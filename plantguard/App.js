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
            headerShown: false, // Hide header on UploadScreen
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
