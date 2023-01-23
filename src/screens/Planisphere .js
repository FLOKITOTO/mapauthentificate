import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View, Button, Linking } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { Alert } from "react-native";
import { enableLatestRenderer } from "react-native-maps";
import { getFriends } from "../commons/firebaseConfig";
import Modal from "react-native-modal";

const Planisphere = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [mapRef, setMapRef] = useState(null);
  const [locationAccepted, setLocationAccepted] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [permissions, setPermissions] = useState(null);
  const [friends, setFriends] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
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

  useEffect(() => {
    async function fetchFriends() {
      const friends = await getFriends();
      setFriends(friends);
      console.log(friends);
    }
    fetchFriends();
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

  const text = useMemo(() => {
    if (errorMsg) {
      return errorMsg;
    } else if (location) {
      return;
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
          minZoomLevel={5}
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
          {friends.map((friend) => (
            <Marker
              key={friend.id}
              coordinate={{
                latitude: friend.latitude,
                longitude: friend.longitude,
              }}
              title={friend.title}
              description={friend.description}
            />
          ))}
        </MapView>
      )}
      <View>
        <Text style={styles.paragraph}>{text}</Text>
      </View>

      <Modal
        onBackdropPress={() => setModalVisible(false)}
        onBackButtonPress={() => setModalVisible(false)}
        isVisible={isModalVisible}
        swipeDirection="down"
        onSwipeComplete={toggleModal}
        animationIn="bounceInUp"
        animationOut="bounceOutDown"
        animationInTiming={900}
        animationOutTiming={500}
        backdropTransitionInTiming={1000}
        backdropTransitionOutTiming={500}
        style={styles.modal}
      >
        <View style={styles.modalContent}>
          <View style={styles.center}>
            <View style={styles.barIcon} />
          </View>
        </View>
      </Modal>
      <View style={styles.bord}>
        {locationAccepted && (
          <View style={styles.buttonContainer} onPress={() => setOpacity(1)}>
            <Button
              color={"#008080"}
              style={styles.button}
              title="Find my location"
              onPress={handleFindMyLocation}
            />
            <Button color={"#004040"} title="Unzoom" onPress={handleUnzoom} />
            <View>
              <Button title="Show Bottom Sheet" onPress={toggleModal} />
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "#ffffff",
    paddingTop: 12,
    paddingHorizontal: 12,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    minHeight: 400,
    paddingBottom: 20,
  },
  center: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  barIcon: {
    width: 60,
    height: 5,
    backgroundColor: "#bbb",
    borderRadius: 3,
  },
  // text: {
  //   color: "#bbb",
  //   fontSize: 24,
  //   marginTop: 100,
  // },
  btnContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 500,
  },

  bord: {
    backgroundColor: "red",
    height: 300,
    width: "100%",
    position: "absolute",
    flex: 0,
    margin: 0,
    bottom: 0,
  },
  map: {
    position: "absolute",
    width: "100%",
    height: "60%",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    position: "absolute",
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
    width: "100%",
    height: "auto",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingLeft: 20,
    paddingTop: 40,
  },
  button: {
    borderRadius: 50,
    width: 200,
    height: 100,
  },
});

export default Planisphere;
