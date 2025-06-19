import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Platform,
  Dimensions,
} from "react-native";
import {
  useFonts,
  Ubuntu_500Medium,
  Ubuntu_700Bold,
} from "@expo-google-fonts/ubuntu";
import { WendyOne_400Regular } from "@expo-google-fonts/wendy-one";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
// Import SVG components
import HomeIcon from "../../assets/home-icon.svg";
import EditIcon from "../../assets/edit-icon.svg";
import BookmarkIcon from "../../assets/bookmark-icon.svg";
import UserIcon from "../../assets/user-icon.svg";

type RootStackParamList = {
  Welcome: undefined;
  MainApp: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList, "Welcome">;

const WelcomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [fontsLoaded] = useFonts({
    Ubuntu_500Medium,
    Ubuntu_700Bold,
    WendyOne_400Regular,
  });

  if (!fontsLoaded) {
    return null; // Return null while fonts are loading
  }

  const handleStart = () => {
    navigation.navigate("MainApp");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Main content area */}
      <View style={styles.content}>
        {/* Logo */}
        <Image
          source={require("../../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Foodie Fusion text */}
        <View style={styles.logoTextContainer}>
          <Text style={styles.logoText}>Foodie Fusion</Text>
        </View>

        {/* Tagline */}
        <Text style={styles.tagline}>
          Healthy recipes to share, like, and engage with others.
        </Text>

        {/* Start button */}
        <TouchableOpacity style={styles.startButton} onPress={handleStart}>
          <Text style={styles.startButtonText}>START</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom navigation bar */}
      {/* <View style={styles.bottomNavContainer}>
        <View style={styles.navigationBar}>
          <HomeIcon width={34} height={34} />
          <EditIcon width={34} height={34} />
          <BookmarkIcon width={34} height={34} />
          <UserIcon width={34} height={34} />
        </View>
        <View style={styles.homeIndicator}>
          <View style={styles.homeIndicatorBar} />
        </View>
      </View> */}
    </SafeAreaView>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF7E4",
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? 20 : 0,
  },
  logo: {
    width: 466,
    height: 310,
    marginTop: 0,
  },
  logoTextContainer: {
    marginTop: 29,
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 5,
    borderRadius: 40,
    backgroundColor: "transparent",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  logoText: {
    fontFamily: "WendyOne_400Regular",
    fontSize: 36,
    color: "#0A2533",
    textShadowColor: "rgba(90, 166, 172, 1)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
    textAlign: "center",
  },
  tagline: {
    fontFamily: "Ubuntu_500Medium",
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.48, // -2% of 24px
    color: "#88C3C6",
    textAlign: "center",
    width: 233,
    marginTop: 29,
  },
  startButton: {
    backgroundColor: "#0A2533",
    paddingVertical: 9,
    paddingHorizontal: 24,
    borderRadius: 40,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  startButtonText: {
    color: "#FFFFFF",
    fontFamily: "Ubuntu_500Medium",
    fontSize: 16,
    lineHeight: 23.2,
  },
  bottomNavContainer: {
    width: "100%",
    position: "absolute",
    bottom: 0,
  },
  navigationBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 25,
    paddingVertical: 19,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 5,
  },
  homeIndicator: {
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#C4C4C4",
  },
  homeIndicatorBar: {
    width: 134,
    height: 5,
    backgroundColor: "#C6E3E5",
    borderRadius: 100,
  },
});

export default WelcomeScreen;
