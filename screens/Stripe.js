// import React from "react";

// import { Text, View, Linking } from "react-native";
import ButtonMain from "./common/button";

// export default function Stripe() {
//   /////////////////////////////////////////////////////////////////

//   async function Check() {
//     const cityRef = db.collection("users").doc(auth.currentUser.uid);
//     const doc = await cityRef.get();
//     if (!doc.exists) {
//       console.log("No such document!");
//     } else {
//       console.log("Document data:", doc.data().stripeId);
//       SetStripe(doc.data().stripeId);
//     }
//     console.log("stripe", stripe);

//     return doc.data().stripeId;
//   }

import * as React from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Linking,
  ActivityIndicator,
  Text,
} from "react-native";
import MapView from "react-native-maps";
import {
  TabView,
  Tab,
  Button,
  Overlay,
  Switch,
  Divider,
  SearchBar,
} from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useState, useContext } from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import axios from "axios";
import { auth, db } from "../firebase";
import { data } from "../src/Transaltion/translation";
import SettingsContext from "../src/context/Setting";

export default function Stripe(props) {
  const [loading, setLoading] = useState(false);
  const { settings, saveSettings } = useContext(SettingsContext);

  /////////////////////////////////////////////////////////////////
  const AccountLink = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://ancient-woodland-88729.herokuapp.com/onboard-user"
      );
      ///////////////////////////////////
      if (response) {
        db.collection("users")
          .doc(auth.currentUser.uid)
          .update({
            stripeId: response.data.id_,
          })
          .then(function () {});
        setLoading(false);
        ///////////////////////////////////
        Linking.canOpenURL(response.data.url).then((supported) => {
          if (supported) {
            Linking.openURL(response.data.url);
          } else {
            console.log("Don't know how to open URI: " + response.data.url);
          }
        });
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
    ///////////////////////////////////
  };
  /////////////////////////////////////////////////////////////////

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
      }}
    >
      <View style={styles.innerContainer1}>
        <Text>{data["Stripe_Message"][settings]}</Text>
      </View>

      <View style={styles.container}>
        <ButtonMain
          title={data["setStripe"][settings]}
          function={() => {
            AccountLink();
          }}
        ></ButtonMain>
        {loading && (
          <View style={{ padding: 20 }}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  SearchBar: {
    padding: 20,
  },
  innerContainer1: {
    // marginBottom:"20%",
    // borderRadius:15,
    borderRadius: 25,
    // backgroundColor: "red",
    backgroundColor: "white",
    width: "90%",
    marginTop: "10%",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
});
