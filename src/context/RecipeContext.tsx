import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { recipes as initialRecipes } from "../data/recipesData";
import { Recipe, FilterOption } from "../types/recipe";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Storage keys
const CREATED_RECIPES_STORAGE_KEY = "foodieFusion_createdRecipes";
const SAVED_RECIPES_STORAGE_KEY = "foodieFusion_savedRecipes";

interface RecipeContextType {
  recipes: Recipe[];
  filteredRecipes: Recipe[];
  savedRecipes: Recipe[];
  searchQuery: string;
  activeFilters: FilterOption[];
  searchRecipes: (query: string) => void;
  toggleFilter: (category: string, value: string) => void;
  clearFilters: () => void;
  applyFilters: () => void;
  saveRecipe: (recipeId: string) => void;
  removeSavedRecipe: (recipeId: string) => void;
  isRecipeSaved: (recipeId: string) => boolean;
  addCreatedRecipe: (recipeData: {
    title: string;
    ingredients: string;
    steps: string;
    cookingTime: string;
    difficulty: string;
    recipeImage: string | null;
  }) => void;
  createdRecipes: Recipe[];
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const useRecipes = () => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error("useRecipes must be used within a RecipeProvider");
  }
  return context;
};

interface RecipeProviderProps {
  children: ReactNode;
}

export const RecipeProvider: React.FC<RecipeProviderProps> = ({ children }) => {
  const [recipes] = useState<Recipe[]>(initialRecipes);
  const [filteredRecipes, setFilteredRecipes] =
    useState<Recipe[]>(initialRecipes);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeFilters, setActiveFilters] = useState<FilterOption[]>([]);
  const [createdRecipes, setCreatedRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved & created recipes from AsyncStorage on component mount
  useEffect(() => {
    const loadStoredData = async () => {
      try {
        // Load created recipes
        const storedCreatedRecipes = await AsyncStorage.getItem(
          CREATED_RECIPES_STORAGE_KEY
        );
        if (storedCreatedRecipes) {
          const parsedRecipes = JSON.parse(storedCreatedRecipes);
          setCreatedRecipes(parsedRecipes);
        }

        // Load saved recipes
        const storedSavedRecipes = await AsyncStorage.getItem(
          SAVED_RECIPES_STORAGE_KEY
        );
        if (storedSavedRecipes) {
          const parsedSavedRecipes = JSON.parse(storedSavedRecipes);
          setSavedRecipes(parsedSavedRecipes);
        }
      } catch (error) {
        console.error("Error loading data from AsyncStorage:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredData();
  }, []);

  // Update filtered recipes when created recipes change
  useEffect(() => {
    if (!isLoading) {
      if (activeFilters.length > 0 || searchQuery) {
        // Don't automatically update if there are filters or search
        return;
      }

      // Make sure we're not duplicating recipes
      const recipeIds = new Set(recipes.map((r) => r.id));
      const uniqueCreatedRecipes = createdRecipes.filter(
        (r) => !recipeIds.has(r.id)
      );

      // Display default recipes with created ones at the top
      setFilteredRecipes([...uniqueCreatedRecipes, ...recipes]);
    }
  }, [createdRecipes, isLoading]);

  const searchRecipes = (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      // If search query is empty, show all recipes or filtered recipes
      applyFilters();
      return;
    }

    const lowerCaseQuery = query.toLowerCase();

    // Get unique recipes to search through
    const recipeIds = new Set(recipes.map((r) => r.id));
    const uniqueCreatedRecipes = createdRecipes.filter(
      (r) => !recipeIds.has(r.id)
    );
    const allUniqueRecipes = [...uniqueCreatedRecipes, ...recipes];

    // Apply search to recipes with current filters
    let results = allUniqueRecipes;
    if (activeFilters.length > 0) {
      results = filterRecipesByOptions(results, activeFilters);
    }

    // Then filter by search query
    results = results.filter(
      (recipe) =>
        recipe.title.toLowerCase().includes(lowerCaseQuery) ||
        recipe.creator.toLowerCase().includes(lowerCaseQuery) ||
        recipe.ingredients.some((ingredient) =>
          ingredient.toLowerCase().includes(lowerCaseQuery)
        )
    );

    setFilteredRecipes(results);
  };

  const toggleFilter = (category: string, value: string) => {
    setActiveFilters((prevFilters) => {
      // Check if filter already exists
      const existingFilterIndex = prevFilters.findIndex(
        (filter) => filter.category === category && filter.value === value
      );

      if (existingFilterIndex >= 0) {
        // Remove filter if it exists
        return prevFilters.filter((_, index) => index !== existingFilterIndex);
      } else {
        // Add new filter
        return [...prevFilters, { category, value, selected: true }];
      }
    });
  };

  const clearFilters = () => {
    setActiveFilters([]);
    setFilteredRecipes([...createdRecipes, ...recipes]);
  };

  const filterRecipesByOptions = (
    recipesToFilter: Recipe[],
    filterOptions: FilterOption[]
  ): Recipe[] => {
    if (filterOptions.length === 0) {
      return recipesToFilter;
    }

    return recipesToFilter.filter((recipe) => {
      // Group filters by category
      const filtersByCategory: { [key: string]: string[] } = {};
      filterOptions.forEach((filter) => {
        if (!filtersByCategory[filter.category]) {
          filtersByCategory[filter.category] = [];
        }
        filtersByCategory[filter.category].push(filter.value);
      });

      // Check each filter category
      for (const [category, values] of Object.entries(filtersByCategory)) {
        switch (category) {
          case "cookingTime":
            // For cooking time filters like "< 15 min"
            const cookingTimeMatch = values.some((value) => {
              const minutes = parseInt(value.replace(/[^0-9]/g, ""));
              return recipe.cookingTime < minutes;
            });
            if (values.length > 0 && !cookingTimeMatch) return false;
            break;

          case "mealTime":
            // Check if recipe's mealTime includes any of the selected meal times
            const mealTimeMatch = values.some((value) =>
              recipe.mealTime.includes(value)
            );
            if (values.length > 0 && !mealTimeMatch) return false;
            break;

          case "diets":
            // Check if recipe's diets include all selected diets
            const dietsMatch = values.every((value) =>
              recipe.diets.includes(value)
            );
            if (values.length > 0 && !dietsMatch) return false;
            break;

          case "exclude":
            // Check if recipe doesn't include any excluded ingredients
            const hasExcludedIngredient = values.some((value) =>
              recipe.ingredients.includes(value.toLowerCase())
            );
            if (hasExcludedIngredient) return false;
            break;

          case "sort":
            // Sorting is handled separately, not a filter
            break;
        }
      }

      return true;
    });
  };

  const applyFilters = () => {
    if (activeFilters.length === 0) {
      // Make sure we're not duplicating recipes
      const recipeIds = new Set(recipes.map((r) => r.id));
      const uniqueCreatedRecipes = createdRecipes.filter(
        (r) => !recipeIds.has(r.id)
      );

      setFilteredRecipes([...uniqueCreatedRecipes, ...recipes]);
      return;
    }

    // Get unique recipes to filter
    const recipeIds = new Set(recipes.map((r) => r.id));
    const uniqueCreatedRecipes = createdRecipes.filter(
      (r) => !recipeIds.has(r.id)
    );
    const allUniqueRecipes = [...uniqueCreatedRecipes, ...recipes];

    const filtered = filterRecipesByOptions(allUniqueRecipes, activeFilters);
    setFilteredRecipes(filtered);
  };

  // Save created recipes to AsyncStorage
  const saveCreatedRecipesToStorage = async (updatedRecipes: Recipe[]) => {
    try {
      await AsyncStorage.setItem(
        CREATED_RECIPES_STORAGE_KEY,
        JSON.stringify(updatedRecipes)
      );
    } catch (error) {
      console.error("Error saving created recipes to AsyncStorage:", error);
    }
  };

  // Save saved recipes to AsyncStorage
  const saveSavedRecipesToStorage = async (updatedSavedRecipes: Recipe[]) => {
    try {
      await AsyncStorage.setItem(
        SAVED_RECIPES_STORAGE_KEY,
        JSON.stringify(updatedSavedRecipes)
      );
    } catch (error) {
      console.error("Error saving saved recipes to AsyncStorage:", error);
    }
  };

  // Saved recipes functionality
  const saveRecipe = (recipeId: string) => {
    // Find the recipe in either the main recipes or created recipes
    const recipeToSave = [...recipes, ...createdRecipes].find(
      (r) => r.id === recipeId
    );

    if (recipeToSave && !isRecipeSaved(recipeId)) {
      const updatedSavedRecipes = [...savedRecipes, recipeToSave];
      setSavedRecipes(updatedSavedRecipes);
      saveSavedRecipesToStorage(updatedSavedRecipes);
    }
  };

  const removeSavedRecipe = (recipeId: string) => {
    const updatedSavedRecipes = savedRecipes.filter(
      (recipe) => recipe.id !== recipeId
    );
    setSavedRecipes(updatedSavedRecipes);
    saveSavedRecipesToStorage(updatedSavedRecipes);
  };

  const isRecipeSaved = (recipeId: string) => {
    return savedRecipes.some((recipe) => recipe.id === recipeId);
  };

  const addCreatedRecipe = (recipeData: {
    title: string;
    ingredients: string;
    steps: string;
    cookingTime: string;
    difficulty: string;
    recipeImage: string | null;
  }) => {
    // Convert ingredients string to array
    const ingredientsArray = recipeData.ingredients
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item !== "")
      .map((item) => {
        // Extract just the ingredient name without quantities
        const parts = item.split(" ");
        if (parts.length > 1 && !isNaN(Number(parts[0]))) {
          return parts.slice(1).join(" ").toLowerCase();
        }
        return item.toLowerCase();
      });

    // Convert cooking time string to minutes
    let cookingTimeMinutes = 15; // default
    if (recipeData.cookingTime.includes("15")) {
      cookingTimeMinutes = 15;
    } else if (recipeData.cookingTime.includes("20")) {
      cookingTimeMinutes = 20;
    } else if (recipeData.cookingTime.includes("30")) {
      cookingTimeMinutes = 30;
    } else if (recipeData.cookingTime.includes("1 hour")) {
      cookingTimeMinutes = 60;
    }

    // Determine meal time based on recipe title/ingredients (simplified logic)
    const mealTime = ["Breakfast"];
    if (
      recipeData.title.toLowerCase().includes("lunch") ||
      recipeData.title.toLowerCase().includes("burger") ||
      recipeData.title.toLowerCase().includes("pasta")
    ) {
      mealTime[0] = "Lunch";
    } else if (
      recipeData.title.toLowerCase().includes("dinner") ||
      recipeData.title.toLowerCase().includes("steak")
    ) {
      mealTime[0] = "Dinner";
    }

    // Determine diets based on ingredients (simplified logic)
    const diets: string[] = [];
    const hasMeat = ingredientsArray.some(
      (item) =>
        item.includes("meat") ||
        item.includes("beef") ||
        item.includes("chicken") ||
        item.includes("pork")
    );

    if (!hasMeat) {
      diets.push("Vegetarian");
    }

    // Generate a truly unique ID with timestamp and random component
    const uniqueId = `created-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 10)}`;

    const newRecipe: Recipe = {
      id: uniqueId,
      title: recipeData.title,
      creator: "You",
      image: recipeData.recipeImage
        ? { uri: recipeData.recipeImage }
        : require("../../assets/avocado-toast.png"),
      likes: "0",
      rating: "5", // Default rating for new recipes
      cookingTime: cookingTimeMinutes,
      mealTime,
      diets,
      ingredients: ingredientsArray,
    };

    // Update state with the new recipe
    const updatedCreatedRecipes = [newRecipe, ...createdRecipes];
    setCreatedRecipes(updatedCreatedRecipes);

    // Save to AsyncStorage
    saveCreatedRecipesToStorage(updatedCreatedRecipes);

    // Add the new recipe to filtered recipes as well to make it visible right away
    setFilteredRecipes((prev) => [newRecipe, ...prev]);
  };

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        filteredRecipes,
        savedRecipes,
        searchQuery,
        activeFilters,
        searchRecipes,
        toggleFilter,
        clearFilters,
        applyFilters,
        saveRecipe,
        removeSavedRecipe,
        isRecipeSaved,
        addCreatedRecipe,
        createdRecipes,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};
