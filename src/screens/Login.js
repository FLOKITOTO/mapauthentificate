import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Button,
  Linking,
} from "react-native";
import FacebookAuth from "./FacebookAuth";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../commons/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { SafeAreaView } from "react-native-safe-area-context";
import SafariView from "react-native-safari-view";
import { WebView } from "react-native-webview";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [uri, setURL] = useState("");

  navigation = useNavigation();

  // useEffect(() => {
  //   Linking.addEventListener("url", (url) => handleOpenURL(url.url));
  //   Linking.getInitialURL().then((url) => {
  //     if (url) {
  //       handleOpenURL({ url });
  //     }
  //   });
  //   return () => {
  //     Linking.removeAllListeners("url");
  //   };
  // }, []);

  // const handleOpenURL = (url) => {
  //   // Extract stringified user string out of the URL
  //   const user = decodeURI(url).match(
  //     /firstName=([^#]+)\/lastName=([^#]+)\/email=([^#]+)/
  //   );
  //   // 2 - store data in Redux
  //   const userData = {
  //     isAuthenticated: true,
  //     firstName: user[1],
  //     lastName: user[2],
  //     //some users on fb may not registered with email but rather with phone
  //     email: user && user[3] ? user[3] : "NA",
  //   };
  //   //redux function
  //   login(userData);
  //   if (Platform.OS === "ios") {
  //     SafariView.dismiss();
  //   } else {
  //     setURL("");
  //   }
  // };

  // const openUrl = (url) => {
  //   // // Use SafariView on iOS
  //   if (Platform.OS === "ios") {
  //     SafariView.show({
  //       url,
  //       fromBottom: true,
  //     });
  //   } else {
  //     setURL(url);
  //   }
  // };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigation.navigate("MapTab", {
          screen: "Home",
          params: { user: user },
        });
      }
    });

    return unsubscribe;
  }, []);

  const handleSignUp = () => {
    if (!email || !password) {
      setEmailError(!email ? "Email field is required" : "");
      setPasswordError(!password ? "Password field is required" : "");
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredentials) => {
          const user = userCredentials.user;
          console.log("Registered with:", user.email);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode);
          console.log(errorMessage);
        });
    }
  };

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log("Logged in with:", user.email);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
      });
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <StatusBar style="auto" />

      <View style={styles.container}>
        <Text style={styles.title}>MapAuth</Text>
        <Text style={styles.text}>Please login</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            style={styles.input}
            secureTextEntry
          />
        </View>

        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <TouchableOpacity onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={styles.subButton}
          >
            <Text style={styles.buttonSubText}>Register</Text>
          </TouchableOpacity>

          <Modal
            animationType="slide"
            transparent={false}
            visible={isModalVisible}
          >
            <View style={styles.container}>
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={(text) => setEmail(text)}
                style={styles.input}
              />
              {emailError && <Text style={styles.errorText}>{emailError}</Text>}
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={(text) => setPassword(text)}
                style={styles.input}
                secureTextEntry
              />

              {passwordError && (
                <Text style={styles.errorText}>{passwordError}</Text>
              )}
              <TouchableOpacity
                onPress={() => {
                  if (!email || !password) {
                    handleSignUp();
                    return;
                  }
                  handleSignUp();
                  setModalVisible(false);
                }}
              >
                <Text style={styles.buttonSubText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
        <Text style={styles.margin}> OU </Text>
        <View style={styles.socialButtonContainer}>
          <Text
            style={styles.subText}
            onPress={() => {
              navigation.navigate("GoogleAuth");
            }}
          >
            Google
          </Text>
          <FacebookAuth />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  errorText: {
    color: "red",
  },
  margin: {
    marginBottom: 25,
  },
  socialButtonContainer: {
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  text: {
    color: "#008080",
    fontSize: 35,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subText: {
    color: "grey",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 9,
  },
  inputContainer: {
    width: "80%",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    marginTop: 30,
    marginBottom: 30,
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    width: "80%",
    padding: 16,
    backgroundColor: "#008080",
  },

  buttonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
    width: "auto",
  },
  subButton: {
    marginTop: 20,
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
    width: "auto",
  },
  buttonSubText: {
    color: "#008080",
    fontWeight: "700",
    fontSize: 16,
    width: "auto",
  },
});
