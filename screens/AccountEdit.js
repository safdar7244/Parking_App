import * as React from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  SafeAreaView,
  TextInput,
  Text,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Avatar } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { Input, Overlay, Divider } from "react-native-elements";
import ButtonMain from "./common/button";
import { useState, useContext } from "react";
import { TabView, ListItem, Tab, Button } from "react-native-elements";
import { formData } from "./FormsData/formData";
import TabBottom from "./TabBottom";
import AvatarCustom from "./common/AvatarCustom";
import { Formik } from "formik";
import { auth, db } from "../firebase";
import SettingsContext from "../src/context/Setting";
import { data } from "../src/Transaltion/translation";
import UploadImage from "./common/UploadImage";
import * as firebase from "firebase";
import { set } from "react-native-reanimated";
import AccountImage from "./common/AccountImage";
export default function AccountEdit({ navigation }) {
  const { settings, saveSettings } = useContext(SettingsContext);
  const [imageUri, setImageUri] = useState(null);

  // console.log("setthings :  ",settings)

  const [username, setUsername] = useState("User");
  const [email, setEmail] = useState("User");
  const [photoUrl, setPhotoUrl] = useState(null);
  const [flag, setFlag] = useState(false);
  const [forgetPassowrdflag, setForgetPassowrdflag] = useState(false);
  const [password, setPassword] = useState(false);
  // const [password, setPassword_] = useState(false);

  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (flag) {
      if (imageUri) {
        // console.log("max: ", imageUri);
        uploadImageAsync(imageUri);
      }
    }
  }, [flag]);

  React.useEffect(() => {
    // if(photoUrl=="1"){

    // }
    // else{
    console.log("YES LENGTH > 0", photoUrl);

    if (photoUrl) {
      console.log("000-> ", photoUrl);
      if (photoUrl == "2") {
        console.log("000pp-> ", photoUrl);
        setFlag(true);
      }

      setFlag(true);
    }

    // }
  }, [photoUrl]);

  React.useEffect(() => {
    console.log("auth : ", auth.currentUser.providerData);
    const user = auth.currentUser.providerData[0]["displayName"];
    setUsername(user);
    setEmail(auth.currentUser.providerData[0]["email"]);
    setPhotoUrl(
      auth.currentUser.providerData[0]["photoURL"]
        ? auth.currentUser.providerData[0]["photoURL"]
        : "2"
    );

    // if(auth.currentUser.providerData[0]["photoURL"].length<3 ){
    //   setPhotoUrl("1")
    // }
    // else  if(auth.currentUser.providerData[0]["photoURL"].length>3 )
    // {
    //   setPhotoUrl(auth.currentUser.providerData[0]["photoURL"])

    // }
    // setPhotoUrl(auth.currentUser.providerData[0]["photoURL"].length==0 ?auth.currentUser.providerData[0]["photoURL"] :"1" )
    // console.log("CURRENT : ",auth.currentUser.providerData[0]["email"])
  }, []);

  async function uploadImageAsync(uri) {
    // console.log("uploadAsFile", uri);
    const response = await fetch(uri);
    const blob = await response.blob();

    var metadata = {
      contentType: "image/jpeg",
    };

    let ref = firebase.storage().ref().child(new Date().toISOString());

    let uploadTask = ref.put(blob);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log("Upload is paused");
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        console.log(error);
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log("File available at", downloadURL);
          auth.onAuthStateChanged((authUser) => {
            if (authUser) {
              console.log(authUser);
              // obj.imageUrl = downloadURL;
              db.collection("users")
                .doc(auth.currentUser.uid)
                .update({
                  profileImage: downloadURL,
                })
                .then(function () {
                  console.log("Profile pic set");
                  auth.currentUser
                    .updateProfile({
                      photoURL: downloadURL,
                    })
                    .then(() => {
                      setPhotoUrl(auth.currentUser.providerData[0]["photoURL"]);
                      setLoading(false);

                      Alert.alert("Success !", "Changed successfully  ", [
                        {
                          text: "OK",
                          onPress: () => {
                            navigation.navigate("Maps");

                            setTimeout(() => {
                              navigation.navigate("Account");
                            }, 500);
                          },
                        },
                      ]);
                    });
                });
            }
          });
        });
      }
    );
  }

  function updateDbname(val) {
    db.collection("users")
      .doc(auth.currentUser.uid)
      .update({
        name: val,
      })
      .then(function () {
        //  console.log("English set")
      });
  }
  return (
    // <View style={styles.container}>

    <View style={styles.container}>
      <ImageBackground
        source={require("../pictures/bkg-user.jpeg")}
        resizeMode="cover"
        style={styles.image}
      />

      <View style={styles.innerContainer}>
        {/* <AvatarCustom /> */}

        {flag && (
          <AccountImage
            imageUri={imageUri}
            setImageUri={setImageUri}
            photoUrl={photoUrl}
          />
        )}
        <Text style={styles.UserName}>{username}</Text>
      </View>

      <Formik
        initialValues={{ _username: "" }}
        onSubmit={async (values) => {
          setLoading(true);

          console.log("submtted", values._username);
          if (imageUri) {
            // console.log("max: ", imageUri);
            uploadImageAsync(imageUri);
          }
          //  auth.currentUser.providerData[0]["displayName"]=values._username
          if (values._username.length < 1) {
            auth.currentUser.updateProfile({
              displayName: username,
            });
            updateDbname(username);
            setUsername(username);
          } else {
            auth.currentUser.updateProfile({
              displayName: values._username,
            });
            updateDbname(values._username);
            setUsername(values._username);
          }
        }}
      >
        {({ handleChange, handleSubmit, values }) => (
          <View style={styles.innercontainer}>
            <View style={styles.innercontainer2}>
              <View style={styles.row}>
                <Text style={styles.labelText}>{data["User"][settings]}</Text>
                <TextInput
                  style={styles.formFieldText}
                  value={values._username}
                  placeholder={username}
                  onChangeText={handleChange("_username")}
                />
              </View>
              <View style={styles.row}>
                <Text style={styles.labelText}>{data["Email"][settings]}</Text>
                <TextInput
                  style={styles.formFieldText}
                  value={email}
                  onChangeText={handleChange("email")}
                  editable={false}
                  // secureTextEntry={true}
                />
              </View>
              <Button
                disabled={loading}
                onPress={handleSubmit}
                title={data["Submit"][settings]}
              />
              {loading && (
                <View style={{ padding: 20 }}>
                  <ActivityIndicator size="large" color="#0000ff" />
                </View>
              )}
            </View>
          </View>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
  innercontainer: {
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
    // borderRadius: 25,
    // backgroundColor: "red",
  },
  innercontainer2: {
    backgroundColor: "white",
    width: "80%",
    padding: 40,
    borderRadius: 25,
    // backgroundColor: "red",
  },
  inputWrap: {
    flex: 1,
    borderColor: "#cccccc",
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  container: {
    flex: 1,
  },
  header: {
    // fontSize: 20,
    // paddingTop: 30
  },
  formText: {
    // fontSize: 20,
    // padding: 10,
    // paddingLeft: 0
  },
  innerContainer: {
    // justifyContent:"center",
    alignItems: "center",
    //    backgroundColor:"blue",
    marginTop: "-15%",
  },
  innerContainer2: {
    marginTop: 20,
    // borderRadius:15,
    backgroundColor: "white",
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    height: 250,
  },
  formFieldText: {
    width: 150,
    fontSize: 12,
    borderRadius: 7,
    borderWidth: 1,
    padding: 5,
    marginBottom: 20,
    backgroundColor: "#eeeeee",
    marginLeft: 20,
  },
  labelText: {
    fontSize: 12,

    // marginBottom: 10,
    paddingLeft: 10,
    marginLeft: -20,
    paddingTop: 10,
    width: "40%",
  },
  image: {
    minHeight: 120,
  },
  UserName: {
    fontFamily: "sans-serif",
    fontSize: 20,
    fontWeight: "bold",
    //   marginBottom:40,
    // marginTop:40
  },
});
