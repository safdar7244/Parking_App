import * as React from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  Alert,
  Button,
} from "react-native";
import { Avatar } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { Input, Switch, Divider, Overlay } from "react-native-elements";
import { useState, useEffect } from "react";
// import TimePicker from "react-time-picker";
// import DateTimePickerModal from "@react-native-community/datetimepicker";
// import TimePicker from "react-native-simple-time-picker";
import { Clock } from "./Clock";
// import Clock from "react-clock";
export default function SingleOptions(props, { navigation }) {
  //   const [selectedHours, setSelectedHours] = useState(0);
  //   const [selectedMinutes, setSelectedMinutes] = useState(0);

  //   const [value, setValue] = useState(new Date());
  //   useEffect(() => {
  //     const interval = setInterval(() => setValue(new Date()), 1000);

  //     return () => {
  //       clearInterval(interval);
  //     };
  //   }, []);
  return (
    <View style={styles.innerContainer2}>
      <View style={{ flexDirection: "row" }}>
        <Text style={{ padding: 5 }}> {props.option} </Text>
        <Switch
          value={props.param}
          style={{ marginLeft: "auto", marginTop: -10, paddingRight: 10 }}
          color="#00DB8C"
          onChange={() => {
            props.function(!props.param);
          }}
        />
      </View>
      {props.param && (
        <View>
          <Clock
            schedule={props.schedule}
            setSchedule={props.setSchedule}
            option={props.option}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  innerContainer2: {
    backgroundColor: "white",
    width: "80%",
    // marginTop: "10%",
  },
});
