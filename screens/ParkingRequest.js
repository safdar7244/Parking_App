import React, { useState, useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, Overlay } from "react-native-elements";
import { data } from "../src/Transaltion/translation";
import SettingsContext from "../src/context/Setting";
function ParkingRequest(props) {
  //console.log("props", props);
  const { settings, saveSettings } = useContext(SettingsContext);

  return (
    <View style={styles.container}>
      <Overlay overlayStyle={{ padding: 40 }} isVisible={props.visible}>
        <Text style={{ textAlign: "center", padding: 10 }}>
          {data["parkingRequest"][settings]} {"\n"}
          {props.userName ? "From" + props.userName : ""}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            buttonStyle={styles.button1}
            onPress={() => {
              //console.log("customer: ",props.customer,"bookedspace: ",props.bookedspace)
              props.accept(props.customer, props.bookedSpace);
            }}
            title="Accept"
          />
          <Button
            buttonStyle={styles.button2}
            onPress={() => {
              props.reject(props.bookedSpace);
            }}
            title="Reject"
          />
        </View>
      </Overlay>
    </View>
  );
}

export default ParkingRequest;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  button1: {
    padding: 10,
    margin: 10,
  },
  button2: {
    padding: 10,
    margin: 10,
    color: "red",
    backgroundColor: "red",
  },
});
