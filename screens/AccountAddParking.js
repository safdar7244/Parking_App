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
  TextInput,
} from "react-native";
import { Avatar } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import { Input, Switch, Divider, Overlay } from "react-native-elements";
import ButtonMain from "./common/button";
import { useState } from "react";
import { TabView, ListItem, Tab, Button } from "react-native-elements";
import Maps from "./Maps";
import AccountEdit from "./AccountEdit";
import TabBottom from "./TabBottom";
import { data } from "./FormsData/formData";
import UploadImage from "./common/UploadImage";
import { Formik } from "formik";
import Options from "./common/Options";
import MapsView from "./MapsView";
import { auth, db } from "../firebase";
import geohash from "ngeohash";

export default function AccountAddParking({ navigation }) {
  const [Flatno, setFlatNo] = useState("");
  const [Building, setBuilding] = useState("");
  const [Street, setStreet] = useState("");
  const [Area, setArea] = useState("");
  const [Price, setPrice] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [message, setmessage] = useState("");
  const [City, setCity] = useState("");
  const [guard, setGuard] = useState(false);
  const [covered, setCovered] = useState(false);
  const [camera, setCamera] = useState(false);

  const getGeohashRange = (
    latitude,
    longitude,
    distance // miles
  ) => {
    const lat = 0.0144927536231884; // degrees latitude per mile
    const lon = 0.0181818181818182; // degrees longitude per mile

    const lowerLat = latitude - lat * distance;
    const lowerLon = longitude - lon * distance;

    const upperLat = latitude + lat * distance;
    const upperLon = longitude + lon * distance;

    const lower = geohash.encode(lowerLat, lowerLon);
    const upper = geohash.encode(upperLat, upperLon);

    return {
      lower,
      upper,
    };
  };

  const handleSubmit = async () => {
    console.log(
      Flatno,
      Building,
      Street,
      userLocation,
      Area,
      guard,
      covered,
      camera,
      Price,
      City
    );
    const coordinates = {
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
    };
    const obj = {
      Flatno,
      Building,
      Street,
      coordinates,
      Area,
      guard,
      covered,
      camera,
      Price,
      City,
    };

    const ghash = geohash.encode(
      obj.coordinates.latitude,
      obj.coordinates.longitude
    );

    const range = getGeohashRange(
      userLocation.latitude,
      userLocation.longitude,
      12
    );

    // console.log("rang", range);
    // db.collection("spaces")
    //   .where("ghash", ">=", range.lower)
    //   .where("ghash", "<=", range.upper)
    //   .onSnapshot((snapshot) => {
    //     // Your own custom logic here
    //     snapshot.forEach((doc) => {
    //       console.log(doc.id, doc.data());
    //     });
    //   });

    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser);
        obj.owner = authUser.uid;
        obj.ghash = ghash;
        db.collection("spaces")
          .add(obj)
          .then(() => {
            console.log("Document successfully written!");
          })
          .catch((error) => {
            console.error("Error writing document: ", error);
          });
      }
    });

    console.log(obj);
  };
  return (
    <ScrollView
      style={{}}
      acontentContainerStyle={{ flexGrow: 1 }}
      stickyFooterIndices={[1]}
    >
      <TabBottom navigate={navigation} />

      <View style={styles.innerContainer}>
        <UploadImage />

        <Text style={styles.UserName}>User</Text>

        <MapsView
          Flatno={Flatno}
          Building={Building}
          Street={Street}
          Area={Area}
          Price={Price}
          userLocation={userLocation}
          setFlatNo={setFlatNo}
          setBuilding={setBuilding}
          setStreet={setStreet}
          setArea={setArea}
          setPrice={setPrice}
          setUserLocation={setUserLocation}
          City={City}
          setCity={setCity}
        />

        <View
          style={{
            // marginBottom:"20%",
            borderRadius: 15,
            backgroundColor: "white",
            width: "80%",
            marginTop: "10%",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <Options
            option1="Guard"
            option2="Covered"
            option3="Camera"
            param1={guard}
            param2={covered}
            param3={camera}
            function1={setGuard}
            function2={setCovered}
            function3={setCamera}
          />
        </View>

        <View style={styles.innerContainer3}>
          <Text style={{ marginBottom: 20 }}>
            If theres any Querry please comment below:
          </Text>
          <TextInput
            style={{
              width: 200,
              height: 150,
              fontSize: 12,
              borderRadius: 7,
              borderWidth: 1,
              padding: 5,
              marginBottom: 20,
              backgroundColor: "#eeeeee",
              marginLeft: 20,
            }}
            onChangeText={(message) => setmessage(message)}
            defaultValue={message}
          />

          <Button onPress={handleSubmit} title="Submit" />
        </View>
      </View>
    </ScrollView>
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
  innercontainer2: {
    backgroundColor: "white",
    width: "80%",
    padding: 40,
  },
  Scrollcontainer: {
    // marginVertical:50,
    // marginHorizontal:20
  },
  container: {
    flex: 1,
    // backgroundColor:"red"
  },

  image: {
    // flex: 1,
    // justifyContent: "center",
    // height:"10%",
    minHeight: 200,
    backgroundColor: "red",
  },
  innerText: {
    // backgroundColor:"white",
    // width:"80%",
    // fontSize:19,
    // fontWeight:"bold",
    // marginRight:100
  },
  UserName: {
    fontFamily: "sans-serif",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 40,
    marginTop: 40,
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
    borderRadius: 15,
    backgroundColor: "white",
    width: "80%",
    // marginTop:"10%",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  innerContainer3: {
    marginBottom: "20%",
    borderRadius: 15,
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
});
