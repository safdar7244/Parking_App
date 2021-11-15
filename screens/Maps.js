import * as React from 'react';
import { ImageBackground,StyleSheet,View, SafeAreaView, TextInput,Text, Alert,Dimensions, SectionList } from 'react-native';
import MapView from 'react-native-maps';
import { TabView, Tab,Button ,Overlay,Switch, Divider} from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useState } from 'react';
import OverlaySet from './Overlay';
import City from './City';
import { Marker } from 'react-native-maps';
import TabBottom from './TabBottom';


export default function Maps({navigation}){

  const [visible, setVisible] = useState(false);
  const [visibleSearch,setVisiblesearch]= useState(false)

  const [guard, setGuard] = useState(false);
  const [covered, setCovered] = useState(false);
  const [camera, setCamera] = useState(false);
  
  const [reigon,setRegion] = useState({
    latitude: 31.4760,
    longitude: 74.3045,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,})

  function hello(params) {
    setVisiblesearch(true)
  }


  return (
   
    <View style={{flex:1}}>


      <Overlay overlayStyle={{padding:20,width:"80%"}} isVisible={visible} onBackdropPress={()=>{setVisible(!visible)}}>

        <OverlaySet guard={guard} covered={covered} camera={camera} setGuard={setGuard} setCovered={setCovered} setCamera={setCamera}  />

      </Overlay>

      <Overlay overlayStyle={{padding:20,width:"80%"}} isVisible={visibleSearch} onBackdropPress={()=>{setVisiblesearch(!visibleSearch)}}>

        <City/>

      </Overlay>

      

    <View  style={{position:"absolute",width:"100%",zIndex:10,top:50,flexDirection:'row' }}> 
    <Button icon={ <Icon name="filter-list"  size={30} color="grey"/>} buttonStyle={styles.filterButton} onPress={()=>{setVisible(!visible)}}  ></Button>
    
    <Button onPress={hello} titleStyle={{color:"black" }} buttonStyle={{backgroundColor:"white",paddingTop:12}} containerStyle={styles.searchBar} title="Lahore"></Button>

    <Button  icon={ <Icon name="adjust"  size={30} color="green"/>} buttonStyle={styles.filterButton} ></Button>

    </View>
        
        <View style={{flex:1,zIndex:2}}>  


      <MapView  
      
      region={reigon}

      style={styles.map} >


       <Marker draggable style={{zIndex:10}}
        coordinate={{latitude: 31.4760, longitude: 74.3045}}
        onDragEnd={(e) => this.setState({ x: e.nativeEvent.coordinate })}
        title={"Hi"}/>


        </MapView>
      
      </View>
      <TabBottom navigate={navigation}/>
      </View>
                
  );
};

const styles = StyleSheet.create({

    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        position: 'absolute',
      },
    searchBar:
    {
      backgroundColor:"white",
      width:"50%",
      margin:10,
      elevation:3
    },
    searchInput:
    {
        backgroundColor:"white",
        borderColor:"white"
    },
    filterButton:
    {
        padding:10,
        margin:10,
        borderRadius:5,
        backgroundColor:"white",
    },


});