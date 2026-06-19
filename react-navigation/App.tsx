import * as React from "react";
import DynamicStackNavigator from "./src/navigators/stack/DynamicStackNavigator";
import StaticNavigtor from "./src/navigators/stack/StaticNavigator";

// For stack navigation

// export default function App() {
//   return <DynamicStackNavigator />;
// }

// export default function App() {
//   return <StaticNavigtor />;
// }


// for tab navigation

import { Text, View } from "react-native";
import {
  createStaticNavigation,
  useNavigation,
} from "@react-navigation/native";
import { Button } from "@react-navigation/elements";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DynamicTabNavigator from "./src/navigators/tabs/DynamicTabNavigator";

function HomeScreen() {
  const navigation = useNavigation<any>();

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home Screen</Text>
      <Button onPress={() => navigation.navigate("Profile")}>
        Go to Profile
      </Button>
    </View>
  );
}

function ProfileScreen() {
  const navigation = useNavigation<any>();

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Profile Screen</Text>
      <Button onPress={() => navigation.navigate("Home")}>Go to Home</Button>
    </View>
  );
}

const MyTabs = createBottomTabNavigator({
  screens: {
    Home: HomeScreen,
    Profile: ProfileScreen,
  },
});

const Navigation = createStaticNavigation(MyTabs);

export default function App() {
  return <DynamicTabNavigator />;
}
