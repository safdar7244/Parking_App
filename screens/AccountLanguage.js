import * as React from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Picker,
  SafeAreaView,
  Text,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState, useContext } from "react";
import TabBottom from "./TabBottom";
import { auth, db } from "../firebase";
import SettingsContext from "../src/context/Setting";
import { data } from "../src/Transaltion/translation";

import AvatarCustom from "./common/AvatarCustom";
export default function AccountLanguage({ navigation }) {
  const [username, setUsername] = useState("User");
  const { settings, saveSettings } = useContext(SettingsContext);
  const [profileUrl, setProfileUrl] = useState(false);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (settings == 0) {
      console.log("setting is 0");
      setSelectedValue("eng");
    } else if (settings == 1) {
      console.log("setting is 1");

      setSelectedValue("hang");
    }
    const user = auth.currentUser.providerData[0]["displayName"];
    setUsername(user);
    setProfileUrl(auth.currentUser.providerData[0]["photoURL"]);
  }, []);

  React.useEffect(() => {
    if (selectedValue == "eng") {
      db.collection("users")
        .doc(auth.currentUser.uid)
        .update({
          language: "English",
        })
        .then(function () {
          console.log("English set");
          setTimeout(() => {
            setLoading(false);
            saveSettings(0);
          }, 0);
        });
    }

    if (selectedValue == "hang") {
      db.collection("users")
        .doc(auth.currentUser.uid)
        .update({
          language: "Hungary",
        })
        .then(function () {
          console.log("Hungary set");
          setTimeout(() => {
            setLoading(false);

            saveSettings(1);
          }, 0);
        });
    }
  }, selectedValue);
  const [selectedValue, setSelectedValue] = useState("");

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../pictures/bkg-user.jpeg")}
        resizeMode="cover"
        style={styles.image}
      />

      <View style={styles.innerContainer}>
        <AvatarCustom url={profileUrl} />

        <Text style={styles.UserName}>{username}</Text>
        <View style={styles.innerContainer2}>
          <View style={styles.row}>
            <Text style={styles.labelText}>{data["Language"][settings]}</Text>

            <Picker
              selectedValue={selectedValue}
              style={{
                height: 50,
                width: 130,
                marginLeft: "20%",
                fontSize: 12,
              }}
              onValueChange={(itemValue, itemIndex) => {
                setLoading(true);

                setSelectedValue(itemValue);
              }}
            >
              <Picker.Item label="English" value="eng" />
              <Picker.Item label="Hungary" value="hang" />
            </Picker>
            {loading && (
              <View style={{ paddingTop: 15, paddingLeft: 15 }}>
                <ActivityIndicator size="small" color="#0000ff" />
              </View>
            )}
          </View>
        </View>
      </View>

      <TabBottom navigate={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
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
  labelText: {
    fontSize: 14,

    // marginBottom: 10,
    paddingLeft: 10,
    // marginLeft:-20,
    paddingTop: 15,
  },
  innerContainer2: {
    // marginBottom:"20%",
    // borderRadius:15,
    backgroundColor: "white",
    width: "80%",
    marginTop: "10%",
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    borderRadius: 25,
    // backgroundColor: "red",
  },
  innerContainer: {
    // justifyContent:"center",
    alignItems: "center",
    //    backgroundColor:"blue",
    marginTop: "-15%",
  },
});
