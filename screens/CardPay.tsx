import React, { useState, useEffect } from "react";
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
import Icon from "react-native-vector-icons/FontAwesome";
import ButtonMain from "./common/button";

export default function Card({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const price = route.params.price;
  const [card, setCard] = useState(null);
  const [cvc, setCvc] = useState(null);
  const date = new Date();
  //////////////////////////////////////////////////////////////////
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true
    );
    return () => backHandler.remove();
  }, []);
  //////////////////////////////////////////////////////////////////

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

  const fetchPaymentIntentClientSecret = async () => {
    var clientSecret = null;
    var obj = null;
    const response = await axios
      .post(
        "https://ancient-woodland-88729.herokuapp.com/create-payment-intent",
        { amount: price }
      )
      .then((res) => {
        obj = res.data.paymentIntent;
        clientSecret = res.data.paymentIntent.id;
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

        // 2. Gather customer billing information (ex. email)
        const response = await axios.post(
          "https://ancient-woodland-88729.herokuapp.com/confirm-payment",
          { key: obj.id, card: card.id }
        );

        const stripeID = await Check();

        const resp = await axios
          .post("https://nameless-wildwood-00103.herokuapp.com/transfer", {
            account: stripeID,
            amount: price * 0.9,
          })
          .then((res) => {
            setLoading(false);
            route.params.pay(price);
            Alert.alert("Payment Successful");
            navigation.navigate("Maps");
          })
          .catch(() => {
            Alert.alert("ERROR OCCURRED");
            setLoading(false);
          });
      } catch (err) {
        console.log("Error Occurred");
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
          placeholder="Enter Name"
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
          placeholder="Enter cvc"
          keyboardType="name-phone-pad"
          onChange={(value) => setCvc(value.nativeEvent.text)}
          style={styles.input}
        />
        <Button onPress={handlePayPress} title="Pay Now" disabled={loading} />
        {loading && (
          <View style={{ flex: 1, padding: 20 }}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}
        <Text>or</Text>
        <Button
          onPress={() => {
            route.params.checkoutFunc();
            navigation.navigate("Maps");
          }}
          title="Pay Later"
          disabled={loading}
        />
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
            {route.params.time}
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
              date.getFullYear() +
              "-" +
              date.getHours() +
              "/" +
              date.getMinutes()}
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
            {route.params.price ? route.params.price : "0"}
          </Text>
        </View>
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
