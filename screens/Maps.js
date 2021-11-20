import React, { useEffect } from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  SafeAreaView,
  TextInput,
  Text,
  Alert,
  Dimensions,
  SectionList,
} from "react-native";
import MapView , { Callout} from "react-native-maps";
import {
  TabView,
  Tab,
  Button,
  Overlay,
  Switch,


  Divider,
} from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useState } from "react";
import OverlaySet from "./Overlay";
import City from "./City";
import { Marker } from "react-native-maps";
import TabBottom from "./TabBottom";
import * as Location from "expo-location";
import geohash from "ngeohash";
import { auth, db } from "../firebase";
import Account from "./Account";
import { Avatar } from "react-native-elements/dist/avatar/Avatar";
import AvatarCustom from "./common/AvatarCustom";
export default function Maps({ navigation }) {
  const [visible, setVisible] = useState(false);
  const [visibleSearch, setVisiblesearch] = useState(false);

  const [guard, setGuard] = useState(false);
  const [covered, setCovered] = useState(false);
  const [camera, setCamera] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [spaces, setSpaces] = useState(null);

  const [reigon, setRegion] = useState({
    latitude: 31.476,
    longitude: 74.3045,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [x, setx] = useState({ latitude: 31.466, longitude: 74.3045 });
  function hello(params) {
    setVisiblesearch(true);
  }

  const getGeohashRange = (
    latitude,
    longitude,
    distance // miles
  ) => {
    return new Promise((resolve) => {
      console.log("here");
      const lat = 0.0144927536231884; // degrees latitude per mile
      const lon = 0.0181818181818182; // degrees longitude per mile

      const lowerLat = latitude - lat * distance;
      const lowerLon = longitude - lon * distance;

      const upperLat = latitude + lat * distance;
      const upperLon = longitude + lon * distance;

      const lower = geohash.encode(lowerLat, lowerLon);
      const upper = geohash.encode(upperLat, upperLon);
      console.log("done");
      return resolve({ lower, upper });
    });

    // console.log("bogaobga");

    // return {
    //   lower,
    //   upper,
    // };
  };

  useEffect(() => {
    console.log("shdaudasdk");
    const verifyPersmission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return false;
      }
      return true;
    };
    const getLocation = async () => {
      const done = await verifyPersmission();
      if (!done) {
        return;
      }
      try {
        const location = await Location.getCurrentPositionAsync({
          timeout: 4000,
        });
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        console.log("hererererer");
        const range = await getGeohashRange(
          location.coords.latitude,
          location.coords.longitude,
          12
        );
        console.log("rang", range);
        const a = [];
        db.collection("spaces")
          .where("ghash", ">=", range.lower)
          .where("ghash", "<=", range.upper)
          .onSnapshot((snapshot) => {
            // Your own custom logic here
            snapshot.forEach((doc) => {
              console.log(doc.id, doc.data());
              let b = doc.data();
              b.id = doc.id;
              a.push(b);
            });
            setSpaces(a);
          });
      } catch (err) {}
    };
    getLocation();
  }, []);
  ////

  return (
    <View style={{ flex: 1 }}>
      <Overlay
        overlayStyle={{ padding: 20, width: "80%" }}
        isVisible={visible}
        onBackdropPress={() => {
          setVisible(!visible);
        }}
      >
        <OverlaySet
          guard={guard}
          covered={covered}
          camera={camera}
          setGuard={setGuard}
          setCovered={setCovered}
          setCamera={setCamera}
        />
      </Overlay>

      <Overlay
        overlayStyle={{ padding: 20, width: "80%" }}
        isVisible={visibleSearch}
        onBackdropPress={() => {
          setVisiblesearch(!visibleSearch);
        }}
      >
        <City />
      </Overlay>

      <View
        style={{
          position: "absolute",
          width: "100%",
          zIndex: 10,
          top: 50,
          flexDirection: "row",
        }}
      >
        <Button
          icon={<Icon name="filter-list" size={30} color="grey" />}
          buttonStyle={styles.filterButton}
          onPress={() => {
            setVisible(!visible);
          }}
        ></Button>

        <Button
          onPress={hello}
          titleStyle={{ color: "black" }}
          buttonStyle={{ backgroundColor: "white", paddingTop: 12 }}
          containerStyle={styles.searchBar}
          title="Lahore"
        ></Button>

        <Button
          icon={<Icon name="adjust" size={30} color="green" />}
          buttonStyle={styles.filterButton}
        ></Button>
      </View>

      <View style={{ flex: 1, zIndex: 2 }}>
        <MapView initialRegion={userLocation} style={styles.map}>
          {spaces &&
            spaces.map((space) => {
              return (
                <Marker
                  coordinate={{
                    latitude: space.coordinates.latitude,
                    longitude: space.coordinates.longitude,
                  }}
                  onPress={()=>console.log("im here")}
                >
<Callout onPress={()=>{
  console.log("callout")}

}

  tooltip={false} style={{width:200,height:200}}>
 {/* <Account /> */}
 
 <View style={{alignItems:"center"}}>
 <Avatar
            size={90}
            
            source={{
                uri:
                  'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
                 }}
            containerStyle={{ backgroundColor: 'grey' ,width:"100%"}}
          >
            
          </Avatar>

<Text >Price </Text>
<Text >Some Details </Text>
<Text >Some More Details </Text>



  {/* <Alert>Nooo</Alert> */}
  </View>
</Callout>

                </Marker>
              );
            })}
        </MapView>
      </View>
      <TabBottom navigate={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    position: "absolute",
  },
  searchBar: {
    backgroundColor: "white",
    width: "50%",
    margin: 10,
    elevation: 3,
  },
  searchInput: {
    backgroundColor: "white",
    borderColor: "white",
  },
  filterButton: {
    padding: 10,
    margin: 10,
    borderRadius: 5,
    backgroundColor: "white",
  },
});
