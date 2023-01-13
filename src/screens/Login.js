import React, { useState, useEffect } from "react";
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
import { useNavigation } from "@react-navigation/native";

WebBrowser.maybeCompleteAuthSession();

const Login = () => {
  const navigation = useNavigation();

  const [auth, setAuth] = useState({
    isLoggedIn: false,
    accessToken: null,
    user: null,
  });
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
      setAuth({
        isLoggedIn: true,
        accessToken: response.authentication.accessToken,
        user: null,
      });
      fetchUserInformations();
      navigation.navigate("Home");
    }
  }, [response]);

  async function fetchUserInformations() {
    let response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
      headers: { Authorization: `Bearer ${auth.accessToken}` },
    });
    const useInfo = await response.json();
    setAuth((prevState) => {
      return { ...prevState, user: useInfo };
    });
  }

  const ShowUserInfo = () => {
    if (auth.user) {
      return (
        <View style={styles.container}>
          {auth.isLoggedIn && (
            <View>
              <Text style={styles.text}>Welcome</Text>
              <Image
                source={{ uri: auth.user.picture }}
                style={styles.picture}
              ></Image>
              <Text style={styles.subText}>{auth.user.name}</Text>
            </View>
          )}
          {!auth.isLoggedIn && (
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
                  {" "}
                  <Image
                    source={require("../../assets/favicon.png")}
                    style={styles.picture}
                  />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {auth.user && <ShowUserInfo />}
      {auth.user === null && (
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
              <Image
                source={require("../../assets/favicon.png")}
                style={styles.image}
              ></Image>
            </TouchableOpacity>
          </View>
        </>
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

export default Login;
