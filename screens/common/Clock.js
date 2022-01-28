import React, { useState } from "react";
import {
  View,
  Button,
  Platform,
  Text,
  StyleSheet,
  TextInput,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

export const Clock = (props) => {
  // console.log("Clock PropsL: ", props);
  const [date, setDate] = useState(new Date(1598051730000));
  const [startDate, setStartDate] = useState(new Date(1598051730000));
  const [endDate, setEndDate] = useState(new Date(1598051730000));

  const [mode, setMode] = useState("date");
  const [showStart, setShowStart] = useState(false);
  const [showEnd, setShowEnd] = useState(false);

  const onChangeStart = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShowStart(Platform.OS === "ios");
    const hrs = currentDate.getHours();
    const mins = currentDate.getMinutes();
    setStartDate(hrs.toString() + ":" + mins);

    // if (hrs == 0) {
    //   setStartDate((hrs + 12).toString() + ":" + mins + " AM");
    // } else if (hrs == 12) {
    //   setStartDate(hrs.toString() + ":" + mins + " PM");
    // } else if (hrs < 12) {
    //   setStartDate(hrs.toString() + ":" + mins + " AM");
    // } else {
    //   //if 22 then 22-12 = 10pm
    //   setStartDate((hrs - 12).toString() + ":" + mins + " PM");
    // }

    // const d = new Date(currentDate);
    // console.log("PROPS OPTION", props.schedule);
    try {
      props.setSchedule({
        ...props.schedule,
        [props.option]: {
          ...props.schedule[props.option],
          flag: true,
          start: hrs + ":" + mins,
        },
      });
      // console.log(
      //   // "DATE: - > ",
      //   // currentDate.getHours(),
      //   // "  /    ",
      //   // currentDate.getMinutes()
      //   "scdedule:::",
      //   props.schedule
      // );
    } catch (e) {
      console.log("error", e);
    }
  };

  const onChangeEnd = (event, selectedDate) => {
    const currentDate = selectedDate || endDate;
    setShowEnd(Platform.OS === "ios");
    const hrs = currentDate.getHours();
    const mins = currentDate.getMinutes();
    setEndDate(hrs.toString() + ":" + mins);
    props.setSchedule({
      ...props.schedule,
      [props.option]: {
        ...props.schedule[props.option],
        flag: true,
        end: hrs + ":" + mins,
      },
    });
    // if (hrs == 0) {
    //   setEndDate((hrs + 12).toString() + ":" + mins + " AM");
    // } else if (hrs == 12) {
    //   setEndDate(hrs.toString() + ":" + mins + " PM");
    // } else if (hrs < 12) {
    //   setEndDate(hrs.toString() + ":" + mins + " AM");
    // } else {
    //   //if 22 then 22-12 = 10pm
    //   setEndDate((hrs - 12).toString() + ":" + mins + " PM");
    // }

    // setEndDate(
    //   currentDate.getHours().toString() + ":" + currentDate.getMinutes()
    // );

    // const d = new Date(currentDate);

    // console.log(
    //   "DATE: - > ",
    //   currentDate.getHours(),
    //   "  /    ",
    //   currentDate.getMinutes()
    //   // "dd,",
    //   // new Date().getDay()
    // );
  };

  const showModeStart = (currentMode) => {
    setShowStart(true);
    setMode(currentMode);
  };
  const showModeEnd = (currentMode) => {
    setShowEnd(true);
    setMode(currentMode);
  };

  //   const showDatepicker = () => {
  //     showMode("date");
  //   };

  const showTimepickerStart = () => {
    showModeStart("time");
  };

  const showTimepickerEnd = () => {
    showModeEnd("time");
  };
  return (
    // <View>
    //       <View>

    <View style={styles.innercontainer2}>
      <View style={styles.row}>
        {/* <Text style={styles.labelText}>Address</Text> */}
        <TextInput
          style={styles.formFieldText}
          value={startDate}
          //   onChangeText={(start) => setStartDate(start)}
          defaultValue={props.schedule[props.option].start.toString()}
          placeholder={props.schedule[props.option].start.toString()}
          editable={false}
        />
        <TextInput
          style={styles.formFieldTextRight}
          //   onChangeText={(end) => setEndDate(end)}
          value={endDate}
          defaultValue={props.schedule[props.option].end.toString()}
          placeholder={props.schedule[props.option].end.toString()}
          editable={false}
        />
      </View>
      <View style={styles.row}>
        <View style={styles.ButtonStart}>
          <Button
            // containerStyle={{ paddi }}
            onPress={showTimepickerStart}
            title="Start"
          />
        </View>
        <View style={styles.ButtonEnd}>
          <Button
            buttonStyle={{ backgroundColor: "red", padding: 40 }}
            //   containerStyle={styles.buttonContainer}

            onPress={showTimepickerEnd}
            title="End"
          />
        </View>
      </View>
      {showStart && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChangeStart}
        />
      )}
      {showEnd && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChangeEnd}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  innercontainer2: {
    backgroundColor: "white",
    width: "75%",
    // padding: 40,
    // marginBottom: 100,
    // borderRadius: 15,
  },
  row: {
    flexDirection: "row",
  },
  formFieldText: {
    width: "50%",
    fontSize: 12,
    borderRadius: 7,
    borderWidth: 0.5,
    padding: 5,
    marginBottom: 20,
    backgroundColor: "#f2f2f2",
    marginLeft: "2%",
    // marginLeft:20
  },
  ButtonStart: {
    width: "50%",
    fontSize: 12,
    // borderRadius: 7,
    // borderWidth: 0.5,
    // padding: 5,
    marginBottom: 20,
    // backgroundColor: "#f2f2f2",
    // marginLeft:20
  },
  ButtonEnd: {
    width: "50%",
    fontSize: 12,
    // borderRadius: 7,
    // borderWidth: 0.5,
    // padding: 5,
    marginBottom: 20,
    // backgroundColor: "#eeeeee",
    marginLeft: 20,
  },
  formFieldTextRight: {
    width: "50%",
    fontSize: 12,
    borderRadius: 7,
    borderWidth: 0.5,
    padding: 5,
    marginBottom: 20,
    backgroundColor: "#eeeeee",
    marginLeft: 20,
  },
});
