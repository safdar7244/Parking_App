import * as React from 'react';
import { ImageBackground,StyleSheet, View, SafeAreaView, Text, Alert } from 'react-native';
import { Avatar } from 'react-native-elements';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import { Input } from 'react-native-elements';
// import ButtonMain from './common/button';
// import { useState } from 'react';
// import { TabView,ListItem, Tab,Button } from 'react-native-elements';
// import Maps from "./Maps"
// import AccountEdit from "./AccountEdit"
// import TabBottom from './TabBottom';
export default function Account(){
   
  
  return (
  
       <ImageBackground source={require('../../pictures/bkg-user.jpeg')} resizeMode="cover" style={styles.image}>

        <View style={styles.innerContainer}>

     
          <Avatar
            size={74}
            
            source={{
                uri:
                  'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
                 }}
            containerStyle={{ backgroundColor: 'grey' ,marginTop:"20%"}}
          >
            <Avatar.Accessory size={23} 
            onPress={() => console.log("Works!")}

            />
          </Avatar>
               <Text style={styles.UserName}>User</Text>

            
  
</View>
</ImageBackground>
)
}




const styles = StyleSheet.create({
    container: {
    flex: 1,
  },

  innerContainer:
  {
      justifyContent:"center",
      alignItems:"center",
    //   backgroundColor:"red"

  },
  image: {
    // flex: 1,
    justifyContent: "center",
    height:"0%",
    
  },
  UserName:
  {
      fontFamily:"sans-serif",
      fontSize:20,
      fontWeight: 'bold',
    //   marginBottom:40,
    // marginTop:40
  },
  tileCont:
  {
      backgroundColor:"white",
    
      width:"100%",
  },
  button:
  {
      backgroundColor:"#4267B2",
      borderRadius:5,
      padding:8

  },
  button2:
  {
      backgroundColor:"white",
      borderRadius:5,
      padding:8

  },
  buttonContainer:
  {
    width:"90%",
    borderRadius:10
  }
  ,
  tileButton:
  {
      color:"#5EA0EE",
      fontSize:10
  },
  });