import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import { useRecipes } from "../../src/context/RecipeContext";
import { useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";

const isAndroid = Platform.OS === "android";

const COOKING_TIMES = ["< 15 min", "< 20 min", "< 30 min", "1 hour"];
const DIFFICULTY_LEVELS = ["Easy", "Medium", "Hard"];

// Define types for navigation
type TabParamList = {
  home: undefined;
  saved: undefined;
  profile: undefined;
  addRecipe: undefined;
};

type AddRecipeNavigationProp = BottomTabNavigationProp<
  TabParamList,
  "addRecipe"
>;

const AddRecipeScreen = () => {
  const { addCreatedRecipe } = useRecipes();
  const navigation = useNavigation<AddRecipeNavigationProp>();
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [steps, setSteps] = useState("");
  const [selectedCookingTime, setSelectedCookingTime] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [recipeImage, setRecipeImage] = useState<string | null>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Please grant permission to access your photo library"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      setRecipeImage(result.assets[0].uri);
    }
  };

  const handleSelectCookingTime = (time: string) => {
    setSelectedCookingTime(time === selectedCookingTime ? "" : time);
  };

  const handleSelectDifficulty = (level: string) => {
    setSelectedDifficulty(level === selectedDifficulty ? "" : level);
  };

  const handlePreview = () => {
    // Preview functionality would go here
    Alert.alert("Preview", "Preview feature coming soon!");
  };

  const handlePublish = () => {
    if (
      !title ||
      !ingredients ||
      !steps ||
      !selectedCookingTime ||
      !selectedDifficulty
    ) {
      Alert.alert("Incomplete Recipe", "Please fill in all required fields");
      return;
    }

    // Add the created recipe to context
    addCreatedRecipe({
      title,
      ingredients,
      steps,
      cookingTime: selectedCookingTime,
      difficulty: selectedDifficulty,
      recipeImage,
    });

    Alert.alert("Success", "Recipe published successfully!", [
      {
        text: "View Recipe",
        onPress: () => navigation.navigate("home"),
      },
    ]);

    // Reset form
    setTitle("");
    setIngredients("");
    setSteps("");
    setSelectedCookingTime("");
    setSelectedDifficulty("");
    setRecipeImage(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Logo and Title */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/FoodieLogo.png")}
            style={styles.logo}
          />
        </View>
        <Text style={styles.headerTitle}>Create Recipe</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Add image placeholder */}
        <TouchableOpacity
          style={styles.imageUploadContainer}
          onPress={pickImage}
        >
          {recipeImage ? (
            <Image source={{ uri: recipeImage }} style={styles.uploadedImage} />
          ) : (
            <Text style={styles.imageUploadText}>
              Tap to add a photo of your dish
            </Text>
          )}
        </TouchableOpacity>

        {/* Recipe title */}
        <Text style={styles.sectionTitle}>Recipe title</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="E.g. Healthy Avocado Toast"
            placeholderTextColor="#97A2B0"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* Ingredients */}
        <Text style={styles.sectionTitle}>Ingredients</Text>
        <View style={styles.textAreaContainer}>
          <TextInput
            style={styles.textArea}
            placeholder="List ingredients, one per line with quantities"
            placeholderTextColor="#97A2B0"
            multiline
            value={ingredients}
            onChangeText={setIngredients}
            textAlignVertical="top"
          />
        </View>

        {/* Steps */}
        <Text style={styles.sectionTitle}>Steps</Text>
        <View style={styles.textAreaContainer}>
          <TextInput
            style={styles.textArea}
            placeholder="Write step-by-step instructions"
            placeholderTextColor="#97A2B0"
            multiline
            value={steps}
            onChangeText={setSteps}
            textAlignVertical="top"
          />
        </View>

        {/* Cooking time */}
        <Text style={styles.sectionTitle}>Cooking time</Text>
        <View style={styles.optionsContainer}>
          {COOKING_TIMES.map((time, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedCookingTime === time && styles.selectedOption,
              ]}
              onPress={() => handleSelectCookingTime(time)}
            >
              <Text style={styles.optionText}>{time}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Difficulty level */}
        <Text style={styles.sectionTitle}>Difficulty level</Text>
        <View style={styles.difficultyContainer}>
          {DIFFICULTY_LEVELS.map((level, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                selectedDifficulty === level && styles.selectedOption,
              ]}
              onPress={() => handleSelectDifficulty(level)}
            >
              <Text style={styles.optionText}>{level}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Action buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={styles.previewButton}
            onPress={handlePreview}
          >
            <Text style={styles.buttonText}>PREVIEW</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.publishButton}
            onPress={handlePublish}
          >
            <Text style={styles.buttonText}>PUBLISH</Text>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: isAndroid ? 48 : 16,
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
  logo: {
    width: 32,
    height: 32,
    borderRadius: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "Ubuntu_500Medium",
    color: "#0A2533",
    marginLeft: 18,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 120, // Extra padding to account for the tab bar
  },
  imageUploadContainer: {
    width: "100%",
    height: 200,
    backgroundColor: "#E3EBEC",
    borderWidth: 2,
    borderColor: "#E6EBF2",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    overflow: "hidden",
  },
  uploadedImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageUploadText: {
    fontSize: 16,
    fontFamily: "Ubuntu_500Medium",
    color: "#97A2B0",
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Ubuntu_500Medium",
    color: "#0A2533",
    marginBottom: 10,
    marginTop: 20,
  },
  inputContainer: {
    borderWidth: 2,
    borderColor: "#C6E3E5",
    borderRadius: 10,
    height: 43,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  input: {
    fontSize: 16,
    fontFamily: "Ubuntu_500Medium",
    color: "#0A2533",
  },
  textAreaContainer: {
    borderWidth: 2,
    borderColor: "#C6E3E5",
    borderRadius: 10,
    height: 150,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  textArea: {
    fontSize: 16,
    fontFamily: "Ubuntu_500Medium",
    color: "#0A2533",
    height: "100%",
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    gap: 10,
  },
  difficultyContainer: {
    flexDirection: "row",
    marginTop: 8,
    gap: 10,
  },
  optionButton: {
    paddingVertical: 9,
    paddingHorizontal: 24,
    backgroundColor: "#EBF0F6",
    borderRadius: 40,
    shadowColor: "rgba(106, 163, 167, 0.1)",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 2,
  },
  selectedOption: {
    backgroundColor: "#C6E3E5",
  },
  optionText: {
    fontSize: 16,
    fontFamily: "Ubuntu_500Medium",
    color: "#0A2533",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
    marginBottom: 20,
    gap: 20,
  },
  previewButton: {
    flex: 1,
    backgroundColor: "#0A2533",
    paddingVertical: 12,
    borderRadius: 40,
    alignItems: "center",
  },
  publishButton: {
    flex: 1,
    backgroundColor: "#0A2533",
    paddingVertical: 12,
    borderRadius: 40,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "Ubuntu_500Medium",
    color: "#FFFFFF",
  },
});

export default AddRecipeScreen;
