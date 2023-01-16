import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, Button } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";

const [location, setLocation] = useState(null);
const [permissionGranted, setPermissionGranted] = useState(false);

const Planisphere = ({ navigation }) => {
  navigation = useNavigation();
  const [location, setLocation] = useState(null);
  const [isMapVisible, setIsMapVisible] = useState(false);

  const getLocation = async () => {
    const { status } = await Location.requestPermissionsAsync();

    if (status === "granted") {
      const location = await Location.getCurrentPositionAsync({});
      setPermissionGranted(true);
      setLocation(location);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.text}>MapTab</Text>
      {!permissionGranted && (
        <Button title="Get Location" onPress={getLocation} />
      )}
      {permissionGranted && location && (
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      )}
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
