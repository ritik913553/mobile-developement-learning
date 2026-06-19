import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Apple,
  BadgeDollarSign,
  Beer,
  Eye,
  EyeOff,
  Lock,
  Mail,
  MoveRight,
} from "lucide-react-native";
const Login = () => {
  const socialMedia = [<Apple />, <Beer />, <BadgeDollarSign />];
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const [password, setPassword] = useState("");
  return (
    <SafeAreaView
      style={{
        paddingVertical: 80,
      }}
    >
      <View
        style={{
          alignItems: "center",
        }}
      >
        <Image
          source={{
            uri: "data:image/jpeg;base64,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",
          }}
          height={100}
          width={100}
        />
      </View>
      <Text
        style={{ textAlign: "center", fontSize: 38, fontFamily: "monospace" }}
      >
        Sign In
      </Text>
      <Text style={{ textAlign: "center", marginTop: 10, fontSize: 17 }}>
        Let's experience the joy of telecare AI
      </Text>

      <View
        style={{
          gap: 20,
          marginTop: 60,
          paddingHorizontal: 20,
        }}
      >
        <View>
          <Text
            style={{
              fontWeight: 700,
              marginBottom: 5,
            }}
          >
            Email Address
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#c7cccc",
              borderRadius: 10,
              paddingHorizontal: 14,
              borderWidth: 1,
              borderColor: emailFocused ? "black" : "transparent",
            }}
          >
            <Mail size={18} />

            <TextInput
              placeholder="ritik123@gmail.com"
              style={{
                flex: 1,
                paddingVertical: 14,
                marginLeft: 10,
                fontSize: 15,
              }}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
            />
          </View>
        </View>
        <View>
          <Text
            style={{
              fontWeight: 700,
              marginBottom: 5,
            }}
          >
            Password
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#c7cccc",
              borderRadius: 10,
              paddingHorizontal: 14,
              borderWidth: 1,
              borderColor: passwordFocused ? "black" : "transparent",
            }}
          >
            <Lock size={18} />

            <TextInput
              placeholder="Enter Your Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={isPasswordHidden}
              style={{
                flex: 1,
                paddingVertical: 14,
                marginLeft: 10,
                fontSize: 15,
              }}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
            />
            <Pressable onPress={() => setIsPasswordHidden(!isPasswordHidden)}>
              {isPasswordHidden ? <EyeOff size={18} /> : <Eye size={18} />}
            </Pressable>
          </View>
        </View>

        <Pressable
          style={{
            padding: 10,
            backgroundColor: "#111111",
            borderRadius: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              gap: 6,
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 15,
                color: "white",
              }}
            >
              Sign In
            </Text>
            <MoveRight color={"white"} />
          </View>
        </Pressable>
      </View>

      <View
        style={{
          flexDirection: "row",
          gap: 20,
          justifyContent: "center",
          marginTop: 50,
        }}
      >
        {socialMedia.map((item, index) => (
          <View
            key={index}
            style={{
              padding: 14,
              borderRadius: 18,
              borderColor: "#858282",
              borderWidth: 2,
            }}
          >
            {item}
          </View>
        ))}
      </View>

      <Text
        style={{
          textAlign: "center",
          marginTop: 50,
        }}
      >
        Don't have account? <Text style={{ color: "blue" }}>Sign Up</Text>
      </Text>
      <Text
        style={{
          textAlign: "center",
          marginTop: 5,
          textDecorationLine: "underline",
          color: "blue",
        }}
      >
        Forgot your password ?
      </Text>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({});
