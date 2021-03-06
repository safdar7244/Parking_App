import React, { useState, useEffect, useContext } from "react";
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
import { Avatar } from "react-native-elements";
import { data } from "./../../src/Transaltion/translation";
import SettingsContext from "./../../src/context/Setting";

export default function UploadImage(props) {
  const { settings, saveSettings } = useContext(SettingsContext);
  console.log("\n\n\n\n\n\n\n\nurl now , ", props);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (props.photoUrl)
      if (props.photoUrl.length > 3) {
        setImage(props.photoUrl);
      }
  }, []);
  // if(props.photoUrl){
  //   console.log("KOOKOKO")
  //   setImage(props.photoUrl)
  // }

  // if(props.photoUrl)
  //   {if(props.photoUrl.length>3){
  //     setImage(props.photoUrl)
  //   }}
  // useEffect(()=>{
  //   if(props.photoUrl)
  //  if(props.photoUrl.length>3){
  //     setImage(props.imageUri)
  //   }
  // },[])
  const addImage = async () => {
    let _image = await ImagePicker.launchImageLibraryAsync();

    console.log("IMAGE DETAILS : ", _image);

    if (!_image.cancelled) {
      props.setImageSetFlag(true);
      setImage(_image.uri);
      props.setImageUri(_image.uri);
    }
  };

  // async function uploadImageAsync(uri) {
  //   console.log("->", uri);
  //   const blob = await new Promise((resolve, reject) => {
  //     const xhr = new XMLHttpRequest();
  //     xhr.onload = function () {
  //       console.log("vlvolL : ", xhr._response);

  //       resolve(xhr._response);
  //     };
  //     xhr.onerror = function (e) {
  //       console.log(e);
  //       reject(new TypeError("Network request failed"));
  //     };
  //     xhr.responseType = "blob";
  //     xhr.open("GET", uri, true);
  //     xhr.send(null);
  //   });

  //   const fileRef = firebase.storage().ref().child(new Date().toISOString());

  //   const snapshot = fileRef
  //     .put(uri)
  //     .then(() => console.log("put wla then"))
  //     .catch((e) => {
  //       console.log("put wla error", e);
  //     });
  //   console.log("fikle: ", blob);
  // }

  //////////////////////////////////////////////////////////////////////////////////
  return (
    <View style={{}}>
      <Avatar
        size={90}
        //  rounded
        source={{
          uri: image,
        }}
        containerStyle={props.newStyle}
      >
        {/* <Avatar.Accessory size={23} 
         onPress={() => {
        {addImage()}
        }}

         /> */}
      </Avatar>

      <View style={imageUploaderStyles.uploadBtnContainer}>
        <TouchableOpacity
          onPress={addImage}
          style={imageUploaderStyles.uploadBtn}
        >
          <Text>{image ? "Edit" : data["uploadImage"][settings]} Image</Text>
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
    width: "70%",
    height: "25%",
  },
  uploadBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});
