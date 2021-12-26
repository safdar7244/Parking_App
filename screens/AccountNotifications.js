import * as React from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Avatar } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { Input, Switch, Divider, Overlay } from "react-native-elements";
import ButtonMain from "./common/button";
import { useState, useContext } from "react";
import { TabView, ListItem, Tab, Button } from "react-native-elements";
import Maps from "./Maps";
import AccountEdit from "./AccountEdit";
import TabBottom from "./TabBottom";
import Options from "./common/Options";
import { auth, db } from "../firebase";
import SettingsContext from "../src/context/Setting";
import { data } from "../src/Transaltion/translation";
import AvatarCustom from "./common/AvatarCustom";
export default function AccountNotifications({ navigation }) {
  const { settings, saveSettings } = useContext(SettingsContext);
  const [profileUrl, setProfileUrl] = useState(false);
  const [Notification, setNotification] = useState(null);
  const [Payment, setPayment] = useState("");
  const [newParking, setNewParking] = useState("");
  const [username, setUsername] = useState("User");
  const [loading, setLoading] = useState(false);

  async function getDbValues() {
    const userInfo = db.collection("users").doc(auth.currentUser.uid);
    const doc = await userInfo.get();
    if (!doc.exists) {
      console.log("No such document!");
    } else {
      if (doc.data().PushNotification) {
        // history = doc.data().history;
        setNotification(doc.data().PushNotification);
      }
    }
  }
  React.useEffect(() => {
    const user = auth.currentUser.providerData[0]["displayName"];
    setUsername(user);
    setProfileUrl(auth.currentUser.providerData[0]["photoURL"]);
    // congetDbValuessole.log("CURRENT : ",user)
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
        {/* <Overlay overlayStyle={{padding:20,width:"80%"}} isVisible={visible} onBackdropPress={()=>{setVisible(!visible)}}> */}

        {/* <Options
              
              option1={data["Push_Notification"][settings]}
              option2={data["Late_Payment"][settings]}
              option3={data["Add_Slot"][settings]}
              
              param1={Notification}
              param2={Payment}
              param3={newParking}
            
              function1={setNotification}
              function2={setPayment}
              function3={setNewParking}
            
            
               
               /> */}
        <View
          style={{
            flexDirection: "row",
            padding: 40,
            backgroundColor: "white",
            marginTop: 40,
            borderRadius: 25,
            // backgroundColor: "red",
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
              // if (Notification) {

              // }

              setNotification(!Notification);
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
