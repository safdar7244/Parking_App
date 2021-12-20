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
import * as firebase from "firebase";

export default function AccountAddParking({ route, navigation }) {
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

  React.useEffect(() => {
    if (route.params) {
      console.log("props ener", route.params);
      // setFlag(true)
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
    console.log(
      // Flatno,
      // Building,
      // Street,
      userLocation,
      // Area,
      guard,
      covered,
      camera,
      Price
      // City
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
      message,
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

    if (imageUri) {
      console.log("ImageUri: ", imageUri);
      uploadImageAsync(imageUri, obj, ghash);
    }
  };

  async function uploadImageAsync(uri, obj, ghash) {
    console.log("uploadAsFile", uri);
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
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log("Upload is paused");
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        console.log(error);
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log("File available at", downloadURL);
          auth.onAuthStateChanged((authUser) => {
            if (authUser) {
              console.log(authUser);
              obj.owner = authUser.uid;
              obj.ghash = ghash;
              obj.imageUrl = downloadURL;
              db.collection("spaces")
                .add(obj)
                .then(() => {
                  console.log("Document successfully written!");
                  navigation.replace("Maps");
                })
                .catch((error) => {
                  console.error("Error writing document: ", error);
                });
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
    >
      <TabBottom navigate={navigation} />

      <View style={styles.innerContainer}>
        <Text style={styles.UserName2}>{data["Location_Image"][settings]}</Text>

        <UploadImage imageUri={imageUri} setImageUri={setImageUri} newStyle={
       { width: 250,
        height: 250,
        elevation: 2,
        backgroundColor: "#efefef",
        // borderRadius:100,
        position: "relative",
        // borderRadius:999,
        overflow: "hidden"}}
        />

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
            onChangeText={(message) => setMessage(message)}
            defaultValue={message}
          />

          <Button onPress={handleSubmit} title={data["Submit"][settings]} />
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
