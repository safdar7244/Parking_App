import * as React from 'react';
import { ImageBackground,StyleSheet,View, SafeAreaView, TextInput,Text, Alert,Dimensions, SectionList } from 'react-native';
import MapView from 'react-native-maps';
import { TabView, Tab,Button ,Overlay,Switch, Divider,SearchBar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useState } from 'react';


export default function City(props){


  return (
   
    
    <View>

     <TextInput style={styles.SearchBar}  placeholder="Type Here..."/>
     <Divider orientation="horizontal" />

     <View style={{height:200}}></View>

    </View>
                
  );
};

const styles = StyleSheet.create({

    SearchBar:
    {
        padding:20
    }

});