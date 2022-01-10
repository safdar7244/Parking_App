import * as React from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from "react-native";

import { Switch } from "react-native-elements";
import { useState, useContext } from "react";
import TabBottom from "./TabBottom";
import { auth, db } from "../firebase";
import SettingsContext from "../src/context/Setting";
import { data } from "../src/Transaltion/translation";
import AvatarCustom from "./common/AvatarCustom";
export default function AccountNotifications({ navigation }) {
  const { settings, saveSettings } = useContext(SettingsContext);
  const [profileUrl, setProfileUrl] = useState(false);
  const [Notification, setNotification] = useState(null);
  const [username, setUsername] = useState("User");
  const [loading, setLoading] = useState(false);

  async function getDbValues() {
    const userInfo = db.collection("users").doc(auth.currentUser.uid);
    const doc = await userInfo.get();
    if (!doc.exists) {
      console.log("No such document!");
    } else {
      if (doc.data().PushNotification) {
        setNotification(doc.data().PushNotification);
      }
    }
  }
  React.useEffect(() => {
    const user = auth.currentUser.providerData[0]["displayName"];
    setUsername(user);
    setProfileUrl(auth.currentUser.providerData[0]["photoURL"]);
    getDbValues();
  }, []);
  React.useEffect(() => {
    if (Notification != null)
      db.collection("users")
        .doc(auth.currentUser.uid)
        .update({
          PushNotification: Notification,
        })
        .then(function () {
          console.log("BACK THEN");
          setLoading(false);
        })
        .catch((e) => {
          console.log("Error");
        });
  }, [Notification]);
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
        <View
          style={{
            flexDirection: "row",
            padding: 40,
            backgroundColor: "white",
            marginTop: 40,
            borderRadius: 25,
          }}
        >
          <Text style={{ paddingTop: 15 }}>
            {" "}
            {data["Notifications"][settings]}{" "}
          </Text>
          <Switch
            value={Notification}
            style={{ marginLeft: "auto", paddingRight: 60 }}
            color="#00DB8C"
            disabled={loading}
            onChange={() => {
              setLoading(true);
              setNotification(!Notification);
            }}
          />
          {loading && (
            <View style={{ paddingTop: 15, paddingLeft: 15 }}>
              <ActivityIndicator size="small" color="#0000ff" />
            </View>
          )}
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
  tab: {
    display: "flex",
    width: "80%",
    backgroundColor: "white",
    color: "black",
    zIndex: 3,
  },
  vagayStyle: {
    fontWeight: "bold",
    padding: 15,
    fontSize: 15,
  },
  ListStyle: {
    marginTop: "10%",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  innerContainer2: {
    backgroundColor: "white",
    width: "80%",
    marginTop: "10%",
  },
  innerContainer: {
    alignItems: "center",
    marginTop: "-15%",
  },

  image: {
    minHeight: 120,
  },
  UserName: {
    fontFamily: "sans-serif",
    fontSize: 20,
    fontWeight: "bold",
  },
  tileCont: {
    backgroundColor: "white",

    width: "100%",
  },
  button: {
    backgroundColor: "#4267B2",
    borderRadius: 5,
    padding: 8,
  },
  button2: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 8,
  },
  buttonContainer: {
    width: "90%",
    borderRadius: 10,
  },
  tileButton: {
    color: "#5EA0EE",
    fontSize: 10,
  },
  headingStyle: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    padding: 20,
  },
});
