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
import { useState } from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import axios from "axios";
import { auth, db } from "../firebase";

export default function Stripe(props) {
  const [loading, setLoading] = useState(false);
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
    <View style={styles.container}>
      <ButtonMain
        title="Set Stripe"
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  SearchBar: {
    padding: 20,
  },
});
