import * as React from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  SafeAreaView,
  TextInput,
  Text,
  Alert,
  Dimensions,
  SectionList,
} from "react-native";
import MapView from "react-native-maps";
import {
  TabView,
  Tab,
  Button,
  Overlay,
  Switch,
  Divider,
  SearchBar,
} from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useState, useContext } from "react";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import { data } from "../src/Transaltion/translation";
import SettingsContext from "../src/context/Setting";

export default function City(props) {
  const { settings, saveSettings } = useContext(SettingsContext);
  return (
    <View>
      <GooglePlacesAutocomplete
        placeholder={data["Search"][settings]}
        fetchDetails={true}
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          ////console.log(details.address_components[0].long_name)
          props.setUserLocation({
            latitude: details.geometry.location.lat,
            longitude: details.geometry.location.lng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
          props.setCurrentlocation(details.address_components[0].long_name);
          props.setVisiblesearch(false);
        }}
        query={{
          key: "AIzaSyDSkRh8fA-d_EiajxpIwO8QYEPFA7fm2wA",
          language: "en",
        }}
        styles={{
          container: { flex: 0, width: "100%", zIndex: 10 },
          listView: { backgroundColor: "white" },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  SearchBar: {
    padding: 20,
  },
});
