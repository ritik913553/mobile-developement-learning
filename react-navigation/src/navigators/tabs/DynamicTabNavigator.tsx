// import * as React from 'react';
// import { Text, View } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { Ionicons } from '@expo/vector-icons';

// function HomeScreen() {
//     return (
//         <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//             <Text>Home</Text>
//         </View>
//     );
// }

// function SearchScreen() {
//     return (
//         <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//             <Text>Search</Text>
//         </View>
//     );
// }

// function ProfileScreen() {
//     return (
//         <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//             <Text>Profile</Text>
//         </View>
//     );
// }

// const Tab = createBottomTabNavigator();

// function MyTabs() {
//     return (
//         <Tab.Navigator initialRouteName='Search' screenOptions={
//             ({ route }) => ({
//                 tabBarStyle:{
//                     height:90,
//                     paddingBottom:8,
//                 },

//                 tabBarInactiveTintColor:"gray",
//                 tabBarIcon: ({ focused, color, size }) => {
//                     const icon = route.name === "Home"
//                         ? focused ? "home" : 'home-outline'
//                         : route.name === "Search"
//                             ? focused ? "search" : "search-outline"
//                             : focused ? "chatbubble" : "chatbubble-outline"

//                      return <Ionicons name={icon} size={size} color={color}/>
//                 }
//             })
//         }>
//             <Tab.Screen name='Home' component={HomeScreen} />
//             <Tab.Screen name='Search' component={SearchScreen} />
//             <Tab.Screen name="Profile" component={ProfileScreen} options={{
//                 tabBarBadge:13
//             }} />
//         </Tab.Navigator>
//     )
// }

// export default function DynamicTabNavigator() {
//     return (
//         <NavigationContainer>
//             <MyTabs />
//         </NavigationContainer>
//     )
// }

// above code is for just tab navigation
// =========================================

import * as React from "react";
import { Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator(); 

function MyTabs() {
  return <Tab.Navigator>
    
  </Tab.Navigator>;
}

export default function DynamicTabNavigator() {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}
