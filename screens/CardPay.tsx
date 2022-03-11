import React, { useState, useEffect, useContext } from "react";
import {
  View,
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  Text,
  BackHandler,
  Button,
} from "react-native";
import { CardField, useConfirmPayment } from "@stripe/stripe-react-native";
import type {
  CardFieldInput,
  PaymentMethodCreateParams,
} from "@stripe/stripe-react-native";

import { auth, db } from "../firebase";
import axios from "axios";
import SettingsContext from "../src/context/Setting";
import { data } from "../src/Transaltion/translation";
import Icon from "react-native-vector-icons/FontAwesome";
import ButtonMain from "./common/button";

export default function Card({ navigation, route }) {
  const { settings, saveSettings } = useContext(SettingsContext);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const price = route.params.price <= 285 ? 285 : route.params.price;
  const [card, setCard] = useState(null);
  const [flag, setFlag] = useState(false);

  const [cvc, setCvc] = useState(null);
  const date = new Date();

  async function Check() {
    const cityRef = db.collection("users").doc(route.params.ownerid);
    const doc = await cityRef.get();
    if (!doc.exists) {
      console.log("No such document!");
    } else {
      console.log("Document data:", doc.data().stripeId);
    }
    return doc.data().stripeId;
  }
  function handleBackButtonClick() {
    // this.props.navigation.goBack(null);
    // console.log("MUAHAHAH");
    navigation.replace("Maps");

    return true;
  }
  // useEffect(() => {
  //   // if (route.params) {
  //   //   if (route.params.path) {
  //   //     setFlag(true);
  //   //   }
  //   // }
  // }, []);
  useEffect(() => {
    if (flag) {
      navigation.replace("Tickets", {
        error: "Error Occurred In Last Payment",
      });
    }
  }, [flag]);
  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
  });
  const fetchPaymentIntentClientSecret = async () => {
    var clientSecret = null;
    var obj = null;
    const response = await axios
      .post(
        "https://ancient-woodland-88729.herokuapp.com/create-payment-intent",
        { amount: parseInt(price) }
        // { amount: 200 }
      )
      .then((res) => {
        //console.log("Res create payment intent", res);
        if (res.data.paymentIntent) {
          obj = res.data.paymentIntent;
          clientSecret = res.data.paymentIntent.id;
        }
      })
      .catch((e) => {
        console.log("Error : ", e);
      });

    return obj;
  };

  const fetchCard = async () => {
    const cardDet = {
      number: card.number,
      exp_month: card.expiryMonth,
      exp_year: card.expiryYear,
      cvc: cvc,
    };

    var obj = null;
    const response = await axios
      .post("https://ancient-woodland-88729.herokuapp.com/add-card", {
        card: cardDet,
      })
      .then((res) => {
        obj = res.data.data;
        console.log("Res", res);
      });
    return obj;
  };

  const handlePayPress = async () => {
    if (cvc) {
      try {
        setLoading(true);
        const card = await fetchCard();
        // 1. fetch Intent Client Secret from backend
        const obj = await fetchPaymentIntentClientSecret();
        if (obj != null) {
          console.log("OOBBJJ:", obj);

          // 2. Gather customer billing information (ex. email)
          const response = await axios.post(
            "https://ancient-woodland-88729.herokuapp.com/confirm-payment",
            { key: obj.id, card: card.id }
          );
          console.log("confirm payemnt :", response);
          // .then((res) => { console.log("RES Confirm opayment:", res) });

          if (response.data.data_success) {
            const stripeID = await Check();
            const resp = await axios
              .post("https://ancient-woodland-88729.herokuapp.com/transfer", {
                account: stripeID,
                amount: price,
                // amount: 200,
              })
              .then((res) => {
                console.log("Res transfer", res);
                setLoading(false);
                route.params.pay(price, route.params.time);
                navigation.replace("Maps");
              })
              .catch((err) => {
                console.log(err);
                setLoading(false);
                if (route.params) {
                  if (route.params.path) {
                    setFlag(true);
                  }
                }
                navigation.replace("Maps", {
                  error: "Error Occurred In Last Payment",
                });
              });
          } else {
            setLoading(false);
            if (route.params) {
              if (route.params.path) {
                setFlag(true);
              }
            }
            navigation.replace("Maps", {
              error: "Error Occurred In Last Payment",
            });
          }
        } else {
          setLoading(false);
          if (route.params) {
            if (route.params.path) {
              setFlag(true);
            }
          }
          navigation.replace("Maps", {
            error: "Error Occurred In Last Payment",
          });
        }
      } catch (err) {
        console.log(err);
        Alert.alert("ERROR OCCURRED");
        setLoading(false);
        if (route.params) {
          if (route.params.path) {
            setFlag(true);
          }
        }
        navigation.replace("Maps", {
          error: "Error Occurred In Last Payment",
        });
      }
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <View style={{ padding: 20 }}></View>
        <TextInput
          autoCapitalize="none"
          placeholder={data["enterName"][settings]}
          keyboardType="name-phone-pad"
          onChange={(value) => setName(value.nativeEvent.text)}
          style={styles.input}
        />
        <CardField
          dangerouslyGetFullCardDetails={true}
          placeholder={{
            number: "4242 4242 4242 4242",
          }}
          onCardChange={(cardDetails) => {
            setCard(cardDetails);
          }}
          onFocus={(focusedField) => {}}
          cardStyle={inputStyles}
          style={styles.cardField}
        />
        <TextInput
          autoCapitalize="none"
          placeholder={data["entercvc"][settings]}
          keyboardType="name-phone-pad"
          onChange={(value) => setCvc(value.nativeEvent.text)}
          style={styles.input}
        />
        {/* <Button onPress={handlePayPress} title="Pay Now" disabled={loading} /> */}
        <ButtonMain
          title={data["pay"][settings]}
          function={handlePayPress}
          loading={loading}
        ></ButtonMain>
        {loading && (
          <View style={{ flex: 1, padding: 20 }}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 20,
    paddingHorizontal: 16,
    width: "100%",
  },
  cardField: {
    width: "100%",
    height: 50,
    marginVertical: 30,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  text: {
    marginLeft: 12,
  },
  input: {
    margin: 10,
    height: 44,
    borderBottomColor: "black",
    borderBottomWidth: 1.5,
  },
});

const inputStyles: CardFieldInput.Styles = {
  borderWidth: 1,
  backgroundColor: "#FFFFFF",
  borderColor: "#000000",
  borderRadius: 8,
  fontSize: 14,
  placeholderColor: "#999999",
};
