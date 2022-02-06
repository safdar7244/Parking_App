import * as React from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  Alert,
} from "react-native";
import { Avatar } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { Input, Switch, Divider, Overlay } from "react-native-elements";
import { useState } from "react";
import SingleOptions from "./SingleOption";

export default function ScheduleCalls(props, { navigation }) {
  console.log("Schefule calls: ", props);
  return (
    <>
      <SingleOptions
        option={props.option1}
        param={props.param1}
        function={props.function1}
        schedule={props.schedule}
        setSchedule={props.setSchedule}
        translation={props.translation1}
      />
      <SingleOptions
        option={props.option2}
        param={props.param2}
        function={props.function2}
        schedule={props.schedule}
        setSchedule={props.setSchedule}
        translation={props.translation2}
      />
      <SingleOptions
        option={props.option3}
        param={props.param3}
        function={props.function3}
        schedule={props.schedule}
        setSchedule={props.setSchedule}
        translation={props.translation3}
      />
      <SingleOptions
        option={props.option4}
        param={props.param4}
        function={props.function4}
        schedule={props.schedule}
        setSchedule={props.setSchedule}
        translation={props.translation3}
      />
      <SingleOptions
        option={props.option5}
        param={props.param5}
        function={props.function5}
        schedule={props.schedule}
        setSchedule={props.setSchedule}
        translation={props.translation4}
      />
      <SingleOptions
        option={props.option6}
        param={props.param6}
        function={props.function6}
        schedule={props.schedule}
        setSchedule={props.setSchedule}
        translation={props.translation5}
      />
      <SingleOptions
        option={props.option7}
        param={props.param7}
        function={props.function7}
        schedule={props.schedule}
        setSchedule={props.setSchedule}
        translation={props.translation6}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tab: {
    //   position:"absolute",
    //   bottom:0,
    display: "flex",
    width: "80%",
    backgroundColor: "white",
    color: "black",
    zIndex: 3,
  },
  vagayStyle: {
    fontWeight: "bold",
    padding: 15,
    fontSize: 15,
  },
  ListStyle: {
    marginTop: "10%",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  innerContainer2: {
    backgroundColor: "white",
    width: "80%",
    marginTop: "10%",
  },
  innerContainer: {
    justifyContent: "center",
    alignItems: "center",
    // backgroundColo r:"red",
    marginTop: "-60%",
  },

  image: {
    flex: 1,
    justifyContent: "center",
    height: "20%",
  },
  UserName: {
    fontFamily: "sans-serif",
    fontSize: 20,
    fontWeight: "bold",
    //   marginBottom:40,
    // marginTop:40
  },
  tileCont: {
    backgroundColor: "white",

    width: "100%",
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
  tileButton: {
    color: "#5EA0EE",
    fontSize: 10,
  },
  headingStyle: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    padding: 20,
  },
});
