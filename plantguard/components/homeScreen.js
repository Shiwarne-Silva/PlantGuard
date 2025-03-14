import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PlantGuard</Text>
      <Text style={styles.body}>
        Diagnose potato plant diseases instantly by uploading an image. Get
        accurate predictions and recommended treatments to keep your crops
        healthy.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Upload")}
      >
        <Text style={styles.buttonText}>Detect Plant Disease</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#d5e4d9",
  },
  title: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#2E7D32", // Green color for a natural theme
    textShadowColor: "rgba(0, 0, 0, 0.3)", // Shadow for a 3D effect
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
    marginBottom: 40,
  },
  body: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginHorizontal: 20,
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#4CAF50", // Green button color
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    elevation: 3, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default HomeScreen;
