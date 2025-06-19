import React from "react";
import { StyleSheet, View, Text, SafeAreaView, StatusBar } from "react-native";
import { Image } from "expo-image";

const ProfileScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Logo */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/FoodieLogo.png")}
            style={styles.logo}
          />
        </View>
        {/* Title */}
        <Text style={styles.title}>Not available</Text>
      </View>
      {/* Message */}
      <View style={styles.messageContainer}>
        <Text style={styles.message}>
          The view you{"\n"}requested is not available on this prototype
        </Text>
      </View>

      {/* Home Indicator */}
      <View style={styles.homeIndicator}>
        <View style={styles.homeIndicatorBar} />
      </View>
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
  logo: {
    width: 32,
    height: 32,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontFamily: "Ubuntu_500Medium",
    color: "#0A2533",
    marginLeft: 18,
  },
  messageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 50,
  },
  message: {
    fontFamily: "Ubuntu_700Bold",
    fontSize: 24,
    color: "#5AA6AC",
    textAlign: "center",
    lineHeight: 32,
  },
  tabBar: {
    flexDirection: "row",
    height: 80,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 5,
  },
  tabIconContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 19,
  },
  homeIndicator: {
    height: 36,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  homeIndicatorBar: {
    width: 134,
    height: 5,
    backgroundColor: "#C6E3E5",
    borderRadius: 100,
  },
});

export default ProfileScreen;
