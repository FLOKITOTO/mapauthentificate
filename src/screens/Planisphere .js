import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View, Button, Linking } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Alert } from "react-native";
import { enableLatestRenderer } from "react-native-maps";

const Planisphere = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [mapRef, setMapRef] = useState(null);
  const [locationAccepted, setLocationAccepted] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [permissions, setPermissions] = useState(null);
  enableLatestRenderer();

  useEffect(() => {
    const fetchPermission = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        setPermissions(status);
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
        }
      } catch (err) {
        setErrorMsg(err.message);
      }
    };
    fetchPermission();
  }, []);

  useEffect(() => {
    const fetchLocation = async () => {
      if (permissions === "granted") {
        const watcher = await Location.watchPositionAsync(
          { accuracy: Location.Accuracy.BestForNavigation },
          (location) => {
            setLocation(location);
            setLocationAccepted(true);
          }
        );
        setSubscription(watcher);
      }
    };
    fetchLocation();
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [permissions]);

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

  //suggéré par un gars stackoverflow
  const text = useMemo(() => {
    if (errorMsg) {
      return errorMsg;
    } else if (location) {
      return JSON.stringify(location);
    }
    return "Waiting..";
  }, [errorMsg, location]);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {location && (
        <MapView
          provider={PROVIDER_GOOGLE}
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
          region={{
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
      {location && (
        <View style={styles.infoModal}>
          <View style={styles.buttonContainer}>
            <Button
              style={styles.button}
              title="Find my location"
              onPress={handleFindMyLocation}
            />
            <Button
              style={styles.button}
              title="Unzoom"
              onPress={handleUnzoom}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    position: "absolute",
    width: "100%",
    height: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    position: "absolute",
    flex: 1,
    width: "100%",
    height: "100%",
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
  buttonContainer: {
    position: "absolute",
    width: "100%",
    backgroundColor: "red",
    height: "50%",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  button: {
    borderRadius: 10,
  },
  infoModal: {},
});

export default Planisphere;
