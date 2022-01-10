import * as React from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  Alert,
} from "react-native";
import { Button, Avatar } from "react-native-elements";

export default function ButtonMain(props) {
  return (
    <Button
      raised={true}
      disabled={props.loading ? props.loading : false}
      containerStyle={styles.buttonContainer}
      buttonStyle={styles.button}
      title={props.title}
      onPress={props.function}
    >
      {" "}
    </Button>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#5EA0EE",
    borderRadius: 10,
    padding: 13,
  },
  buttonContainer: {
    width: "90%",
    margin: 5,
    borderRadius: 10,
  },
});
