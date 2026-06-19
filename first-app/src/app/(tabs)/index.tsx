import {
  Text,
  View,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Button,
} from "react-native";
import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.helloWorldTitle}>
        Edit src/app/index.tsx to edit this screen.
      </Text>
      {/* <Image
      style={styles.image}
        source={{
          uri: "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80",
        }}
      /> */}
      <TextInput placeholder="Email" />
      <ActivityIndicator size={"large"} />
      <Link href={"/about"}> GO to About Screen</Link>
      <Button title="Naviagate" onPress={() => router.push("/about")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  helloWorldTitle: {
    color: "red",
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
  },
});
