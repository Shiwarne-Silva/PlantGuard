import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./components/homeScreen";
import UploadScreen from "./components/uploadScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }} // Hide header on HomeScreen
        />
        <Stack.Screen
          name="Upload"
          component={UploadScreen}
          options={{
            title: "Plant Disease Detection",
            headerStyle: {
              backgroundColor: "#d5e4d9", // Light green to match the UploadScreen background
            },
            headerTintColor: "#000000", // Black text for contrast
            headerTitleStyle: {
              fontWeight: "bold",
              fontSize: 20,
            },
            headerBackTitleVisible: false, // Hide the back button title
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
