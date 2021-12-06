import React from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  Alert,
} from "react-native";
import { Button, Avatar } from "react-native-elements";
import ButtonMain from "./common/button";
import TabBottom from "./TabBottom";
import { auth } from "../firebase";
export default function Main({ navigation }) {
  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        navigation.replace("Maps");
      }
    });

    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../pictures/bkg.png")}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.innerContainer}>
          <Text style={styles.logoStyle}>Szia!</Text>
          <Avatar
            rounded
            source={{
              uri: "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg",
            }}
            size="xlarge"
            containerStyle={{ marginTop: 20, marginBottom: 100 }}
          />
          <Button
            raised={true}
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.button}
            title="Bejelentkezés"
            onPress={() => {
              navigation.navigate("Login");

            }}
          >
            {" "}
          </Button>
          <Button
            raised={true}
            titleStyle={{ color: "black" }}
            containerStyle={styles.buttonContainer}
            buttonStyle={styles.button2}
            title="Regisztráció"
            onPress={() => {
              navigation.navigate("Register");
            }}
          >
            {" "}
          </Button>
          <View style={{ height: 100 }}></View>
        </View>
      </ImageBackground>
      {/* <Home /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: 45,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#5EA0EE",
    borderRadius: 10,
    padding: 13,
  },
  button2: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 13,
  },
  buttonContainer: {
    width: "90%",
    margin: 5,
    borderRadius: 10,
  },
});
