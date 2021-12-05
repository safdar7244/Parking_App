import * as React from 'react';
import { ImageBackground,StyleSheet,View, SafeAreaView, TextInput,Text, Alert,Dimensions } from 'react-native';
import MapView from 'react-native-maps';
import { TabView, Tab,Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useState,useEffect } from 'react';
import Maps from './Maps';
import Account from "./Account"
import AccountEdit from './AccountEdit';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import {useNavigation} from 'react-navigation-hooks';

// const Tab = createBottomTabNavigator();


export default function TabBottom(props){
  // const {navigate} = useNavigation();

  // //console.log("ppp",props.navigate)
    const [index, setIndex] = useState(0)
    
//   useEffect(()=>{
// //console.log("index Changed")
// if(index==0){
//   // props.navigate.navigate('Maps')

// }
// else if(index==2){
//   props.navigate.navigate('Account')
// }

//   },[index])
  return (
   


      
      <View  style={styles.tab} >
      <Tab indicatorStyle={{backgroundColor:"white"}}  value={index} onChange={setIndex} >
        <Tab.Item
        onPressIn={()=>{
          //console.log("pressed1")
          props.navigate.navigate('Maps')
          
          }} 
        icon={ <Icon name="place" size={30} color="#5EA0EE"/>} buttonStyle={styles.tileCont} containerStyle={{color:"black"}} titleStyle={styles.tileButton} title="Térkép" />
        <Tab.Item icon={ <Icon name="confirmation-number"  onPress={()=> {}} size={30} color="#5EA0EE"/>} buttonStyle={styles.tileCont} titleStyle={styles.tileButton} title="Jegyek" />
        <Tab.Item 
        onPressIn={()=>{
          //console.log("pressed3")
          props.navigate.navigate('Account')
          
          }} 
        icon={ <Icon name="portrait"  size={30} color="#5EA0EE"/>} buttonStyle={styles.tileCont} titleStyle={styles.tileButton} title="Fiók" />
      </Tab>  
      </View>

    



  );
};

const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
        
    //   },
      tab:
      {
          position:"absolute",
          bottom:0,
          width:"100%",
          backgroundColor:"white",
          color:"black",
          zIndex:100,
      },
      tileButton:
      {
          color:"#5EA0EE",
          fontSize:10
      },
      tileCont:
      {
          backgroundColor:"white",
      },
      
});