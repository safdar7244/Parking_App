import React, {useState} from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  SafeAreaView,
  TextInput,
  Text,
  Alert,
} from "react-native";
import MapView from "react-native-maps";
import { Marker } from "react-native-maps";

export default function Location() {
  const [region, setRegion] = useState({
    latitude: 31.476,
    longitude: 74.3045,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const [x, setx] = useState({
    latitude: 37.78823,
    longitude: -122.4024,
  });

  return (
    <View>
      <MapView region={region}>
        {/* <Marker
          draggable
          coordinate={x}
          onDragEnd={(e) => setx(e.nativeEvent.coordinate)}
        /> */}
      </MapView>
    </View>
  );
}
