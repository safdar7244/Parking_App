import * as React from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Text,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Input, Switch, Divider, Overlay } from "react-native-elements";
import { useState, useContext } from "react";
import TabBottom from "./TabBottom";
import { auth, db } from "../firebase";
import SettingsContext from "../src/context/Setting";
import { data } from "../src/Transaltion/translation";
import AvatarCustom from "./common/AvatarCustom";
export default function AccountLatePayment({ navigation }) {
  const { settings, saveSettings } = useContext(SettingsContext);

  const [latePayment, setLatePayment] = useState(null);
  const [profileUrl, setProfileUrl] = useState(false);
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState("User");
  async function getDbValues() {
    const userInfo = db.collection("users").doc(auth.currentUser.uid);
    const doc = await userInfo.get();
    if (!doc.exists) {
      console.log("No such document!");
    } else {
      if (doc.data().latePayment) {
        // history = doc.data().history;

        setLatePayment(doc.data().latePayment);
      }
    }
  }
  React.useEffect(() => {
    const user = auth.currentUser.providerData[0]["displayName"];
    setUsername(user);
    setProfileUrl(auth.currentUser.providerData[0]["photoURL"]);
    getDbValues();

    // console.log("CURRENT : ",user)
  }, []);

  React.useEffect(() => {
    if (latePayment != null)
      db.collection("users")
        .doc(auth.currentUser.uid)
        .update({
          latePayment: latePayment,
        })
        .then(function () {
          console.log("BACK THEN");
          setLoading(false);
        })
        .catch((e) => {
          console.log("Error");
        });
  }, [latePayment]);

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
            {data["Late_Payment"][settings]}{" "}
          </Text>
          <Switch
            value={latePayment}
            style={{ marginLeft: "auto", paddingRight: 60 }}
            color="#00DB8C"
            disabled={loading}
            onChange={() => {
              setLoading(true);

              setLatePayment(!latePayment);
            }}
          />
          {loading && (
            <View style={{ paddingTop: 15, paddingLeft: 15 }}>
              <ActivityIndicator size="small" color="#0000ff" />
            </View>
          )}
        </View>
        {/* </Overlay> */}
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
    //   position:"absolute",
    //   bottom:0,
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
    // justifyContent:"center",
    alignItems: "center",
    //    backgroundColor:"blue",
    marginTop: "-15%",
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
