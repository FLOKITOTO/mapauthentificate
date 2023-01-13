import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/Login";
import Home from "../screens/Home";

const Stack = createNativeStackNavigator();

const stackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Group>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} />
      </Stack.Group>
      {/* <Stack.Group screenOptions={{ presentation: "modal" }}>
        <Stack.Screen name="NewEvent" component={NewEventScreen} />
      </Stack.Group> */}
    </Stack.Navigator>
  );
};

export default stackNavigator;
