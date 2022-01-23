import React, { useEffect, useRef } from "react";
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
  ActivityIndicator,
} from "react-native";
import MapView, { Callout } from "react-native-maps";
import { Button, Overlay } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useState, useContext } from "react";
import OverlaySet from "./Overlay";
import City from "./City";
import { Marker } from "react-native-maps";
import TabBottom from "./TabBottom";
import * as Location from "expo-location";
import geohash from "ngeohash";
import { auth, db } from "../firebase";
import { Avatar } from "react-native-elements/dist/avatar/Avatar";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapViewDirections from "react-native-maps-directions";
import PushNotification from "./PushNotification";
import { schedulePushNotification } from "./PushNotification";
import { data } from "../src/Transaltion/translation";
import ButtonMain from "./common/button";
import SettingsContext from "../src/context/Setting";
import Parked from "./Parked";
///////////////////////////////////////////////////////////////////////
const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
// const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
export default function Maps(props) {
  const { settings, saveSettings } = useContext(SettingsContext);

  const [visible, setVisible] = useState(false);
  const [visibleSearch, setVisiblesearch] = useState(false);
  const [Showmarkerdetails, setShowmarkerdetails] = useState(false);
  const [guard, setGuard] = useState(false);
  const [covered, setCovered] = useState(false);
  const [camera, setCamera] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [spaces, setSpaces] = useState(null);
  const [currentLocation, setCurrentlocation] = useState(null);
  const DirectionsTimer = useRef(null);
  const [visibleRequest, setVisibleRequest] = useState(false);
  const [user, setUser] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [bookedSpace, setBookedSpace] = useState(null);
  const [requestSpace, setrequestSpace] = useState(null);
  const [startGps, setStartGps] = useState(false);
  const [parked, setParked] = useState(false);
  const [pay, setPay] = useState(false);
  const [loadingScreen, setLoadingScreen] = useState(false);
  const [filter, setFilter] = useState(false);

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const checkBan = async () => {
    const time = new Date().getTime() / 1000;
    db.collection("users")
      .doc(auth.currentUser.uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          // console.log("Document data:", doc.data());
          let userData = doc.data();
          if (userData.history) {
            //console.log(userData.history);
            const check = time - history.date.seconds;
            console.log("CHECK", check);
            let unpaid = userData.history.filter((history) => {
              if (!history.isPayed && time - history.date.seconds > 172800) {
                console.log("here", isPayed, time - history.date.seconds);
                return history;
              } else return null;
            });
            console.log("Banned: ", new Date().getTime());

            if (unpaid) {
              db.collection("users")
                .doc(auth.currentUser.uid)
                .update({
                  Ban: true,
                })
                .then(function () {});
              props.navigation.replace("Banned");
            } else {
              db.collection("users")
                .doc(auth.currentUser.uid)
                .update({
                  Ban: false,
                })
                .then(function () {});
            }
          }
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      })
      .catch((error) => {
        //console.log("Error getting document:", error);
      });
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  if (user) {
    db.collection("users")
      .where("id", "==", user.uid)
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "modified") {
            console.log("Modified city: ", change.doc.data());
            if (change.doc.data().activeRequest) {
              if (change.doc.data().activeRequest.status == 1) {
                schedulePushNotification();
              }
            }
          }
          if (change.type === "removed") {
          }
        });
      });
  }

  ////////////////////////////////////////////////////////////
  function hello(params) {
    setVisiblesearch(true);
  }
  ////////////////////////////////////////////////////////////

  //////////////////////////////// to start interval
  function startDirections() {
    if (startGps) {
      DirectionsTimer.current = setInterval(() => {
        getLocationCurrent();
      }, 4000);
    } else {
      clearInterval(DirectionsTimer.current);
    }
  }

  //////////////////////////////// to stop interval
  function stopDirections() {
    for (var i = 0; i < 100; i++) {
      clearInterval(i);
    }
    clearInterval(DirectionsTimer.current);
    DirectionsTimer.current = null;
  }

  ////////////////////////////////////////////////////////
  useEffect(() => {
    if (startGps) {
      checkBan();
      startDirections();
      setShowmarkerdetails(false);
      setLoadingScreen(false);
    }
  }, [startGps]);
  ////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////
  async function getLanguage() {
    console.log("\n\n\n\n\n\n\n\n\n Meo");
    const userInfo = db.collection("users").doc(auth.currentUser.uid);
    const doc = await userInfo.get();
    if (!doc.exists) {
      console.log("No such document!");
    } else {
      if (doc.data().language) {
        let lang = doc.data().language;
        console.log("LANG p: ", lang);

        console.log("pp", typeof lang);
        lang == "Hungary" ? saveSettings(1) : saveSettings(0);
      }
      if (doc.data().Session) {
        console.log("PARK FROM FIREBASE", doc.data().Session);
        setParked(doc.data().Session.parked);
        setBookedSpace(doc.data().Session.bookedSpace);
      }
    }
  }
  useEffect(() => {
    console.log("THIS MAP");
    getLanguage();
  }, []);
  ////////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////////
  useEffect(() => {
    if (props.route.params) {
      setrequestSpace(props.route.params.historySpace);
      setShowmarkerdetails(props.route.params.historyCheck);
    }
  }, []);
  ////////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////////
  function AcceptRequest(customer, bookedSpace) {
    setBookedSpace(bookedSpace);
    setLoadingScreen(true);
    console.log("customer:", customer, "\nbookedspace:", bookedSpace.id);
    if (customer) {
      db.collection("spaces")
        .doc(bookedSpace.id)
        .update({
          status: 1,
        })
        .then(function () {
          setStartGps(true);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
  ////////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////////
  function resetBackend(slotId) {
    if (bookedSpace) {
      db.collection("users")
        .doc(bookedSpace.owner)
        .update({
          activeRequest: {
            status: 0,
          },
        })
        .then(function () {});

      db.collection("users")
        .doc(auth.currentUser.uid)
        .update({
          Session: null,
        })
        .then(function () {});

      db.collection("spaces")
        .doc(bookedSpace.id)
        .update({
          status: 0,
        })
        .then(function () {
          stopNavigation();
          setParked(false);
          setShowmarkerdetails(false);
        });
    }

    if (slotId) {
      db.collection("users")
        .doc(slotId)
        .update({
          activeRequest: {
            status: 0,
          },
        })
        .then(function () {
          //////console.log("updating backend2 done")
        });
    }

    db.collection("users")
      .doc(auth.currentUser.uid)
      .update({
        acceptedSession: {
          status: 0,
        },
      })
      .then(function () {
        //////console.log("updating backend1 done")
      });
  }
  /////////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////////
  function stopNavigation() {
    setStartGps(false);
    stopDirections();
  }
  ////////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////////
  function ParkCar() {
    setParked(true);
    stopNavigation();
    db.collection("users")
      .doc(auth.currentUser.uid)
      .update({
        checkIntime: new Date(),
        Session: {
          parked: true,
          bookedSpace: bookedSpace,
        },
      })
      .then(function () {});
  }
  ////////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////////
  const getGeohashRange = (
    latitude,
    longitude,
    distance // miles
  ) => {
    return new Promise((resolve) => {
      //////console.log("here");
      const lat = 0.0144927536231884; // degrees latitude per mile
      const lon = 0.0181818181818182; // degrees longitude per mile

      const lowerLat = latitude - lat * distance;
      const lowerLon = longitude - lon * distance;

      const upperLat = latitude + lat * distance;
      const upperLon = longitude + lon * distance;

      const lower = geohash.encode(lowerLat, lowerLon);
      const upper = geohash.encode(upperLat, upperLon);
      //////console.log("done");
      return resolve({ lower, upper });
    });
  };
  ////////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////////
  async function getLocationCurrent() {
    //////console.log("shdaudasdk");
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
          latitudeDelta: 0.0009,
          longitudeDelta: 0.002,
        });
        // ////console.log("hererererer",location);
        const range = await getGeohashRange(
          location.coords.latitude,
          location.coords.longitude,
          12
        );
        // ////console.log("rang", range);

        auth.onAuthStateChanged((authUser) => {
          if (authUser) {
            ////console.log("\n\n\n\n\n\n AUth:",authUser.uid,"->next : ",auth.currentUser)
            setUser(authUser);
            // ////console.log("sdsadsadsadsadsadsad", user);
          }
        });
        const a = [];
        db.collection("spaces")
          .where("ghash", ">=", range.lower)
          .where("ghash", "<=", range.upper)
          .onSnapshot((snapshot) => {
            // Your own custom logic here
            snapshot.forEach((doc) => {
              // ////console.log(doc.id, doc.data());
              let b = doc.data();
              b.id = doc.id;
              a.push(b);
            });
            setSpaces(a);
          });
      } catch (err) {}
    };
    getLocation();
  }
  ////////////////////////////////////////////////////////////

  useEffect(() => {
    getLocationCurrent();
  }, [parked]);
  ////////////////////////////////////////////////////////////

  return (
    <View style={{ flex: 1 }}>
      {
        ////console.log("GPS  ????? : ",startGps)
      }

      {parked && (
        <Overlay
          overlayStyle={{
            padding: 20,
            width: "90%",
            flex: 0.7,
            justifyContent: "center",
          }}
          isVisible={parked}
        >
          <Text style={{ textAlign: "center", fontSize: 30 }}>Car Parked!</Text>

          <Text style={{ textAlign: "center", color: "red", fontSize: 10 }}>
            {props.route.params
              ? props.route.params.error
                ? props.route.params.error
                : null
              : null}
          </Text>
          <View style={{ flex: 0.2 }}></View>
          <ButtonMain
            title="Unpark"
            function={() => {
              setPay(true);
            }}
          ></ButtonMain>
        </Overlay>
      )}

      {pay && (
        <Parked
          stopNavigation={stopNavigation}
          navigation={props.navigation}
          visible={true}
          reset={resetBackend}
          setParked={setPay}
          bookedSpace={bookedSpace}
        />
      )}

      <Overlay
        overlayStyle={{ padding: 20, width: "80%" }}
        isVisible={visible}
        onBackdropPress={() => {
          setVisible(!visible);
          setFilter(true);
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

      {/* THIS OVERLAY REPLACES MARKER CALLBACK */}
      {/* THIS OVERLAY REPLACES MARKER CALLBACK */}
      <Overlay
        overlayStyle={{ padding: 20, width: "80%" }}
        isVisible={Showmarkerdetails}
        onBackdropPress={() => {
          setShowmarkerdetails(!Showmarkerdetails);
        }}
      >
        <View style={{ width: "100%" }}>
          <View
            style={{
              backgroundColor: "white",
              alignItems: "center",
            }}
          >
            <Avatar
              size={90}
              source={{
                uri: requestSpace
                  ? requestSpace.imageUrl
                  : "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg",
              }}
              containerStyle={{
                backgroundColor: "grey",
                width: "100%",
              }}
            ></Avatar>

            <Text style={{ fontSize: 20, margin: 5 }}>
              {data["Price"][settings] + ":"}{" "}
              {requestSpace && requestSpace.Price}{" "}
            </Text>
            <Text style={{ fontSize: 15, margin: 5 }}>
              {data["Address"][settings] + ":"}{" "}
              {requestSpace &&
                requestSpace.Flatno +
                  " " +
                  requestSpace.Area +
                  " " +
                  requestSpace.Building}{" "}
            </Text>
            <Text style={{ fontSize: 15, margin: 5 }}>
              {requestSpace && requestSpace.Street + ", " + requestSpace.City}
            </Text>
            <Text style={{ fontSize: 15, margin: 5 }}>
              {requestSpace && requestSpace.message + " "}
            </Text>
            <View style={{ fontSize: 15, margin: 5 }}></View>
            {loadingScreen ? (
              <View style={{ flex: 1, padding: 20 }}>
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
            ) : (
              <Button
                onPress={() => {
                  AcceptRequest(auth.currentUser.uid, requestSpace);

                  // onPress={() => {
                  // ////console.log(space);
                  // if (props.route.params) {
                  //   //console.log("USerss");
                  //   Book(props.route.params.historySpace);
                  // } else {
                  //   console.log("NO ONE SHOULD COME");
                  //   AcceptRequest(auth.currentUser, requestSpace);
                  // }

                  // ////console.log(a);
                }}
                titleStyle={{ color: "white" }}
                buttonStyle={{
                  backgroundColor: "#5EA0EE",
                }}
                containerStyle={{}}
                title="Book"
              ></Button>
            )}
          </View>
        </View>
      </Overlay>
      {/* THIS OVERLAY REPLACES MARKER CALLBACK */}

      <Overlay
        overlayStyle={{ width: "85%" }}
        isVisible={visibleSearch}
        onBackdropPress={() => {
          setVisiblesearch(!visibleSearch);
        }}
      >
        <City
          setVisiblesearch={setVisiblesearch}
          setUserLocation={setUserLocation}
          setCurrentlocation={setCurrentlocation}
        />
      </Overlay>

      {startGps && (
        <View
          style={{
            position: "absolute",
            width: "100%",
            zIndex: 10,
            bottom: "20%",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            onPress={ParkCar}
            titleStyle={{ color: "white" }}
            buttonStyle={{
              backgroundColor: "red",
            }}
            containerStyle={{}}
            title="stop navigation and park"
          ></Button>
        </View>
      )}

      <View
        style={{
          position: "absolute",
          width: "100%",
          zIndex: 10,
          top: 50,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
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
          title={data["Search"][settings]}
        ></Button>

        <Button
          icon={<Icon name="adjust" size={30} color="green" />}
          buttonStyle={styles.filterButton}
          onPress={getLocationCurrent}
        ></Button>
      </View>

      <View style={{ flex: 1, zIndex: 2 }}>
        <GooglePlacesAutocomplete
          placeholder="Search"
          onPress={(data, details = null) => {
            // 'details' is provided when fetchDetails = true
            // ////console.log(data, details);
          }}
          query={{
            key: "AIzaSyDSkRh8fA-d_EiajxpIwO8QYEPFA7fm2wA",
            language: "en",
          }}
        />
        <MapView
          initialRegion={userLocation}
          style={styles.map}
          region={userLocation}
        >
          {userLocation && <Marker coordinate={userLocation} />}

          {startGps && (
            <MapViewDirections
              lineDashPattern={[1]}
              origin={userLocation}
              destination={bookedSpace.coordinates}
              apikey={"AIzaSyBF4pISVkNESXEyzdHxDXZjupKC9n-xyTQ"}
              strokeWidth={3}
              strokeColor="blue"
            />
          )}

          {spaces &&
            spaces.map((space) => {
              const a = space;
              // ////console.log("user", user);
              // <<<<<<< HEAD
              //               if (
              //                 user &&
              //                 user.uid !== space.owner &&
              //                 space.camera === camera &&
              //                 space.guard === guard &&
              //                 space.covered === covered
              //               )
              // =======
              if (user && filter) {
                if (
                  user &&
                  user.uid !== space.owner &&
                  space.camera === camera &&
                  space.guard === guard &&
                  space.covered === covered
                )
                  // >>>>>>> newPopBranch
                  return (
                    <Marker
                      coordinate={{
                        latitude: space.coordinates.latitude,
                        longitude: space.coordinates.longitude,
                      }}
                      onPress={() => {
                        setrequestSpace(space);
                        setShowmarkerdetails(true);
                      }}
                    ></Marker>
                  );
                else {
                  return null;
                }
              } else {
                // console.log("NON BB2");

                if (user && user.uid !== space.owner)
                  return (
                    <Marker
                      coordinate={{
                        latitude: space.coordinates.latitude,
                        longitude: space.coordinates.longitude,
                      }}
                      onPress={() => {
                        setrequestSpace(space);
                        setShowmarkerdetails(true);
                      }}
                    ></Marker>
                  );
                else {
                  return null;
                }
              }
            })}
        </MapView>
      </View>
      <TabBottom navigate={props.navigation} />
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
