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
export default function Tickets({navigation}){

  const list_spaces=[

  ]
//   const [username,setUsername]=useState("User")
  const {settings,saveSettings}= useContext(SettingsContext);

  const [spaces,setSpaces]=useState([])
  React.useEffect(()=>{
    // const user=auth.currentUser.providerData[0]["displayName"]
    // setUsername(user)
    // console.log("CURRENT : ",user)

console.log("Entered")
    db.collection("spaces")
    .where("owner", "==", auth.currentUser.uid)
    .onSnapshot((snapshot) => {
      // Your own custom logic here
      snapshot.forEach((doc) => {
        // ////console.log(doc.id, doc.data());
// console.log("PARKING SLOT YAAAY",doc.data())
let dd=doc.data()
dd["title"]="Slot "+(list_spaces.length+1)
// const dta={
//   title:2
// }
// dd.append(dta)
list_spaces.push(dd)
      });
      // console.log(list_spaces)
      // console.log(list_spaces.length)
      setSpaces(list_spaces);
    });






  },[])

    const renderFunction=(item,key)=>{
    console.log("key : ",key)
     navigation.replace(
      'AccountAddParking',
      { item },
    );

    

    }
// data.b = "new value";
// const list = [
    
//     {
//       title: 'Slot 1',
//     },
//     {
//         title: 'Slot 2',
//       },
 
                       
    
            
      
//   ]
  return (
<ScrollView style={{ minHeight:"100%" }} acontentContainerStyle={{ flexGrow: 1 ,      
}}
stickyFooterIndices={[0]}
>
    {/* <ScrollView 
    style={styles.Scrollcontainer}
> */}
{/* <TabBottom navigate={navigation}/>  */}

       {/* <ImageBackground source={require('../pictures/bkg-user.jpeg')} resizeMode="cover" style={styles.image} /> */}

<View style={styles.innerContainer}>

     
          {/* <AvatarCustom /> */}
          
               {/* <Text style={styles.UserName}>{username}</Text> */}

               <View style={styles.innerContainer2}>
<Text style={styles.innerText}>{data["My_Parking_Spaces"][settings]}</Text>
{
      
        spaces.map((item, i) => (
          <ListItem button onPress={() => {{renderFunction(item,i+1)}}} key={i+1} bottomDivider containerStyle={{width:"100%",fontSize:12}}>
            <ListItem.Content>
              <ListItem.Title>{item.title}</ListItem.Title>
              
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        ))
    
}
</View>


</View>



  </ScrollView>

  );
};

const styles = StyleSheet.create({
    Scrollcontainer:{
    
    },
    container: {
    flex: 1,
  },
  
  image: {
   
minHeight:120,

    
  },
  innerText:{

  },
  UserName:
{
  fontFamily:"sans-serif",
  fontSize:20,
  fontWeight: 'bold',
  marginBottom:40,
},
labelText: {
  
    
  },
innerContainer2:
{
    marginTop:20,
  borderRadius:15,
    backgroundColor:"white",
    width:"80%",
    justifyContent:"center",
    alignItems:"center",
padding:40,   
    
    
},
innerContainer3:
{
    marginBottom:"55%",
  borderRadius:15,
    backgroundColor:"white",
    width:"80%",
    marginTop:"20%",
    justifyContent:"center",
    alignItems:"center",
padding:30,   
    
    
},
innerContainer:
{
    alignItems:"center",

},
  });