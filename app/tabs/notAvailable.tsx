import React from "react";
import { StyleSheet, View, Text, SafeAreaView, StatusBar } from "react-native";
import { Image } from "expo-image";

const NotAvailableScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/FoodieLogo.png")}
          style={styles.logo}
          contentFit="contain"
        />
      </View>

      {/* Title */}
      <Text style={styles.title}>Not available</Text>

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
  logoContainer: {
    position: "absolute",
    top: 50,
    left: 20,
    width: 32,
    height: 35,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontFamily: "Ubuntu_700Bold",
    fontSize: 24,
    color: "#0A2533",
    textAlign: "center",
    marginTop: 56,
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

export default NotAvailableScreen;
