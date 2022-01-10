import * as React from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  TextInput,
  Text,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState, useContext } from "react";
import { Tab, Button } from "react-native-elements";
import { Formik } from "formik";
import { auth, db } from "../firebase";
import SettingsContext from "../src/context/Setting";
import { data } from "../src/Transaltion/translation";
import * as firebase from "firebase";
import AccountImage from "./common/AccountImage";
export default function AccountEdit({ navigation }) {
  const { settings, saveSettings } = useContext(SettingsContext);
  const [imageUri, setImageUri] = useState(null);
  const [username, setUsername] = useState(null);
  const [email, setEmail] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [flag, setFlag] = useState(false);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (flag) {
      if (imageUri) {
        uploadImageAsync(imageUri);
      }
    }
  }, [flag]);

  React.useEffect(() => {
    if (photoUrl) {
      if (photoUrl == "2") {
        setFlag(true);
      }
      setFlag(true);
    }
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
  }, []);

  async function uploadImageAsync(uri) {
    const response = await fetch(uri);
    const blob = await response.blob();
    let ref = firebase.storage().ref().child(new Date().toISOString());
    let uploadTask = ref.put(blob);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            break;
        }
      },
      (error) => {
        console.log(error);
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          // console.log("File available at", downloadURL);
          auth.onAuthStateChanged((authUser) => {
            if (authUser) {
              console.log(authUser);
              db.collection("users")
                .doc(auth.currentUser.uid)
                .update({
                  profileImage: downloadURL,
                })
                .then(function () {
                  auth.currentUser
                    .updateProfile({
                      photoURL: downloadURL,
                    })
                    .then(() => {
                      setPhotoUrl(auth.currentUser.providerData[0]["photoURL"]);
                      setLoading(false);

                      Alert.alert(
                        data["Success"][settings] + "!",
                        data["Changed_Successfully"][settings],
                        [
                          {
                            text: data["OK"][settings],
                            onPress: () => {
                              navigation.navigate("Maps");

                              setTimeout(() => {
                                navigation.navigate("Account");
                              }, 500);
                            },
                          },
                        ]
                      );
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
      .then(function () {});
  }
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../pictures/bkg-user.jpeg")}
        resizeMode="cover"
        style={styles.image}
      />

      <View style={styles.innerContainer}>
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

          // console.log("submtted", values._username);
          if (imageUri) {
            uploadImageAsync(imageUri);
          }
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
                  multiline={true}
                  numberOfLines={3}
                  editable={false}
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
  },
  innercontainer2: {
    backgroundColor: "white",
    width: "80%",
    padding: 40,
    borderRadius: 25,
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
  header: {},
  formText: {},
  innerContainer: {
    alignItems: "center",
    marginTop: "-15%",
  },
  innerContainer2: {
    marginTop: 20,
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
  },
});
