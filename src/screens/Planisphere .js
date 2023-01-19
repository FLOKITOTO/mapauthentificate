import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, Button } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";

const Planisphere = ({ navigation }) => {
  const [location, setLocation] = useState(null);

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setError("Permission to access location was denied");
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.text}>MapTab</Text>
      <Button title="Get Location" onPress={getLocation} />
      {location && (
        <MapView
          style={styles.mapStyle}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Your Location"
          />
        </MapView>
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
