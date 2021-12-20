import React, { useState } from 'react';

import {
    ImageBackground,
    StyleSheet,
    View,
    SafeAreaView,
    TextInput,
    Text,
    Alert,
    Dimensions,
    SectionList,
    ActivityIndicator,
  } from "react-native";
  import {
    TabView,
    Tab,
    Button,
    Overlay,
    Switch,
    Divider,
  } from "react-native-elements";
  import { auth, db } from "../firebase";
  import ButtonMain from './common/button'





function Parked(props,navigation) {


    const [hours,setHours]=useState(0)
    const [stripeId,setStripeId] = useState(null);
    const [price,setPrice] = useState(null);

    async function checkout() 
    {
      
        let date
        console.log("Asdasdas")

        const cityRef = db.collection('users').doc(auth.currentUser.uid);
        const doc = await cityRef.get();
        if (!doc.exists) {
          console.log('No such document!');
        } else 
        {
          date = new Date (doc.data().checkIntime.seconds*1000)
          const date1 = new Date();
          console.log(date1,date)
          const diffTime = Math.abs(date1 - date);
          const hours = diffTime/3600000;
          setHours(hours)
          setPrice(hours*props.bookedSpace.Price)
          console.log("HIURSSs",price)
          props.navigation.navigate('Card',{ pay: pay,ownerid:props.bookedSpace.owner ,price :200})
        }
    }

    async function pay()
    {

      var history=[];
      const cityRef = db.collection('users').doc(auth.currentUser.uid);
      const doc = await cityRef.get();
      if (!doc.exists) 
      {
        console.log('No such document!');
      } else 
      {
        if(doc.data().history){
        history=doc.data().history;}
      }
      
      history.push({
        bookedSpace:props.bookedSpace,
          date: new Date()})

      db.collection("users")
      .doc(auth.currentUser.uid)
      .update({
        history:history
      })
      .then(function () {
        props.setParked(false)
        props.reset()
      });
    }


    return ( 
        <Overlay  isVisible={props.visible}>
            <View>
        <Text  style={{ textAlign: "center", padding: 30,fontSize:20 }}>
          Car Has Been Parked!
        </Text>

        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
  
          <ButtonMain title="Checkout and Pay Now" function={checkout}  />
          <ButtonMain title="Checkout and Pay Later" />

        </View>
          <View style={{padding:20}}></View>
            </View> 
        </Overlay>
     );
}

export default Parked;

const styles = StyleSheet.create({
    container: {
      padding: 20,
    },
    button: {
      padding: 10,
      margin: 10,
      width:"100%",
      textAlign:"center"
    },
    buttonContainer:
    {
        textAlign:"center"
    },
    formFieldText: {
    width:"100%",
    fontSize: 12,
    borderRadius: 5,
    borderWidth: .5,
    padding: 10,
    backgroundColor:"#eeeeee",
    marginTop:10,
    marginBottom:10
  },
  });
  