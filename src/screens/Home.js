import React, { useEffect } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { StatusBar } from "expo-status-bar";

const Home = ({ route }) => {
  // const { auth } = route.params;
  const navigation = useNavigation();

  return (
    <View>
      <StatusBar style="auto" />
      {/* <Text style={styles.text}>Welcome {auth.user.name}</Text> */}
      <Text style={styles.text}>Welcome </Text>
      {/* <Image source={{ uri: auth.user.picture }} style={styles.picture}></Image> */}
      <Button title="SignOut" onPress={() => navigation.navigate("Login")} />
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
