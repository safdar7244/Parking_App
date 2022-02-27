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
  const [LatePayment, setlatePayment] = useState(null);

  const { settings, saveSettings } = useContext(SettingsContext);
  const [loadingScreen, SetLoading] = useState(false);
  const date = new Date();
  const getLatePayment = async () => {
    const userInfo = db.collection("users").doc(auth.currentUser.uid);
    const doc = await userInfo.get();
    if (!doc.exists) {
      console.log("No such document!");
    } else {
      try {
        console.log("Muhaha", doc.data().latePayment);
        setlatePayment(doc.data().latePayment);
      } catch (e) {
        console.log("err: ", e);
      }
    }
  };
  useEffect(() => {
    getLatePayment();
    // console.log("\n\n\n\n\n\n\n\n\n Meo");
  }, []);
  useEffect(() => {
    const getResult = async () => {
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
    };
    getResult();
  }, []);

  function convertNumToTime(number) {
    // Check sign of given number
    var sign = number >= 0 ? 1 : -1;

    // Set positive value of number of sign negative
    number = number * sign;

    // Separate the int from the decimal part
    var hour = Math.floor(number);
    var decpart = number - hour;

    var min = 1 / 60;
    // Round to nearest minute
    decpart = min * Math.round(decpart / min);

    var minute = Math.floor(decpart * 60) + "";

    // Add padding if need
    if (minute.length < 2) {
      minute = "0" + minute;
    }

    // Add Sign in final result
    sign = sign == 1 ? "" : "-";

    // Concate hours and minutes
    time = sign + hour + "hrs" + minute + "min";

    return time;
  }

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
    console.log("\n\nWERTY");
    SetLoading(true);
    let date;
    // let hours;
    const city = db.collection("users").doc(auth.currentUser.uid);
    const docc = await city.get();
    if (!docc.exists) {
    } else {
      // date = new Date(docc.data().checkIntime.seconds * 1000);
      // const date1 = new Date();
      // const diffTime = Math.abs(date1 - date);
      // hours = diffTime / 3600000;
      // setHours(hours);
      // setPrice(hours * props.bookedSpace.Price);
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
        SetLoading(false);
      })
      .catch((e) => {
        console.log("ERROR LOVE", e);
      });
    console.log("\n\nWERTY2");
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
          "https://ancient-woodland-88729.herokuapp.com/generate_invoice",
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
      style={{ padding: 20 }}
    >
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <View
          style={{
            borderRadius: 15,
            backgroundColor: "#EEEDE7",
            width: "100%",
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
            {data["invoice"][settings]}:
          </Text>

          <Text>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "bold",
              }}
            >
              {data["Time"][settings]}:
            </Text>
            {"  "}
            {hours ? convertNumToTime(hours) : "0"}
          </Text>
          <Text>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "bold",
              }}
            >
              {data["date"][settings]}:
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
              {data["Price"][settings]}:
            </Text>{" "}
            {props.bookedSpace.Price} {data["ft"][settings]}
          </Text>
          <Text>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "bold",
              }}
            >
              {data["Payable"][settings]}:
            </Text>{" "}
            {price.toFixed(1) <= 176 ? "176" : price.toFixed(1)} ft
          </Text>
        </View>
        {}
        <ButtonMain title={data["payNow"][settings]} function={checkout} />
        {LatePayment && (
          <ButtonMain
            title={data["payLater"][settings]}
            function={checkoutLater}
          />
        )}
        {loadingScreen && (
          <View style={{ flex: 1, padding: 20 }}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
      </View>
      <View style={{ padding: 20 }}></View>
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
