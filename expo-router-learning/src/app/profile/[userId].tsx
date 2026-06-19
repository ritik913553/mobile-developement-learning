import { useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const UserScreen = () => {
  const { userId } = useLocalSearchParams(); //destruct krne time name exact same hona chaiyea as a file name
  return (
    <View>
      <Text>UserScreen {userId}</Text>
    </View>
  );
};

export default UserScreen;

const styles = StyleSheet.create({});
