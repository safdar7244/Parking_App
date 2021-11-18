import * as React from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  Alert,
} from "react-native";
import { Avatar } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { Input } from "react-native-elements";
import ButtonMain from "./common/button";
import { useState } from "react";
import { TabView, ListItem, Tab, Button } from "react-native-elements";
import Maps from "./Maps";
import AccountEdit from "./AccountEdit";
import TabBottom from "./TabBottom";
// import AccountAbout from "./AccountAbout"
import AvatarCustom from "./common/AvatarCustom";
export default function Account({ navigation }) {
  const list = [
    {
      title: "Profile",
      icon: "user",
    },
    {
      title: "Notifications",
      icon: "bell",
    },
    {
      title: "Language",
      icon: "globe",
    },
    {
      title: "About",
      icon: "question-circle",
    },
    {
      title: "My Parking Spaces",
      icon: "car",
    },
  ];

  const renderFunction = (key) => {
    console.log("yaya");

    key == 1 && navigation.navigate("AccountEdit");
    key == 2 && navigation.navigate("AccountNotifications");
    key == 3 && navigation.navigate("AccountLanguage");
    key == 4 && navigation.navigate("AccountAbout");
    key == 5 && navigation.navigate("AccountParkings");
  };
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../pictures/bkg-user.jpeg")}
        resizeMode="cover"
        style={styles.image}
      />

      <View style={styles.innerContainer}>
        <AvatarCustom url="'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg'" />

        <Text style={styles.UserName}>User</Text>
      </View>
      <View style={styles.ListStyle}>
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
            containerStyle={{ width: "80%" }}
          >
            <Icon name={item.icon} size={20} />
            <ListItem.Content>
              <ListItem.Title>{item.title}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        ))}
      </View>
      <View style={styles.ListStyle1}>
        <ListItem
          button
          onPress={() => {
            {
              renderFunction(6);
            }
          }}
          key={6}
          containerStyle={{ width: "80%" }}
        >
          <Icon name="smile-o" size={20} />
          <ListItem.Content>
            <ListItem.Title style={{ color: "red", fontWeight: "bold" }}>
              Delete Account
            </ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
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
  ListStyle1: {
    marginTop: 40,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  innerContainer: {
    // justifyContent:"center",
    alignItems: "center",
    //    backgroundColor:"blue",
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
});
