import * as React from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Picker,
  SafeAreaView,
  Text,
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
import HistoryNavigate from "./HistoryNavigate";
export default function Tickets({ navigation }) {
  const [history, setHistroy] = useState([]);
  const [flag, setFlag] = useState(false);

  async function func() {
    console.log("Entered");
    console.log("auth.", auth.currentUser.uid);
    const aUser = db.collection("users").doc(auth.currentUser.uid);
    // console.log("AUSEE L ",aUser)
    const docData = await aUser.get();
    if (docData) {
      console.log("docs: ", docData.data().history);
      // console.log("History : ",history_spaces)
      if (docData.data().history) {
        setHistroy(docData.data().history);
        setFlag(true);
      }
      // const dta={
      //   title:2
      // }
      // dd.append(dta)
      // list_spaces.push(dd)
    }
  }

  //   const [username,setUsername]=useState("User")
  const { settings, saveSettings } = useContext(SettingsContext);

  React.useEffect(() => {
    // const user=auth.currentUser.providerData[0]["displayName"]
    // setUsername(user)
    // console.log("CURRENT : ",user)

    func();

    //     db.collection("users")
    //     .where("id", "==", auth.currentUser.uid)
    //     .onSnapshot((snapshot) => {
    //       // Your own custom logic here
    //       snapshot.forEach((doc) => {

    //         // ////console.log(doc.id, doc.data());
    // // console.log("PARKING SLOT YAAAY",doc.data())
    // let dd=doc.data()
    // dd["title"]="Slot "+(list_spaces.length+1)
    // // const dta={
    // //   title:2
    // // }
    // // dd.append(dta)
    // // list_spaces.push(dd)
    //     //   });
    //       // console.log(list_spaces)
    //       // console.log(list_spaces.length)
    //       setSpaces(list_spaces);
    //     });
  }, []);

  const renderFunction = (item, key) => {
    console.log("key : ", key);
    navigation.navigate("HistoryNavigate", { item: item, index: key - 1 });
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
  return (
    <View style={styles.container}>
      <ScrollView
        style={{ minHeight: "100%" }}
        contentContainerStyle={{ flexGrow: 1 }}
        stickyFooterIndices={[0]}
      >
        {/* <ScrollView 
    style={styles.Scrollcontainer}
> */}
        {/* <TabBottom navigate={navigation}/>  */}

        {/* <ImageBackground source={require('../pictures/bkg-user.jpeg')} resizeMode="cover" style={styles.image} /> */}

        <View style={styles.innerContainer}>
          {/* <AvatarCustom /> */}

          {/* <Text style={styles.UserName}>{username}</Text> */}

          <View style={styles.innerContainer2}>
            <Text style={styles.innerText}>{data["My_Tickets"][settings]}</Text>
            {flag &&
              history.map((item, i) => (
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
                    <ListItem.Title>
                      {"Ticket\t\t"}
                      {i + 1}
                      <Text style={{ color: "red", fontSize: 12 }}>
                        {item.isPayed ? "" : "          unpayed"}
                      </Text>
                    </ListItem.Title>
                  </ListItem.Content>
                  <ListItem.Chevron />
                </ListItem>
              ))}
          </View>
        </View>
      </ScrollView>
      <TabBottom navigate={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  Scrollcontainer: {},
  container: {
    flex: 1,
  },

  image: {
    minHeight: 120,
  },
  innerText: {},
  UserName: {
    fontFamily: "sans-serif",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 40,
  },
  labelText: {},
  innerContainer2: {
    marginTop: 20,
    borderRadius: 15,
    backgroundColor: "white",
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  innerContainer3: {
    marginBottom: "55%",
    borderRadius: 15,
    backgroundColor: "white",
    width: "80%",
    marginTop: "20%",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  innerContainer: {
    alignItems: "center",
  },
});
