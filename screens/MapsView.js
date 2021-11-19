import * as React from 'react';
import { ImageBackground,StyleSheet, Dimensions,View,Picker, SafeAreaView, Text, Alert,ScrollView,TextInput } from 'react-native';

import { useState,useEffect } from 'react';

import TabBottom from './TabBottom';

import * as Location from "expo-location";
import MapView, { Marker, Callout } from "react-native-maps";

// import TabBottom from "./TabBottom";
export default function MapsView({navigation}){
    
    const [Flatno,setFlatNo]=useState('')
    const [Building,setBuilding]=useState('')
    const [Street,setStreet]=useState('')
    const [Area,setArea]=useState('')
    const [Price,setPrice]=useState('')

    const [userLocation, setUserLocation] = useState(null);
    const [isFetching, setIsFetching] = useState(false);




const markerHandler = (event) => {
console.log(event);
setUserLocation({
  latitude: event.nativeEvent.coordinate.latitude,
  longitude: event.nativeEvent.coordinate.longitude,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
});
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
  } catch (err) {}
};
getLocation();
}, []);
////


  return (

<View style={styles.innerContainer}>

<MapView
        style={styles.map}
        initialRegion={userLocation}
        onPress={markerHandler}
      >
          
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            draggable={true}
            onDragEnd={(e) => {
              console.log("sadsad", e.nativeEvent.coordinate);
            }}
          >
            <Callout>
              <Text>Hello</Text>
            </Callout>
          </Marker>
        )}
      </MapView>

          
               {/* <Text style={styles.UserName}>User</Text> */}

            
                <View style={styles.innercontainer2}>

              <View style={styles.row}>

                {/* <Text style={styles.labelText}>Address</Text> */}
                <TextInput
                  style={styles.formFieldText}
                  onChangeText={Flat => setFlatNo(Flat)}
                 defaultValue={Flatno}
                 placeholder="Flat/Villa No"
                />
                <TextInput
                  style={styles.formFieldTextRight}
                  onChangeText={Building => setBuilding(Building)}
                 defaultValue={Building}
                 placeholder="Building/Villa"

                />







                </View>
               <View style={styles.row}> 
               
                {/* <Text style={styles.labelText}>Ft/hr        </Text> */}
                <TextInput
       style={styles.formFieldText}
       onChangeText={Street => setStreet(Street)}
      defaultValue={Street}
      placeholder="Street"
      />
       <TextInput
       style={styles.formFieldTextRight}
       onChangeText={Area => setArea(Area)}
      defaultValue={Area}
      placeholder="Area"

      />
                </View>
                <View style={styles.row}>
                <TextInput
       style={styles.formFieldTextFull}
       onChangeText={Price => setPrice(Price)}
      defaultValue={Price}
      placeholder="Ft/Hr"
      />

                    </View>

                {/* <Button onPress={handleSubmit} title="Submit"/> */}

            
          

</View>
 




</View>


  );
};

const styles = StyleSheet.create({
    map:{
        width:Dimensions.get('window') | 400 ,
        height:300,
        marginBottom:40,

    },
    row: {
        flexDirection: "row"
      },
      innercontainer:{
        marginTop:30,
        justifyContent:"center",
        alignItems:"center",
      },
      formFieldText: {
        width:"50%",
        fontSize: 12,
        borderRadius: 7,
        borderWidth: 1,
        padding: 5,
        marginBottom:20,
        backgroundColor:"#f2f2f2",
        // marginLeft:20
    },
    formFieldTextFull:{
        width:"110%",
        fontSize: 12,
        borderRadius: 7,
        borderWidth: 1,
        padding: 5,
        marginBottom:20,
        backgroundColor:"#f2f2f2",
        // marginLeft:20
    },
    formFieldTextRight: {
        width:"50%",
        fontSize: 12,
        borderRadius: 7,
        borderWidth: 1,
        padding: 5,
        marginBottom:20,
        backgroundColor:"#eeeeee",
        marginLeft:20
    },
      innercontainer2:{
        backgroundColor:"white",
        width:"75%",
        padding:40,
        marginBottom:100,
      },
    Scrollcontainer:{
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
minHeight:200,
backgroundColor:"red"

    
  },
  innerText:{
// backgroundColor:"white",
// width:"80%",
// fontSize:19,
// fontWeight:"bold",
// marginRight:100
  },
  UserName:
{
  fontFamily:"sans-serif",
  fontSize:20,
  fontWeight: 'bold',
  marginBottom:40,
marginTop:40
},
labelText: {
    // fontSize: 14,

    // // marginBottom: 10,
    // paddingLeft: 10,
    // // marginLeft:-20,
    // paddingTop: 15,
    
  },
innerContainer2:
{
    // marginBottom:"20%",
  borderRadius:15,
    backgroundColor:"white",
    width:"80%",
    // marginTop:"10%",
    justifyContent:"center",
    alignItems:"center",
padding:20,   
    
    
},
innerContainer3:
{
    marginBottom:"20%",
  borderRadius:15,
    backgroundColor:"white",
    width:"80%",
    marginTop:"10%",
    justifyContent:"center",
    alignItems:"center",
padding:20,   
    
    
},
innerContainer:
{
    // justifyContent:"center",
    alignItems:"center",
//    backgroundColor:"blue",
    //  marginTop:"5%", 
    marginBottom:"-28%",
    },
  });