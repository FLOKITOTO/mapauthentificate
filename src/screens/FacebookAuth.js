import React, { useState, useEffect } from "react";
// import * as Facebook from "expo-facebook";
// import { LoginManager, AccessToken } from "react-native-fbsdk";
// import { useUserInfo } from "../hooks/useUserInfo";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Button,
} from "react-native";

const FacebookAuth = () => {
  // const [accessToken, setAccessToken] = useState(null);
  // const [user, setUser] = useState(null);
  // const { userInfo, updateUserInfo } = useUserInfo();

  // useEffect(() => {
  //   AccessToken.getCurrentAccessToken().then((data) => {
  //     setAccessToken(data.accessToken);
  //     accessToken && fetchUserInformations();
  //   });
  // }, [accessToken]);

  // async function fetchUserInformations() {
  //   let response = await fetch(
  //     `https://graph.facebook.com/me?access_token=${accessToken}`
  //   );
  //   const useInfo = await response.json();
  //   setUser(useInfo);
  //   updateUserInfo(useInfo);
  // }

  // const logIn = async () => {
  //   try {
  //     const { type, token, expires, permissions, declinedPermissions } =
  //       await Facebook.logInWithReadPermissionsAsync("APP_ID", {
  //         permissions: ["public_profile"],
  //       });

  //     if (type === "success") {
  //       setAccessToken(token);
  //     } else {
  //       // type === 'cancel'
  //     }
  //   } catch ({ message }) {
  //     alert(`Facebook Login Error: ${message}`);
  //   }
  // };

  // const ShowUserInfo = () => {
  //   if (user) {
  //     return (
  //       <View style={styles.container}>
  //         <Text style={styles.text}>Welcome</Text>
  //         <Text style={styles.subText}>{user.name}</Text>
  //         <Button
  //           title="Acceder au tableau de bord"
  //           onPress={() => {
  //             navigation.navigate("Home");
  //           }}
  //         />
  //       </View>
  //     );
  //   }
  // };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello</Text>
      {/* {user && <ShowUserInfo />}
      {user === null && (
        <Button title="Se connecter avec Facebook" onPress={logIn} />
      )} */}
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

export default FacebookAuth;
