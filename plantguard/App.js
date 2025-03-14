import React from "react";
import { StyleSheet, View } from "react-native";
import UploadScreen from "./components/uploadScreen";

export default function App() {
  return (
    <View style={styles.container}>
      <UploadScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
});
