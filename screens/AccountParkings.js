import * as React from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Picker,
  SafeAreaView,
  Text,
  Linking,
  Alert,
  ScrollView,
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
// import { data } from './FormsData/formData';
import AvatarCustom from "./common/AvatarCustom";
import { auth, db } from "../firebase";
import SettingsContext from "../src/context/Setting";
import { data } from "../src/Transaltion/translation";
import axios from "axios";

export default function AccountParkings({ navigation }) {
  const [profileUrl, setProfileUrl] = useState(false);

  const list_spaces = [];
  const [username, setUsername] = useState("User");
  const { settings, saveSettings } = useContext(SettingsContext);
  const [stripe, SetStripe] = useState(0);
  const [loading, setLoading] = useState(false);

  const [spaces, setSpaces] = useState([]);
  React.useEffect(() => {
    const user = auth.currentUser.providerData[0]["displayName"];
    setUsername(user);
    setProfileUrl(auth.currentUser.providerData[0]["photoURL"]);

    // console.log("CURRENT : ",user)

    console.log("Entered");
    db.collection("spaces")
      .where("owner", "==", auth.currentUser.uid)
      .onSnapshot((snapshot) => {
        // Your own custom logic here
        snapshot.forEach((doc) => {
          // ////console.log(doc.id, doc.data());
          // console.log("PARKING SLOT YAAAY",doc.data())
          let dd = doc.data();
          dd["title"] = "Slot " + (list_spaces.length + 1);
          // const dta={
          //   title:2
          // }
          // dd.append(dta)
          list_spaces.push(dd);
        });
        // console.log(list_spaces)
        // console.log(list_spaces.length)
        setSpaces(list_spaces);
      });
  }, []);

  const renderFunction = (item, key) => {
    console.log("key : ", key);
    navigation.replace("AccountAddParking", { item });
  };
  // data.b = "new value";
  // const list = [

  //     {
  //       title: 'Slot 1',
  //     },
  //     {
  //         title: 'Slot 2',
  //       },

  //   ]

  /////////////////////////////////////////////////////////////////

  async function Check() {
    const cityRef = db.collection("users").doc(auth.currentUser.uid);
    const doc = await cityRef.get();
    if (!doc.exists) {
      console.log("No such document!");
    } else {
      console.log("Document data:", doc.data().stripeId);
      SetStripe(doc.data().stripeId);
    }
    console.log("stripe", stripe);

    return doc.data().stripeId;
  }
  /////////////////////////////////////////////////////////////////

  return (
    <View>
      <ScrollView
        style={{ minHeight: "100%" }}
        acontentContainerStyle={{ flexGrow: 1 }}
        stickyFooterIndices={[0]}
      >
        {/* <ScrollView 
    style={styles.Scrollcontainer}
> */}
        <ImageBackground
          source={require("../pictures/bkg-user.jpeg")}
          resizeMode="cover"
          style={styles.image}
        />

        <View style={styles.innerContainer}>
          <AvatarCustom url={profileUrl} />

          <Text style={styles.UserName}>{username}</Text>

          <View style={styles.innerContainer2}>
            <Text style={styles.innerText}>
              {data["My_Parking_Spaces"][settings]}
            </Text>
            {spaces.map((item, i) => (
              <ListItem
                button
                onPress={() => {
                  {
                    renderFunction(item, i + 1);
                  }
                }}
                key={i + 1}
                bottomDivider
                containerStyle={{ width: "100%", fontSize: 12 }}
              >
                <ListItem.Content>
                  <ListItem.Title>{item.title}</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
              </ListItem>
            ))}
          </View>
          <View style={styles.innerContainer3}>
            <ListItem
              button
              onPress={async () => {
                console.log("pressed");
                const check = await Check();
                if (check != 0) {
                  navigation.navigate("AccountAddParking");
                } else {
                  setLoading(true);
                }
              }}
              key={100}
              containerStyle={{ width: "80%", fontSize: 12 }}
            >
              <ListItem.Content>
                <ListItem.Title>
                  {data["Add_Slot"][settings]}{" "}
                  <Icon
                    name="plus"
                    size={20}
                    color="blue"
                    style={
                      {
                        //   marginLeft:"20%"
                      }
                    }
                  />
                </ListItem.Title>
              </ListItem.Content>
            </ListItem>
            <Text style={{ fontSize: 10 }}>
              {" "}
              {loading ? "Make Stripe Account First" : ""}
            </Text>
          </View>
        </View>

        {/*  */}
        {/* </ScrollView> */}
      </ScrollView>
      <TabBottom navigate={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  Scrollcontainer: {},
  container: {
    flex: 1,
    // backgroundColor:"red"
  },

  image: {
    // flex: 1,
    // justifyContent: "center",
    // height:"10%",
    minHeight: 120,
  },
  innerText: {},
  UserName: {
    fontFamily: "sans-serif",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 40,
    // marginTop:40
  },
  labelText: {
    // fontSize: 14,
    // // marginBottom: 10,
    // paddingLeft: 10,
    // // marginLeft:-20,
    // paddingTop: 15,
  },
  innerContainer2: {
    // marginBottom:"20%",
    marginTop: 20,
    // borderRadius:15,
    backgroundColor: "white",
    width: "85%",
    // marginTop:"10%",
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  innerContainer3: {
    marginBottom: "55%",
    // borderRadius:15,
    backgroundColor: "white",
    width: "85%",
    marginTop: "20%",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  innerContainer: {
    // justifyContent:"center",
    alignItems: "center",
    //    backgroundColor:"blue",
    marginTop: "-15%",
  },
});
