import React, { useEffect } from "react";
import { StyleSheet, Text, View, Image, Button } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

const Home = ({ route, navigation }) => {
  // const Home = ({ navigation }) => {
  navigation = useNavigation();
  const { user } = route.params;
  // const { user } = useContext(UserContext);

  useEffect(() => {
    return () => {
      console.log("User logged in", user);
    };
  }, [user]);

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
    </View>
  );
};
const styles = StyleSheet.create({
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
    borderRadius: 50,
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
