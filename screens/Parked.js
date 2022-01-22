import React, { useEffect, useState } from "react";

import {
  ImageBackground,
  StyleSheet,
  View,
  SafeAreaView,
  TextInput,
  Text,
  Alert,
  Dimensions,
  SectionList,
  ActivityIndicator,
} from "react-native";
import {
  TabView,
  Tab,
  Button,
  Overlay,
  Switch,
  Divider,
} from "react-native-elements";
import { useContext } from "react";
import { auth, db } from "../firebase";
import ButtonMain from "./common/button";
import { data } from "../src/Transaltion/translation";
import SettingsContext from "../src/context/Setting";
import axios from "axios";
function Parked(props, navigation) {
  const [hours, setHours] = useState(0);
  const [stripeId, setStripeId] = useState(null);
  const [price, setPrice] = useState(null);
  const { settings, saveSettings } = useContext(SettingsContext);
  const date = new Date();

  useEffect(async () => {
    let date;
    const cityRef = db.collection("users").doc(auth.currentUser.uid);
    const doc = await cityRef.get();
    if (!doc.exists) {
      console.log("No such document!");
    } else {
      date = new Date(doc.data().checkIntime.seconds * 1000);
      const date1 = new Date();
      console.log(date1, date);
      const diffTime = Math.abs(date1 - date);
      const hours = diffTime / 3600000;
      setHours(hours);
      setPrice(hours * props.bookedSpace.Price);
    }
  }, []);

  async function checkout() {
    props.navigation.navigate("Card", {
      pay: pay,
      ownerid: props.bookedSpace.owner,
      price: price,
      time: hours,
      checkoutFunc: checkoutLater,
    });
  }

  async function checkoutLater() {
    let date;
    let hours;
    const city = db.collection("users").doc(auth.currentUser.uid);
    const docc = await city.get();
    if (!docc.exists) {
      console.log("No such document!");
    } else {
      date = new Date(docc.data().checkIntime.seconds * 1000);
      const date1 = new Date();
      console.log(date1, date);
      const diffTime = Math.abs(date1 - date);
      hours = diffTime / 3600000;
      setHours(hours);
      setPrice(hours * props.bookedSpace.Price);
      console.log("HIURSSs", props.bookedSpace.Price);
    }

    var history = [];
    const cityRef = db.collection("users").doc(auth.currentUser.uid);
    const doc = await cityRef.get();
    if (!doc.exists) {
      console.log("No such document!");
    } else {
      if (doc.data().history) {
        history = doc.data().history;
      }
    }

    history.push({
      bookedSpace: props.bookedSpace,
      date: new Date(),
      isPayed: false,
      payable: hours * props.bookedSpace.Price,
      time: hours,
    });

    db.collection("users")
      .doc(auth.currentUser.uid)
      .update({
        history: history,
      })
      .then(function () {
        props.setParked(false);
        props.reset();
      });
  }

  async function pay(price, time) {
    var history = [];
    const cityRef = db.collection("users").doc(auth.currentUser.uid);
    const doc = await cityRef.get();
    if (!doc.exists) {
      console.log("No such document!");
    } else {
      try {
        const data = await axios.post(
          "https://salty-citadel-46447.herokuapp.com/generate_invoice",
          {
            name: doc.data().name,
            email: doc.data().email,
            address: doc.data().address,
            city: doc.data().city,
            zipCode: doc.data().zipCode,
            slotPrice: props.bookedSpace.Price,
            hours: time,
            price,
            date: new Date().toISOString().slice(0, 10),
          }
        );
      } catch (err) {
        console.log("err", err);
      }

      if (doc.data().history) {
        history = doc.data().history;
      }
    }

    history.push({
      bookedSpace: props.bookedSpace,
      date: new Date(),
      isPayed: true,
      payable: null,
      time: null,
    });

    db.collection("users")
      .doc(auth.currentUser.uid)
      .update({
        history: history,
      })
      .then(function () {
        props.setParked(false);
        props.reset();
      });
  }

  return (
    <Overlay
      isVisible={props.visible}
      onBackdropPress={() => {
        props.setParked(false);
      }}
    >
      <View>
        <Text style={{ textAlign: "center", padding: 30, fontSize: 20 }}>
          {data["Car_Parked"][settings]}+{"!"}
        </Text>

        <View
          style={{
            borderRadius: 15,
            backgroundColor: "#EEEDE7",
            width: "80%",
            padding: 20,
            marginTop: 40,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              marginBottom: 5,
            }}
          >
            Invoice:
          </Text>

          <Text>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "bold",
              }}
            >
              Time:
            </Text>
            {"  "}
            {hours} hrs
          </Text>
          <Text>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "bold",
              }}
            >
              Date:
            </Text>
            {"  "}
            {date.getDate() +
              "/" +
              date.getMonth() +
              1 +
              "/" +
              date.getFullYear()}
          </Text>
          <Text>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "bold",
              }}
            >
              Price:
            </Text>{" "}
            {props.bookedSpace.Price} ft/hr
          </Text>
          <Text>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "bold",
              }}
            >
              Payable:
            </Text>{" "}
            {price} ft
          </Text>
        </View>

        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ButtonMain title="Checkout and Pay Now" function={checkout} />
          <ButtonMain title="Checkout and Pay Later" function={checkoutLater} />
        </View>
        <View style={{ padding: 20 }}></View>
      </View>
    </Overlay>
  );
}

export default Parked;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  button: {
    padding: 10,
    margin: 10,
    width: "100%",
    textAlign: "center",
  },
  buttonContainer: {
    textAlign: "center",
  },
  formFieldText: {
    width: "100%",
    fontSize: 12,
    borderRadius: 5,
    borderWidth: 0.5,
    padding: 10,
    backgroundColor: "#eeeeee",
    marginTop: 10,
    marginBottom: 10,
  },
});
