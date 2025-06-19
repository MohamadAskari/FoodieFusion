import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRecipes } from "../../src/context/RecipeContext";
import { Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Recipe } from "../../src/types/recipe";

// SVG Icons
import FolderIcon from "../../assets/folder-icon.svg";
import StarIcon from "../../assets/star-icon.svg";
import ThumbsUpIcon from "../../assets/thumbs-up-icon.svg";

// Define types for navigation
type SavedStackParamList = {
  savedMain: undefined;
  recipeDetail: { recipe: Recipe };
};

type SavedScreenNavigationProp = StackNavigationProp<
  SavedStackParamList,
  "savedMain"
>;

interface RecipeCardProps {
  image: any;
  title: string;
  creator: string;
  likes: string;
  rating: string;
  recipe: Recipe;
}

const RecipeCard = ({
  image,
  title,
  creator,
  likes,
  rating,
  recipe,
}: RecipeCardProps) => {
  const navigation = useNavigation<SavedScreenNavigationProp>();

  return (
    <TouchableOpacity
      style={styles.recipeCard}
      onPress={() => {
        navigation.navigate("recipeDetail", { recipe });
      }}
    >
      <View style={styles.cardContent}>
        <View style={styles.imageContainer}>
          <Image source={image} style={styles.recipeImage} resizeMode="cover" />
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
        <ThumbsUpIcon width={18} height={18} stroke="#1E1E1E" />
        <Text style={styles.likesText}>{likes}</Text>
      </View>
    </TouchableOpacity>
  );
};

const SavedScreen = () => {
  const { savedRecipes } = useRecipes();
  const navigation = useNavigation<SavedScreenNavigationProp>();

  const [selectedFilter, setSelectedFilter] = useState<string>("Most likes");

  // Get the latest 2 saved recipes for the horizontal list
  const latestRecipes = savedRecipes.slice(0, 2);

  // Filter categories
  const filterOptions = ["Most likes", "Lunch", "< 20 min"];

  const handleFilterPress = (filter: string) => {
    setSelectedFilter(filter);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image
              source={require("../../assets/FoodieLogo.png")}
              style={styles.logoSmall}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.pageTitle}>Saved Recipes</Text>
        </View>

        {/* Latest Additions Section */}
        <View style={styles.latestSection}>
          <Text style={styles.sectionTitle}>Latest additions</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              styles.latestContainer,
              latestRecipes.length === 0 && {
                flexGrow: 1,
                justifyContent: "center",
              },
            ]}
          >
            {latestRecipes.length > 0 ? (
              latestRecipes.map((recipe) => (
                <Pressable
                  onPress={() => {
                    navigation.navigate("recipeDetail", { recipe });
                  }}
                  key={recipe.id}
                  style={styles.latestRecipeCard}
                >
                  <View>
                    <Image
                      source={recipe.image}
                      style={styles.latestRecipeImage}
                    />
                  </View>
                  <Text style={styles.latestRecipeTitle}>{recipe.title}</Text>
                </Pressable>
              ))
            ) : (
              <View style={styles.emptyStateContainer}>
                <Text style={[styles.emptyStateText]}>
                  No recipes saved yet
                </Text>
              </View>
            )}
          </ScrollView>
        </View>

        {/* Filter Options */}
        <View style={styles.filterSection}>
          <View style={styles.titleRow}>
            <Text style={styles.sectionTitle}>Saved Recipes</Text>
          </View>
        </View>

        {/* Recipes List */}
        <View style={styles.recipesContainer}>
          {savedRecipes.length > 0 ? (
            savedRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                image={recipe.image}
                title={recipe.title}
                creator={recipe.creator}
                likes={recipe.likes}
                rating={recipe.rating}
                recipe={recipe as Recipe}
              />
            ))
          ) : (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>No recipes saved yet</Text>
            </View>
          )}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 16,
    paddingHorizontal: 20,
  },
  logoContainer: {
    width: 32,
    height: 35,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  logoSmall: {
    width: 32,
    height: 32,
    borderRadius: 10,
  },
  pageTitle: {
    fontSize: 24,
    fontFamily: "Ubuntu_500Medium",
    color: "#0A2533",
    marginLeft: 18,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Ubuntu_500Medium",
    color: "#0A2533",
    marginHorizontal: 20,
    marginVertical: 15,
  },
  foldersSection: {
    backgroundColor: "#DEDEDE",
    paddingVertical: 15,
  },
  folderItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  folderSelected: {
    backgroundColor: "#DEDEDE",
  },
  folderName: {
    marginLeft: 15,
    fontSize: 20,
    color: "#000",
    fontFamily: "Ubuntu_500Medium",
  },
  latestSection: {
    marginVertical: 10,
  },
  latestContainer: {
    paddingHorizontal: 20,
  },
  imageContainer: {
    position: "relative",
    width: 75,
    height: 75,
    borderRadius: 8,
    overflow: "hidden",
    margin: 12,
  },
  latestRecipeCard: {
    backgroundColor: "#FFFFFF",
    width: 174,
    height: 220,
    marginRight: 12,
    overflow: "hidden",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#f4f2f2",
    shadowColor: "#063336",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 3,
    marginBottom: 10,
  },
  latestRecipeImage: {
    width: 174,
    height: 140,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  latestRecipeTitle: {
    fontSize: 16,
    fontFamily: "Ubuntu_500Medium",
    color: "#0A2533",
    padding: 16,
    paddingTop: 12,
  },
  filterSection: {
    marginTop: 10,
  },
  filterContainer: {
    paddingHorizontal: 15,
    paddingBottom: 5,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  filterButton: {
    backgroundColor: "#EBF0F6",
    paddingHorizontal: 24,
    paddingVertical: 9,
    borderRadius: 40,
    marginHorizontal: 5,
    shadowColor: "#6AA3A7",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  filterButtonSelected: {
    backgroundColor: "#C6E3E5",
  },
  filterText: {
    fontSize: 16,
    color: "#0A2533",
    fontFamily: "Ubuntu_500Medium",
  },
  recipesContainer: {
    gap: 10,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flex: 1,
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
    paddingTop: 5,
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
  },
  ratingBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  ratingBadgeText: {
    marginLeft: 2,
    fontSize: 12,
    color: "#000",
    fontFamily: "Ubuntu_500Medium",
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: "Ubuntu_500Medium",
    color: "#0A2533",
  },
});

export default SavedScreen;
