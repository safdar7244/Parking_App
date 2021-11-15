import * as React from 'react';
import { ImageBackground,StyleSheet, View, SafeAreaView, Text, Alert } from 'react-native';
import { Button,Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Input } from 'react-native-elements';
import ButtonMain from './common/button';

export default function Register(){
  return (
    <View style={styles.container}>
        
       <ImageBackground source={require('../pictures/bkg.png')} resizeMode="cover" style={styles.image}>

<View style={styles.innerContainer}>

     <Text style={styles.logoStyle}>Regisztrálás</Text>
     <Avatar rounded
       source={{
       uri:
         'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
        }}

        size="large"
        containerStyle={{marginTop:20,marginBottom:20}}
     />

     <Input containerStyle={styles.buttonContainer} leftIcon={{ type: 'font-awesome-5', name: 'file-signature', color:"grey",padding:5 }} 
     placeholder='Felhasználónév'/>

     <Input containerStyle={styles.buttonContainer} leftIcon={{ type: 'font-awesome-5', name: 'envelope', color:"grey" ,padding:5}}placeholder='E-mail'/>
     <Input containerStyle={styles.buttonContainer} leftIcon={{ type: 'font-awesome-5', name: 'key', color:"grey",padding:5 }}placeholder='Jelszó'/>

     <ButtonMain title="Regisztráció" function={()=>{navigation.navigate('Register')}} />

     <Text style={styles.vagayStyle}>Vagy</Text>

     <Button icon={
    <Icon
      name="facebook-square"
      size={20}
      color="white"
      style={{paddingRight:10}}
    />
  } raised={true} containerStyle={styles.buttonContainer} buttonStyle={styles.button} title="Continue with Facebook" onPress= {()=>{navigation.navigate('Login')}}> </Button>

      <View style={{height:10}}></View>
 
     <Button 
     icon={
      <Icon
        name="google"
        size={20}
        color="black"
        style={{paddingRight:15}}
      />}
       raised={true} titleStyle={{color:"black"}} containerStyle={styles.buttonContainer} buttonStyle={styles.button2} title="Continue with Google" onPress= {()=>{navigation.navigate('Login')}}> </Button>

     <View style={{height:50}}></View>

</View>

</ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
    flex: 1,
  },
  vagayStyle:
  {
    fontWeight:"bold",
    padding:15,
    fontSize:15
  },
  innerContainer:
  {
      justifyContent:"center",
      alignItems:"center"
  },
  image: {
    flex: 1,
    justifyContent: "center"
  },
  logoStyle:
  {
      fontFamily:"sans-serif",
      fontSize:40,
      fontWeight: 'bold'
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
  
  });