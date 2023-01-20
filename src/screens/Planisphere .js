import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  Platform,
  Linking,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";
import MapView, { Marker } from "react-native-maps";
import { Alert } from "react-native";

const Planisphere = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [mapRef, setMapRef] = useState(null);
  const [locationAccepted, setLocationAccepted] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        Alert.alert(
          "Location Permission Denied",
          "Please go to settings and enable location permission for this app to continue.",
          [
            {
              text: "Go to Settings",
              onPress: () => Linking.openSettings(),
            },
          ]
        );
        return;
      }

      let subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.BestForNavigation },
        (location) => {
          setLocation(location);
          setLocationAccepted(true);
        }
      );

      return () => subscription.remove();
    })();
  }, []);

  const handleFindMyLocation = () => {
    if (location && mapRef) {
      mapRef.fitToCoordinates([
        {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
      ]);
    }
  };

  const handleUnzoom = () => {
    if (location && mapRef) {
      mapRef.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  };

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {location && (
        <MapView
          ref={(ref) => setMapRef(ref)}
          style={styles.map}
          minZoomLevel={8}
          maxZoomLevel={18}
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
            title={"Your location"}
          />
        </MapView>
      )}
      <Text style={styles.paragraph}>{text}</Text>
      {locationAccepted && (
        <View>
          <Button title="Find my location" onPress={handleFindMyLocation} />
          <Button title="Unzoom" onPress={handleUnzoom} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "70%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
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
