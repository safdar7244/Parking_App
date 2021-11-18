import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./screens/Login";
import Main from "./screens/Main";
import Register from "./screens/Register";
import TabBottom from "./screens/TabBottom";
import Account from "./screens/Account";
import Maps from "./screens/Maps";
import AccountEdit from "./screens/AccountEdit";
import AccountNotifications from "./screens/AccountNotifications";
import AccountLanguage from "./screens/AccountLanguage";
import AccountAbout from "./screens/AccountAbout";
import AccountParkings from "./screens/AccountParkings";
import AccountAddParking from "./screens/AccountAddParking";
import Location from "./screens/Location";
const Stack = createNativeStackNavigator();

const globalScreenOptions = {
  headerStyle: {
    backgroundColor: "#5EA0EE",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    shadowColor: "black",
    height: 45,
  },
  headerTitleStyle: { color: "white" },
  headerTintColor: "white",
};

export default function MyStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={globalScreenOptions}>
        <Stack.Screen name="Main" component={Main} options={{ title: "" }} />

        <Stack.Screen name="Login" component={Login} options={{ title: "" }} />
        <Stack.Screen
          name="Register"
          component={Register}
          options={{ title: "" }}
        />
        <Stack.Screen
          name="Account"
          component={Account}
          options={{ title: "", headerShown: true }}
        />
        <Stack.Screen
          name="Maps"
          component={Maps}
          options={{ title: "", headerShown: false }}
        />
        <Stack.Screen
          name="AccountEdit"
          component={AccountEdit}
          options={{ title: "", headerShown: true }}
        />
        <Stack.Screen
          name="AccountNotifications"
          component={AccountNotifications}
          options={{ title: "", headerShown: true }}
        />
        <Stack.Screen
          name="AccountLanguage"
          component={AccountLanguage}
          options={{ title: "", headerShown: true }}
        />
        <Stack.Screen
          name="AccountAbout"
          component={AccountAbout}
          options={{ title: "", headerShown: true }}
        />
        <Stack.Screen
          name="AccountParkings"
          component={AccountParkings}
          options={{ title: "", headerShown: true }}
        />

        <Stack.Screen
          name="AccountAddParking"
          component={AccountAddParking}
          options={{ title: "", headerShown: true }}
        />

        <Stack.Screen
          name="TabBottom"
          component={TabBottom}
          options={{ title: "", headerShown: false }}
        />
      </Stack.Navigator>
      {/* <TabBottom/> */}
    </NavigationContainer>
  );
}
