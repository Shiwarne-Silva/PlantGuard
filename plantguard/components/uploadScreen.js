import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

// Replace with your computer's IP or ngrok URL
const API_URL = "http://172.27.0.14:8009/predict"; // Example: Replace with your IP or ngrok URL

const UploadScreen = () => {
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  // Request permission to access the camera roll
  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Sorry, we need camera roll permissions to make this work!"
      );
      return false;
    }
    return true;
  };

  // Function to pick an image from the device
  const pickImage = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setPrediction(null); // Reset prediction when a new image is selected
    }
  };

  // Function to upload the image to the backend and get predictions
  const uploadImage = async () => {
    if (!image) {
      Alert.alert("No Image", "Please select an image first!");
      return;
    }

    console.log("Selected image URI:", image);

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", {
        uri: image,
        name: "image.jpg",
        type: "image/jpeg",
      });

      console.log("Sending request to:", API_URL);

      const response = await axios.post(API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Prediction response:", response.data);
      setPrediction(response.data);
    } catch (error) {
      console.error("Error during prediction:", error);
      Alert.alert("Error", "Something went wrong while making the prediction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Plant Disease Detection</Text>

      {/* Button to pick an image */}
      <Button title="Pick an Image" onPress={pickImage} />

      {/* Display the selected image */}
      {image && <Image source={{ uri: image }} style={styles.image} />}

      {/* Button to upload the image and get predictions */}
      <View style={styles.buttonContainer}>
        <Button
          title="Predict Disease"
          onPress={uploadImage}
          disabled={loading}
        />
      </View>

      {/* Display loading indicator */}
      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      {/* Display prediction results */}
      {prediction && (
        <View style={styles.predictionContainer}>
          <Text style={styles.predictionText}>
            Predicted Disease: {prediction.class}
          </Text>
          <Text style={styles.predictionText}>
            Confidence: {(prediction.confidence * 100).toFixed(2)}%
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#d5e4d9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 300,
    marginVertical: 20,
    borderRadius: 10,
  },
  buttonContainer: {
    marginVertical: 10,
  },
  predictionContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
  },
  predictionText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default UploadScreen;
