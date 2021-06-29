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


const helpCenter = ({navigation}) => {
    return(
      <View style={styles.container}>
        <Icon name= "md-menu" size= {30}/>
        <Text>welcome to help center</Text>
        <Button 
        title="Go To detail screen"
        onPress={() => navigation.navigate("details")}/>
      </View>
    );
  };
  export default helpCenter;

  const styles = StyleSheet.create({
      container: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center'
      },
  });