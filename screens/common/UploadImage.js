import React, { useState, useEffect } from 'react';
import { Image, View, Platform, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
// import {storage} from "../../firebase.js"
import uuid from "react-native-uuid";
import * as firebase from "firebase" 
// const firebaseConfig = {
//   apiKey: "AIzaSyAsp-zjL1XiddCr7HwEm33N5sPsDbRjvlo",
//   authDomain: "new-parking-app-ecfa0.firebaseapp.com",
//   projectId: "new-parking-app-ecfa0",
//   storageBucket: "new-parking-app-ecfa0.appspot.com",
//   messagingSenderId: "1049891039964",
//   appId: "1:1049891039964:web:d06f1fd2024ca7023ca219",
//   measurementId: "G-RDFXJ31JDY"
// };
// firebase.initializeApp(firebaseConfig);
import axios from "axios"

export default function UploadImage(props) {
    // console.log("propjjjjj , ", props)
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const addImage = async () => {
    let _image = await ImagePicker.launchImageLibraryAsync();

    console.log("IMAGE DETAILS : ",_image);

    if (!_image.cancelled) 
    {
      setImage(_image.uri);
// const response=await fetch(_image.uri)
// const blob=await response.blob()
// // console.log("bb: ",blob)
//       firebase.storage().ref().child("images/"+"noga").put(blob).then(()=>{console.log("SUCCCCDESSS N MN ")})
uploadImageAsync(_image.uri).then(()=>{
        console.log("SUCCESS")

      })
      
      .catch((e)=>{
        console.log("NO SUCCESS: ",e)
      })

    }

  };

  async function _handleImagePicked (uri)
  {
    // console.log("res")
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;

    const task = storage()
    .ref(filename)
    .putFile(uploadUri)

    .then(()=>{})
    .catch((e)=>console.log("error: ",e))


//     try{
//       const response= await axios.get("/data/user/0/host.exp.exponent/cache/ExperienceData/%2540khizar50%252FMapsProject/ImagePicker/87ab8d95-ed1e-4b10-b3cd-680f0f216c3d.jpg");
//       console.log(" first ")

//       console.log(response)
//       console.log("second")

//       // console.log("resss22: ",response)
//       console.log("resss",response)
//       const blob =await response.blob();
//       console.log("response1")

//    console.log("blob",blob)
//    console.log("response2")

//    var ref = firebase.storage().ref().child("images/"+uri)
//    const metadata = response.headers;
//    console.log("meta: ",metadata)
//     const ll=await ref.put(blob, metadata)
//  console.log("lll :L ",ll)

//     }
//     catch(e){
//       console.log("err: ",e)
//     }
   
  };

async function uploadImageAsync(uri) {
  console.log("->",uri)
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

  const fileRef = firebase.storage().ref().child(new Date().toISOString())

const snapshot=fileRef.put(uri).then(()=>console.log("put wla then")).catch((e)=>{console.log("put wla error",e)})
  console.log("fikle: ",blob)
  // const storageRef = ref(storage, 'images/' + file.name);
  // const uploadTask = uploadBytesResumable(storageRef, file, metadata);

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