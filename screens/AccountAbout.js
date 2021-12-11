import * as React from 'react';
import { ImageBackground,StyleSheet, View,Linking, SafeAreaView, Text, Alert,TextInput } from 'react-native';
import { Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input ,Switch, Divider,Overlay} from 'react-native-elements';
import ButtonMain from './common/button';
import { useState } from 'react';
import { TabView,ListItem, Tab,Button } from 'react-native-elements';
import Maps from "./Maps"
import AccountEdit from "./AccountEdit"
import TabBottom from './TabBottom';
import { data } from './FormsData/formData';
export default function AccountAbout({navigation}){
 
   
  function handleClick(){
    Linking.canOpenURL("https://homeparking.hu").then(supported => {
      if (supported) {
        Linking.openURL("https://homeparking.hu");
      } else {
        console.log("Don't know how to open URI: " + this.props.url);
      }
    });
  };

// data.b = "new value";

  return (
    <View style={styles.container}>
   
       <ImageBackground source={require('../pictures/bkg-user.jpeg')} resizeMode="cover" style={styles.image} />

<View style={styles.innerContainer}>

     
          <Avatar
          rounded
            size={90}
            
            source={{
                uri:
                  'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
                 }}
            containerStyle={{ backgroundColor: 'grey', }}
          >
            <Avatar.Accessory size={0} 
            onPress={() => {}}

            />
          </Avatar>
          
               <Text style={styles.UserName}>User</Text>
            
<View style={styles.innerContainer2}>
<Text onPress={handleClick} style={styles.innerText}>Privacy Policy</Text>
<Text style={styles.innerText}>F.A.Q</Text>
<Text style={styles.innerText}>How the App Works</Text>

</View> 
<View style={styles.innerContainer2}>
<Text style={styles.innerText}>I have a Question/Suggestion</Text>
<TextInput
          editable = {true}
          multiline = {true}
          numberOfLines={5}
            style={{
              width: "100%",
              fontSize: 12,
              borderRadius: 7,
              borderWidth: .5,
              padding: 5,
              marginBottom: 20,
              backgroundColor: "#eeeeee",
              marginLeft: 20,
            }}
            // onChangeText={(message) => setmessage(message)}
          
  />
  <Button title="Send" ></Button>

</View>     
</View>
<TabBottom navigate={navigation}/>


  </View>
  );
};

const styles = StyleSheet.create({
    container: {
    flex: 1,
    // backgroundColor:"red"
  },
  row: {
    flexDirection: "row"
  },
  image: {
    minHeight:120,

    
  },
  UserName:
{
  fontFamily:"sans-serif",
  fontSize:20,
  fontWeight: 'bold',
//   marginBottom:40,
// marginTop:40
},
labelText: {
    fontSize: 14,

    // marginBottom: 10,
    paddingLeft: 10,
    // marginLeft:-20,
    paddingTop: 15,
    
  },
innerContainer2:
{
    // marginBottom:"20%",
  // borderRadius:15,
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
                marginTop:"-15%"
},
innerText:
{
  margin:5
}
  });