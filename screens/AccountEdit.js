import * as React from 'react';
import { ImageBackground,StyleSheet, View, SafeAreaView, TextInput,Text, Alert } from 'react-native';
import { Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';
import ButtonMain from './common/button';
import { useState ,useContext} from 'react';
import { TabView,ListItem, Tab,Button } from 'react-native-elements';
import { formData } from './FormsData/formData';
import TabBottom from './TabBottom';
import AvatarCustom from './common/AvatarCustom';
import { Formik } from 'formik'
import { auth, db } from "../firebase";
import SettingsContext from '../src/context/Setting';
import { data } from '../src/Transaltion/translation';
export default function AccountEdit({navigation}){
  const {settings,saveSettings}= useContext(SettingsContext);

  console.log("setthings :  ",settings)
  
  const [username,setUsername]=useState("User")
  const [email,setEmail]=useState("User")

  React.useEffect(()=>{
    const user=auth.currentUser.providerData[0]["displayName"]
    setUsername(user)
    setEmail(auth.currentUser.providerData[0]["email"])
    // console.log("CURRENT : ",auth.currentUser.providerData[0]["email"])
  },[]);

function updateDbname(val)
{
  db.collection("users")
        .doc(auth.currentUser.uid)
        .update({
          name: val
        })
        .then(function () {
         console.log("English set")
        }); 
}
    return (
        // <View style={styles.container}>
          
        //   <ImageBackground source={require('../pictures/bkg-user.jpeg')} resizeMode="cover" style={styles.image}>


        //   <View style={styles.innerContainer}>
        //   <Avatar
        //     size={80}
            
        //     source={{
        //         uri:
        //           'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
        //          }}
        //     containerStyle={{ backgroundColor: 'grey' }}
        //   >
        //     <Avatar.Accessory size={23} 
        //     onPress={() => console.log("Works!")}

        //     />
        //   </Avatar>
          
        //        <Text style={styles.UserName}>User</Text>

        //   <View style={styles.innerContainer2}>
        //   <FormField
        //   label='Username'
        //     formKey='username'
        //     placeholder='Your username'
    
        //     handleFormValueChange={handleFormValueChange}
        //   />
        //   <FormField
        //     label='Email'
        //     formKey='email'
        //     placeholder='Your email id'
        //     textInputProps={{
        //       autoCapitalize: "none"
        //     }}
        //     handleFormValueChange={handleFormValueChange}
        //   />
          
        //   {/* <Text style={styles.header}>Values in Hook: </Text>
        //   <View>
        //     <Text style={styles.formText}>Username is : {formValues.username}</Text>
        //     <Text style={styles.formText}>Email is: {formValues.email}</Text>
        //   </View> */}
        //   </View>
        //   </View>
        //   </ImageBackground>
        //   <TabBottom navigate={navigation}/>
        // </View>









        ////
        <View style={styles.container}>

          <ImageBackground source={require('../pictures/bkg-user.jpeg')} resizeMode="cover" style={styles.image} />


          <View style={styles.innerContainer}>
          <AvatarCustom />
          
               <Text style={styles.UserName}>{username}</Text>
               </View>

          <Formik
            initialValues={{_username:''}}
            onSubmit={(values) =>{
               console.log('submitted', values._username)
              //  auth.currentUser.providerData[0]["displayName"]=values._username
              auth.currentUser.updateProfile({
                displayName: values._username,
              });
              updateDbname(values._username)
               setUsername(values._username)

              Alert.alert(
                "Success !",
                "Username successfully changed ",
                [
                
                  { text: "OK", onPress: () => {
                    navigation.navigate('Maps')

                    setTimeout(()=>{
                      navigation.navigate('Account')

                    },500)

                  }}
                ]
              );
              }}
          >
             {({handleChange, handleSubmit, values})=>(
               <View style={styles.innercontainer}>
                <View style={styles.innercontainer2}>

              <View style={styles.row}>

                <Text style={styles.labelText}>{data["User"][settings]}</Text>
                <TextInput
                  style={styles.formFieldText}
                  value={values._username}
                  onChangeText={handleChange('_username')}
                />
                </View>
               <View style={styles.row}> 
               
                <Text style={styles.labelText}>{data["Email"][settings]}</Text>
                <TextInput
                  style={styles.formFieldText}
                  value={email}
                  onChangeText={handleChange('email')}
                  editable={false}
                  // secureTextEntry={true}
                />
                </View>
                <Button onPress={handleSubmit} title={data["Submit"][settings]}/>

                </View>
              </View>
            )}
          </Formik>
</View>


      )
    
}
    
    const styles = StyleSheet.create({
      row: {
        flexDirection: "row"
      },
      innercontainer:{
        marginTop:30,
        justifyContent:"center",
        alignItems:"center",
      },
      innercontainer2:{
        backgroundColor:"white",
        width:"80%",
        padding:40
      },
      inputWrap: {
        flex: 1,
        borderColor: "#cccccc",
        borderBottomWidth: 1,
        marginBottom: 10
      },
      container: {
        flex: 1,
      },
      header: {
        // fontSize: 20,
        // paddingTop: 30
      },
      formText: {
        // fontSize: 20,
        // padding: 10,
        // paddingLeft: 0
      },
      innerContainer:
      {
                  // justifyContent:"center",
    alignItems:"center",
    //    backgroundColor:"blue",
         marginTop:"-15%"
      },
      innerContainer2:
      {
          marginTop:20,
        // borderRadius:15,
          backgroundColor:"white",
          width:"80%",
          justifyContent:"center",
          alignItems:"center",
          height:250,
          
          
          
      },
      formFieldText: {
        width:150,
        fontSize: 12,
        borderRadius: 7,
        borderWidth: 1,
        padding: 5,
        marginBottom:20,
        backgroundColor:"#eeeeee",
        marginLeft:20
    },
    labelText: {
      fontSize: 12,
  
      // marginBottom: 10,
      paddingLeft: 10,
      marginLeft:-20,
      paddingTop: 10,
      width:"40%"
      
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
    })
