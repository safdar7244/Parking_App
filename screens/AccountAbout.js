import * as React from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Linking,
  SafeAreaView,
  Text,
  Alert,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Avatar } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { Input, Switch, Divider, Overlay } from "react-native-elements";
import ButtonMain from "./common/button";
import { useState, useContext, useRef } from "react";
import { TabView, ListItem, Tab, Button } from "react-native-elements";
import Maps from "./Maps";
import AccountEdit from "./AccountEdit";
import TabBottom from "./TabBottom";
// import { data } from './FormsData/formData';
import { auth, db } from "../firebase";
import { data } from "../src/Transaltion/translation";
import SettingsContext from "../src/context/Setting";
import AvatarCustom from "./common/AvatarCustom";
import { ScrollView } from "react-native-gesture-handler";
import axios from "axios";
export default function AccountAbout({ navigation }) {
  const [profileUrl, setProfileUrl] = useState(false);
  const [loading, setLoading] = useState(false);
  const scrollView = useRef();
  // console.log("->", scrollView);

  const { settings, saveSettings } = useContext(SettingsContext);
  const [message, setMessage] = useState("");

  // setTimeout(() => {
  //   saveSettings(1)
  // }, 0);

  // console.log("ssss",settings)
  const [link, setLink] = useState("");
  const [username, setUsername] = useState("User");
  React.useEffect(() => {
    const user = auth.currentUser.providerData[0]["displayName"];
    setUsername(user);
    // console.log("CURRENT : ",user)
    setProfileUrl(auth.currentUser.providerData[0]["photoURL"]);
  }, []);

  function handleClick() {
    Linking.canOpenURL("https://homeparking.hu").then((supported) => {
      if (supported) {
        Linking.openURL("https://homeparking.hu");
      } else {
        console.log("Don't know how to open URI: " + this.props.url);
      }
    });
  }
  const onPressAbout = () => {
    console.log("{RESS");
    scrollViewCheck.current.scrollToEnd();
  };

  async function handleSubmit(e) {
    if (message.length > 4) {
      console.log("IF");
      setLoading(true);
      const data = {
        username: username,
        email: auth.currentUser.providerData[0]["email"],
        message: message,
      };
      try {
        const response = await axios.post(
          "https://ancient-woodland-88729.herokuapp.com/sendmail",
          data
        );
        console.log("Subnmited: ", message);
        setLoading(false);
        navigation.navigate("Account");
      } catch {
        console.log("ERRPR");
      }
    } else {
      console.log("Else");

      Alert.alert(
        "Alert !",
        "Message length can not be less than 5 characters long",
        [
          {
            text: "Ok",
            onPress: () => {
              // console.log("OKKK");
            },
          },
        ]
      );
    }
  }
  // data.b = "new value";

  return (
    <View style={styles.container}>
      <ScrollView
        keyboardShouldPersistTaps={"always"}
        // ref={(ref) => {
        //   scrollView = ref;
        // }}
        ref={scrollView}
      >
        <ImageBackground
          source={require("../pictures/bkg-user.jpeg")}
          resizeMode="cover"
          style={styles.image}
        />

        <View style={styles.innerContainer}>
          <AvatarCustom url={profileUrl} />

          <Text style={styles.UserName}>{username}</Text>

          <View style={styles.innerContainer1}>
            <Text onPress={handleClick} style={styles.innerText}>
              {data["Privacy_Policy"][settings]}
            </Text>
            <Text style={styles.innerText} onPress={handleClick}>
              {data["FAQ"][settings]}
            </Text>
            <Text style={styles.innerText} onPress={handleClick}>
              {data["How_The_App_Works"][settings]}
            </Text>
          </View>
          <View style={styles.innerContainer2}>
            <Text style={styles.innerText}>
              {data["Question_Suggestion"][settings]}
            </Text>
            <TextInput
              editable={true}
              multiline={true}
              numberOfLines={5}
              // onFocus={() => {
              //   console.log("->", scrollView.current);
              //   setTimeout(() => {
              //     scrollView.current.scrollToEnd({ Animated: true });
              //   }, 1000);
              // }}
              onTouchStart={() => {
                console.log("Pressed...");
                setTimeout(() => {
                  scrollView.current.scrollToEnd({
                    // animated: true,
                    // duration: 500,
                  });
                }, 500);
              }}
              style={{
                width: "100%",
                fontSize: 12,
                borderRadius: 7,
                borderWidth: 0.5,
                padding: 5,
                marginBottom: 20,
                marginTop: 10,
                backgroundColor: "#eeeeee",
                // marginLeft: 5,
              }}
              onChangeText={(message) => setMessage(message)}
            />
            <Button
              disabled={loading}
              onPress={(e) => handleSubmit(e)}
              title={data["Submit"][settings]}
            ></Button>
            {loading && (
              <View style={{ padding: 20 }}>
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      <TabBottom navigate={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor:"red"
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
    marginBottom: "30%",
    // borderRadius:15,
    borderRadius: 25,
    // backgroundColor: "red",
    backgroundColor: "white",
    width: "80%",
    marginTop: "10%",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  innerContainer1: {
    // marginBottom:"20%",
    // borderRadius:15,
    borderRadius: 25,
    // backgroundColor: "red",
    backgroundColor: "white",
    width: "80%",
    marginTop: "10%",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  innerContainer: {
    // justifyContent:"center",
    alignItems: "center",
    //    backgroundColor:"blue",
    marginTop: "-15%",
  },
  innerText: {
    margin: 5,
  },
});
