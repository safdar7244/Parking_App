import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./screens/Login";
import ReLogin from "./screens/ReLogin";

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
import MapsView from "./screens/MapsView";
import AccountAddParking from "./screens/AccountAddParking";
import Location from "./screens/Location";
import TempScreen from "./screens/temp";
import Tickets from "./screens/Tickets";
import AccountLatePayment from "./screens/AccountLatePayment";
import { SettingsProvider } from "./src/context/Setting";

const Stack = createNativeStackNavigator();
const settings =1;
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
          <SettingsProvider settings={settings}>

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
          name="Temp"
          component={TempScreen}
          options={{ title: "", headerShown: false }}
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
         <Stack.Screen
          name="ReLogin"
          component={ReLogin}
          options={{ title: "", headerShown: false }}
        />
         <Stack.Screen
          name="Tickets"
          component={Tickets}
          options={{ title: "", headerShown: true }}
        />
        <Stack.Screen
          name="AccountLatePayment"
          component={AccountLatePayment}
          options={{ title: "", headerShown: true }}
        />

      </Stack.Navigator>
      </SettingsProvider>

      {/* <TabBottom/> */}
    </NavigationContainer>
  );
}
