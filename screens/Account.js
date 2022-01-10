import * as React from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Avatar } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { Input } from "react-native-elements";
import ButtonMain from "./common/button";
import { useState, useContext } from "react";
import { TabView, ListItem, Tab, Button, Divider } from "react-native-elements";
import Maps from "./Maps";
import AccountEdit from "./AccountEdit";
import TabBottom from "./TabBottom";
// import AccountAbout from "./AccountAbout"
import AvatarCustom from "./common/AvatarCustom";
import ReLogin from "./ReLogin";
import { auth, db } from "../firebase";
// import ReLogin from "./ReLogin";
import { data } from "../src/Transaltion/translation";
import SettingsContext from "../src/context/Setting";
import { Overlay } from "react-native-elements/dist/overlay/Overlay";

export default function Account({ navigation }) {
  const { settings, saveSettings } = useContext(SettingsContext);

  const [username, setUsername] = useState("User");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [deleteUser, setDeleteUser] = useState(false);
  const [nowDelete, setNowDelete] = useState(true);
  const [profileUrl, setProfileUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [flag, setFlag] = useState(false);

  React.useEffect(() => {
    const user = auth.currentUser.providerData[0]["displayName"];
    setUsername(user);
    setEmail(auth.currentUser.providerData[0]["email"]);

    setProfileUrl(auth.currentUser.providerData[0]["photoURL"]);
  }, []);

  React.useEffect(() => {
    if (deleteUser) {
      db.collection("users")
        .doc(auth.currentUser.uid)
        .delete()
        .then(() => {
          db.collection("spaces")
            .where("owner", "==", auth.currentUser.uid)
            .get()
            .then((snapshot) => {
              snapshot.docs.forEach((doc) => {
                doc.ref.delete();
              });
              const usr_ = auth.currentUser;
              auth.signOut().then(
                function () {
                  console.log("Signed Out");
                  usr_.delete().then(async () => {
                    setLoading(false);
                    navigation.reset({
                      index: 0,
                      routes: [
                        {
                          name: "Register",
                        },
                      ],
                    });
                  });
                },
                function (error) {
                  setLoading(false);
                  console.error("Sign Out Error", error);
                }
              );
              setDeleteUser(false);
            });
        })
        .catch((e) => {
          setLoading(false);
        });
    }
  }, [deleteUser]);

  const list = [
    {
      title: data["Profile"][settings],
      icon: "user",
    },

    {
      title: data["Notifications"][settings],
      icon: "bell",
    },
    {
      title: data["Language"][settings],
      icon: "globe",
    },
    {
      title: data["About"][settings],
      icon: "question-circle",
    },
    {
      title: data["My_Parking_Spaces"][settings],
      icon: "car",
    },
    {
      title: data["Late_Payment"][settings],
      icon: "dollar",
    },
    {
      title: data["Stripe"][settings],
      icon: "scribd",
    },
  ];

  const deleteAccount = (ley) => {
    const user = auth.currentUser;

    Alert.alert("Alert !", data["Alert1"][settings], [
      {
        text: data["Cancel"][settings],
        onPress: () => {},
      },
      {
        text: data["Proceed"][settings],
        onPress: () => {
          auth.signOut().then(
            function () {
              setFlag(true);
            },
            function (error) {
              console.error("Sign Out Error", error);
            }
          );
        },
      },
    ]);
  };

  const renderFunction = (key) => {
    key == 1 && navigation.navigate("AccountEdit");
    key == 2 && navigation.navigate("AccountNotifications");
    key == 3 && navigation.navigate("AccountLanguage");
    key == 4 && navigation.navigate("AccountAbout");
    key == 5 && navigation.navigate("AccountParkings");
    key == 6 && navigation.navigate("AccountLatePayment");
    key == 7 && navigation.navigate("Stripe");
  };
  return (
    <View>
      <ScrollView
        style={{}}
        keyboardShouldPersistTaps={"handled"}
        contentContainerStyle={{ flexGrow: 1 }}
        stickyFooterIndices={[1]}
      >
        <ImageBackground
          source={require("../pictures/bkg-user.jpeg")}
          resizeMode="cover"
          style={styles.image}
        />

        <View style={styles.innerContainer}>
          <AvatarCustom url={profileUrl} />

          <Text style={styles.UserName}>{username}</Text>
        </View>

        <Overlay
          overlayStyle={{ padding: 20, width: "80%" }}
          isVisible={flag}
          onBackdropPress={() => {
            setFlag(!flag);
            setPassword("");
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: "Login",
                },
              ],
            });
          }}
        >
          <View style={{ width: "100%" }}>
            <View
              style={{
                backgroundColor: "white",
                alignItems: "center",
              }}
            >
              <Text
                style={{ fontWeight: "bold", fontSize: 20, marginBottom: 20 }}
              >
                {data["Confirm_Credentials"][settings]}
              </Text>
              <Divider />
              <Input
                containerStyle={styles.buttonContainer}
                placeholder="Password"
                onChangeText={(text) => setPassword(text)}
                value={password}
                secureTextEntry={true}
              />
              <Button
                buttonStyle={{ backgroundColor: "red" }}
                title={data["Submit"][settings]}
                onPress={() => {
                  setLoading(true);
                  auth
                    .signInWithEmailAndPassword(email, password)
                    .then(async () => {
                      setDeleteUser(true);
                    })
                    .catch((err) => {
                      alert(err);
                      setLoading(false);
                    });
                }}
              ></Button>
              {loading && (
                <View style={{ padding: 20 }}>
                  <ActivityIndicator size="large" color="#0000ff" />
                </View>
              )}
            </View>
          </View>
        </Overlay>

        <View style={styles.ListStyle}>
          <View style={styles.innerListStyle}>
            {list.map((item, i) => (
              <ListItem
                button
                onPress={() => {
                  {
                    renderFunction(i + 1);
                  }
                }}
                key={i + 1}
                bottomDivider
                containerStyle={{ width: "100%" }}
              >
                <Icon name={item.icon} size={20} />
                <ListItem.Content>
                  <ListItem.Title>{item.title}</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />
              </ListItem>
            ))}
          </View>
        </View>
        <View style={styles.ListStyle1}>
          <View style={styles.innerListStyle}>
            <ListItem
              button
              onPress={() => {
                {
                  deleteAccount(100);
                }
              }}
              key={100}
              containerStyle={{ width: "80%" }}
            >
              <Icon name="smile-o" size={20} />
              <ListItem.Content>
                <ListItem.Title style={{ color: "red", fontWeight: "bold" }}>
                  {data["Delete_Account"][settings]}
                </ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron />
            </ListItem>
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
    borderRadius: 15,
  },
  innerListStyle: {
    justifyContent: "center",
    alignItems: "center",
    width: "80%",
    padding: 10,
    backgroundColor: "white",
    borderRadius: 25,
  },
  ListStyle1: {
    marginTop: 40,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: "30%",
    borderRadius: 15,
  },
  innerContainer: {
    alignItems: "center",
    marginTop: "-15%",
  },
  image: {
    minHeight: 120,
    backgroundColor: "red",
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
});
