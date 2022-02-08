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
import { useState, useContext } from "react";
import { TabView, ListItem, Tab, Button } from "react-native-elements";
import Maps from "./Maps";
import AccountEdit from "./AccountEdit";
import TabBottom from "./TabBottom";
// import { data } from "./FormsData/formData";
import UploadImage from "./common/UploadImage";
import { Formik } from "formik";
import Options from "./common/Options";
import MapsView from "./MapsView";
import { auth, db } from "../firebase";
import geohash from "ngeohash";
import { data } from "../src/Transaltion/translation";
import SettingsContext from "../src/context/Setting";
import { NavigationContainer } from "@react-navigation/native";

export default function HistoryNavigate({ route, navigation }) {
  const [Flatno, setFlatNo] = useState("");
  const [Building, setBuilding] = useState("");
  const [Street, setStreet] = useState("");
  const [Area, setArea] = useState("");
  const { settings, saveSettings } = useContext(SettingsContext);

  const [Price, setPrice] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [message, setMessage] = useState("");
  const [City, setCity] = useState("");
  const [guard, setGuard] = useState(false);
  const [covered, setCovered] = useState(false);
  const [camera, setCamera] = useState(false);
  const [flag, setFlag] = useState(false);
  const [imageUri, setImageUri] = useState(null);

  const slot_Filters = [
    data["Guard"][settings],
    data["Covered"][settings],
    data["Camera"][settings],
  ];
  React.useEffect(() => {
    console.log("route: ", route.params.item.bookedSpace);
    if (route.params) {
      setImageUri(route.params.item.bookedSpace.imageUrl);
      setStreet(route.params.item.bookedSpace.Street);
      setFlatNo(route.params.item.bookedSpace.Flatno);
      setCity(route.params.item.bookedSpace.City);
      setBuilding(route.params.item.bookedSpace.Building);
      setMessage(route.params.item.bookedSpace.message);
      setArea(route.params.item.bookedSpace.Area);
      setPrice(route.params.item.bookedSpace.Price);
      setCamera(route.params.item.bookedSpace.camera);
      setCovered(route.params.item.bookedSpace.covered);
    }
    // if (route.params) {
    //   console.log("props ener", route.params);
    //   // setFlag(true)
    //   setStreet(route.params.item.Street);
    //   setFlatNo(route.params.item.Flatno);
    //   setCity(route.params.item.City);
    //   setBuilding(route.params.item.Building);
    //   setMessage(route.params.item.message);
    //   setArea(route.params.item.Area);
    //   setPrice(route.params.item.Price);
    //   setCamera(route.params.item.camera);
    //   setCovered(route.params.item.covered);
    //   setUserLocation({
    //     latitude: route.params.item.coordinates.latitude,
    //     longitude: route.params.item.coordinates.longitude,
    //     latitudeDelta: 0.0922,
    //     longitudeDelta: 0.0421,
    //   });

    //   setGuard(route.params.item.guard);
    // }
    // setFlag(true);
  }, []);

  function convertNumToTime(number) {
    // Check sign of given number
    var sign = number >= 0 ? 1 : -1;

    // Set positive value of number of sign negative
    number = number * sign;

    // Separate the int from the decimal part
    var hour = Math.floor(number);
    var decpart = number - hour;

    var min = 1 / 60;
    // Round to nearest minute
    decpart = min * Math.round(decpart / min);

    var minute = Math.floor(decpart * 60) + "";

    // Add padding if need
    if (minute.length < 2) {
      minute = "0" + minute;
    }

    // Add Sign in final result
    sign = sign == 1 ? "" : "-";

    // Concate hours and minutes
    time = sign + hour + " hrs " + minute + " min";

    return time;
  }

  async function pay() {
    var history = [];
    const data_user = db.collection("users").doc(auth.currentUser.uid);
    const doc = await data_user.get();
    if (!doc.exists) {
      console.log("No such document!");
    } else {
      if (doc.data().history) {
        history = doc.data().history;
      }
    }
    history[route.params.index].isPayed = true;
    db.collection("users")
      .doc(auth.currentUser.uid)
      .update({
        history: history,
      })
      .then(function () {});
  }

  return (
    <View>
      <ScrollView
        style={{}}
        contentContainerStyle={{ flexGrow: 1 }}
        stickyFooterIndices={[1]}
      >
        <View style={styles.innerContainer}>
          <Text style={styles.UserName2}></Text>

          <View
            style={{
              width: "80%",
              height: 300,
            }}
          >
            <Avatar
              // size={90}
              source={{
                uri: imageUri,
              }}
              containerStyle={{
                backgroundColor: "grey",
                width: "100%",
                height: "100%",
              }}
            ></Avatar>
          </View>
          <View
            style={{
              borderRadius: 15,
              backgroundColor: "white",
              width: "80%",
              padding: 20,
              marginTop: 40,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                marginBottom: 5,
              }}
            >
              {data["Payment_Details"][settings] + ":"}
            </Text>

            <Text>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                }}
              >
                {data["Time"][settings] + ":"}
              </Text>
              {"  "}
              {convertNumToTime(route.params.item.time)}
            </Text>
            <Text>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                }}
              >
                {data["Payment_Status"][settings] + ":"}
              </Text>
              {"  "}
              {route.params.item.isPayed ? "payed" : "un-payed"}
            </Text>
            <Text>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                }}
              >
                {data["Payable"][settings] + ":"}
              </Text>{" "}
              {(Price * route.params.item.time).toFixed(1)}-ft
            </Text>
            {!route.params.item.isPayed && (
              <ButtonMain
                title={data["payNow"][settings]}
                function={() => {
                  navigation.navigate("Card", {
                    pay: pay,
                    ownerid: route.params.item.bookedSpace.owner,
                    price: route.params.item.bookedSpace.Price,
                    time: route.params.item.time,
                    checkoutFunc: () => {
                      navigation.navigate("Maps");
                    },
                  });
                }}
              ></ButtonMain>
            )}
          </View>

          <View
            style={{
              borderRadius: 15,
              backgroundColor: "white",
              width: "80%",
              padding: 20,
              marginTop: 40,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                marginBottom: 5,
              }}
            >
              {data["Parking_Slots_Specifics"][settings]}
            </Text>
            <Text>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                }}
              >
                {data["Address"][settings] + ":"}
              </Text>
              {"  "}
              {Flatno} {Area} {Street} {Building}
              {" , "}
              {City}
            </Text>
            <Text>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                }}
              >
                {data["Price"][settings] + ":"}
              </Text>{" "}
              ft
              {Price}
            </Text>
          </View>

          <View
            style={{
              // marginBottom:"20%",
              borderRadius: 15,
              backgroundColor: "white",
              width: "80%",
              // justifyContent: "center",
              // alignItems: "center",
              padding: 20,
              marginTop: 40,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                marginBottom: 5,
              }}
            >
              {data["Parking_Slots_Basic_Details"][settings]}
            </Text>

            {slot_Filters.map((item, i) => (
              <Text>
                {item}

                <Text>
                  {{ covered } ? (
                    <Icon name={"check"} size={20} />
                  ) : (
                    <Icon name={"times"} size={20} />
                  )}
                </Text>
              </Text>
            ))}
          </View>
          <View
            style={{
              // marginBottom:"20%",
              borderRadius: 15,
              backgroundColor: "white",
              width: "80%",
              // justifyContent: "center",
              // alignItems: "center",
              padding: 20,
              marginTop: 40,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                marginBottom: 5,
              }}
            >
              {data["Message"][settings]}
            </Text>
            <Text> {message}</Text>
          </View>
          <Button
            onPress={() => {
              navigation.replace("Maps", {
                historyCheck: true,
                historySpace: route.params.item.bookedSpace,
              });
              // setLoadingScreen(true)
              // onPress={() => {
              // ////console.log(space);
              // Book(requestSpace);

              // ////console.log(a);
            }}
            titleStyle={{ color: "white" }}
            buttonStyle={{
              backgroundColor: "#5EA0EE",
              padding: 17,
              // width:"100%",
              // marginRight:"20%"
              // alignItems:"center",
              // justifyContent:"center"
              // alignContent:"center"
            }}
            containerStyle={{
              marginTop: "10%",
              marginBottom: "25%",
              alignItems: "center",
              justifyContent: "center",
            }}
            title={data["Navigate"][settings]}
          ></Button>
        </View>
      </ScrollView>

      <TabBottom navigate={navigation} />
    </View>
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
  UserName2: {
    fontFamily: "sans-serif",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 40,
    marginTop: "10%",
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
    marginTop: 10,
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
