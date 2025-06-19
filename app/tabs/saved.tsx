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

const isAndroid = Platform.OS === "android";

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
            <StarIcon width={32} height={32} />
            <Text style={styles.ratingText}>{rating}</Text>
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

  // This would use the actual savedRecipes but for the demo, let's use some sample data
  const displayedRecipes =
    savedRecipes.length > 0
      ? savedRecipes
      : [
          {
            id: "1",
            image: require("../../assets/toast-strawberries.png"),
            title: "Cake with some berries",
            creator: "Benny Garlic",
            likes: "346",
            rating: "7",
          },
          {
            id: "3",
            image: require("../../assets/blueberry-egg.png"),
            title: "Blueberry pudding for snack",
            creator: "Alice Fala",
            likes: "1234",
            rating: "4",
          },
          {
            id: "4",
            image: require("../../assets/toast-egg.png"),
            title: "Simple egg toast",
            creator: "Mary",
            likes: "774",
            rating: "5",
          },
        ];

  const handleFilterPress = (filter: string) => {
    setSelectedFilter(filter);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image
            source={require("../../assets/FoodieLogo.png")}
            style={styles.logoSmall}
            resizeMode="contain"
          />
          <Text style={styles.pageTitle}>Saved Recipes</Text>
        </View>

        {/* Latest Additions Section */}
        <View style={styles.latestSection}>
          <Text style={styles.sectionTitle}>Latest additions</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.latestContainer}
          >
            {latestRecipes.length > 0 ? (
              latestRecipes.map((recipe) => (
                <Pressable key={recipe.id} style={styles.latestRecipeCard}>
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
              // Display sample images if no saved recipes
              <>
                <Pressable style={styles.latestRecipeCard}>
                  <View>
                    <Image
                      source={require("../../assets/avocado-toast.png")}
                      style={styles.latestRecipeImage}
                    />
                  </View>
                  <Text style={styles.latestRecipeTitle}>
                    Sunny Egg & Toast Avocado
                  </Text>
                </Pressable>
                <Pressable style={styles.latestRecipeCard}>
                  <View>
                    <Image
                      source={require("../../assets/beef-bowl.png")}
                      style={styles.latestRecipeImage}
                    />
                  </View>
                  <Text style={styles.latestRecipeTitle}>
                    Bowl of noodle with beef
                  </Text>
                </Pressable>
              </>
            )}
          </ScrollView>
        </View>

        {/* Filter Options */}
        <View style={styles.filterSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterContainer}
          >
            {filterOptions.map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterButton,
                  selectedFilter === filter && styles.filterButtonSelected,
                ]}
                onPress={() => handleFilterPress(filter)}
              >
                <Text style={styles.filterText}>{filter}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.titleRow}>
            <Text style={styles.sectionTitle}>View all</Text>
          </View>
        </View>

        {/* Recipes List */}
        <View style={styles.recipesContainer}>
          {displayedRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              image={recipe.image}
              title={recipe.title}
              creator={recipe.creator}
              likes={recipe.likes}
              rating={recipe.rating}
              recipe={recipe as Recipe}
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
    backgroundColor: isAndroid ? "#FFFFFF" : "#f5f4f4",
  },
  header: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  logoSmall: {
    width: 32,
    height: 35,
    marginBottom: 10,
  },
  pageTitle: {
    fontSize: 24,
    fontFamily: "Ubuntu_500Medium",
    color: "#0A2533",
    textAlign: "center",
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
    paddingHorizontal: 20,
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
});

export default SavedScreen;
