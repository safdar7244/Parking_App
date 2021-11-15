import * as React from 'react';
import { ImageBackground,StyleSheet,View, SafeAreaView, TextInput,Text, Alert,Dimensions, SectionList } from 'react-native';
import MapView from 'react-native-maps';
import { TabView, Tab,Button ,Overlay,Switch, Divider} from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useState } from 'react';


export default function OverlaySet(props){


  return (
   
    
    <View>
    <Text style={styles.headingStyle}>Szűrők:</Text>

    <View style={{flexDirection:"row",padding:20}}> 
    <Icon name="local-police"  size={30} color="#5EA0EE"/>
    <Text style={{padding:5 }}>   Őrzött </Text>
    <Switch value={props.guard} style={{marginLeft:"auto",paddingRight:10}} color="#00DB8C" onChange={()=>{props.setGuard(!props.guard)}} />
    </View>

    <Divider orientation="horizontal" />

    <View style={{flexDirection:"row",padding:20}}> 
    <Icon name="home"  size={30} color="#5EA0EE"/>
    <Text style={{padding:5 }}>   Fedett </Text>
    <Switch value={props.covered} style={{marginLeft:"auto",paddingRight:10}} color="#00DB8C" onChange={()=>{props.setCovered(!props.covered)}} />
    </View>

    <Divider orientation="horizontal" />

    <View style={{flexDirection:"row",padding:20}}> 
    <Icon name="video-call"  size={30} color="#5EA0EE"/>
    <Text style={{padding:5 }}>   Kamera </Text>
    <Switch value={props.camera} style={{marginLeft:"auto",paddingRight:10}} color="#00DB8C" onChange={()=>{props.setCamera(!props.camera)}} />
    </View>


    <Divider orientation="horizontal" />
    <View style={{padding:20}}></View>

    </View>
                
  );
};

const styles = StyleSheet.create({

    headingStyle:
    {
      fontSize:30,
      fontWeight:"bold",
      textAlign:"center",
      padding:20
    }

});