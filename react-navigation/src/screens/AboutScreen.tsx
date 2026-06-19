import { Button, StyleSheet, Text, View } from "react-native";
import React, { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";

const AboutScreen = ({ route }: any) => {
  const { username } = route.params;
  const navigation = useNavigation<any>();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Ritik",
    });
  }, [navigation]);

  return (
    <View>
      <Text>AboutScreen</Text>
      <Button
        title="Go TO Profile Page"
        onPress={() => navigation.navigate("Profile")}
      />
      <Text>{username}</Text>
    </View>
  );
};

export default AboutScreen;

const styles = StyleSheet.create({});
