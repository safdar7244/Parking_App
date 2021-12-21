import React from "react";
import { View, Text, StyleSheet } from "react-native";

function Banned() {
  return (
    <View style={styles.container}>
      <Text>Congratulations! You have been banned.</Text>
    </View>
  );
}

export default Banned;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
