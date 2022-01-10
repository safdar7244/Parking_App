import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { data } from "../src/Transaltion/translation";
import SettingsContext from "../src/context/Setting";
import { useContext } from "react";

function Banned() {
  const { settings, saveSettings } = useContext(SettingsContext);

  return (
    <View style={styles.container}>
      <Text>{data["Banned"][settings]}</Text>
    </View>
  );
}

export default Banned;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
