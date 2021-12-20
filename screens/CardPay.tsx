
import React, {useState} from 'react';
import {
  View,
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  TextInput,
  Text,
  Button,
} from 'react-native';
import {CardField, useConfirmPayment} from '@stripe/stripe-react-native';
import type {
  CardFieldInput,
  PaymentMethodCreateParams,
} from '@stripe/stripe-react-native';
import { auth, db } from "../firebase";
import axios from 'axios';


export default function Card({navigation,route}) {
  const [loading,setLoading]= useState(false)
  const [name, setName] = useState('');
  const price=route.params.price;
  const [card,setCard] = useState(null);
  const [cvc,setCvc] = useState(null);

  async function Check ()
{
  const cityRef = db.collection('users').doc(route.params.ownerid);
  const doc = await cityRef.get();
  if (!doc.exists) 
  {
    console.log('No such document!');
  } else 
  {
    console.log('Document data:', doc.data().stripeId);
  }
  return doc.data().stripeId
}
  
  const fetchPaymentIntentClientSecret = async () => {
    var clientSecret=null;
    var obj=null;
    const response = await axios.post('https://ancient-woodland-88729.herokuapp.com/create-payment-intent', { amount:price})
    .then((res)=>{
      obj=res.data.paymentIntent
      clientSecret=res.data.paymentIntent.id;
    })
   
    // const {clientSecret} = await response.json();
    console.log("helloo",clientSecret)
    return obj;
    
  };

  const fetchCard = async () => {
   const cardDet =
   {
    number: card.number,
    exp_month: card.expiryMonth,
    exp_year: card.expiryYear,
    cvc: cvc
   }
   console.log(cardDet)
   var obj=null;
   const response = await axios.post('https://ancient-woodland-88729.herokuapp.com/add-card', { card:cardDet})
   .then((res)=>{
     obj=res.data.data;
   })
   


  
   // const {clientSecret} = await response.json();
   console.log("helloo",obj)
   return obj;
  };


  const handlePayPress = async () => {

    try
    {
      setLoading(true);

    const card = await fetchCard();

    // 1. fetch Intent Client Secret from backend
    const obj = await fetchPaymentIntentClientSecret();

    // 2. Gather customer billing information (ex. email)
    const response = await axios.post('https://ancient-woodland-88729.herokuapp.com/confirm-payment', { key:obj.id, card:card.id})
   
    const stripeID = await Check();

    const resp = await axios.post('https://nameless-wildwood-00103.herokuapp.com/transfer', {account:stripeID, amount:price}) .then((res)=>
    {
      setLoading(false)
      console.log(res.data.data)
      Alert.alert(
        "Payment Successful"
      )
      navigation.navigate('Maps')
    })
    .catch(()=>{
      Alert.alert('ERROR OCCURRED')
    }
    )
   
    route.params.pay();
  }
  catch(err)
  {
    console.log("Error Occurred")
  } 
    
  };

  return (
    <ScrollView style={styles.container}>
      <TextInput
        autoCapitalize="none"
        placeholder="Name"
        keyboardType="name-phone-pad"
        onChange={(value) => setName(value.nativeEvent.text)}
        style={styles.input}
      />
      <CardField
      dangerouslyGetFullCardDetails ={true}
        placeholder={{
          number: '4242 4242 4242 4242',
        }}
        onCardChange={(cardDetails) => {
          console.log('cardDetails', cardDetails);
          setCard(cardDetails)
        }}
        onFocus={(focusedField) => {
          console.log('focusField', focusedField);
        }}
        cardStyle={inputStyles}
        style={styles.cardField}
      />
      <TextInput
        autoCapitalize="none"
        placeholder="cvc"
        keyboardType="name-phone-pad"
        onChange={(value) => setCvc(value.nativeEvent.text)}
        style={styles.input}
      />
      <Button onPress={handlePayPress} title="Pay" disabled={loading} />
      {loading && <View style={{flex:1,padding:20}}>
                        <ActivityIndicator size="large" color="#0000ff"/>
                          </View>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'white',
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  cardField: {
    width: '100%',
    height: 50,
    marginVertical: 30,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  text: {
    marginLeft: 12,
  },
  input: {
    margin:10,
    height: 44,
    borderBottomColor: 'black',
    borderBottomWidth: 1.5,
  },
});

const inputStyles: CardFieldInput.Styles = {
  borderWidth: 1,
  backgroundColor: '#FFFFFF',
  borderColor: '#000000',
  borderRadius: 8,
  fontSize: 14,
  placeholderColor: '#999999',
};