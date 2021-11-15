import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';

const FormField = (props) => {
  return (
    <View style={styles.formFieldWrapper}>
      <Text style={styles.labelText}>{props.label}</Text>
      <TextInput
        placeholder={props.placeholder}
        style={styles.formFieldText}
        onChange={(event) => props.handleFormValueChange(props.formKey, event.nativeEvent.text)}
        {...props.textInputProps}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  formFieldWrapper: {
    //   backgroundColor:"green",
    //   flex:1
  },
  formFieldText: {
      width:150,
    fontSize: 12,
    borderRadius: 7,
    borderWidth: 1,
    padding: 5,
    backgroundColor:"#eeeeee",
  },
  labelText: {
    fontSize: 14,

    marginBottom: 10,
    paddingLeft: 10,
    paddingTop: 10,
    
  }
})

export default FormField;
