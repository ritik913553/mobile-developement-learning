import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text>Edit src/app/index.tsx to edit this screen.</Text>
      <Link href={"/about"}> About</Link>
      <Link href={"/profile/123"}>Go to user page </Link>

      <Link href={"/docs2/1234/kumar/jha"}>GO to the nested Docs 2 page</Link>

      <Link href={"/login"}>Login</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
