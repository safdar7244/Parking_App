import * as React from 'react';
import { ImageBackground,StyleSheet, View,Picker, SafeAreaView, Text, Alert } from 'react-native';
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
import AvatarCustom from './common/AvatarCustom';
export default function AccountLanguage({navigation}){
    console.log("hhh",data)
    data["b"]="ddddd"

    const [selectedValue, setSelectedValue] = useState("java");
   
// data.b = "new value";

  return (
    <View style={styles.container}>
   
       <ImageBackground source={require('../pictures/bkg-user.jpeg')} resizeMode="cover" style={styles.image} />

<View style={styles.innerContainer}>

     
          <AvatarCustom />
          
               <Text style={styles.UserName}>User</Text>
               {/* <Overlay overlayStyle={{padding:20,width:"80%"}} isVisible={visible} onBackdropPress={()=>{setVisible(!visible)}}> */}
               <View style={styles.innerContainer2}>

               <View style={styles.row}>
               <Text style={styles.labelText}>Language</Text>

               <Picker
        selectedValue={selectedValue}
        style={{ height: 50, width: 130 ,marginLeft:"20%",fontSize:12}}
        onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
      >
        <Picker.Item label="English" value="eng" />
        <Picker.Item label="Hungary" value="hang" />
      </Picker>

    <View>
    {/* <Button title="Submit"/>  */}
      </View>
</View>



</View>
    {/* </Overlay> */}

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
  });