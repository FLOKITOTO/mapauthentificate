import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Button,
} from "react-native";
import GoogleAuth from "./GoogleAuth";
import FacebookAuth from "./FacebookAuth";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

const Login = () => {
  const [selectedAuth, setSelectedAuth] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View>
        <Text style={styles.Title}>MapAuth Project</Text>
      </View>
      <View>
        <Text style={styles.text}>Please login</Text>
        <Text
          style={styles.subText}
          onPress={() => {
            setSelectedAuth("google");
            setIsModalOpen(true);
          }}
        >
          Google
        </Text>
        <Text
          style={styles.subText}
          onPress={() => {
            setSelectedAuth("facebook");
            setIsModalOpen(true);
          }}
        >
          Facebook
        </Text>
      </View>
      <Modal visible={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
        {selectedAuth === "google" && (
          <GoogleAuth closeModal={() => setIsModalOpen(false)} />
        )}
        {selectedAuth === "facebook" && (
          <FacebookAuth closeModal={() => setIsModalOpen(false)} />
        )}

        <View
          style={{
            height: 200,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => setIsModalOpen(false)}
            style={styles.button}
          >
            <Text>Retour</Text>
            <Ionicons name="md-arrow-back" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#f1f1f1",
    borderRadius: 5,
    padding: 10,
  },
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
    marginBottom: 9,
  },
  picture: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
});
