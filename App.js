import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";

import StackNavigator from "./src/commons/stackNavigator";

export default function App() {
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
}
