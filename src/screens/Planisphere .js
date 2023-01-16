import React, { useEffect } from "react";
import { StyleSheet, Text, View, Image, Button } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";

const Planisphere = ({ navigation }) => {
  navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.text}>MapTab</Text>
      <Button
        title="go to map"
        onPress={() => {
          navigation.navigate("Map");
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

export default Planisphere;
