import { View, StyleSheet } from "react-native";
import { TiltGame } from "@/components/titl-game";

export default function Index() {
  return (
    <View style={styles.container}>
      <TiltGame />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
});
