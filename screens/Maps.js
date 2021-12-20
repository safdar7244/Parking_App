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
import Account from "./Account";
import { Avatar } from "react-native-elements/dist/avatar/Avatar";
import AvatarCustom from "./common/AvatarCustom";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapViewDirections from "react-native-maps-directions";
import ParkingRequest from "./ParkingRequest";
import PushNotification from "./PushNotification";
import { schedulePushNotification } from "./PushNotification";
import { data } from "../src/Transaltion/translation";
import SettingsContext from "../src/context/Setting";
import Parked from "./Parked";
///////////////////////////////////////////////////////////////////////
const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
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
  const [currentLocation, setCurrentlocation] = useState(
    data["Search"][settings]
  );
  const DirectionsTimer = useRef(null);
  const [visibleRequest, setVisibleRequest] = useState(false);
  const [user, setUser] = useState(null);
  const [requestAccepted, setRequestAccepted] = useState(0);

  const [customer, setCustomer] = useState(null);
  const [bookedSpace, setBookedSpace] = useState(null);
  const [requestSpace, setrequestSpace] = useState(null);
  const [startGps, setStartGps] = useState(false);
  const [parked, setParked] = useState(false);
  const [requestRejected, setRequestRejected] = useState(false);
  const [loadingScreen, setLoadingScreen] = useState(false);

  const toggleOverlayRequest = () => {
    setVisibleRequest(!visibleRequest);
  };

  if (user) {
    db.collection("users")
      .where("id", "==", user.uid)
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          ////console.log("hehrehrhehrehrhehrer");

          if (change.type === "modified") {
            console.log("Modified city: ", change.doc.data());
            if (change.doc.data().activeRequest) {
              if (change.doc.data().activeRequest.status == 1) {
                if (!visibleRequest) {
                  schedulePushNotification();
                  setVisibleRequest(true);
                  setBookedSpace(change.doc.data().activeRequest.space);
                }

                ////console.log("SET CUSTOMER  : ",change.doc.data().activeRequest.id)
                ////console.log("SET BOOKED SPACES  : ",change.doc.data().activeRequest.slot_id)

                setCustomer(change.doc.data().activeRequest.id);
                // setBookedSpace(change.doc.data().activeRequest.slot_id)
              }
            }
            if (change.doc.data().acceptedSession) {
              if (change.doc.data().acceptedSession.status === 1) {
                setVisibleRequest(false);

                // setCustomer(change.doc.data().activeRequest.id);

                // setBookedSpace(change.doc.data().activeRequest.slot_id)
              }
            }
          }
          if (change.type === "removed") {
            // //console.log("Removed city: ", change.doc.data());
          }
        });
      });
  }

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

  //////////////////////////////// to start interval
  function startDirections() {
    // if (!DirectionsTimer) {
    if (startGps) {
      DirectionsTimer.current = setInterval(() => {
        getLocationCurrent();
      }, 4000);
    } else {
      clearInterval(DirectionsTimer.current);
    }
    // }
  }

  //////////////////////////////// to stop interval
  function stopDirections() {
    clearInterval(DirectionsTimer.current);
    DirectionsTimer.current = null;
  }

  useEffect(() => {
    startDirections();
  }, [startGps]);

  function Book(space) {
    setBookedSpace(space);

    ////console.log("BOOK NOW",space)
    const b = null;
    db.collection("users")
      .doc(space.owner)
      .update({
        activeRequest: {
          status: 1,
          id: auth.currentUser.uid,
          slot_id: space.id,
          space: space,
        },
      })
      .then(function () {
        setBookedSpace(space);
        console.log(bookedSpace);
      });
  }

  useEffect(() => {
    console.log("\n\n\nEFFF :", props.route.params);
    if (props.route.params) {
      setrequestSpace(props.route.params.historySpace);
      setShowmarkerdetails(props.route.params.historyCheck);
    }
  }, []);
  useEffect(() => {
    db.collection("users")
      .where("id", "==", auth.currentUser.uid)
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
          }
          if (change.type === "modified") {
            if (change.doc.data().acceptedSession) {
              if (change.doc.data().acceptedSession.status === 1) {
                setBookedSpace(change.doc.data().acceptedSession.space);
                console.log("MULTIPLE TIMES");
                setLoadingScreen(false);
                setShowmarkerdetails(false);
                setStartGps(true);
                startDirections();
              } else if (change.doc.data().acceptedSession.status === -1) {
                //console.log("\n\n\n\nRejected",visibleRequest,bookedSpace,requestSpace)
                resetBackend(change.doc.data().acceptedSession.id);
                setLoadingScreen(false);
                setRequestRejected(true);
                setStartGps(false);
                stopDirections();
              }
            }
          }
          if (change.type === "removed") {
            // ////console.log("Removed city: ", change.doc.data());
          }
        });
      });
  }, []);

  function AcceptRequest(customer, bookedSpace) {
    if (customer) {
      db.collection("users")
        .doc(customer)
        .update({
          acceptedSession: {
            status: 1,
            space: bookedSpace,
          },
        })
        .then(function () {
          console.log("accepte and updatedd");
          setVisibleRequest(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  ////////////////////////////////////////////////////////////////////
  function resetBackend(slotId) {
    if (bookedSpace) {
      db.collection("users")
        .doc(bookedSpace.owner)
        .update({
          activeRequest: {
            status: 0,
          },
        })
        .then(function () {
          stopNavigation();
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
  //////////////////////////////////////////////////////////////////////////

  function stopNavigation() {
    setStartGps(false);
    stopDirections();
  }

  function ParkCar() {
    setParked(true);

    db.collection("users")
      .doc(auth.currentUser.uid)
      .update({
        checkIntime: new Date(),
      })
      .then(function () {});
  }

  /////////////////////////////////////////////////////////////////////////

  function RejectRequest(bookedSpace) {
    console.log("HOLO", bookedSpace);
    db.collection("users")
      .doc(customer)
      .update({
        acceptedSession: {
          status: -1,
          id: auth.currentUser.uid,
        },
      })
      .then(function () {
        //////console.log("rejected and updatedd");
        setVisibleRequest(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }

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

  return (
    <View style={{ flex: 1 }}>
      {
        ////console.log("GPS  ????? : ",startGps)
      }

      <ParkingRequest
        visible={visibleRequest}
        toggleOverlay={toggleOverlayRequest}
        accept={AcceptRequest}
        reject={RejectRequest}
        customer={customer}
        bookedSpace={bookedSpace}
      />

      <Parked
        stopNavigation={stopNavigation}
        navigation={props.navigation}
        visible={parked}
        reset={resetBackend}
        setParked={setParked}
        bookedSpace={bookedSpace}
      />

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
              Price: {requestSpace && requestSpace.Price}{" "}
            </Text>
            <Text style={{ fontSize: 15, margin: 5 }}>
              Adress:{" "}
              {requestSpace &&
                requestSpace.Flatno +
                  requestSpace.Area +
                  requestSpace.Building}{" "}
            </Text>
            <Text style={{ fontSize: 15, margin: 5 }}>
              {requestSpace && requestSpace.Street + "," + requestSpace.City}
            </Text>
            <Text style={{ fontSize: 15, margin: 5 }}>
              {requestSpace && requestSpace.message}
            </Text>
            <View style={{ fontSize: 15, margin: 5 }}></View>
            {loadingScreen ? (
              <View style={{ flex: 1, padding: 20 }}>
                <ActivityIndicator size="large" color="#0000ff" />
              </View>
            ) : (
              <Button
                onPress={() => {
                  setLoadingScreen(true);
                  // onPress={() => {
                  // ////console.log(space);
                  if (props.route.params) {
                    console.log("USerss");
                    Book(props.route.params.historySpace);
                  } else {
                    console.log("NO ONE SHOULD COME");
                    Book(requestSpace);
                  }

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

            {loadingScreen && (
              <Button
                onPress={() => {
                  setLoadingScreen(false);
                  resetBackend();
                }}
                titleStyle={{ color: "white" }}
                buttonStyle={{
                  backgroundColor: "red",
                }}
                containerStyle={{}}
                title="Cancel"
              ></Button>
            )}

            {requestRejected && <Text>Your Request was Rejected</Text>}
          </View>
        </View>
      </Overlay>
      {/* THIS OVERLAY REPLACES MARKER CALLBACK */}

      <Overlay
        overlayStyle={{ width: "90%" }}
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
          title={currentLocation}
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
              if (
                user &&
                user.uid !== space.owner &&
                space.camera === camera &&
                space.guard === guard &&
                space.covered === covered
              )
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
