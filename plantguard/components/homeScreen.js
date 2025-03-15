import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native"; // Replace useRouter with useNavigation
import {
  useFonts,
  Poppins_700Bold,
  Poppins_400Regular,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";
import { Leaf, Upload } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function HomeScreen() {
  const navigation = useNavigation(); // Use useNavigation instead of useRouter
  const { width } = useWindowDimensions();

  const [fontsLoaded] = useFonts({
    "Poppins-Bold": Poppins_700Bold,
    "Poppins-Regular": Poppins_400Regular,
    "Poppins-SemiBold": Poppins_600SemiBold,
  });

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

      <View style={styles.content}>
        {/* Logo and Title Section */}
        <View style={styles.headerSection}>
          <View style={styles.logoContainer}>
            <Leaf size={40} color="#4CAF50" style={styles.logoIcon} />
          </View>
          <Text style={styles.title}>PlantGuard</Text>
          <Text style={styles.subtitle}>
            AI-Powered Plant Disease Detection
          </Text>
        </View>

        {/* Description Section */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>
            Protect your potato crops with instant disease detection. Upload a
            photo to get accurate diagnoses and treatment recommendations.
          </Text>
        </View>

        {/* Action Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Upload")} // Replace router.push with navigation.navigate
        >
          <Upload size={24} color="#ffffff" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Scan Your Plant</Text>
        </TouchableOpacity>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>99%</Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>24/7</Text>
            <Text style={styles.statLabel}>Support</Text>
          </View>
        </View>
      </View>
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
  content: {
    flex: 1,
    justifyContent: "space-between",
    padding: 24,
    paddingTop: 150,
    paddingBottom: 40,
  },
  headerSection: {
    alignItems: "center",
  },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  logoIcon: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  title: {
    fontSize: 42,
    color: "#ffffff",
    fontFamily: "Poppins-Bold",
    textAlign: "center",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#E0E0E0",
    fontFamily: "Poppins-Regular",
    textAlign: "center",
  },
  descriptionContainer: {
    paddingHorizontal: 20,
  },
  description: {
    fontSize: 18,
    color: "#ffffff",
    textAlign: "center",
    fontFamily: "Poppins-Regular",
    lineHeight: 28,
  },
  button: {
    backgroundColor: "#4CAF50",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    marginVertical: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  buttonIcon: {
    marginRight: 12,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    color: "#ffffff",
    fontFamily: "Poppins-Bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#E0E0E0",
    fontFamily: "Poppins-Regular",
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
});
