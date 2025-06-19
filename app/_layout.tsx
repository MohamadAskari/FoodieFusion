import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import TabLayout from "./tabs/_layout";
import WelcomeScreen from "../src/screens/WelcomeScreen";
import { RecipeProvider } from "../src/context/RecipeContext";

const Stack = createStackNavigator();

export default function RootLayout() {
  return (
    <NavigationContainer>
      <RecipeProvider>
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="MainApp" component={TabLayout} />
        </Stack.Navigator>
      </RecipeProvider>
    </NavigationContainer>
  );
}
