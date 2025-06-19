import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
  TextInput,
} from "react-native";
import { SvgXml } from "react-native-svg";
import SearchIcon from "../../assets/search-icon.svg";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useRecipes } from "../../src/context/RecipeContext";

// Define types for navigation
type HomeStackParamList = {
  homeMain: undefined;
  filters: undefined;
};

type FiltersScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  "filters"
>;

interface FilterButtonProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  category: string;
}

const FilterButton = ({
  label,
  selected = false,
  onPress,
  category,
}: FilterButtonProps) => (
  <TouchableOpacity
    style={[styles.filterButton, selected && styles.filterButtonSelected]}
    onPress={onPress}
  >
    <Text
      style={[
        styles.filterButtonText,
        selected && styles.filterButtonTextSelected,
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const FiltersScreen = () => {
  const navigation = useNavigation<FiltersScreenNavigationProp>();
  const {
    toggleFilter,
    searchRecipes,
    activeFilters,
    applyFilters,
    clearFilters,
    searchQuery,
  } = useRecipes();
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  // Filter states
  const filterCategories = {
    sort: ["Most likes", "Recommended"],
    cookingTime: ["< 15 min", "< 20 min", "< 30 min"],
    mealTime: ["Breakfast", "Lunch", "Dinner"],
    diets: ["Lactose-free", "Low-carb", "Vegetarian", "Gluten-free"],
    exclude: ["Onion", "Mushroom", "Peanut"],
  };

  // Handle filter toggle
  const handleFilterToggle = (category: string, value: string) => {
    toggleFilter(category, value);
  };

  // Check if a filter is active
  const isFilterActive = (category: string, value: string) => {
    return activeFilters.some(
      (filter) => filter.category === category && filter.value === value
    );
  };

  // Handle search
  const handleSearch = (text: string) => {
    setLocalSearchQuery(text);
    searchRecipes(text);
  };

  // Handle apply filters button
  const handleApplyFilters = () => {
    applyFilters();
    navigation.navigate("homeMain");
  };

  const arrowLeftIcon = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.25 12.2739L19.25 12.2739" stroke="#0A2533" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10.2998 18.2985L4.2498 12.2745L10.2998 6.24951" stroke="#0A2533" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
    `;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header with Logo */}
      <View style={styles.headerContainer}>
        <View style={styles.logoWrapper}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <SvgXml xml={arrowLeftIcon} />
          </TouchableOpacity>
        </View>
        <Text style={styles.screenTitle}>Search with Filters</Text>
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

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Sort Section */}
        <Text style={styles.sectionTitle}>Sort</Text>
        <View style={styles.filterRow}>
          {filterCategories.sort.map((filterValue) => (
            <FilterButton
              key={`sort-${filterValue}`}
              label={filterValue}
              category="sort"
              selected={isFilterActive("sort", filterValue)}
              onPress={() => handleFilterToggle("sort", filterValue)}
            />
          ))}
        </View>

        {/* Cooking Time Section */}
        <Text style={styles.sectionTitle}>Cooking time</Text>
        <View style={styles.filterRow}>
          {filterCategories.cookingTime.map((filterValue) => (
            <FilterButton
              key={`cooking-${filterValue}`}
              label={filterValue}
              category="cookingTime"
              selected={isFilterActive("cookingTime", filterValue)}
              onPress={() => handleFilterToggle("cookingTime", filterValue)}
            />
          ))}
        </View>

        {/* Meal Time Section */}
        <Text style={styles.sectionTitle}>Meal time</Text>
        <View style={styles.filterRow}>
          {filterCategories.mealTime.map((filterValue) => (
            <FilterButton
              key={`meal-${filterValue}`}
              label={filterValue}
              category="mealTime"
              selected={isFilterActive("mealTime", filterValue)}
              onPress={() => handleFilterToggle("mealTime", filterValue)}
            />
          ))}
        </View>

        {/* Diets Section */}
        <Text style={styles.sectionTitle}>Diets</Text>
        <View style={styles.filterRows}>
          <View style={styles.filterRow}>
            {filterCategories.diets.slice(0, 2).map((filterValue) => (
              <FilterButton
                key={`diet-${filterValue}`}
                label={filterValue}
                category="diets"
                selected={isFilterActive("diets", filterValue)}
                onPress={() => handleFilterToggle("diets", filterValue)}
              />
            ))}
          </View>
          <View style={[styles.filterRow, styles.filterRowMargin]}>
            {filterCategories.diets.slice(2).map((filterValue) => (
              <FilterButton
                key={`diet-${filterValue}`}
                label={filterValue}
                category="diets"
                selected={isFilterActive("diets", filterValue)}
                onPress={() => handleFilterToggle("diets", filterValue)}
              />
            ))}
          </View>
        </View>

        {/* Exclude Section */}
        <Text style={styles.sectionTitle}>Exclude</Text>
        <View style={styles.filterRow}>
          {filterCategories.exclude.map((filterValue) => (
            <FilterButton
              key={`exclude-${filterValue}`}
              label={filterValue}
              category="exclude"
              selected={isFilterActive("exclude", filterValue)}
              onPress={() => handleFilterToggle("exclude", filterValue)}
            />
          ))}
        </View>

        {/* Filter Actions */}
        <View style={styles.buttonRow}>
          {/* Clear Button */}
          {activeFilters.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
              <Text style={styles.clearButtonText}>CLEAR</Text>
            </TouchableOpacity>
          )}
          {/* Search Button */}
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleApplyFilters}
          >
            <Text style={styles.searchButtonText}>
              {activeFilters.length > 0 ? "APPLY FILTERS" : "SEARCH"}
            </Text>
          </TouchableOpacity>
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
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 5,
  },
  logoWrapper: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 15,
    overflow: "hidden",
    marginRight: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 15,
  },
  logo: {
    width: 50,
    height: 50,
  },
  screenTitle: {
    fontSize: 24,
    color: "#0A2533",
    fontFamily: "Ubuntu_500Medium",
  },
  searchContainer: {
    paddingHorizontal: 18,
    marginTop: 20,
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
    fontFamily: "Ubuntu",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    color: "#0A2533",
    marginBottom: 10,
    paddingLeft: 10,
    fontSize: 20,
    fontFamily: "Ubuntu_500Medium",
    paddingTop: 10,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
  filterRows: {
    gap: 5,
  },
  filterRowMargin: {
    marginTop: 5,
  },
  filterButton: {
    paddingHorizontal: 24,
    paddingVertical: 9,
    backgroundColor: "#EBF0F6",
    borderRadius: 40,
    shadowColor: "rgba(106, 163, 167, 0.1)",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  filterButtonSelected: {
    backgroundColor: "#C6E3E5",
  },
  filterButtonText: {
    fontSize: 14,
    fontFamily: "Ubuntu_500Medium",
    color: "#0A2533",
  },
  filterButtonTextSelected: {
    color: "#FFFFFF",
    fontFamily: "Ubuntu_500Medium",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
    marginBottom: 40,
    gap: 10,
  },
  searchButton: {
    paddingHorizontal: 24,
    paddingVertical: 9,
    backgroundColor: "#0A2533",
    borderRadius: 40,
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Ubuntu_500Medium",
  },
  clearButton: {
    paddingHorizontal: 24,
    paddingVertical: 9,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#C6E3E5",
    borderRadius: 40,
  },
  clearButtonText: {
    color: "#C6E3E5",
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Ubuntu_500Medium",
  },
});

export default FiltersScreen;
