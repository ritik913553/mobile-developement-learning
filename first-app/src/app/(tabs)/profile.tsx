import { Text, View, StyleSheet, TextInput, ActivityIndicator } from "react-native";
import { Image } from "expo-image";

export default function Profile () {
  return (
    <View style={styles.container}> 
    <Text>Profile Screen</Text>
      <Image
      style={styles.image}
        source={{
          uri: "https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740&q=80",
        }}
      />  
    </View>
  ); 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
 image:{
  width:200,
  height:200,
  marginTop:10
 }
});
