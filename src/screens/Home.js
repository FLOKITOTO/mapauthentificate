import React, { useEffect } from "react";
import { StyleSheet, Text, View, Image, Button } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";

const Home = ({ route, navigation }) => {
  navigation = useNavigation();
  const { user } = route.params;
  useEffect(() => {
    return () => {
      console.log("User logged in", user);
    };
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <Text style={styles.text}>successfully connected</Text>
      <Text style={styles.text}>Welcome to Home, {user.name}</Text>
      <Image source={{ uri: user.picture }} style={styles.picture}></Image>
      <Button
        title="go to map"
        onPress={() => {
          navigation.navigate("Planisphere");
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
