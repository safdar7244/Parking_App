import React, { useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Button, Avatar, Overlay, Divider } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { Input } from "react-native-elements";
import ButtonMain from "./common/button";
import { auth } from "../firebase";

export default function Login({ navigation, route }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [flag, setFlag] = useState(false);
  const [newEmail, setNewEmail] = useState(null);
  const [loading, setLoading] = useState(false);

  const forgotPassword = (Email) => {
    console.log("reset email sent to " + Email);

    auth
      .sendPasswordResetEmail(Email)
      .then(() => {
        alert("reset email sent to " + Email);

        Alert.alert("Email Sent to " + Email, "Press OK to continue", [
          {
            text: "OK",
            onPress: () => {
              setFlag(false);
              setNewEmail(null);
            },
          },
        ]);
      })
      .catch(function (e) {
        console.log(e);
        alert(
          "ERROR While sending the email, Please check your connection and try again"
        );

        setFlag(false);
        setNewEmail(null);
      });
  };

  const logIn = () => {
    // navigation.replace('Temp');
    setLoading(true);
    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        setLoading(false);
        // console.log("dasdsdasd");
        navigation.reset({
          index: 0,
          routes: [
            {
              name: "Maps",
              // params: { someParam: "Param1" },
            },
          ],
        });
      })
      .catch((err) => {
        setLoading(false);
        alert(err);
      });
  };
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../pictures/bkg.png")}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.innerContainer}>
          <Text style={styles.logoStyle}>Bejelentkezés</Text>
          <Avatar
            rounded
            source={{
              uri: "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg",
            }}
            size="large"
            containerStyle={{ marginTop: 20, marginBottom: 20 }}
          />
          <Overlay
            overlayStyle={{ padding: 20, width: "80%" }}
            isVisible={flag}
            onBackdropPress={() => {
              setFlag(!flag);
            }}
          >
            <View style={{ width: "100%" }}>
              <View
                style={{
                  backgroundColor: "white",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ fontWeight: "bold", fontSize: 20, marginBottom: 20 }}
                >
                  E-mail visszaállítása
                </Text>
                <Divider />
                <Input
                  containerStyle={styles.buttonContainer}
                  placeholder="Email"
                  onChangeText={(text) => setNewEmail(text)}
                  value={newEmail}
                  secureTextEntry={false}
                />
                <Button
                  buttonStyle={{ backgroundColor: "red" }}
                  // style={{width:"100%"}}
                  title="Küldés"
                  onPress={() => {
                    forgotPassword(newEmail);
                  }}
                ></Button>
              </View>
            </View>
          </Overlay>
          <Input
            containerStyle={styles.buttonContainer}
            leftIcon={{
              type: "font-awesome-5",
              name: "envelope",
              color: "grey",
            }}
            placeholder="E-mail"
            onChangeText={(text) => setEmail(text)}
          />
          <Input
            containerStyle={styles.buttonContainer}
            leftIcon={{ type: "font-awesome-5", name: "key", color: "grey" }}
            placeholder="Jelszó"
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
          />

          <ButtonMain
            title="Bejelentkezés"
            loading={loading}
            function={() => {
              logIn();
            }}
          />
          {loading && (
            <View style={{ padding: 20 }}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )}

          <Text
            onPress={() => {
              navigation.navigate("Register");
            }}
            style={styles.vagayStyle}
          >
            Nincs még fiókod? Regisztrálj!
          </Text>
          <Text
            onPress={() => {
              setFlag(true);
            }}
            style={styles.vagayStyle}
          >
            elfelejtett jelszó?
          </Text>

          {/* <Button
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
            title="Continue with Facebook"
            onPress={() => {
              navigation.navigate("Login");
            }}
          >
            {" "}
          </Button> */}

          <View style={{ height: 10 }}></View>

          {/* <Button
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
            title="Continue with Google"
            onPress={() => {
              navigation.navigate("Login");
            }}
          >
            {" "}
          </Button> */}

          <View style={{ height: 50 }}></View>
        </View>
      </ImageBackground>
    </View>
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
