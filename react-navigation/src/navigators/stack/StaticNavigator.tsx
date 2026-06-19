import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../../screens/HomeScreen";
import AboutScreen from "../../screens/AboutScreen";
import ProfileScreen from "../../screens/ProfileScreen";
import { createStaticNavigation } from "@react-navigation/native";

const RootStack = createNativeStackNavigator({
  // initialRouteName:""
  screens: {
    Home: {
      screen: HomeScreen,
      options: {},
    },
    About: AboutScreen,
    Profile: ProfileScreen,
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function StaticNavigtor() {
  return <Navigation />;
}
