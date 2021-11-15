import * as React from 'react';
import { ImageBackground,StyleSheet, View, SafeAreaView, Text, Alert } from 'react-native';
import { Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input ,Switch, Divider,Overlay} from 'react-native-elements';
import { useState } from 'react';

export default function AccountNotifications({navigation}){
    const [guard, setGuard] = useState(false);
    const [covered, setCovered] = useState(false);
    const [camera, setCamera] = useState(false);
    // const [visible, setVisible] = useState(false);



  return (
   
                
               <View style={styles.innerContainer2}>
 

    <View style={{flexDirection:"row",padding:10}}> 
    <Text style={{padding:5 }}>   Option 1 </Text>
    <Switch value={guard} style={{marginLeft:"auto",paddingRight:10}} color="#00DB8C" onChange={()=>{setGuard(!guard)}} />
    </View>

    <Divider orientation="horizontal" />

    <View style={{flexDirection:"row",padding:10}}> 
    <Text style={{padding:5 }}>   Option 2 </Text>
    <Switch value={covered} style={{marginLeft:"auto",paddingRight:10}} color="#00DB8C" onChange={()=>{setCovered(!covered)}} />
    </View>

    <Divider orientation="horizontal" />

    <View style={{flexDirection:"row",padding:10}}> 
    <Text style={{padding:5 }}>   Option 3 </Text>
    <Switch value={camera} style={{marginLeft:"auto",paddingRight:10}} color="#00DB8C" onChange={()=>{setCamera(!camera)}} />
    </View>




</View>
  )
};

const styles = StyleSheet.create({
    container: {
    flex: 1,
  },
  tab:
  {
    //   position:"absolute",
    //   bottom:0,
    display:"flex",
      width:"80%",
      backgroundColor:"white",
      color:"black",
      zIndex:3,
  },
  vagayStyle:
  {
    fontWeight:"bold",
    padding:15,
    fontSize:15
  },
  ListStyle:{
      marginTop:"10%",
    justifyContent:"center",
    alignItems:"center" ,
    width:"100%",
    
},
innerContainer2:{
    backgroundColor:"white",
    width:"80%",
    marginTop:"10%"

},
  innerContainer:
  {
      justifyContent:"center",
      alignItems:"center",
      // backgroundColo r:"red",
      marginTop:"-60%",
  },

  image: {
    flex: 1,
    justifyContent: "center",
    height:"20%",
    
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
  headingStyle:
    {
      fontSize:30,
      fontWeight:"bold",
      textAlign:"center",
      padding:20
    }

  });