import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/Login";
import Home from "../screens/Home";
import Settings from "../screens/Settings";
import Planisphere from "../screens/Planisphere ";
import { NavigationContainer } from "@react-navigation/native";
import GoogleAuth from "../screens/GoogleAuth";
import { Linking, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MapTab = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: true,
        gestureEnabled: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          canGoBack: false,
          gestureEnabled: false,
          headerShown: true,
          headerLeft: () => <View style={{ width: 0, height: 0 }} />,
          tabBarIcon: (tabInfo) => {
            return (
              <Ionicons
                name="md-home"
                size={24}
                color={tabInfo.focused ? "#006600" : "#8e8e93"}
              />
            );
          },
        }}
      />
      <Tab.Screen
        options={{
          gestureEnabled: false,
          headerShown: true,
          headerLeft: () => <View style={{ width: 0, height: 0 }} />,
          tabBarIcon: (tabInfo) => {
            return (
              <Ionicons
                name="md-map"
                size={24}
                color={tabInfo.focused ? "#008080" : "#8e8e93"}
              />
            );
          },
        }}
        name="Planisphere"
        component={Planisphere}
      />
      <Tab.Screen
        options={{
          gestureEnabled: false,
          headerShown: true,
          headerLeft: () => <View style={{ width: 0, height: 0 }} />,
          tabBarIcon: (tabInfo) => {
            return (
              <Ionicons
                name="md-settings"
                size={24}
                color={tabInfo.focused ? "#008080" : "#8e8e93"}
              />
            );
          },
        }}
        name="Settings"
        component={Settings}
      />
    </Tab.Navigator>
  );
};

const Navigation = () => {
  return (
    <NavigationContainer linking={Linking}>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="MapTab"
          component={MapTab}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="GoogleAuth"
          component={GoogleAuth}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
