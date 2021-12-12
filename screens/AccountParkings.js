import * as React from 'react';
import { ImageBackground,StyleSheet, View,Picker, SafeAreaView, Text, Alert,ScrollView } from 'react-native';
import { Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input ,Switch, Divider,Overlay} from 'react-native-elements';
import ButtonMain from './common/button';
import { useState ,useContext} from 'react';
import { TabView,ListItem, Tab,Button } from 'react-native-elements';
import Maps from "./Maps"
import AccountEdit from "./AccountEdit"
import TabBottom from './TabBottom';
// import { data } from './FormsData/formData';
import AvatarCustom from './common/AvatarCustom';
import { auth, db } from "../firebase";
import SettingsContext from '../src/context/Setting';
import { data } from '../src/Transaltion/translation';
export default function AccountParkings({navigation}){
  const [username,setUsername]=useState("User")
  const {settings,saveSettings}= useContext(SettingsContext);

  React.useEffect(()=>{
    const user=auth.currentUser.providerData[0]["displayName"]
    setUsername(user)
    console.log("CURRENT : ",user)
  },[])

    const renderFunction=(key)=>{
    console.log("logged")
    }
// data.b = "new value";
const list = [
    
    {
      title: 'Slot 1',
    },
    {
        title: 'Slot 2',
      },
 
                       
    
            
      
  ]
  return (
<ScrollView style={{ minHeight:"100%" }} acontentContainerStyle={{ flexGrow: 1 ,      
}}
stickyFooterIndices={[0]}
>
    {/* <ScrollView 
    style={styles.Scrollcontainer}
> */}
<TabBottom navigate={navigation}/> 

       <ImageBackground source={require('../pictures/bkg-user.jpeg')} resizeMode="cover" style={styles.image} />

<View style={styles.innerContainer}>

     
          <AvatarCustom />
          
               <Text style={styles.UserName}>{username}</Text>

               <View style={styles.innerContainer2}>
<Text style={styles.innerText}>{data["My_Parking_Spaces"][settings]}</Text>
{
      
        list.map((item, i) => (
          <ListItem button onPress={() => {{renderFunction(i+1)}}} key={i+1} bottomDivider containerStyle={{width:"100%",fontSize:12}}>
            <ListItem.Content>
              <ListItem.Title>{item.title}</ListItem.Title>
              
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        ))
    
}
</View>
<View style={styles.innerContainer3}>
<ListItem button onPress={() => {
          console.log("pressed")
          {navigation.navigate('AccountAddParking')}}}
           key={100}  containerStyle={{width:"80%",fontSize:12}}>
            <ListItem.Content>
              <ListItem.Title>{data["Add_Slot"][settings]}      <Icon
      name="plus"
      size={20}
      color="blue"
      style={{
        //   marginLeft:"20%"
      }}
      onPress={() => {
          console.log("pressed")
          {navigation.navigate('AccountAddParking')}}}
/></ListItem.Title>
       
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>

</View>     

</View>

{/*  */}
  {/* </ScrollView> */}

  </ScrollView>

  );
};

const styles = StyleSheet.create({
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
minHeight:120,

    
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
// marginTop:40
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
    marginTop:20,
  borderRadius:15,
    backgroundColor:"white",
    width:"80%",
    // marginTop:"10%",
    justifyContent:"center",
    alignItems:"center",
padding:40,   
    
    
},
innerContainer3:
{
    marginBottom:"25%",
  borderRadius:15,
    backgroundColor:"white",
    width:"80%",
    marginTop:"10%",
    justifyContent:"center",
    alignItems:"center",
padding:30,   
    
    
},
innerContainer:
{
    // justifyContent:"center",
    alignItems:"center",
//    backgroundColor:"blue",
     marginTop:"-15%"
},
  });