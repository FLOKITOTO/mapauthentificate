// import React, { useState } from "react";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// // import { NavigationContainer } from "@react-navigation/native";
// // import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import Login from "../screens/Login";
// import Home from "../screens/Home";

// const Stack = createNativeStackNavigator();

// const stackNavigator = () => {
//   return (
//     <Stack.Navigator
//       initialRouteName="Login"
//       screenOptions={{ headerShown: true }}
//     >
//       <Stack.Group>
//         <Stack.Screen name="Login" component={Login} />
//         <Stack.Screen
//           name="Home"
//           component={Home}
//           options={{
//             gestureEnabled: false,
//             headerShown: false,
//             headerLeft: () => <></>,
//           }}
//         />
//       </Stack.Group>
//     </Stack.Navigator>
//   );
// };

// export default stackNavigator;

import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../screens/Login";
import Home from "../screens/Home";
import Planisphere from "../screens/Planisphere ";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MapTab = () => {
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen
        options={{
          gestureEnabled: false,
          headerShown: true,
          headerLeft: () => <></>,
        }}
        name="Planisphere"
        component={Planisphere}
      />
    </Tab.Navigator>
  );
};

const Navigation = () => {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen
        options={{
          gestureEnabled: false,
          headerShown: true,
          headerLeft: () => <></>,
        }}
        name="Home"
        component={Home}
      />
      <Stack.Screen
        options={{
          gestureEnabled: false,
          headerShown: false,
          headerLeft: () => <></>,
        }}
        name="Planisphere"
        component={MapTab}
      />
    </Stack.Navigator>
  );
};

export default Navigation;
