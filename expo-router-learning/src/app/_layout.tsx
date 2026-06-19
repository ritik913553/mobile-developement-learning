// stack implementation

import { Stack } from "expo-router";

export default function RootLayout() {
  const isAuth = true;
  return (
    <Stack>
      <Stack.Protected guard={!isAuth}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={isAuth}>
        <Stack.Screen name="index" />
        <Stack.Screen name="about" />
      </Stack.Protected>
    </Stack>
  );
}
