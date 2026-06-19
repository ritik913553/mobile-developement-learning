import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      // screenOptions={{
      //   headerStyle: { backgroundColor: "cornflowerblue" },
      //   headerTintColor: "white",
      //   animation:"slide_from_right"
      // }}
      screenOptions={{
        headerShown:false
      }}
    >
      {" "}
      <Stack.Screen name="(tabs)"  />

      {/* <Stack.Screen name="index" options={{ title: "Home" }} /> */}
      {/* <Stack.Screen name="about" options={{ title: "About" }} /> */}
    </Stack>
  );
}
