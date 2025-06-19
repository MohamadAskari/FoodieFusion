import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import {
  useFonts,
  Ubuntu_500Medium,
  Ubuntu_700Bold,
} from "@expo-google-fonts/ubuntu";
import { WendyOne_400Regular } from "@expo-google-fonts/wendy-one";
import { View, ActivityIndicator } from "react-native";
import HomeIcon from "../../assets/home-icon.svg";
import EditIcon from "../../assets/edit-icon.svg";
import BookmarkIcon from "../../assets/bookmark-icon.svg";
import UserIcon from "../../assets/user-icon.svg";

// Screens
import HomeScreen from "./home";
import AddRecipeScreen from "./addRecipe";
import SavedScreen from "./saved";
import ProfileScreen from "./profile";
import FiltersScreen from "./filters";
import RecipeDetailScreen from "../../src/screens/RecipeDetailScreen";

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const SavedStack = createStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="homeMain" component={HomeScreen} />
      <HomeStack.Screen name="filters" component={FiltersScreen} />
      <HomeStack.Screen name="recipeDetail" component={RecipeDetailScreen} />
    </HomeStack.Navigator>
  );
}

function SavedStackScreen() {
  return (
    <SavedStack.Navigator screenOptions={{ headerShown: false }}>
      <SavedStack.Screen name="savedMain" component={SavedScreen} />
      <SavedStack.Screen name="recipeDetail" component={RecipeDetailScreen} />
    </SavedStack.Navigator>
  );
}

function TabLayout() {
  const [fontsLoaded] = useFonts({
    Ubuntu_500Medium,
    Ubuntu_700Bold,
    WendyOne_400Regular,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#C6E3E5" />
      </View>
    );
  }

  return (
    <Tab.Navigator
      initialRouteName="home"
      screenOptions={{
        tabBarActiveTintColor: "#C6E3E5",
        tabBarInactiveTintColor: "#1E1E1E",
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -3,
          },
          shadowOpacity: 0.15,
          shadowRadius: 2,
          elevation: 5,
          height: 80,
          paddingBottom: 8,
          paddingTop: 12,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="home"
        component={HomeStackScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <HomeIcon
              width={34}
              height={34}
              stroke={focused ? "none" : color}
              fill={focused ? "#C6E3E5" : "none"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="addRecipe"
        component={AddRecipeScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <EditIcon
              width={34}
              height={34}
              stroke={focused ? "none" : color}
              fill={focused ? "#C6E3E5" : "none"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="saved"
        component={SavedStackScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <BookmarkIcon
              width={34}
              height={34}
              stroke={focused ? "none" : color}
              fill={focused ? "#C6E3E5" : "none"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <UserIcon
              width={34}
              height={34}
              stroke={focused ? "none" : color}
              fill={focused ? "#C6E3E5" : "none"}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default TabLayout;
