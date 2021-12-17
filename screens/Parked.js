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





function Parked(props) {


    const [hours,setHours]=useState(0)
    const [stripeId,setStripeId] = useState(null);
    const [price,setPrice] = useState(null);

    async function checkout() 
    {
        //props.setParked(false)
        let date
        console.log("Asdasdas")

        const cityRef = db.collection('users').doc(auth.currentUser.uid);
        const doc = await cityRef.get();
        if (!doc.exists) {
          console.log('No such document!');
        } else 
        {
          date = doc.data().checkIntime
          const date1 = new Date();
          console.log(date1,date)
          const diffTime = Math.abs(date1 - date);
          const hours = diffTime/3600000;
          setHours(hours)
          setPrice(hours*props.bookedSpace.Price)
        }
    }

    async function pay()
    {
      props.setParked(false)
      props.reset()
    }


    return ( 
        <Overlay  isVisible={props.visible}>
            <View>
        <Text  style={{ textAlign: "center", padding: 30,fontSize:20 }}>
          Car Has Been Parked!
        </Text>

        {
          hours!=0 &&

        <TextInput
        placeholder="Stripe Id"
        style={styles.formFieldText}
        onChangeText={(text) => setStripeId(text)}
      />
        }
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {hours==0 && <>
          <ButtonMain title="Checkout and Pay Now" function={checkout}  />
          <ButtonMain title="Checkout and Pay Later" />
          </>}
          {hours!=0 && <>
          <ButtonMain title="Pay Now" function={pay}  />
          </>}
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
  