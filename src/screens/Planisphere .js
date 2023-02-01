import React, { useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Linking,
  Dimensions,
  Alert,
  Switch,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
const { width, height } = Dimensions.get("window");
import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { enableLatestRenderer } from "react-native-maps";
import { db, getFriends, getNoFriends } from "../commons/firebaseConfig";
import Modal from "react-native-modal";
import { GOOGLE_MAPS_API_KEY, USERS_COLLECTION } from "../commons/contants";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { nanoid } from "nanoid";
import { SvgUri } from "react-native-svg";

const Planisphere = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [mapRef, setMapRef] = useState(null);
  const [locationAccepted, setLocationAccepted] = useState(false);
  const [subscription, setSubscription] = useState(null);
  const [permissions, setPermissions] = useState(null);
  const [friends, setFriends] = useState([]);
  const [noFriends, setNoFriends] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [destination, setDestination] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [distance, setDistance] = useState(null);
  const [destinationMarker, setDestinationMarker] = useState(null);
  const [originSelected, setOriginSelected] = useState(false);
  const [clueOpacity, setClueOpacity] = useState(1);
  const [destinationAddress, setDestinationAddress] = useState("");
  const [friendsMode, setFriendsMode] = useState(true);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [originIsFriend, setOriginIsFriend] = useState(false);

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
      console.log("fetched setFriends(friends);");
      setLoading(false);
    }
    if (loading) {
      fetchFriends();
    }
  }, [friends]);

  useEffect(() => {
    async function fetchNoFriends() {
      const noFriends = await getNoFriends();
      setNoFriends(noFriends);
      console.log("fetched  setNoFriends(noFriends);");
      setLoading(false);
    }
    if (loading) {
      fetchNoFriends();
    }
  }, [noFriends]);

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
        latitudeDelta: 0.4,
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

  const friendsPredefinedPlaces = friends.map((friend) => ({
    description: friend.title,
    structured_formatting: {
      main_text: friend.title,
    },
    geometry: {
      location: {
        lat: friend.coords.latitude,
        lng: friend.coords.longitude,
      },
    },
  }));

  async function handleAddFriend() {
    try {
      // const friendId = nanoid().toString();
      const friendId = origin.id;
      const userRef = doc(db, "friends", friendId);
      const docSnap = await getDoc(userRef);
      setLoading(true);
      console.log("loading", loading);
      setOriginIsFriend(true);

      await setDoc(userRef, {
        id: origin.id,
        title: origin.title,
        description: origin.description,
        coords: {
          latitude: origin.latitude,
          longitude: origin.longitude,
        },
      });

      const noFriendRef = doc(db, "noFriends", origin.id);
      await deleteDoc(noFriendRef);

      const updatedNoFriends = noFriends.filter(
        (noFriend) => noFriend.title !== origin.title
      );

      const updatedFriends = friends.filter(
        (friend) => friend.id !== origin.id
      );

      setNoFriends(updatedNoFriends);
      setFriends(updatedFriends);
      setLoading(true);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleRemoveFriend() {
    try {
      const noFriendId = origin.id;
      const userRef = doc(db, "noFriends", noFriendId);
      const docSnap = await getDoc(userRef);
      setLoading(true);
      console.log("loading", loading);
      await setDoc(userRef, {
        id: origin.id,
        title: origin.title,
        description: origin.description,
        coords: {
          latitude: origin.latitude,
          longitude: origin.longitude,
        },
      });

      try {
        const friendRef = doc(db, "friends", noFriendId);
        await deleteDoc(friendRef);
      } catch (error) {
        console.error(error);
      }

      const updatedNoFriends = noFriends.filter(
        (noFriend) => noFriend.id !== id
      );

      const updatedFriends = friends.filter(
        (friend) => friend.id !== origin.id
      );

      setFriends(updatedFriends);
      setNoFriends(updatedNoFriends);
      setLoading(true);
    } catch (error) {
      console.error(error);
    }
  }

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
              pinColor={"orange"}
              title={friend.title}
              description={friend.description}
              onPress={() => {
                setOrigin({
                  id: friend.id,
                  title: friend.title,
                  description: friend.description,
                  latitude: friend.coords.latitude,
                  longitude: friend.coords.longitude,
                });
              }}
            />
          ))}
          {noFriends.map((noFriend) => (
            <Marker
              key={noFriend.id}
              coordinate={{
                latitude: noFriend.coords.latitude,
                longitude: noFriend.coords.longitude,
              }}
              pinColor={"pink"}
              title={noFriend.title}
              description={noFriend.description}
              onPress={() =>
                setOrigin({
                  id: noFriend.id,
                  title: noFriend.title,
                  description: noFriend.description,
                  latitude: noFriend.coords.latitude,
                  longitude: noFriend.coords.longitude,
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

            <View style={styles.switchContainer}>
              <Text>
                {friendsMode
                  ? "Recherche d'itinéraire standard"
                  : "Filtrer en fonction de tes ami(e)s"}
              </Text>
              <Switch
                value={friendsMode}
                onValueChange={(value) => setFriendsMode(value)}
              />
            </View>

            {friendsMode ? (
              <GooglePlacesAutocomplete
                placeholder="All arround the world"
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
            ) : (
              <GooglePlacesAutocomplete
                placeholder="Only My friends"
                predefinedPlaces={friendsPredefinedPlaces}
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
                debounce={200}
              />
            )}
          </View>
        </Modal>
      ) : null}
      {locationAccepted ? (
        !origin ? (
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
        )
      ) : null}

      <View style={styles.bord}>
        {locationAccepted && (
          <View style={styles.buttonContainer}>
            <View style={styles.buttonZoom}>
              <TouchableOpacity onPress={handleFindMyLocation}>
                <Image
                  source={{
                    uri: "https://cdn.discordapp.com/attachments/483349134661779476/1070368697753022564/zoom_in_480px.png",
                  }}
                  style={styles.zoomStatus}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleUnzoom}>
                <Image
                  source={{
                    uri: "https://cdn.discordapp.com/attachments/483349134661779476/1070370019088805998/zoom_out_480px.png",
                  }}
                  style={styles.zoomStatus}
                />
              </TouchableOpacity>
            </View>

            <Text>Distance: {distance} km</Text>
            <Text>Adresse d'arrivée : {destinationAddress}</Text>

            {origin && (
              <View style={styles.actions}>
                {friends.some((friend) => friend.title === origin.title) ? (
                  <Button
                    title="Retirer ami"
                    onPress={() => {
                      handleRemoveFriend();
                    }}
                  />
                ) : (
                  <Button
                    title="Ajouter ami"
                    onPress={() => {
                      handleAddFriend();
                    }}
                  />
                )}
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  zoomStatus: {
    height: 30,
    width: 30,
  },
  buttonZoom: {
    backgroundColor: "red",
    width: "100%",
    display: "flex",
    flexDirection: "row",
  },
  marker: {
    width: 80,
    height: 80,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginBottom: 10,
  },
  clueContainer: {
    position: "absolute",
    display: "flex",
    alignItems: "center",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
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
