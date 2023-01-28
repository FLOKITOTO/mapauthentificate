import React, { useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Linking,
  Dimensions,
} from "react-native";
const { width, height } = Dimensions.get("window");
import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { Alert } from "react-native";
import { enableLatestRenderer } from "react-native-maps";
import { getFriends } from "../commons/firebaseConfig";
import Modal from "react-native-modal";
import { GOOGLE_MAPS_API_KEY } from "../commons/contants";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const Planisphere = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [mapRef, setMapRef] = useState(null);
  const [locationAccepted, setLocationAccepted] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [permissions, setPermissions] = useState(null);
  const [friends, setFriends] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [destination, setDestination] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [distance, setDistance] = useState(null);
  const [destinationMarker, setDestinationMarker] = useState(null);
  const [originSelected, setOriginSelected] = useState(false);
  const [clueOpacity, setClueOpacity] = useState(1);
  const [destinationAddress, setDestinationAddress] = useState("");

  function handleDoubleClick() {
    if (!originSelected) {
      setClueOpacity(0.5);
      setTimeout(() => {
        setClueOpacity(1);
      }, 500);
    } else {
    }
  }

  enableLatestRenderer();

  function toggleModal(data, details) {
    setModalVisible(!isModalVisible);
  }

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

  const handleReset = () => {
    setOrigin(null);
    setDestination(null);
    setDistance(null);
    setDestinationMarker(null);
    setDestinationAddress("");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      {location && (
        <MapView
          onDoublePress={() => {
            handleDoubleClick();
            toggleModal();
          }}
          onPress={handleReset}
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
            onPress={() =>
              setOrigin({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              })
            }
            title={"Your location"}
          />
          {destinationMarker && (
            <Marker
              coordinate={destinationMarker}
              pinColor={"green"}
              title={"Destination"}
            />
          )}
          {friends.map((friend) => (
            <Marker
              key={friend.id}
              coordinate={{
                latitude: friend.coords.latitude,
                longitude: friend.coords.longitude,
              }}
              title={friend.title}
              description={friend.description}
              onPress={() =>
                setOrigin({
                  latitude: friend.coords.latitude,
                  longitude: friend.coords.longitude,
                })
              }
            />
          ))}
          {origin && destination && (
            <MapViewDirections
              origin={origin}
              destination={destination}
              apikey={GOOGLE_MAPS_API_KEY}
              strokeWidth={3}
              strokeColor="hotpink"
              onReady={(result) => {
                mapRef.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    right: width / 20,
                    bottom: height / 20,
                    left: width / 20,
                    top: height / 20,
                  },
                });
                setDistance(result.distance);
                setDestinationMarker(destination);
              }}
            />
          )}
        </MapView>
      )}
      <View>
        <Text style={styles.paragraph}>{text}</Text>
      </View>

      {origin ? (
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

            <GooglePlacesAutocomplete
              placeholder="Search"
              minLength={2}
              autoFocus={false}
              returnKeyType={"search"}
              listViewDisplayed="auto"
              fetchDetails={true}
              onPress={(data, details = null) => {
                if (!origin) {
                  setOrigin({
                    latitude: details.geometry.location.lat,
                    longitude: details.geometry.location.lng,
                  });
                } else {
                  setDestination({
                    name: data.structured_formatting.main_text,
                    latitude: details.geometry.location.lat,
                    longitude: details.geometry.location.lng,
                  });
                  setDestinationAddress(data.description);
                  setModalVisible(false);
                }
              }}
              query={{
                key: GOOGLE_MAPS_API_KEY,
                language: "en",
              }}
              styles={{
                textInputContainer: {
                  width: "100%",
                },
                description: {
                  fontWeight: "bold",
                },
                predefinedPlacesDescription: {
                  color: "#1faadb",
                },
              }}
              currentLocation={false}
              currentLocationLabel="Current location"
              nearbyPlacesAPI="GooglePlacesSearch"
              GoogleReverseGeocodingQuery={{}}
              GooglePlacesSearchQuery={{
                rankby: "distance",
                types: "food",
              }}
              filterReverseGeocodingByTypes={[
                "locality",
                "administrative_area_level_3",
              ]}
              debounce={200}
            />
          </View>
        </Modal>
      ) : null}

      {!origin ? (
        <View style={[styles.clueContainer, { opacity: clueOpacity }]}>
          <Text style={styles.clue}>Selectionne un point de départ</Text>
        </View>
      ) : !destination ? (
        <View style={[styles.clueContainer, { opacity: clueOpacity }]}>
          <Text style={styles.clue}>
            Double tape on map pour définir un itinéraire
          </Text>
        </View>
      ) : (
        <View style={[styles.clueContainer, { opacity: clueOpacity }]}>
          <Text style={styles.clue}>
            Pour réinitialiser le trajet clique une fois sur la map
          </Text>
        </View>
      )}

      <View style={styles.bord}>
        {locationAccepted && (
          <View style={styles.buttonContainer}>
            <Button
              color={"#008080"}
              style={styles.button}
              title="Find my location"
              onPress={handleFindMyLocation}
            />
            <Button color={"#004040"} title="Unzoom" onPress={handleUnzoom} />
            <Text>Distance: {distance} km</Text>
            <Text>Adresse d'arrivée : {destinationAddress}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  clueContainer: {
    position: "absolute",
    display: "flex",
    alignItems: "center",
    marginTop: "105%",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 10,
    width: "auto",
    backgroundColor: "white",
  },
  clue: {
    fontSize: 16,
    fontWeight: "bold",
  },
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

  btnContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: 500,
  },

  bord: {
    backgroundColor: "#ffff",
    height: 200,
    width: "100%",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    position: "absolute",
    flex: 0,
    margin: 0,
    bottom: 0,
  },
  map: {
    position: "absolute",
    width: "100%",
    height: "70%",
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
