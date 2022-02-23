import React, { useState, useContext } from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import { Button, Avatar } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { Input } from "react-native-elements";
import ButtonMain from "./common/button";
import { auth, db } from "../firebase";
import * as Facebook from "expo-facebook";
import * as Google from "expo-google-app-auth";
import { data } from "../src/Transaltion/translation";
import SettingsContext from "../src/context/Setting";

// import { StackActions, NavigationActions } from "react-navigation";

export default function Register({ navigation, route }) {
  const [userData, setUserData] = useState({});
  const [name, setName] = useState("");
  const [zipCode, setZip] = useState("");
  const [address, setAdress] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { settings, saveSettings } = useContext(SettingsContext);
  //sconst [status, requestPermission] = Facebook.usePermissions();

  ///////////////////////////////////////////////////////////////////////////////////////////////////

  async function logIn() {
    try {
      await Facebook.initializeAsync({
        appId: "557872115402556",
      });
      const { type, token, expirationDate, permissions, declinedPermissions } =
        await Facebook.logInWithReadPermissionsAsync({
          permissions: ["public_profile"],
        });
      if (type === "success") {
        // Get the user's name using Facebook's Graph API
        const response = await fetch(
          `https://graph.facebook.com/me?access_token=${token}`
        );
        Alert.alert("bejelentkezve!", `Szia ${(await response.json()).name}!`);
      } else {
        // type === 'cancel'
      }
    } catch ({ message }) {
      alert(`Facebook bejelentkezési hiba!`);
    }
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////

  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  const handleGoogleSignin = () => {
    setGoogleSubmitting(true);
    const config = {
      androidClientId:
        "48070917160-u4rv1o65pgq3qh0tar021rko5kqohebb.apps.googleusercontent.com",
      androidStandaloneAppClientId:
        "48070917160-14890me2n4l8hva09qofmfj07mjt0v41.apps.googleusercontent.com",
      scopes: ["profile", "email"],
    };

    Google.logInAsync(config)
      .then((result) => {
        const { type, user } = result;
        if (type == "success") {
          const { email, name } = user;
          setTimeout(() => {
            setName(name);
            setEmail(email);
          }, 1000);
        } else {
          // handleMessage('Google Signin was cancelled');
        }
        setGoogleSubmitting(false);
      })
      .catch((error) => {
        // handleMessage('An error occurred. Check your network and try again');
        console.log(error);
        setGoogleSubmitting(false);
      });
  };

  /////////////////////////////////////////////////////////////////////////////////////////////////////

  const signUp = async () => {
    setLoading(true);
    try {
      //console.log(email, password);
      const authUser = await auth.createUserWithEmailAndPassword(
        email,
        password
      );
      const a = await authUser.user.updateProfile({
        displayName: name,
      });

      //console.log("a", authUser.uid);

      const obj = {
        email,
        name,
        city,
        zipCode,
        address,
      };

      auth.onAuthStateChanged((authUser) => {
        if (authUser) {
          //console.log(authUser);
          obj.id = authUser.uid;
          obj.stripeId = 0;
          obj.PushNotification = false;
          obj.latePayment = false;

          db.collection("users")
            .doc(obj.id)
            .set(obj)
            .then(() => {
              //console.log("Document successfully written!");
              setLoading(false);
            })
            .catch((error) => {
              setLoading(false);
              console.error("Hiba, próbáld újra! ", error);
            });
        }
      });

      // db.collection("users")
      //   .add(user)
      //   .then(() => {
      //     //console.log("Document successfully written!");
      //   })
      //   .catch((error) => {
      //     console.error("Error writing document: ", error);
      //   });

      navigation.reset({
        index: 0,
        routes: [
          {
            name: "Maps",
            // params: { someParam: "Param1" },
          },
        ],
      });
    } catch (err) {
      setLoading(false);

      alert("Hiba, próbáld újra!");
    }
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <ScrollView style={styles.container}>
      <ImageBackground
        source={require("../pictures/bkg.png")}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.innerContainer}>
          <Text style={styles.logoStyle}>Regisztrálás</Text>
          <Avatar
            rounded
            source={{
              uri: "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg",
            }}
            size="large"
            containerStyle={{ marginTop: 20, marginBottom: 20 }}
          />
          <Text style={styles.vagayStyle2}>
            Figyelem! Itt a pontos számlázási adataid add meg, erre az adatokra
            fogunk számlát kiállítani, miután parkoltál
          </Text>
          <Input
            containerStyle={styles.buttonContainer}
            leftIcon={{
              type: "font-awesome-5",
              name: "file-signature",
              color: "grey",
              padding: 5,
            }}
            placeholder="Számlázási név"
            onChangeText={(text) => setName(text)}
            value={name}
          />

          <Input
            containerStyle={styles.buttonContainer}
            leftIcon={{
              type: "font-awesome-5",
              name: "envelope",
              color: "grey",
              padding: 5,
            }}
            placeholder="E-mail"
            onChangeText={(text) => setEmail(text)}
            value={email}
          />

          <Input
            containerStyle={styles.buttonContainer}
            leftIcon={{
              type: "font-awesome-5",
              name: "address-card",
              color: "grey",
              padding: 5,
            }}
            placeholder={data["zipCode"][settings]}
            onChangeText={(text) => setZip(text)}
            value={zipCode}
          />

          <Input
            containerStyle={styles.buttonContainer}
            leftIcon={{
              type: "font-awesome-5",
              name: "city",
              color: "grey",
              padding: 5,
            }}
            placeholder={data["city"][settings]}
            onChangeText={(text) => setCity(text)}
            value={city}
          />

          <Input
            containerStyle={styles.buttonContainer}
            leftIcon={{
              type: "font-awesome-5",
              name: "address-book",
              color: "grey",
              padding: 5,
            }}
            placeholder={data["address"][settings]}
            onChangeText={(text) => setAdress(text)}
            value={address}
          />

          <Input
            containerStyle={styles.buttonContainer}
            leftIcon={{
              type: "font-awesome-5",
              name: "key",
              color: "grey",
              padding: 5,
            }}
            secureTextEntry={true}
            placeholder="Jelszó"
            onChangeText={(text) => setPassword(text)}
          />

          <ButtonMain
            title="Regisztráció"
            loading={loading}
            function={() => {
              signUp();
            }}
          />
          {loading && (
            <View style={{ padding: 5 }}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )}
          <Text style={styles.vagayStyle}>Vagy</Text>
          <Text
            onPress={() => {
              navigation.navigate("Login");
            }}
            style={styles.vagayStyle}
          >
            Már van fiókja? Belépés!
          </Text>
          <Button
            icon={
              <Icon
                name="facebook-square"
                size={20}
                color="white"
                style={{ paddingRight: 10 }}
              />
            }
            raised={true}
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.button}
            title={data["withFacebook"][settings]}
            onPress={() => {
              logIn();
              // navigation.replce("Login");
            }}
          >
            {" "}
          </Button>

          <View style={{ height: 10 }}></View>

          <Button
            icon={
              <Icon
                name="google"
                size={20}
                color="black"
                style={{ paddingRight: 15 }}
              />
            }
            raised={true}
            titleStyle={{ color: "black" }}
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.button2}
            title={data["withGoogle"][settings]}
            onPress={() => {
              handleGoogleSignin();
            }}
          >
            {" "}
          </Button>
          <Text style={styles.vagayStyle}>Vagy</Text>
          <View style={{ height: 50 }}></View>
        </View>
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  vagayStyle: {
    fontWeight: "bold",
    padding: 15,
    fontSize: 15,
  },
  vagayStyle2: {
    padding: 15,
    fontSize: 12,
    textAlign: "center",
  },
  innerContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  logoStyle: {
    fontFamily: "sans-serif",
    fontSize: 40,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#4267B2",
    borderRadius: 5,
    padding: 8,
  },
  button2: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 8,
  },
  buttonContainer: {
    width: "90%",
    borderRadius: 10,
  },
});
