import React, { useState, useEffect } from 'react';
import { Image, View, Platform, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import {storage} from "../../firebase.js"
import uuid from "react-native-uuid";

export default function UploadImage(props) {
    // console.log("propjjjjj , ", props)
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const addImage = async () => {
    let _image = await ImagePicker.launchImageLibraryAsync();

    console.log(_image.uri);

    if (!_image.cancelled) 
    {
      setImage(_image.uri);
      _handleImagePicked(_image.uri).then(()=>{
        console.log("SUCCESS")
      })
      
      .catch(()=>{
        console.log("NO SUCCESS")
      })

    }

  };

  async function _handleImagePicked (uri)
  {
    console.log("res")
  //  const response = await fetch(uri);
  //  console.log("res",response)
   const blob = uri.blob();
   console.log("blob",blob)
   var ref = storage.ref().child("images/"+uri)
   const metadata = response.headers;
    await ref.put(blob, metadata)
   return res
  };

async function uploadImageAsync(uri) {
  // console.log(uri)
  // Why are we using XMLHttpRequest? See:
  // https://github.com/expo/expo/issues/2402#issuecomment-443726662
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      console.log("vlvolL : ",xhr._response)

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

  const fileRef = storage.ref(uuid.v4());
  console.log("fikle: ",fileRef)
  const storageRef = ref(storage, 'images/' + file.name);
  const uploadTask = uploadBytesResumable(storageRef, file, metadata);

  // We're done with the blob, close and release it
  // blob.close();

  // return await storage.getDownloadURL(fileRef);
}





  //////////////////////////////////////////////////////////////////////////////////
  return (
            <View style={{
                width:250,
                height:250,
                elevation:2,
    backgroundColor:'#efefef',
    position:'relative',
    // borderRadius:999,
    overflow:'hidden',}

            }>
                {
                    image  && <Image source={{ uri: image }} style={{ width: 250, height: 250 }} />
                }
                    
                    <View style={imageUploaderStyles.uploadBtnContainer}>
                        <TouchableOpacity onPress={addImage} style={imageUploaderStyles.uploadBtn} >
                            <Text>{image ? 'Edit' : 'Upload'} Image</Text>
                            <AntDesign name="camera" size={20} color="black" />
                        </TouchableOpacity>
                    </View>
              

            </View>
   
  );
}

const imageUploaderStyles=StyleSheet.create({
   container:{
    
   },
    uploadBtnContainer:{
        opacity:0.7,
        position:'absolute',
        right:0,
        bottom:0,
        backgroundColor:'lightgrey',
        width:'100%',
        height:'25%',
    },
    uploadBtn:{
        display:'flex',
        alignItems:"center",
        justifyContent:'center'
    }
})