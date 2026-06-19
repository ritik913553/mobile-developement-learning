import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const Docs2DynamicPage = () => {
  const { slug } = useLocalSearchParams();
  console.log(slug)    //["1234", "kumar", "jha"]
  return (
    <View>
      <Text>Docs2DynamicPage {slug}</Text>
    </View>
  );
};

export default Docs2DynamicPage;

const styles = StyleSheet.create({});
