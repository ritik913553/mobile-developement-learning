import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Button } from "@react-navigation/elements";
import { Link, useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  return (
    <View>
      <Text>HomeScreen</Text>
      {/* <Button screen={"About"}>Go To About</Button> */}
      {/* <Link screen={"About"}>Go To About</Link> */}

      <Button onPress={() => navigation.navigate("About",{username:"Ritik"})}>Go To About</Button>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
