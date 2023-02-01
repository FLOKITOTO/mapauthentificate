import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, Button } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { GiftedChat } from "react-native-gifted-chat";
import { dbrt } from "../commons/firebaseConfig";
import { onValue, ref, set } from "firebase/database";

const Home = ({ route, navigation }) => {
  const [messages, setMessages] = useState([]);

  navigation = useNavigation();
  const { user } = route.params;

  useEffect(() => {
    return () => {
      console.log("User logged in", user);
    };
  }, [user]);

  useEffect(() => {
    const messagesRef = ref(dbrt, "messages");
    onValue(messagesRef, (snapshot) => {
      setMessages(snapshot.val());
    });
  }, []);

  const onSend = (newMessage = []) => {
    setMessages([...messages, ...newMessage]);

    const messagesRef = ref(dbrt, "messages");
    set(messagesRef, messages);
  };

  // prevent back
  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = navigation.addListener("beforeRemove", (e) => {
        e.preventDefault();
      });

      return unsubscribe;
    }, [navigation])
  );

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.banner}>
        <View style={styles.leftContent}>
          <Button
            color={"#008080"}
            title="go to map"
            onPress={() => {
              navigation.navigate("Planisphere");
            }}
          />
        </View>
        <View style={styles.rightContent}>
          <View style={styles.rightTextContent}>
            <Text style={styles.name}>
              {user.name ? user.name : user.email}
            </Text>
          </View>
          {user.picture ? (
            <Image source={{ uri: user.picture }} style={styles.picture} />
          ) : null}
        </View>
      </View>
      <View style={styles.chatContainer}>
        <GiftedChat style={styles.chat} messages={messages} onSend={onSend} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  chatContainer: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  chatContainer: {
    width: "100%",
    height: "100%",
    flex: 1,
    marginBottom: 10,
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
  },
  banner: {
    width: "100%",
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    padding: 10,
  },
  name: {
    fontSize: 15,
    fontWeight: "bold",
    color: "gray",
    marginRight: 20,
  },
  picture: {
    width: 50,
    height: 50,
    borderRadius: 30,
  },
  leftContent: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
    marginRight: "auto",
    marginLeft: "auto",
  },
  rightContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    justifyContent: "center",
    marginRight: "auto",
    marginLeft: "auto",
    flexDirection: "row",
    padding: 10,
  },
});

export default Home;
