import React, { useContext, useEffect } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../commons/UserContext";

const Home = ({ navigation }) => {
  navigation = useNavigation();

  // const handleLogout = () => {
  //   setUser(null);
  // };
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Button
        color="#008080"
        title="go to map"
        onPress={() => {
          navigation.navigate("Planisphere");
        }}
      />
      <Button
        color="#8B0000"
        title="LogOut"
        onPress={() => {
          navigation.navigate("Login", {
            screen: "Login",
          });
          // handleLogout;
        }}
      />
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
