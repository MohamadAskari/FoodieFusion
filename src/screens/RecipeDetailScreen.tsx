import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SvgXml } from "react-native-svg";
import { useRoute } from "@react-navigation/native";
import { Recipe } from "../types/recipe";
import StarIcon from "../../assets/star-icon.svg";
import ThumbsUpIcon from "../../assets/thumbs-up-icon.svg";
import BookmarkIcon from "../../assets/bookmark-icon.svg";
import CarbIcon from "../../assets/carb-icon.svg";
import ProteinIcon from "../../assets/protein-icon.svg";
import CalorieIcon from "../../assets/calorie-icon.svg";
import FatIcon from "../../assets/fat-icon.svg";
import { LinearGradient } from "expo-linear-gradient";
import { useRecipes } from "../context/RecipeContext";

// Define the route param types
type RecipeDetailRouteParams = {
  recipe: Recipe;
};

// Navigation type

const RecipeDetailScreen = () => {
  const route = useRoute();
  const { recipe } = route.params as RecipeDetailRouteParams;
  const { saveRecipe, removeSavedRecipe, isRecipeSaved } = useRecipes();
  const [activeTab, setActiveTab] = useState<"ingredients" | "steps">(
    "ingredients"
  );
  const [saved, setSaved] = useState<boolean>(isRecipeSaved(recipe.id));

  // Comments data based on Figma design
  const comments = [
    {
      user: "Tanya",
      date: "23.5.2025",
      comment: "Amazing and delicious!",
      likes: "2560",
    },
    {
      user: "James",
      date: "23.5.2025",
      comment:
        "I did not add any onions and I like it even better. Overall very simple and fast to cook. Thanx!",
      likes: "2560",
    },
  ];

  const handleSave = () => {
    if (saved) {
      removeSavedRecipe(recipe.id);
      setSaved(false);
    } else {
      saveRecipe(recipe.id);
      setSaved(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/FoodieLogo.png")}
          style={styles.logoImage}
        />
      </View>

      {/* Hero Image */}
      <View style={styles.imageContainer}>
        <Image source={recipe.image} style={styles.recipeImage} />
        <LinearGradient
          colors={["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.9)"]}
          style={styles.imageOverlay}
          locations={[0.1, 1]}
        />
      </View>

      <ScrollView style={styles.contentScroll}>
        {/* Recipe Title and Creator */}
        <View style={styles.titleSection}>
          <View style={styles.titleRow}>
            <Text style={styles.recipeTitle}>{recipe.title}</Text>
            <View style={styles.ratingContainer}>
              <StarIcon width={40} height={40} fill="#FFC640" />
              <Text style={styles.ratingText}>{recipe.rating}</Text>
            </View>
          </View>
          <Text style={styles.creatorText}>By {recipe.creator}</Text>
          <TouchableOpacity>
            <Text style={styles.followText}>+ Follow</Text>
          </TouchableOpacity>
        </View>

        {/* Nutrition Information */}
        <View style={styles.nutritionSection}>
          <View style={styles.nutritionRow}>
            <View style={styles.nutritionItem}>
              <View style={styles.iconContainer}>
                <CarbIcon width={24} height={24} />
              </View>
              <Text style={styles.nutritionText}>65g carbs</Text>
            </View>

            <View style={styles.nutritionItem}>
              <View style={styles.iconContainer}>
                <ProteinIcon width={24} height={24} />
              </View>
              <Text style={styles.nutritionText}>27g proteins</Text>
            </View>
          </View>

          <View style={styles.nutritionRow}>
            <View style={styles.nutritionItem}>
              <View style={styles.iconContainer}>
                <FatIcon width={24} height={24} />
              </View>
              <Text style={styles.nutritionText}>91g fats</Text>
            </View>

            <View style={styles.nutritionItem}>
              <View style={styles.iconContainer}>
                <CalorieIcon width={24} height={24} />
              </View>
              <Text style={styles.nutritionText}>120 Kcal</Text>
            </View>
          </View>
        </View>

        {/* Tabs for Ingredients/Steps */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={
              activeTab === "ingredients"
                ? styles.activeTab
                : styles.inactiveTab
            }
            onPress={() => setActiveTab("ingredients")}
          >
            <Text
              style={
                activeTab === "ingredients"
                  ? styles.activeTabText
                  : styles.inactiveTabText
              }
            >
              Ingredients
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={
              activeTab === "steps" ? styles.activeTab : styles.inactiveTab
            }
            onPress={() => setActiveTab("steps")}
          >
            <Text
              style={
                activeTab === "steps"
                  ? styles.activeTabText
                  : styles.inactiveTabText
              }
            >
              Steps
            </Text>
          </TouchableOpacity>
        </View>

        {/* Conditionally render Ingredients or Steps based on active tab */}
        {activeTab === "ingredients" ? (
          <View style={styles.contentSection}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <View style={styles.ingredientsCard}>
              <Text style={styles.ingredientsText}>
                {
                  "    1              Bun\n150 g          Beef\n  0,5             Red Onion\n100 g          Cheddar cheese\n2 Tbsp        Mayo\n1 Tbsp        Mustard\n1 Tbsp        Ketchup  "
                }
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.contentSection}>
            <Text style={styles.sectionTitle}>Steps</Text>
            <View style={styles.stepsCard}>
              <Text style={styles.stepsText}>
                {
                  "1. Cut the onion into slices.\n2. Fry the beef on a pan to medium rare (or how you like it).\n3. Warm up the bun 10 sec on the pan.\n4. Place the bottom of the bun on a plate, add beef, cheese and onions. Add mayo in between.\n5. Close with the top of the bun. Enjoy!"
                }
              </Text>
            </View>
          </View>
        )}

        {/* Comments Section */}
        <View style={styles.contentSection}>
          <Text style={styles.sectionTitle}>Comments</Text>

          {comments.map((comment, index) => (
            <View key={index} style={styles.commentCard}>
              <Text style={styles.commentHeader}>
                {` ${comment.user}   ${comment.date} `}
              </Text>
              <Text style={styles.commentText}>{comment.comment}</Text>

              <View style={styles.commentActions}>
                <View style={styles.likesContainer}>
                  <ThumbsUpIcon width={22} height={22} />
                  <Text style={styles.likesText}>{comment.likes}</Text>
                </View>
                <TouchableOpacity style={styles.replyButton}>
                  <Text style={styles.replyText}>REPLY</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <View style={styles.actionButton}>
            <SvgXml
              xml={`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18.6665 11.9998V6.6665C18.6665 5.60564 18.2451 4.58822 17.4949 3.83808C16.7448 3.08793 15.7274 2.6665 14.6665 2.6665L9.33317 14.6665V29.3332H24.3732C25.0163 29.3404 25.6403 29.115 26.1304 28.6985C26.6204 28.282 26.9434 27.7024 27.0398 27.0665L28.8798 15.0665C28.9378 14.6843 28.9121 14.2941 28.8043 13.9228C28.6965 13.5516 28.5093 13.2082 28.2556 12.9165C28.002 12.6248 27.6879 12.3917 27.3353 12.2335C26.9826 12.0752 26.5997 11.9955 26.2132 11.9998H18.6665ZM9.33317 29.3332H5.33317C4.62593 29.3332 3.94765 29.0522 3.44755 28.5521C2.94746 28.052 2.6665 27.3737 2.6665 26.6665V17.3332C2.6665 16.6259 2.94746 15.9476 3.44755 15.4476C3.94765 14.9475 4.62593 14.6665 5.33317 14.6665H9.33317" fill="white"/>
<path d="M9.33317 14.6665L14.6665 2.6665C15.7274 2.6665 16.7448 3.08793 17.4949 3.83808C18.2451 4.58822 18.6665 5.60564 18.6665 6.6665V11.9998H26.2132C26.5997 11.9955 26.9826 12.0752 27.3353 12.2335C27.6879 12.3917 28.002 12.6248 28.2556 12.9165C28.5093 13.2082 28.6965 13.5516 28.8043 13.9228C28.9121 14.2941 28.9378 14.6843 28.8798 15.0665L27.0398 27.0665C26.9434 27.7024 26.6204 28.282 26.1304 28.6985C25.6403 29.115 25.0163 29.3404 24.3732 29.3332H9.33317M9.33317 14.6665V29.3332M9.33317 14.6665H5.33317C4.62593 14.6665 3.94765 14.9475 3.44755 15.4476C2.94746 15.9477 2.6665 16.6259 2.6665 17.3332V26.6665C2.6665 27.3737 2.94746 28.052 3.44755 28.5521C3.94765 29.0522 4.62593 29.3332 5.33317 29.3332H9.33317" stroke="#1E1E1E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`}
            />
            <Text style={styles.actionText}>{recipe.likes}</Text>
          </View>
          <View style={styles.actionButton}>
            <SvgXml
              xml={`
        <svg width="27" height="27" viewBox="0 0 27 27" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21.6 21.6L27 27V2.7C27 1.9575 26.7356 1.32187 26.2069 0.793125C25.6781 0.264375 25.0425 0 24.3 0H2.7C1.9575 0 1.32187 0.264375 0.793125 0.793125C0.264375 1.32187 0 1.9575 0 2.7V18.9C0 19.6425 0.264375 20.2781 0.793125 20.8069C1.32187 21.3356 1.9575 21.6 2.7 21.6H21.6Z" fill="white"/>
<path d="M27 27L21.6 21.6H2.7C1.9575 21.6 1.32187 21.3356 0.793125 20.8069C0.264375 20.2781 0 19.6425 0 18.9V2.7C0 1.9575 0.264375 1.32187 0.793125 0.793125C1.32187 0.264375 1.9575 0 2.7 0H24.3C25.0425 0 25.6781 0.264375 26.2069 0.793125C26.7356 1.32187 27 1.9575 27 2.7V27ZM2.7 18.9H22.7475L24.3 20.4187V2.7H2.7V18.9Z" fill="#1D1B20"/>
</svg>


              `}
            />
            <Text style={styles.actionText}>COMMENT</Text>
          </View>
          <View style={styles.actionButton}>
            <SvgXml
              xml={`
<svg width="34" height="33" viewBox="0 0 34 33" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M25.25 11C27.5282 11 29.375 9.15317 29.375 6.875C29.375 4.59683 27.5282 2.75 25.25 2.75C22.9718 2.75 21.125 4.59683 21.125 6.875C21.125 9.15317 22.9718 11 25.25 11Z" fill="white"/>
<path d="M8.75 20.625C11.0282 20.625 12.875 18.7782 12.875 16.5C12.875 14.2218 11.0282 12.375 8.75 12.375C6.47183 12.375 4.625 14.2218 4.625 16.5C4.625 18.7782 6.47183 20.625 8.75 20.625Z" fill="white"/>
<path d="M25.25 30.25C27.5282 30.25 29.375 28.4032 29.375 26.125C29.375 23.8468 27.5282 22 25.25 22C22.9718 22 21.125 23.8468 21.125 26.125C21.125 28.4032 22.9718 30.25 25.25 30.25Z" fill="white"/>
<path d="M12.3113 18.5763L21.7025 24.0487M21.6887 8.95125L12.3113 14.4237M29.375 6.875C29.375 9.15317 27.5282 11 25.25 11C22.9718 11 21.125 9.15317 21.125 6.875C21.125 4.59683 22.9718 2.75 25.25 2.75C27.5282 2.75 29.375 4.59683 29.375 6.875ZM12.875 16.5C12.875 18.7782 11.0282 20.625 8.75 20.625C6.47183 20.625 4.625 18.7782 4.625 16.5C4.625 14.2218 6.47183 12.375 8.75 12.375C11.0282 12.375 12.875 14.2218 12.875 16.5ZM29.375 26.125C29.375 28.4032 27.5282 30.25 25.25 30.25C22.9718 30.25 21.125 28.4032 21.125 26.125C21.125 23.8468 22.9718 22 25.25 22C27.5282 22 29.375 23.8468 29.375 26.125Z" stroke="#1E1E1E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

              `}
            />
            <Text style={styles.actionText}>SHARE</Text>
          </View>
          <TouchableOpacity style={styles.actionButton} onPress={handleSave}>
            <BookmarkIcon
              width={22}
              height={28}
              fill={saved ? "#C6E3E5" : "white"}
              stroke="#1E1E1E"
              strokeWidth={2}
            />
            <Text style={styles.actionText}>SAVE</Text>
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
  logoContainer: {
    position: "absolute",
    top: 70,
    left: 20,
    zIndex: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
  },
  logoImage: {
    width: 32,
    height: 35,
    borderRadius: 10,
  },
  imageContainer: {
    height: 313,
    width: "100%",
    position: "relative",
  },
  recipeImage: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 220,
  },
  ratingContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: -30,
  },
  ratingText: {
    position: "absolute",
    color: "#000000",
    fontFamily: "Ubuntu_700Bold",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: 4,
  },
  contentScroll: {
    flex: 1,
  },
  titleSection: {
    paddingLeft: 20,
    paddingTop: 10,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 20,
  },
  recipeTitle: {
    fontFamily: "Ubuntu_500Medium",
    maxWidth: "80%",
    fontSize: 24,
    color: "#0A2533",
    lineHeight: 32,
  },
  creatorText: {
    fontFamily: "Ubuntu_500Medium",
    fontSize: 16,
    color: "#0A2533",
    marginTop: 10,
  },
  followText: {
    fontFamily: "Ubuntu_700Bold",
    fontSize: 18,
    color: "#70B9BE",
    textAlign: "right",
    position: "absolute",
    right: 20,
    top: -20,
  },
  nutritionSection: {
    flexDirection: "column",
    padding: 20,
    marginTop: 10,
    width: "100%",
  },
  nutritionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    alignItems: "flex-start",
    width: "100%",
  },
  nutritionItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E6EBF2",
    borderRadius: 8,
    marginRight: 12,
  },
  iconBackground: {
    backgroundColor: "#E6EBF2",
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  nutritionText: {
    fontFamily: "Ubuntu_500Medium",
    fontSize: 16,
    color: "#0A2533",
    flex: 1,
  },
  tabsContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    backgroundColor: "#E6EBF2",
    borderRadius: 16,
    marginTop: 10,
    padding: 5,
  },
  activeTab: {
    flex: 1,
    backgroundColor: "#88C3C6",
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTabText: {
    fontFamily: "Ubuntu_700Bold",
    fontSize: 16,
    color: "#FFFFFF",
  },
  inactiveTab: {
    flex: 1,
    backgroundColor: "#E3EBEC",
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
  inactiveTabText: {
    fontFamily: "Ubuntu_700Bold",
    fontSize: 16,
    color: "#0A2533",
  },
  contentSection: {
    padding: 20,
  },
  sectionTitle: {
    fontFamily: "Ubuntu_700Bold",
    fontSize: 20,
    color: "#0A2533",
    marginBottom: 12,
  },
  ingredientsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    paddingRight: 121,
    shadowColor: "#063336",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 3,
  },
  ingredientsText: {
    fontFamily: "Ubuntu_500Medium",
    fontSize: 18,
    lineHeight: 32,
    color: "#0A2533",
  },
  stepsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    paddingRight: 121,
    shadowColor: "#063336",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 3,
  },
  stepsText: {
    fontFamily: "Ubuntu_500Medium",
    fontSize: 18,
    lineHeight: 32,
    color: "#0A2533",
  },
  commentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    shadowColor: "#063336",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 3,
  },
  commentHeader: {
    fontFamily: "Ubuntu_700Bold",
    fontSize: 18,
    color: "#0A2533",
    marginBottom: 10,
  },
  commentText: {
    fontFamily: "Ubuntu_500Medium",
    fontSize: 16,
    color: "#0A2533",
    lineHeight: 28,
  },
  commentActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  likesContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  likesText: {
    fontFamily: "Ubuntu_400Regular",
    fontSize: 14,
    color: "#0A2533",
  },
  replyButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  replyText: {
    fontFamily: "Ubuntu_500Medium",
    fontSize: 12,
    color: "#000000",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#D9D9D9",
    width: "100%",
    height: 60,
  },
  actionButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: {
    fontFamily: "Ubuntu_500Medium",
    fontSize: 12,
    color: "#000000",
    marginTop: 5,
  },
  bottomNavigation: {
    flexDirection: "row",
    height: 80,
    backgroundColor: "#FFFFFF",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 5,
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    width: 34,
    height: 34,
  },
});

export default RecipeDetailScreen;
