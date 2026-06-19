import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../../screens/HomeScreen";
import AboutScreen from "../../screens/AboutScreen";
import ProfileScreen from "../../screens/ProfileScreen";

const Stack = createNativeStackNavigator<any>();


//jyda priority individual wale screen ko milega na ki global wale ko
function MyStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        title: "Dashboard",
        //   headerShown:false,
        headerStyle: {
          backgroundColor: "black",
        },
        headerTintColor: "white",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Dashboard",
          //   headerShown:false,
          headerStyle: {
            backgroundColor: "black",
          },
          headerTintColor: "white",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen name="About" component={AboutScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

export default function DynamicStackNavigator() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}
