import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  useWindowDimensions,
  Platform,
  Animated,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import {
  Upload as UploadIcon,
  Image as ImageIcon,
  ChevronLeft,
  Download as DownloadIcon,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  useFonts,
  Poppins_700Bold,
  Poppins_400Regular,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import { useNavigation } from "@react-navigation/native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";

// Replace with your computer's IP
const API_URL = "http://192.168.8.158:8009/predict";

export default function UploadScreen() {
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const { width } = useWindowDimensions();
  const navigation = useNavigation();

  // Animation for header visibility
  const [headerVisible, setHeaderVisible] = useState(true);
  const headerHeight = Platform.OS === "ios" ? 120 : 100;
  const animatedHeader = useRef(new Animated.Value(0)).current;

  const [fontsLoaded] = useFonts({
    "Poppins-Bold": Poppins_700Bold,
    "Poppins-Regular": Poppins_400Regular,
    "Poppins-SemiBold": Poppins_600SemiBold,
  });

  const requestPermission = async () => {
    try {
      console.log("Requesting media library permissions...");
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        console.log("Media library permissions denied");
        Alert.alert(
          "Permission Denied",
          "We need camera roll permissions to select an image. Please enable permissions in your device settings."
        );
        return false;
      }
      console.log("Media library permissions granted");
      return true;
    } catch (error) {
      console.error("Error requesting permissions:", error);
      Alert.alert("Error", "Failed to request permissions. Please try again.");
      return false;
    }
  };

  const pickImage = async () => {
    console.log("Pick image button pressed");
    const hasPermission = await requestPermission();
    if (!hasPermission) {
      console.log("Permission not granted, aborting image picking");
      return;
    }

    try {
      console.log("Launching image library...");
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 1,
      });

      console.log("Image picker result:", result);

      if (!result.canceled) {
        const uri = result.assets ? result.assets[0].uri : result.uri;
        if (uri) {
          console.log("Image selected:", uri);
          setImage(uri);
          setPrediction(null);
        } else {
          console.log("No valid image URI found in result");
          Alert.alert("Error", "No valid image selected. Please try again.");
        }
      } else {
        console.log("Image picking cancelled");
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick an image. Please try again.");
    }
  };

  const uploadImage = async () => {
    if (!image) {
      Alert.alert("No Image", "Please select an image first!");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", {
        uri: image,
        name: "image.jpg",
        type: "image/jpeg",
      });

      const response = await axios.post(API_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setPrediction(response.data);
    } catch (error) {
      console.error("Error during prediction:", error);
      if (error.response) {
        const errorMessage =
          error.response.data.detail ||
          "Something went wrong while making the prediction.";
        Alert.alert("Error", errorMessage);
      } else if (error.request) {
        Alert.alert(
          "Error",
          "Network error. Please check your internet connection and try again."
        );
      } else {
        Alert.alert("Error", "An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    if (!prediction) {
      Alert.alert("No Report", "Please generate an analysis report first!");
      return;
    }

    let imageBase64 = "";
    if (image) {
      try {
        console.log("Converting image to base64...");
        imageBase64 = await FileSystem.readAsStringAsync(image, {
          encoding: FileSystem.EncodingType.Base64,
        });
        imageBase64 = `data:image/jpeg;base64,${imageBase64}`;
        console.log("Image converted to base64 successfully");
      } catch (error) {
        console.error("Error converting image to base64:", error);
        Alert.alert(
          "Warning",
          "Failed to include the image in the PDF. The report will be generated without the image."
        );
        imageBase64 = "";
      }
    }

    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
            h1 { text-align: center; color: #2c3e50; }
            h2 { color: #34495e; }
            h3 { text-align: center; color: #7f8c8d; font-size: 16px; margin-bottom: 10px; }
            p { margin: 10px 0; }
            ul { list-style-type: disc; margin-left: 20px; }
            .section { margin-bottom: 20px; }
            .image-section { text-align: center; margin-bottom: 20px; }
            img { max-width: 100%; height: auto; max-height: 300px; }
          </style>
        </head>
        <body>
          <h1>PlantGuard</h1>
          <center><h2>Plant Disease Analysis Report</h2></center>
          ${
            imageBase64
              ? `
          <div class="image-section">
            <h3>Uploaded Image</h3>
            <img src="${imageBase64}" alt="Uploaded Plant Image" />
          </div>
          `
              : ""
          }
          <div class="section">
            <h2>Disease</h2>
            <p>${prediction.class}</p>
          </div>
          <div class="section">
            <h2>Confidence</h2>
            <p>${(prediction.confidence * 100).toFixed(2)}%</p>
          </div>
          <div class="section">
            <h2>Disease Information</h2>
            <p>${prediction.disease_info}</p>
          </div>
          <div class="section">
            <h2>Treatments</h2>
            <ul>
              ${prediction.treatments
                .map((treatment) => `<li>${treatment}</li>`)
                .join("")}
            </ul>
          </div>
        </body>
      </html>
    `;

    try {
      console.log("Generating PDF...");
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      console.log("PDF generated at:", uri);

      if (await Sharing.isAvailableAsync()) {
        console.log("Sharing PDF...");
        await Sharing.shareAsync(uri, {
          mimeType: "application/pdf",
          dialogTitle: "Download or Share Analysis Report",
          UTI: "com.adobe.pdf",
        });
      } else {
        console.log("Sharing not available, saving locally if possible");
        Alert.alert(
          "Download",
          "Sharing is not available on this device. The PDF can be accessed via the file system."
        );
      }
    } catch (error) {
      console.error("Error generating or sharing PDF:", error);
      Alert.alert(
        "Error",
        "Failed to generate or download the PDF. Please try again."
      );
    }
  };

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const threshold = 50;

    if (offsetY > threshold && headerVisible) {
      setHeaderVisible(false);
      Animated.timing(animatedHeader, {
        toValue: -headerHeight,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else if (offsetY <= threshold && !headerVisible) {
      setHeaderVisible(true);
      Animated.timing(animatedHeader, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=1920",
        }}
        style={[styles.backgroundImage, { width }]}
        resizeMode="cover"
      />

      {/* Overlay Gradient */}
      <LinearGradient
        colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.7)"]}
        style={[styles.gradient, { width }]}
      />

      {/* Animated Header Bar */}
      <Animated.View
        style={[
          styles.header,
          {
            transform: [{ translateY: animatedHeader }],
          },
        ]}
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.7)", "rgba(0,0,0,0)"]}
          style={styles.headerGradient}
        />
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeft color="#fff" size={32} />
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Plant Disease Detection</Text>
            <Text style={styles.headerSubtitle}>Analyze & Diagnose</Text>
          </View>
        </View>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.content}>
          <View style={styles.imageSection}>
            {image ? (
              <Image source={{ uri: image }} style={styles.selectedImage} />
            ) : (
              <View style={styles.placeholderContainer}>
                <ImageIcon
                  size={64}
                  color="#ffffff"
                  style={styles.placeholderIcon}
                />
                <Text style={styles.placeholderText}>No image selected</Text>
              </View>
            )}
          </View>

          <View style={styles.actionSection}>
            <TouchableOpacity
              style={[styles.button, styles.uploadButton]}
              onPress={() => {
                console.log("Select Image button pressed");
                pickImage();
              }}
            >
              <UploadIcon size={24} color="#ffffff" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Select Image</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.predictButton,
                !image && styles.buttonDisabled,
              ]}
              onPress={uploadImage}
              disabled={!image || loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <>
                  <ImageIcon
                    size={24}
                    color="#ffffff"
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.buttonText}>Analyze Disease</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          {prediction && (
            <View style={styles.predictionContainer}>
              <Text style={styles.predictionTitle}>Analysis Report</Text>
              <View style={styles.predictionRow}>
                <Text style={styles.predictionLabel}>Disease:</Text>
                <Text style={styles.predictionValue}>{prediction.class}</Text>
              </View>
              <View style={styles.predictionRow}>
                <Text style={styles.predictionLabel}>Confidence:</Text>
                <Text style={styles.predictionValue}>
                  {(prediction.confidence * 100).toFixed(2)}%
                </Text>
              </View>
              <View style={styles.predictionRow}>
                <Text style={styles.predictionLabel}>Disease Info:</Text>
                <Text style={styles.predictionValue}>
                  {prediction.disease_info}
                </Text>
              </View>
              <View style={styles.predictionSection}>
                <Text style={styles.predictionLabel}>Treatments:</Text>
                <View style={styles.treatmentList}>
                  {prediction.treatments.map((treatment, index) => (
                    <Text key={index} style={styles.treatmentItem}>
                      • {treatment}
                    </Text>
                  ))}
                </View>
              </View>
              <TouchableOpacity
                style={[styles.button, styles.downloadButton]}
                onPress={generatePDF}
              >
                <DownloadIcon
                  size={24}
                  color="#ffffff"
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>Download Report</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  backgroundImage: {
    height: "100%",
    position: "absolute",
  },
  gradient: {
    height: "100%",
    position: "absolute",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    height: Platform.OS === "ios" ? 120 : 100,
  },
  headerGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "100%",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 90 : 40,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTextContainer: {
    marginLeft: 8,
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 24,
    fontFamily: "Poppins-Bold",
  },
  headerSubtitle: {
    color: "#ffffff",
    opacity: 0.8,
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: Platform.OS === "ios" ? 190 : 120,
    paddingBottom: 40,
  },
  imageSection: {
    aspectRatio: 1,
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 24,
  },
  selectedImage: {
    width: "100%",
    height: "100%",
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderIcon: {
    marginBottom: 16,
    opacity: 0.7,
  },
  placeholderText: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    opacity: 0.7,
  },
  actionSection: {
    gap: 16,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  uploadButton: {
    backgroundColor: "#4CAF50",
  },
  predictButton: {
    backgroundColor: "#2196F3",
  },
  downloadButton: {
    backgroundColor: "#9C27B0",
    marginTop: 16,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonIcon: {
    marginRight: 12,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
  },
  predictionContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    padding: 24,
    marginTop: 24,
  },
  predictionTitle: {
    fontSize: 24,
    color: "#ffffff",
    fontFamily: "Poppins-Bold",
    marginBottom: 16,
    textAlign: "center",
  },
  predictionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  predictionLabel: {
    fontSize: 16,
    color: "#E0E0E0",
    fontFamily: "Poppins-Regular",
    flex: 1,
  },
  predictionValue: {
    fontSize: 16,
    color: "#ffffff",
    fontFamily: "Poppins-SemiBold",
    flex: 1,
    textAlign: "right",
  },
  predictionSection: {
    marginTop: 12,
  },
  treatmentList: {
    marginTop: 8,
  },
  treatmentItem: {
    fontSize: 14,
    color: "#E0E0E0",
    fontFamily: "Poppins-Regular",
    marginBottom: 8,
    marginLeft: 10,
  },
});
