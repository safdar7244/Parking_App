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
// import { data } from "./FormsData/formData";
import UploadImage from "./common/UploadImage";
import { Formik } from "formik";
import Options from "./common/Options";
// import SingleOptions from "./common/SingleOption";
import ScheduleCalls from "./common/ScheduleCalls";
import MapsView from "./MapsView";
import { auth, db } from "../firebase";
import geohash from "ngeohash";
import { data } from "../src/Transaltion/translation";
import SettingsContext from "../src/context/Setting";
import * as firebase from "firebase";

export default function AccountAddParking({ route, navigation }) {
  const { settings, saveSettings } = useContext(SettingsContext);

  const weekDays = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  const Translated_weekDays = [
    data["monday"][settings],
    data["tuesday"][settings],
    data["wednesday"][settings],
    data["thursday"][settings],
    data["friday"][settings],
    data["saturday"][settings],
    data["sunday"][settings],
  ];
  const [monday, setMonday] = useState(false);
  const [tuesday, setTuesday] = useState(false);
  const [wednesday, setWednesday] = useState(false);
  const [thursday, setThursday] = useState(false);
  const [friday, setFriday] = useState(false);
  const [saturday, setSaturday] = useState(false);
  const [sunday, setSunday] = useState(false);

  const [schedule, setSchedule] = useState({
    monday: {
      flag: false,
      start: 0,
      end: 0,
    },
    tuesday: {
      flag: false,
      start: 0,
      end: 0,
    },
    wednesday: {
      flag: false,
      start: 0,
      end: 0,
    },
    thursday: {
      flag: false,
      start: 0,
      end: 0,
    },
    friday: {
      flag: false,
      start: 0,
      end: 0,
    },
    saturday: {
      flag: false,
      start: 0,
      end: 0,
    },
    sunday: {
      flag: false,
      start: 0,
      end: 0,
    },
  });

  const [Flatno, setFlatNo] = useState("");
  const [Building, setBuilding] = useState("");
  const [Street, setStreet] = useState("");
  const [Area, setArea] = useState("");

  const [photoUrl, setPhotoUrl] = useState(null);
  // <<<<<<< HEAD
  const [loading, setLoading] = useState(false);
  // =======

  // >>>>>>> newPopBranch
  const [Price, setPrice] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [message, setMessage] = useState("");
  const [City, setCity] = useState("");
  const [guard, setGuard] = useState(false);
  const [covered, setCovered] = useState(false);
  const [camera, setCamera] = useState(false);
  const [flag, setFlag] = useState(false);
  const [imageUri, setImageUri] = useState(null);

  const [imageSetFlag, setImageSetFlag] = useState(false);

  React.useEffect(() => {
    // if(photoUrl=="1"){

    // }
    // else{
    // console.log("YES LENGTH > 0", photoUrl);

    if (photoUrl) {
      // console.log("000-> ", photoUrl);
      if (photoUrl == "2") {
        // console.log("000pp-> ", photoUrl);
        setFlag(true);
      }

      setFlag(true);
    }

    // }
  }, [photoUrl]);

  React.useEffect(() => {
    if (route.params) {
      // console.log("props ener", route.params);
      // setFlag(true)
      setMonday(route.params.item.schedule["monday"].flag);
      setTuesday(route.params.item.schedule["tuesday"].flag);
      setWednesday(route.params.item.schedule["wednesday"].flag);
      setThursday(route.params.item.schedule["thursday"].flag);
      setFriday(route.params.item.schedule["friday"].flag);
      setSaturday(route.params.item.schedule["saturday"].flag);
      setSunday(route.params.item.schedule["sunday"].flag);

      setSchedule({
        monday: {
          flag: route.params.item.schedule["monday"].flag,
          start: route.params.item.schedule["monday"].start,
          end: route.params.item.schedule["monday"].end,
        },
        tuesday: {
          flag: route.params.item.schedule["tuesday"].flag,
          start: route.params.item.schedule["tuesday"].start,
          end: route.params.item.schedule["tuesday"].end,
        },
        wednesday: {
          flag: route.params.item.schedule["wednesday"].flag,
          start: route.params.item.schedule["wednesday"].start,
          end: route.params.item.schedule["wednesday"].end,
        },
        thursday: {
          flag: route.params.item.schedule["thursday"].flag,
          start: route.params.item.schedule["thursday"].start,
          end: route.params.item.schedule["thursday"].end,
        },
        friday: {
          flag: route.params.item.schedule["friday"].flag,
          start: route.params.item.schedule["friday"].start,
          end: route.params.item.schedule["friday"].end,
        },
        saturday: {
          flag: route.params.item.schedule["saturday"].flag,
          start: route.params.item.schedule["saturday"].start,
          end: route.params.item.schedule["saturday"].end,
        },
        sunday: {
          flag: route.params.item.schedule["sunday"].flag,
          start: route.params.item.schedule["sunday"].start,
          end: route.params.item.schedule["sunday"].end,
        },
      });

      setStreet(route.params.item.Street);
      setFlatNo(route.params.item.Flatno);
      setCity(route.params.item.City);
      setBuilding(route.params.item.Building);
      setMessage(route.params.item.message);
      setArea(route.params.item.Area);
      setPrice(route.params.item.Price);
      setCamera(route.params.item.camera);
      setCovered(route.params.item.covered);
      setUserLocation({
        latitude: route.params.item.coordinates.latitude,
        longitude: route.params.item.coordinates.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
      // <<<<<<< HEAD
      // setPhotoUrl(route.params.item.imageUrl);
      // =======
      setPhotoUrl(
        route.params.item.imageUrl ? route.params.item.imageUrl : "2"
      );
      // >>>>>>> newPopBranch

      setGuard(route.params.item.guard);
    }
    setFlag(true);
  }, []);

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
    console.log("EXpo");
    setLoading(true);

    const coordinates = {
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
    };
    const obj = {
      timestamp: new Date().getTime(),
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
      message,
      schedule,
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

    console.log(obj);
    console.log("dds");

    if (!imageSetFlag && route.params) {
      console.log("EDIT without image", auth.currentUser.uid);
      obj.owner = auth.currentUser.uid;
      obj.ghash = ghash;
      console.log("schedule now : ", schedule);
      // obj.scheduleCalls = schedule;
      // obj.imageUrl = downloadURL;

      db.collection("spaces")
        .doc(route.params.item.id)

        .update(obj)
        .then(() => {
          console.log("Document successfully written!");
          navigation.replace("Maps");
        })
        .catch((error) => {
          console.error("Error writing document: ", error);
        });
    } else if (imageUri) {
      console.log("ImageUri: ", imageUri);
      uploadImageAsync(imageUri, obj, ghash);
    } else {
      Alert.alert("Alert !", "Please fill the required fields", [
        {
          text: "OK",
          onPress: () => {
            setLoading(false);
          },
        },
      ]);
    }
  };

  async function uploadImageAsync(uri, obj, ghash) {
    // console.log("uploadAsFile", uri);
    const response = await fetch(uri);
    const blob = await response.blob();

    var metadata = {
      contentType: "image/jpeg",
    };

    var ref = firebase.storage().ref().child(new Date().toISOString());

    var uploadTask = ref.put(blob);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            // console.log("Upload is/ paused");
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            // console.log("Upload is running");
            break;
        }
      },
      (error) => {
        console.log(error);
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          // console.log("File available at", downloadURL);
          auth.onAuthStateChanged((authUser) => {
            if (authUser) {
              // <<<<<<< HEAD
              //               console.log(authUser);
              //               obj.owner = authUser.uid;
              //               obj.ghash = ghash;
              //               obj.imageUrl = downloadURL;
              //               db.collection("spaces")
              //                 .add(obj)
              //                 .then(() => {
              //                   console.log("Document successfully written!");
              //                   setLoading(false);
              //                   navigation.replace("Maps");
              //                 })
              //                 .catch((error) => {
              //                   console.error("Error writing document: ", error);
              //                 });
              // =======
              if (!route.params) {
                console.log("NOT EDIT", authUser);
                obj.owner = authUser.uid;
                obj.ghash = ghash;
                obj.imageUrl = downloadURL;

                console.log("here the problem lies", obj);
                db.collection("spaces")
                  .add(obj)
                  .then(() => {
                    console.log("Document successfully written!");
                    navigation.replace("Maps");
                  })
                  .catch((error) => {
                    console.error("Error writing document: ", error);
                  });
              } else {
                // console.log("EDIT", authUser);
                obj.owner = authUser.uid;
                obj.ghash = ghash;
                obj.imageUrl = downloadURL;

                db.collection("spaces")
                  .doc(route.params.item.id)

                  .update(obj)
                  .then(() => {
                    // console.log("Document successfully written!");
                    navigation.replace("Maps");
                  })
                  .catch((error) => {
                    // console.error("Error writing document: ", error);
                  });
              }
              // >>>>>>> newPopBranch
            }
          });
        });
      }
    );
  }

  return (
    <ScrollView
      style={{}}
      contentContainerStyle={{ flexGrow: 1 }}
      stickyFooterIndices={[1]}
      keyboardShouldPersistTaps={"handled"}
    >
      <TabBottom navigate={navigation} />

      <View style={styles.innerContainer}>
        <Text style={styles.UserName2}>{data["Location_Image"][settings]}</Text>

        {/* <<<<<<< HEAD
        <UploadImage
          imageUri={imageUri}
          setImageUri={setImageUri}
          photoUrl={photoUrl}
          newStyle={{
            width: 250,
            height: 250,
            // elevation: 2,
            // backgroundColor: "#efefef",
            // // borderRadius:100,
            // position: "relative",
            // // borderRadius:999,
            // overflow: "hidden"
          }}
        />
======= */}
        {flag && (
          <UploadImage
            imageUri={imageUri}
            setImageUri={setImageUri}
            setImageSetFlag={setImageSetFlag}
            photoUrl={photoUrl}
            newStyle={{
              width: 250,
              height: 250,
              // elevation: 2,
              // backgroundColor: "#efefef",
              // // borderRadius:100,
              // position: "relative",
              // // borderRadius:999,
              // overflow: "hidden"
            }}
          />
        )}
        {/* >>>>>>> newPopBranch */}

        <Text style={styles.UserName}>
          {data["Location_And_Details"][settings]}
        </Text>

        {flag && (
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
        )}

        <Text style={styles.UserName}>{data["Features"][settings]}</Text>

        <View
          style={{
            // marginBottom:"20%",
            borderRadius: 15,
            backgroundColor: "white",
            width: "80%",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <Options
            option1={data["Guard"][settings]}
            option2={data["Covered"][settings]}
            option3={data["Camera"][settings]}
            param1={guard}
            param2={covered}
            param3={camera}
            function1={setGuard}
            function2={setCovered}
            function3={setCamera}
          />
        </View>

        <Text style={styles.UserName}>{data["scheduleSet"][settings]}</Text>

        <View
          style={{
            // marginBottom:"20%",
            borderRadius: 15,
            backgroundColor: "white",
            width: "80%",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <ScheduleCalls
            translation1={Translated_weekDays[0]}
            translation2={Translated_weekDays[1]}
            translation3={Translated_weekDays[2]}
            translation4={Translated_weekDays[3]}
            translation5={Translated_weekDays[4]}
            translation6={Translated_weekDays[5]}
            translation7={Translated_weekDays[6]}
            option1={weekDays[0].toLocaleLowerCase()}
            option2={weekDays[1].toLocaleLowerCase()}
            option3={weekDays[2].toLocaleLowerCase()}
            option4={weekDays[3].toLocaleLowerCase()}
            option5={weekDays[4].toLocaleLowerCase()}
            option6={weekDays[5].toLocaleLowerCase()}
            option7={weekDays[6].toLocaleLowerCase()}
            param1={monday}
            param2={tuesday}
            param3={wednesday}
            param4={thursday}
            param5={friday}
            param6={saturday}
            param7={sunday}
            schedule={schedule}
            function1={setMonday}
            function2={setTuesday}
            function3={setWednesday}
            function4={setThursday}
            function5={setFriday}
            function6={setSaturday}
            function7={setSunday}
            setSchedule={setSchedule}
          />
        </View>
        <Text style={styles.UserName}>{data["Querries"][settings]}</Text>

        <View style={styles.innerContainer3}>
          <Text style={{ marginBottom: 20 }}>
            {data["If_Any_Querry"][settings]}
          </Text>
          <TextInput
            editable={true}
            multiline={true}
            numberOfLines={5}
            style={{
              width: "100%",
              fontSize: 12,
              borderRadius: 7,
              borderWidth: 0.5,
              padding: 5,
              marginBottom: 20,
              backgroundColor: "#eeeeee",
              marginLeft: 20,
            }}
            onChangeText={(msg) => setMessage(msg)}
            defaultValue={message}
          />

          <Button
            disabled={loading}
            onPress={handleSubmit}
            title={data["Submit"][settings]}
          />
          {loading && (
            <View style={{ padding: 20 }}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )}
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
  UserName2: {
    fontFamily: "sans-serif",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 40,
    marginTop: "30%",
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
