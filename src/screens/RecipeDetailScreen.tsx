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
} from "react-native";
import { SvgXml } from "react-native-svg";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Recipe, Comment } from "../types/recipe";
import StarIcon from "../../assets/star-icon.svg";
import ThumbsUpIcon from "../../assets/thumbs-up-icon.svg";
import BookmarkIcon from "../../assets/bookmark-icon.svg";
import CarbIcon from "../../assets/carb-icon.svg";
import ProteinIcon from "../../assets/protein-icon.svg";
import CalorieIcon from "../../assets/calorie-icon.svg";
import FatIcon from "../../assets/fat-icon.svg";
import CommentIcon from "../../assets/comment-icon.svg";
import { LinearGradient } from "expo-linear-gradient";
import { useRecipes } from "../context/RecipeContext";
import ShareModal from "../components/ShareModal";
import CommentModal from "../components/CommentModal";

// Define the route param types
type RecipeDetailRouteParams = {
  recipe: Recipe;
};

// Navigation type

const RecipeDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { recipe } = route.params as RecipeDetailRouteParams;
  const {
    saveRecipe,
    removeSavedRecipe,
    isRecipeSaved,
    getRecipeComments,
    likeRecipe,
    unlikeRecipe,
    isRecipeLiked,
    getRecipeLikes,
  } = useRecipes();
  const [activeTab, setActiveTab] = useState<
    "ingredients" | "steps" | "comments"
  >("ingredients");
  const [saved, setSaved] = useState<boolean>(isRecipeSaved(recipe.id));
  const [shareModalVisible, setShareModalVisible] = useState<boolean>(false);
  const [commentModalVisible, setCommentModalVisible] =
    useState<boolean>(false);
  const [liked, setLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(parseInt(recipe.likes));

  // Get comments for this recipe
  const comments = getRecipeComments(recipe.id);

  // Load like status and likes count
  useEffect(() => {
    const loadLikeData = async () => {
      try {
        // Check if this recipe is liked
        const recipeIsLiked = await isRecipeLiked(recipe.id);
        setLiked(recipeIsLiked);

        // Get the current likes count
        const currentLikes = await getRecipeLikes(recipe.id);
        setLikesCount(currentLikes);
      } catch (error) {
        console.error("Error loading like data:", error);
      }
    };

    loadLikeData();
  }, [recipe.id, isRecipeLiked, getRecipeLikes]);

  const handleSave = () => {
    if (saved) {
      removeSavedRecipe(recipe.id);
      setSaved(false);
    } else {
      saveRecipe(recipe.id);
      setSaved(true);
    }
  };

  const handleSharePress = () => {
    setShareModalVisible(true);
  };

  const handleCommentPress = () => {
    setCommentModalVisible(true);
  };

  const handleLikePress = async () => {
    try {
      if (!liked) {
        // Update local state immediately for UI feedback
        setLiked(true);
        setLikesCount(likesCount + 1);

        // Then update in storage (async)
        await likeRecipe(recipe.id);
      } else {
        // Update local state immediately for UI feedback
        setLiked(false);
        setLikesCount(likesCount - 1);

        // Then update in storage (async)
        await unlikeRecipe(recipe.id);
      }
    } catch (error) {
      console.error("Error handling like:", error);
      // Revert UI changes if there was an error
      if (!liked) {
        setLiked(false);
        setLikesCount(likesCount - 1);
      } else {
        setLiked(true);
        setLikesCount(likesCount + 1);
      }
    }
  };

  const arrowLeftIcon = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.25 12.2739L19.25 12.2739" stroke="#0A2533" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10.2998 18.2985L4.2498 12.2745L10.2998 6.24951" stroke="#0A2533" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
    `;
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView style={styles.contentScroll}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <SvgXml xml={arrowLeftIcon} />
          </TouchableOpacity>
        </View>


        {/* Hero Image */}
        <View style={styles.imageContainer}>
          <Image source={recipe.creator === "You" ? require("../../assets/default-food.png") : recipe.image} style={styles.recipeImage} />
          <LinearGradient
            colors={["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.9)"]}
            style={styles.imageOverlay}
            locations={[0.1, 1]}
          />
        </View>
        {/* Recipe Title and Creator */}
        <View style={styles.titleSection}>
          <View style={styles.titleRow}>
            <Text style={styles.recipeTitle}>{recipe.title}</Text>
            <View style={styles.ratingContainer}>
              {recipe.creator !== "You" ? <StarIcon width={32} height={32} fill="#FFC640" /> : null}
              {recipe.creator !== "You" ? <Text style={styles.ratingText}>{recipe.rating}</Text> : null}
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

        {/* Tabs for Ingredients/Steps/Comments */}
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
          <TouchableOpacity
            style={
              activeTab === "comments" ? styles.activeTab : styles.inactiveTab
            }
            onPress={() => setActiveTab("comments")}
          >
            <Text
              style={
                activeTab === "comments"
                  ? styles.activeTabText
                  : styles.inactiveTabText
              }
            >
              Comments
            </Text>
          </TouchableOpacity>
        </View>

        {/* Conditionally render Ingredients, Steps, or Comments based on active tab */}
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
        ) : activeTab === "steps" ? (
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
        ) : (
          <View style={styles.contentSection}>
            <Text style={styles.sectionTitle}>Comments</Text>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <View key={comment.id} style={styles.commentCard}>
                  <View style={styles.commentHeader}>
                    <Text style={styles.commentUser}>{comment.user}</Text>
                    <Text style={styles.commentDate}>{comment.date}</Text>
                  </View>
                  <Text style={styles.commentText}>{comment.text}</Text>
                  <View style={styles.commentFooter}>
                    <ThumbsUpIcon width={16} height={16} stroke="#1E1E1E" />
                    <Text style={styles.commentLikes}>{comment.likes}</Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.noCommentsContainer}>
                <Text style={styles.noCommentsText}>
                  No comments yet. Be the first to comment!
                </Text>
                <TouchableOpacity
                  style={styles.addCommentButton}
                  onPress={() => setCommentModalVisible(true)}
                >
                  <Text style={styles.addCommentButtonText}>Add Comment</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleLikePress}
          >
            <SvgXml
              xml={`<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M18.6665 11.9998V6.6665C18.6665 5.60564 18.2451 4.58822 17.4949 3.83808C16.7448 3.08793 15.7274 2.6665 14.6665 2.6665L9.33317 14.6665V29.3332H24.3732C25.0163 29.3404 25.6403 29.115 26.1304 28.6985C26.6204 28.282 26.9434 27.7024 27.0398 27.0665L28.8798 15.0665C28.9378 14.6843 28.9121 14.2941 28.8043 13.9228C28.6965 13.5516 28.5093 13.2082 28.2556 12.9165C28.002 12.6248 27.6879 12.3917 27.3353 12.2335C26.9826 12.0752 26.5997 11.9955 26.2132 11.9998H18.6665ZM9.33317 29.3332H5.33317C4.62593 29.3332 3.94765 29.0522 3.44755 28.5521C2.94746 28.052 2.6665 27.3737 2.6665 26.6665V17.3332C2.6665 16.6259 2.94746 15.9476 3.44755 15.4476C3.94765 14.9475 4.62593 14.6665 5.33317 14.6665H9.33317" fill="${
                liked ? "#C6E3E5" : "white"
              }"/>
<path d="M9.33317 14.6665L14.6665 2.6665C15.7274 2.6665 16.7448 3.08793 17.4949 3.83808C18.2451 4.58822 18.6665 5.60564 18.6665 6.6665V11.9998H26.2132C26.5997 11.9955 26.9826 12.0752 27.3353 12.2335C27.6879 12.3917 28.002 12.6248 28.2556 12.9165C28.5093 13.2082 28.6965 13.5516 28.8043 13.9228C28.9121 14.2941 28.9378 14.6843 28.8798 15.0665L27.0398 27.0665C26.9434 27.7024 26.6204 28.282 26.1304 28.6985C25.6403 29.115 25.0163 29.3404 24.3732 29.3332H9.33317M9.33317 14.6665V29.3332M9.33317 14.6665H5.33317C4.62593 14.6665 3.94765 14.9475 3.44755 15.4476C2.94746 15.9477 2.6665 16.6259 2.6665 17.3332V26.6665C2.6665 27.3737 2.94746 28.052 3.44755 28.5521C3.94765 29.0522 4.62593 29.3332 5.33317 29.3332H9.33317" stroke="#1E1E1E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`}
            />
            <Text style={[styles.actionText, liked && styles.activeActionText]}>
              {likesCount}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleCommentPress}
          >
            <CommentIcon width={30} height={30} />
            <Text style={styles.actionText}>COMMENT</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleSharePress}
          >
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
          </TouchableOpacity>
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

      {/* Share Modal */}
      <ShareModal
        isVisible={shareModalVisible}
        onClose={() => setShareModalVisible(false)}
        recipe={recipe}
      />

      {/* Comment Modal */}
      <CommentModal
        isVisible={commentModalVisible}
        onClose={() => setCommentModalVisible(false)}
        recipe={recipe}
      />
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
    top: 30,
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
    marginTop: -10,
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
    fontSize: 16,
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
    fontSize: 16,
    lineHeight: 32,
    color: "#0A2533",
  },
  commentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
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
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  commentUser: {
    fontFamily: "Ubuntu_700Bold",
    fontSize: 16,
    color: "#0A2533",
  },
  commentDate: {
    fontFamily: "Ubuntu_400Regular",
    fontSize: 14,
    color: "#97A2B0",
  },
  commentText: {
    fontFamily: "Ubuntu_400Regular",
    fontSize: 16,
    color: "#0A2533",
    marginBottom: 12,
  },
  commentFooter: {
    flexDirection: "row",
    alignItems: "center",
  },
  commentLikes: {
    fontFamily: "Ubuntu_400Regular",
    fontSize: 14,
    color: "#97A2B0",
    marginLeft: 5,
  },
  noCommentsContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#063336",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 3,
  },
  noCommentsText: {
    fontFamily: "Ubuntu_400Regular",
    fontSize: 16,
    color: "#97A2B0",
    textAlign: "center",
    marginBottom: 15,
  },
  addCommentButton: {
    backgroundColor: "#88C3C6",
    borderRadius: 40,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  addCommentButtonText: {
    fontFamily: "Ubuntu_500Medium",
    fontSize: 14,
    color: "#FFFFFF",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    marginBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
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
  activeActionText: {
    fontFamily: "Ubuntu_500Medium",
    color: "#70B9BE",
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
