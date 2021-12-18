import React, { useState, useEffect } from "react";
import {
  Image,
  View,
  Platform,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import uuid from "react-native-uuid";
import * as firebase from "firebase";

import axios from "axios";

export default function UploadImage({ setImageUri }, { navigation }) {
  //console.log("propjjjjj , ", props);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const addImage = async () => {
    let _image = await ImagePicker.launchImageLibraryAsync();

    console.log("IMAGE DETAILS : ", _image);

    if (!_image.cancelled) {
      setImage(_image.uri);
      setImageUri(_image.uri);
    }
  };

  async function uploadImageAsync(uri) {
    console.log("->", uri);
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        console.log("vlvolL : ", xhr._response);

        resolve(xhr._response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const fileRef = firebase.storage().ref().child(new Date().toISOString());

    const snapshot = fileRef
      .put(uri)
      .then(() => console.log("put wla then"))
      .catch((e) => {
        console.log("put wla error", e);
      });
    console.log("fikle: ", blob);
  }

  //////////////////////////////////////////////////////////////////////////////////
  return (
    <View
      style={{
        width: 250,
        height: 250,
        elevation: 2,
        backgroundColor: "#efefef",
        position: "relative",
        // borderRadius:999,
        overflow: "hidden",
      }}
    >
      {image && (
        <Image source={{ uri: image }} style={{ width: 250, height: 250 }} />
      )}

      <View style={imageUploaderStyles.uploadBtnContainer}>
        <TouchableOpacity
          onPress={addImage}
          style={imageUploaderStyles.uploadBtn}
        >
          <Text>{image ? "Edit" : "Upload"} Image</Text>
          <AntDesign name="camera" size={20} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const imageUploaderStyles = StyleSheet.create({
  container: {},
  uploadBtnContainer: {
    opacity: 0.7,
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "lightgrey",
    width: "100%",
    height: "25%",
  },
  uploadBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
