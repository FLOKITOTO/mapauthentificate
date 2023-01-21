import React, { useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Facebook from "expo-auth-session/providers/facebook";
import { StyleSheet, Text } from "react-native";
import { auth } from "../commons/firebaseConfig";
import { FacebookAuthProvider, signInWithCredential } from "firebase/auth";
import { ResponseType } from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

export default function FacebookAuth() {
  const [request, response, promptAsync] = Facebook.useAuthRequest({
    responseType: ResponseType.Token,
    clientId: "1112967956770445",
    redirectUri: "https://mapauth-37afa.firebaseapp.com/__/auth/handler",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params;
      const credential = FacebookAuthProvider.credential(access_token);
      signInWithCredential(auth, credential);
    }
  }, [response]);

  return (
    <Text
      style={styles.subText}
      disabled={!request}
      onPress={() => promptAsync()}
    >
      Facebook
    </Text>
  );
}
const styles = StyleSheet.create({
  subText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "grey",
    marginBottom: 9,
  },
});
