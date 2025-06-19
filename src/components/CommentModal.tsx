import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  TextInput,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SvgXml } from "react-native-svg";
import { Recipe } from "../types/recipe";
import { LinearGradient } from "expo-linear-gradient";
import { useRecipes } from "../context/RecipeContext";

interface CommentModalProps {
  isVisible: boolean;
  onClose: () => void;
  recipe: Recipe;
}

const CommentModal = ({ isVisible, onClose, recipe }: CommentModalProps) => {
  const [comment, setComment] = useState<string>("");
  const { addComment } = useRecipes();

  const handleSubmit = () => {
    if (!comment.trim()) {
      Alert.alert("Error", "Please write a comment before submitting.");
      return;
    }

    // Add the comment
    addComment(recipe.id, comment);

    // Clear the input and close the modal
    setComment("");
    onClose();
  };

  const handlePreview = () => {
    if (!comment.trim()) {
      Alert.alert("Error", "Please write a comment to preview.");
      return;
    }

    // Show preview alert
    Alert.alert("Comment Preview", comment, [
      { text: "Edit", style: "cancel" },
      { text: "Submit", onPress: handleSubmit },
    ]);
  };

  const arrowLeftIcon = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.25 12.2739L19.25 12.2739" stroke="#0A2533" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10.2998 18.2985L4.2498 12.2745L10.2998 6.24951" stroke="#0A2533" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
  `;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <StatusBar barStyle="dark-content" />

          {/* Header with back button and title */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <SvgXml xml={arrowLeftIcon} />
            </TouchableOpacity>
            <Text style={styles.title}>Add comment</Text>
          </View>

          {/* Recipe Info */}
          <View style={styles.recipeInfo}>
            <Text style={styles.recipeTitle}>{recipe.title}</Text>
            <Text style={styles.recipeAuthor}>By {recipe.creator}</Text>
          </View>

          {/* Comment Input */}
          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Write here"
              placeholderTextColor="#97A2B0"
              multiline
              value={comment}
              onChangeText={setComment}
            />
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={styles.previewButton}
              onPress={handlePreview}
            >
              <Text style={styles.buttonText}>PREVIEW</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>SUBMIT</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Navigation Bar */}
          <View style={styles.bottomNav}>
            <View style={styles.navIconsContainer}>
              <View style={styles.navIcon}>
                <SvgXml
                  xml={`
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.02 2.84016L3.63 7.04016C2.73 7.74016 2 9.23016 2 10.3602V17.7702C2 20.0902 3.89 21.9902 6.21 21.9902H17.79C20.11 21.9902 22 20.0902 22 17.7802V10.5002C22 9.29016 21.19 7.74016 20.2 7.05016L14.02 2.72016C12.62 1.74016 10.37 1.79016 9.02 2.84016Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 17.9902V14.9902" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  `}
                  width={24}
                  height={24}
                />
              </View>
              <View style={[styles.navIcon, styles.activeNavIcon]}>
                <SvgXml
                  xml={`
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M16.04 3.02001L8.16 10.9C7.86 11.2 7.56 11.79 7.5 12.22L7.07 15.23C6.91 16.32 7.68 17.08 8.77 16.93L11.78 16.5C12.2 16.44 12.79 16.14 13.1 15.84L20.98 7.96001C22.34 6.60001 22.98 5.02001 20.98 3.02001C18.98 1.02001 17.4 1.66001 16.04 3.02001Z" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M14.91 4.1499C15.58 6.5399 17.45 8.4099 19.85 9.0899" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  `}
                  width={24}
                  height={24}
                />
                <View style={styles.navIndicator} />
              </View>
              <View style={styles.navIcon}>
                <SvgXml
                  xml={`
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.62 20.81C12.28 20.93 11.72 20.93 11.38 20.81C8.48 19.82 2 15.69 2 8.69C2 5.6 4.49 3.1 7.56 3.1C9.38 3.1 10.99 3.98 12 5.34C13.01 3.98 14.63 3.1 16.44 3.1C19.51 3.1 22 5.6 22 8.69C22 15.69 15.52 19.82 12.62 20.81Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  `}
                  width={24}
                  height={24}
                />
              </View>
              <View style={styles.navIcon}>
                <SvgXml
                  xml={`
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  `}
                  width={24}
                  height={24}
                />
              </View>
            </View>
          </View>

          {/* Foodie Logo */}
          <Image
            source={require("../../assets/FoodieLogo.png")}
            style={styles.logo}
          />
        </View>
      </TouchableWithoutFeedback>
    </Modal>
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
    marginTop: 60,
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontFamily: "Ubuntu_500Medium",
    fontSize: 24,
    color: "#0A2533",
    marginLeft: 15,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 10,
    position: "absolute",
    top: 60,
    right: 20,
  },
  recipeInfo: {
    marginTop: 30,
    paddingHorizontal: 30,
  },
  recipeTitle: {
    fontFamily: "Ubuntu_500Medium",
    fontSize: 20,
    color: "#97A2B0",
  },
  recipeAuthor: {
    fontFamily: "Ubuntu_500Medium",
    fontSize: 16,
    color: "#97A2B0",
    marginTop: 5,
  },
  commentInputContainer: {
    marginTop: 20,
    marginHorizontal: 25,
    height: 300,
    borderWidth: 2,
    borderColor: "#C6E3E5",
    borderRadius: 10,
    padding: 15,
  },
  commentInput: {
    fontFamily: "Ubuntu_500Medium",
    fontSize: 16,
    color: "#0A2533",
    flex: 1,
    textAlignVertical: "top",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
    paddingHorizontal: 25,
  },
  previewButton: {
    backgroundColor: "#5AA6AC",
    borderRadius: 40,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "center",
    width: "45%",
  },
  submitButton: {
    backgroundColor: "#0A2533",
    borderRadius: 40,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "center",
    width: "45%",
  },
  buttonText: {
    fontFamily: "Ubuntu_500Medium",
    fontSize: 16,
    color: "#FFFFFF",
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 80,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E6EBF2",
  },
  navIconsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: "100%",
  },
  navIcon: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: 70,
  },
  activeNavIcon: {
    position: "relative",
  },
  navIndicator: {
    position: "absolute",
    bottom: 0,
    height: 4,
    width: "100%",
    backgroundColor: "#C6E3E5",
  },
});

export default CommentModal;
