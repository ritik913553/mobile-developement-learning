import { Button, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  return (
    <View>
      <Text>ProfileScreen</Text>
      <Button
        title="Go To Home Page"
        onPress={() => navigation.popTo("Home")}

        //popToTop ---> first scrren pe le jayega directly chae stack me 100 screen kyu na add ho jaye 
        //replace. ----> to empty the stack 

        // onPress={() => navigation.navigate("Home")}
        //agr yaha popTo ke jgha navigate use kr lete to wapis se ek Home scrren stack me add ho  jata and means loop me ho jata home me bhi back button dikhega phir waisa
      />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({});
