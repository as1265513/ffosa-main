import React from 'react';
import {
    Button,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
  } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'


const APUhome = ({navigation}) => {
    return(
      <View style={styles.container}>
        <Icon name= "ios-person-circle-outline" size= {30}/>
        <Text>Home Screen</Text>
        <Button 
        title="Go To detail screen"
        onPress={() => navigation.navigate("details")}/>
      </View>
    );
  };
  export default APUhome;

  const styles = StyleSheet.create({
      container: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center'
      },
  });