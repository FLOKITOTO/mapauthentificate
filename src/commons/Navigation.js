import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/Login";
import Home from "../screens/Home";
import Settings from "../screens/Settings";
import Planisphere from "../screens/Planisphere ";
import { NavigationContainer } from "@react-navigation/native";
import GoogleAuth from "../screens/GoogleAuth";
import { Button, View } from "react-native";

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
        }}
      />
      <Tab.Screen
        options={{
          gestureEnabled: false,
          headerShown: true,
          headerLeft: () => <View style={{ width: 0, height: 0 }} />,
        }}
        name="Planisphere"
        component={Planisphere}
      />
      <Tab.Screen
        options={{
          gestureEnabled: false,
          headerShown: true,
          headerLeft: () => <View style={{ width: 0, height: 0 }} />,
        }}
        name="Settings"
        component={Settings}
      />
    </Tab.Navigator>
  );
};

const Navigation = () => {
  return (
    <NavigationContainer>
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

// const MapTab = () => {
//   return (
//     <Tab.Navigator>
//       <Tab.Screen
//         options={{
//           gestureEnabled: false,
//           headerShown: true,
//           headerLeft: () => <></>,
//         }}
//         name="Planisphere"
//         component={Planisphere}
//       />
//       <Tab.Screen
//         options={{
//           gestureEnabled: false,
//           headerShown: true,
//           headerLeft: () => <></>,
//         }}
//         name="Settings"
//         component={Settings}
//       />
//     </Tab.Navigator>
//   );
// };

// const Navigation = () => {
//   return (
//     <Stack.Navigator initialRouteName="Login">
//       <Stack.Screen name="Login" component={Login} />
//       <Stack.Screen
//         options={{
//           gestureEnabled: false,
//           headerShown: true,
//           headerLeft: () => <></>,
//         }}
//         name="Home"
//         component={Home}
//       />
//       <Stack.Screen
//         options={{
//           gestureEnabled: false,
//           headerShown: false,
//           headerLeft: () => <></>,
//         }}
//         name="Planisphere"
//         component={MapTab}
//       />
//     </Stack.Navigator>
//   );
// };

export default Navigation;
