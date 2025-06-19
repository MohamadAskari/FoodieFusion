import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  TextInput,
} from "react-native";
import { SvgXml } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import SearchIcon from "../../assets/search-icon.svg";
import StarIcon from "../../assets/star-icon.svg";
import { useRecipes } from "../../src/context/RecipeContext";
import { Recipe } from "../../src/types/recipe";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define types for navigation
type HomeStackParamList = {
  homeMain: undefined;
  filters: undefined;
  recipeDetail: { recipe: Recipe };
};

type HomeScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  "homeMain"
>;

const ThumbsUpIcon = () => (
  <SvgXml
    xml={`
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 10V19H4C3.45 19 3 18.55 3 18V11C3 10.45 3.45 10 4 10H7ZM21 10C21 9.45 20.55 9 20 9H14.69L15.64 4.43C15.78 3.85 15.42 3.29 14.83 3.15L14.54 3.11C14.31 3.07 14.07 3.14 13.9 3.31L8.59 8.59C8.22 8.95 8 9.46 8 10V18C8 19.1 8.9 20 10 20H18C18.83 20 19.54 19.5 19.84 18.78L21.86 13.73C21.95 13.5 22 13.26 22 13V11C22 10.45 21.55 10 21 10Z" stroke="#1E1E1E" stroke-width="2"/>
    </svg>
  `}
  />
);

interface RecipeCardProps {
  image: any;
  title: string;
  creator: string;
  likes: string;
  rating: string;
  recipe: Recipe;
  recentlyAdded?: boolean;
}

const RecipeCard = ({
  image,
  title,
  creator,
  likes,
  rating,
  recipe,
  recentlyAdded,
}: RecipeCardProps) => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  return (
    <TouchableOpacity
      style={[
        styles.recipeCard,
        {
          shadowColor: recentlyAdded ? "#c9c6c6" : "#000000",
          shadowOffset: recentlyAdded
            ? { width: 0, height: 2 }
            : { width: 0, height: 2 },
          shadowOpacity: recentlyAdded ? 0.1 : 0.1,
          shadowRadius: recentlyAdded ? 16 : 16,
          borderWidth: recentlyAdded ? 1 : 1,
          borderColor: recentlyAdded ? "#f5f3f3" : "#FBFBFB",
        },
      ]}
      onPress={() => {
        navigation.navigate("recipeDetail", { recipe });
      }}
    >
      <View style={styles.cardContent}>
        <View style={styles.imageContainer}>
          <Image
            source={
              creator === "You"
                ? require("../../assets/default-food.png")
                : image
            }
            style={styles.recipeImage}
            resizeMode="cover"
          />
          <View style={styles.starOverlay}>
            {creator !== "You" ? <StarIcon width={32} height={32} /> : null}
            {creator !== "You" ? (
              <Text style={styles.ratingText}>{rating}</Text>
            ) : null}
          </View>
        </View>
        <View style={styles.recipeInfo}>
          <Text style={styles.creatorName}>{creator}</Text>
          <Text style={styles.recipeTitle}>{title}</Text>
        </View>
      </View>
      {/* Likes container on the right */}
      <View style={styles.likesContainer}>
        <ThumbsUpIcon />
        <Text style={styles.likesText}>{likes}</Text>
      </View>
    </TouchableOpacity>
  );
};

const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const {
    filteredRecipes,
    searchRecipes,
    searchQuery,
    activeFilters,
    createdRecipes,
  } = useRecipes();
  const [localSearchQuery, setLocalSearchQuery] = useState("");

  // Handle search input
  const handleSearch = (text: string) => {
    setLocalSearchQuery(text);
    searchRecipes(text);
  };

  // Get filtered recipes or show most liked if no filters
  // Combine created recipes with filtered recipes, ensuring no duplicates
  const displayedRecipes = React.useMemo(() => {
    // Get the IDs of created recipes to avoid duplicates
    const createdRecipeIds = createdRecipes.map((recipe) => recipe.id);

    // Filter out any duplicates from the filtered recipes
    const filteredWithoutDuplicates = filteredRecipes.filter(
      (recipe) => !createdRecipeIds.includes(recipe.id)
    );

    // Combine the arrays, with created recipes at the top
    return [
      ...(filteredWithoutDuplicates.length > 0
        ? filteredWithoutDuplicates
        : filteredWithoutDuplicates.sort(
            (a, b) => parseInt(b.likes) - parseInt(a.likes)
          )),
    ];
  }, [createdRecipes, filteredRecipes]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF7E4" />

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Foodie Fusion</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            value={localSearchQuery}
            onChangeText={handleSearch}
            placeholder="Search"
            placeholderTextColor="#97A2B0"
          />
          <SearchIcon />
        </View>
      </View>

      {/* Filters */}
      <TouchableOpacity
        style={styles.filtersContainer}
        onPress={() => navigation.navigate("filters")}
      >
        <Text style={styles.filtersText}>
          {activeFilters.length > 0
            ? `${activeFilters.length} filters applied`
            : "+ Filters"}
        </Text>
      </TouchableOpacity>

      {/* Recipes Section */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {searchQuery || activeFilters.length > 0 ? null : (
          <View style={styles.recentlyAddedContainer}>
            <Text style={styles.recentlyAddedText}>Recently Added</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.recentlyAddedScrollView}
              contentContainerStyle={[styles.recentlyAddedContentContainer]}
            >
              {createdRecipes.length > 0 ? (
                createdRecipes.map((recipe, index) => (
                  <View
                    key={recipe.id || index}
                    style={styles.recentlyAddedCardWrapper}
                  >
                    <RecipeCard
                      image={recipe.image}
                      title={recipe.title}
                      creator={recipe.creator}
                      likes={recipe.likes}
                      rating={recipe.rating}
                      recipe={recipe}
                      recentlyAdded={true}
                    />
                  </View>
                ))
              ) : (
                <Text style={styles.noRecipesText}>No recipes added yet</Text>
              )}
            </ScrollView>
          </View>
        )}
        <Text style={styles.sectionTitle}>
          {searchQuery
            ? `Search Results (${displayedRecipes.length})`
            : activeFilters.length > 0
            ? `Filtered Recipes (${displayedRecipes.length})`
            : "Most Liked This Week"}
        </Text>

        <View style={styles.recipesContainer}>
          {displayedRecipes.map((recipe, index) => (
            <RecipeCard
              key={recipe.id || index}
              image={recipe.image}
              title={recipe.title}
              creator={recipe.creator}
              likes={recipe.likes}
              rating={recipe.rating}
              recipe={recipe}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  logoContainer: {
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingVertical: 5,
    paddingTop: 10,
    marginTop: 6,
  },
  logoText: {
    fontFamily: "WendyOne_400Regular",
    fontSize: 36,
    fontWeight: "400",
    color: "#0A2533",
    textAlign: "center",
    textShadowColor: "#5AA6AC",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
  },
  searchContainer: {
    paddingHorizontal: 18,
    marginTop: 10,
  },
  searchBar: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#C6E3E5",
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 43,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#0A2533",
    fontFamily: "Ubuntu_500Medium",
    padding: 0,
  },
  searchPlaceholder: {
    fontSize: 16,
    color: "#97A2B0",
    fontFamily: "Ubuntu_500Medium",
  },
  filtersContainer: {
    paddingHorizontal: 30,
    marginTop: 16,
    alignItems: "flex-end",
  },
  filtersText: {
    fontSize: 18,
    color: "#70B9BE",
    fontFamily: "Ubuntu_500Medium",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 31,
  },
  sectionTitle: {
    fontSize: 20,
    color: "#0A2533",
    marginBottom: 15,
    fontFamily: "Ubuntu_500Medium",
    paddingLeft: 4,
  },
  recipesContainer: {
    gap: 10,
    paddingBottom: 20,
  },
  recipeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FBFBFB",
    shadowColor: "#063336",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 3,
    height: 100,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  imageContainer: {
    width: 75,
    height: 75,
    borderRadius: 8,
    overflow: "hidden",
    margin: 12,
    position: "relative",
  },
  recipeImage: {
    width: "100%",
    height: "100%",
  },
  starOverlay: {
    position: "absolute",
    top: 2,
    left: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  ratingText: {
    position: "absolute",
    color: "black",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: 4,
    padding: 2,
  },
  recipeInfo: {
    flex: 1,
    paddingRight: 5,
    marginTop: -20,
  },
  recipeTitle: {
    fontSize: 16,
    color: "#0A2533",
    fontFamily: "Ubuntu_500Medium",
  },
  creatorName: {
    fontSize: 14,
    color: "#70B9BE",
    marginBottom: 4,
    fontFamily: "Ubuntu_500Medium",
  },
  likesContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 16,
    gap: 6,
    marginBottom: -60,
  },
  likesText: {
    fontSize: 14,
    color: "#0A2533",
    fontFamily: "Ubuntu",
    // marginBottom: -20,
  },
  recentlyAddedContainer: {
    paddingHorizontal: 0,
    marginTop: 31,
  },
  recentlyAddedText: {
    fontSize: 20,
    fontFamily: "Ubuntu_500Medium",
    color: "#0A2533",
    paddingLeft: 4,
  },
  recentlyAddedScrollView: {
    marginTop: 10,
    marginBottom: 15,
    backgroundColor: "#FFFFFF",
  },
  recentlyAddedContentContainer: {
    paddingLeft: 4,
    paddingRight: 20,
    paddingVertical: 10,
  },
  recentlyAddedCardWrapper: {
    width: 280,
    marginRight: 15,
  },
  noRecipesText: {
    fontSize: 16,
    color: "#0A2533",
    fontFamily: "Ubuntu_500Medium",
    marginTop: 20,
    marginLeft: 40,
    marginBottom: 20,
    paddingLeft: 10,
    width: 280,
    textAlign: "center",
  },
});

export default HomeScreen;
