How to create expo project ?
--->

npm run reset-project. ---> for make the setup simple
npx expo start

rnfes (shortcuts for vs code snippets ) for react-native component template

for reload the app press 'R' key on terminal and then press enter.

React-native specific things:
components
View ---> like div //for android react-native convert this internally into android.View.ViewGroup. // ios me UIView

        Text ---> like p tag
            props
                numberOfLines --> agr sentense bada hai to utna line dikhayega jitna prop me diya hai and then ... kr dega


        Image --->  self closing component
            for image that is comming from internt means link dal rhe direct so for that 'height' 'weight'  props must dena pdega
            props
                blurRadius

        TextInput
            props
                placeholder
                editable ---> by default true
                multiline --->
                onChangeText
                onChange

        Pressable
            To make any element pressable (tapable )
            onPress
            onLongPress
            onPressIn. ---> on press se phele chlega
            onPressOut
            hitSlop ---> for the touch area of pressable     yee ek object ho skta hai jisme left right top bottom value hoti hai

import { useState } from "react";
import { Text, View, Image, TextInput, Pressable } from "react-native";

export default function Index() {
const [name, setName] = useState("");
return (
<View
style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }} >
<Text>
Lorem ipsum dolor sit amet consectetur adipisicing elit. Corrupti magnam
amet repellendus ex est alias consectetur explicabo neque quis autem
sint fugit deleniti maiores nisi, id voluptates temporibus magni
cupiditate?
</Text>

      {/* Remote image form internet */}
      <Image
        // src="https://images.pexels.com/photos/35716852/pexels-photo-35716852.jpeg"
        source={{
          uri: "https://images.pexels.com/photos/35716852/pexels-photo-35716852.jpeg",
        }}
        height={200}
        width={200}
      />
      {/* local image */}
      <Image
        source={require("@/assets/images/icon.png")}
        style={{
          height: 200,
          width: 200,
        }}
      />
      <TextInput
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
        placeholderTextColor={"red"}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 10,
          borderRadius: 5,
          width: 200,
        }}
      />

      <Pressable
        onPress={() => alert("text pressed")}
        style={({ pressed }) => ({
          backgroundColor: pressed ? "red" : "green",
          padding: 10,
          borderRadius: 5,
          marginTop: 10,
        })}
      >
        {({ pressed }) => <Text>{pressed ? "Pressing" : "Press me"}</Text>}
      </Pressable>
    </View>

);
}

=====================================================================

ScrollView ----> for scrolling view of screen
FlatList-----> (very important) performace optimised hota hai  
Button
Switch ----> toggle type (only take value as boolean)

import { ScrollView, StyleSheet, Switch, Text, View } from "react-native";
import React, { useState } from "react";

const index = () => {
const items = Array.from({ length: 5 }, (\_, i) => `Item ${i + 1}`);
const [isDarkMode, setIsDarkMode] = useState(false);
return (
<ScrollView
contentContainerStyle={{
        padding: 16,
        alignItems: "center",
      }} >
{items.map((i) => (
<View
style={{
backgroundColor: "white",
padding: 16,
marginBottom: 10,
borderRadius: 10,

            // android specific
            elevation: 2,

            // ios specific
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 4,
          }}
          key={i}
        >
          <Text>{i}</Text>
        </View>
      ))}
      <Switch
        value={isDarkMode}
        onValueChange={setIsDarkMode}
        trackColor={{ false: "red", true: "green" }}
        thumbColor={"yellow"}
      />
    </ScrollView>

);
};

export default index;

const styles = StyleSheet.create({});

=====================================================================

SessionList
FlatList

import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";

const USERS = [
{
id: 1,
name: "Alex Rivera",
role: "Admin",
},
{
id: 2,
name: "Sam Chen",
role: "Developer",
},
{
id: 3,
name: "Taylor Jordan",
role: "Designer",
},
{
id: 4,
name: "Morgan Blake",
role: "Manager",
},
{
id: 5,
name: "Jordan Smith",
role: "User",
},
];

const index = () => {
return (
<FlatList
style={{ backgroundColor: "black" }}
data={USERS}
// horizontal
keyExtractor={(item) => item.id.toString()} //key extractor ko string hi chaiyea hota hai. and key me index nhi dena chiayea
renderItem={({ item }) => (
<View>
<Text>{item.name}</Text>
<Text>{item.role}</Text>
</View>
)}
contentContainerStyle={{ padding: 20, backgroundColor: "green" }}
ItemSeparatorComponent={() => (
<View style={{ height: 1, backgroundColor: "black" }} />
)}
/>
);
};

export default index;

const styles = StyleSheet.create({ });

=====================================================================

KeyboardAvoidingView
input box keyboard ke piche chip na jaye isliye use kiya jata hai ye

SafeAreaView. ---> age ye reactnative se import krte hai to code fatata hai android ke liye ,is problem ko solve krta hai expo ,expo building deta hai jo dono me kam krta hai proper ache se

can we render flatlist inside ScrollView ???

import React from "react";
import {
StyleSheet,
TextInput,
View,
Pressable,
Text,
KeyboardAvoidingView,
Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Index = () => {
return (
<SafeAreaView style={{ flex: 1 }}>
{" "}
<KeyboardAvoidingView
style={styles.container}
behavior={Platform.OS === "ios" ? "padding" : "height"} // height ,position ,padding >
<View style={styles.formContainer}>
<TextInput
            placeholder="Email"
            keyboardType="email-address"
            style={styles.input}
          />

          <TextInput
            placeholder="Password"
            secureTextEntry
            style={styles.input}
          />

          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>

);
};

export default Index;

const styles = StyleSheet.create({
container: {
flex: 1,
justifyContent: "flex-end",
padding: 20,
},

formContainer: {
gap: 12,
paddingBottom: 30,
},

input: {
borderWidth: 1,
borderColor: "#ccc",
borderRadius: 10,
paddingHorizontal: 15,
paddingVertical: 12,
},

button: {
backgroundColor: "#000",
paddingVertical: 14,
borderRadius: 10,
alignItems: "center",
},

buttonText: {
color: "#fff",
fontWeight: "600",
},
});

==============================================================

Touchable Opacity
ImageBackground

==========================================================

SafeAreaView
useSafeAreaInsets
initialWindowMetrics
StyleSheets
create
compose
flatten
useWindowDimensions
useColorScheme

1. SafeAreaView
   ----> after removing top status bar area and bottom navigation then the rest space is safe area  
   props
   edges --> control kr skte hai manually like top,bottom ,left,right (by default sare included hote hai)

2.useSafeAreaInsets
hooks hai jo ki safe area ka detialed deta hai (insets) mtlb top,bottom,left,right ka value for safe area mtlb isse more control hum apne hath me le skte hai  
 const insets = useSafeAreaInsets();

3.initialWindowMetrics
ye bhi top,bottom,left,right hi deta hai ssafe area ,but ye synchronously deta hai (fast rhta hai)
ye use tb krte hai hum jb SafeAreaProvider se wrap krte hai pura pplication ko

4.<StatusBar barStyle={"dark-content"}/>. ---> for controlling the status bar

5.StyleSheet
methods of StyleSheet
compose
create
flatten

      const styles = StyleSheet.create({
        card:{

        },
        text:{

        }
      })



      can also give array  in style
        ex:-  <View style={[styles.button,isActive && styles.activeButton ]} ></View>

      but this is not readable  so that we use compose method of StyleSheet

      const buttonStyle = StyleSheet.compose(
        styles.button,
        isActive ? styles.activeButton : null
      )
      <View style={buttonStyle } ></View>


      const flat = StyleSheet.flatten([styleA.text , styleB.text]) //styleB overrides  styleA

6.useWindowDimensions
const {fontScale,height,width,scale} = useWindowDimensions();

npx expo install expo-screen-orientation

7.useColorScheme
