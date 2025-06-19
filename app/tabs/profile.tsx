import React from "react";
import { StyleSheet, View, Text, SafeAreaView } from "react-native";

const ProfileScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Your account details</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF7E4",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    marginBottom: 10,
    color: "#0A2533",
    fontFamily: "Ubuntu_500Medium",
  },
  subtitle: {
    fontSize: 18,
    color: "#88C3C6",
    fontFamily: "Ubuntu_500Medium",
  },
});

export default ProfileScreen;
