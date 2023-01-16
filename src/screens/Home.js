import React, { useEffect } from "react";
<<<<<<< Updated upstream
import { StyleSheet, Text, View, Image } from "react-native";
=======
import { StyleSheet, Text, View, Image, Button } from "react-native";
>>>>>>> Stashed changes
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";

<<<<<<< Updated upstream
const Home = ({ route }) => {
  // const { auth } = route.params;
  const navigation = useNavigation();
=======
const Home = ({ route, navigation }) => {
  navigation = useNavigation();
  const { user } = route.params;
  useEffect(() => {
    return () => {
      console.log("User logged in", user);
    };
  }, []);
>>>>>>> Stashed changes

  return (
    <View>
      <StatusBar style="auto" />
<<<<<<< Updated upstream
      {/* <Text style={styles.text}>Welcome {auth.user.name}</Text> */}
      <Text style={styles.text}>Welcome </Text>
      {/* <Image source={{ uri: auth.user.picture }} style={styles.picture}></Image> */}
      <Button title="SignOut" onPress={() => navigation.navigate("Login")} />
=======
      <Text style={styles.text}>successfully connected</Text>
      <Text style={styles.text}>Welcome to Home, {user.name}</Text>
      <Image source={{ uri: user.picture }} style={styles.picture}></Image>
      <Button
        title="go to map"
        onPress={() => {
          navigation.navigate("Planisphere");
        }}
      />
>>>>>>> Stashed changes
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 35,
    fontWeight: "bold",
    marginBottom: 20,
    color: "gray",
  },
  subText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  picture: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
});

export default Home;
