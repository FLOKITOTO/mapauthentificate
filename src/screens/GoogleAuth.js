import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Button,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { SvgUri } from "react-native-svg";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

WebBrowser.maybeCompleteAuthSession();
const fakeUser = {
  name: "John Doe",
  picture:
    "https://cdn.discordapp.com/attachments/483349134661779476/1064226792325533716/Compressed.png",
};
const GoogleAuth = ({ navigation }) => {
  navigation = useNavigation();
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(fakeUser);
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId:
      "1062703903300-g9berao3p6nk6mqk9g0b72patvka83kk.apps.googleusercontent.com",
    iosClientId:
      "1062703903300-s2krt7ehujr2acev0aol9pt7pihftegf.apps.googleusercontent.com",
    androidClientId:
      "1062703903300-ejsdg7die21apfn2oh4jst7sid260c1v.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      setAccessToken(response.authentication.accessToken);
      accessToken && fetchUserInformations();
    }
  }, [response, accessToken]);

  async function fetchUserInformations() {
    let response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const useInfo = await response.json();
    setUser(useInfo);
  }

  const ShowUserInfo = () => {
    if (user) {
      return (
        <View style={styles.container}>
          <Text style={styles.text}>Successfully connected</Text>
          <Text style={styles.text}>Welcome</Text>
          <Image source={{ uri: user.picture }} style={styles.picture}></Image>
          <Text style={styles.subText}>{user.name}</Text>
          <Button
            disabled={!request}
            title="Acceder au tableau de bord"
            onPress={() => {
              navigation.navigate("MapTab", {
                screen: "Home",
                params: { user: user },
              });
              // console.log("context", (user = useContext(UserContext)));
              // console.log("addUser", addUser(...user));
            }}
          />
          <Button
            title="test"
            onPress={() => {
              console.log("context", user);
            }}
          />
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {user && <ShowUserInfo />}

      {user === null && (
        <>
          <View>
            <Text style={styles.text}>Welcome</Text>
            <Text style={styles.subText}>Please Login</Text>
            <TouchableOpacity
              disabled={!request}
              onPress={() => {
                promptAsync();
              }}
            >
              <SvgUri
                width="35%"
                height="35%"
                uri="https://cdn.discordapp.com/attachments/483349134661779476/1063773568246239372/google.svg"
              />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    height: "auto",
  },
  container: {
    height: 400,
    justifyContent: "flex-end",
    alignItems: "center",
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

export default GoogleAuth;
