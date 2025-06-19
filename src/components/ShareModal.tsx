import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  Clipboard,
  Share,
} from "react-native";
import { SvgXml } from "react-native-svg";
import { Recipe } from "../types/recipe";
import FacebookIcon from "../../assets/facebook.svg";
import TwitterIcon from "../../assets/twitter.svg";

interface ShareModalProps {
  isVisible: boolean;
  onClose: () => void;
  recipe: Recipe;
}

const ShareModal = ({ isVisible, onClose, recipe }: ShareModalProps) => {
  const [copied, setCopied] = useState(false);

  const handleSharePress = () => {
    Share.share({
      message: `Check out this recipe: ${recipe.title}`,
      url: `https://www.foodiefusion.com/?share=${recipe.id}`,
    });
  };

  const handleCopyLink = () => {
    const shareLink = `https://www.foodiefusion.com/?share=${recipe.id}`;
    Clipboard.setString(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />

        {/* Header section */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <SvgXml xml={arrowLeftIcon} />
          </TouchableOpacity>
          <Text style={styles.title}>Share</Text>
        </View>

        {/* Foodie Logo */}
        <Image
          source={require("../../assets/FoodieLogo.png")}
          style={styles.logo}
        />

        {/* Recipe Image */}
        <View style={styles.recipeImageContainer}>
          <Image
            source={recipe.creator === "You" ? require("../../assets/default-food.png") : recipe.image}
            style={styles.recipeImage}
            resizeMode="cover"
          />
        </View>

        {/* Recipe Title and Author */}
        <View style={styles.recipeInfo}>
          <Text style={styles.recipeTitle}>{recipe.title}</Text>
          <Text style={styles.recipeAuthor}>By {recipe.creator}</Text>
        </View>

        {/* Social Media Icons */}
        <View style={styles.socialGrid}>
          <View style={styles.socialRow}>
            <TouchableOpacity onPress={handleSharePress} style={styles.socialIcon}>
              <FacebookIcon width={70} height={70} style={styles.socialIconImage} />
              <Text style={styles.socialText}>Facebook</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSharePress} style={styles.socialIcon}>
              <Image source={require("../../assets/instagram.png")} style={styles.socialIconImage} />
              <Text style={styles.socialText}>Instagram</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSharePress} style={styles.socialIcon}>
              <TwitterIcon width={70} height={70} style={styles.socialIconImage} />
              <Text style={styles.socialText}>Twitter</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Share Link Section */}
        <Text style={styles.orShareLinkText}>Or share link</Text>
        <View style={styles.shareLinkContainer}>
          <Text style={styles.linkText}>
            https://www.foodiefusion.com/?share=123
          </Text>
        </View>

        {/* Copy Button */}
        <TouchableOpacity style={styles.copyButton} onPress={handleCopyLink}>
          <Text style={styles.copyButtonText}>
            {copied ? "COPIED!" : "COPY"}
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 60,
    marginBottom: 20,
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
  socialIconImage: {
    width: 70,
    height: 70,
    marginBottom: 5,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 10,
    position: "absolute",
    top: 60,
    right: 20,
  },
  recipeImageContainer: {
    height: 250,
    borderRadius: 15,
    overflow: "hidden",
    marginBottom: 15,
  },
  recipeImage: {
    width: "100%",
    height: "100%",
  },
  recipeInfo: {
    marginBottom: 15,
  },
  recipeTitle: {
    fontFamily: "Ubuntu_500Medium",
    fontSize: 24,
    color: "#0A2533",
  },
  recipeAuthor: {
    fontFamily: "Ubuntu_500Medium",
    fontSize: 16,
    color: "#97A2B0",
    marginTop: 5,
  },
  socialGrid: {
    marginVertical: 10,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  socialIcon: {
    alignItems: "center",
    width: "30%",
  },
  socialText: {
    fontFamily: "Ubuntu_500Medium",
    fontSize: 14,
    color: "#0A2533",
    marginTop: 5,
  },
  orShareLinkText: {
    fontFamily: "Ubuntu_500Medium",
    fontSize: 20,
    color: "#0A2533",
    marginTop: 10,
    marginBottom: 15,
  },
  shareLinkContainer: {
    borderWidth: 2,
    borderColor: "#5AA6AC",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
  },
  linkText: {
    fontFamily: "Ubuntu_500Medium",
    fontSize: 16,
    color: "#0A2533",
  },
  copyButton: {
    backgroundColor: "#15242C",
    borderRadius: 40,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    width: "40%",
    alignSelf: "center",
  },
  copyButtonText: {
    fontFamily: "Ubuntu_500Medium",
    fontSize: 16,
    color: "#FFFFFF",
  },
});

export default ShareModal;
