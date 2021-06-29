import React,{useContext} from 'react'
import { View, Text, StyleSheet,Button ,ActivityIndicator } from 'react-native'
import firestore from '@react-native-firebase/firestore'
import Auth from '@react-native-firebase/auth'

import { AuthContext } from '../studentAuth/AuthProvider';
import {  Title } from 'react-native-paper';
export default function DetailScreen({uid}) {
    const [TripData,setTripData]=React.useState([]);
    const { user, logout } = useContext(AuthContext)
    const GetTripData= async()=>{
        
        
        let array=[];
       let data= await  firestore().collection('Upcoming_Trips').where("uid", '==', Auth().currentUser.uid).get().then(querySnapshot => {
            console.log()
            querySnapshot.forEach(documentSnapshot => {
            let Data={
              DocId :documentSnapshot.id,
              fromLocation : documentSnapshot.get('fromlocation'),
              toLocation :documentSnapshot.get('tolocation'),
              totalseatsBooked:documentSnapshot.get('bookedSeatsNumber').length,
              time:documentSnapshot.get('time'),
            }
            console.log(Data)
            array.push(Data)
            setTripData(array)
            });
          }).catch((e)=>{
              console.log(e)
          })
    }
    React.useEffect(()=>{
      
  
        
        GetTripData()
     
          
    },[])
    if(TripData.length<=0)
    {
        return(
            <View style={[styles.main,{alignItems:'center'}]}>
            <ActivityIndicator size="small" color="#ffffff" />
            </View>
        )
    }
    return (
        <View style={styles.main}>
            <Title style={styles.titleScreen}>Detail of Bus seats and Driver</Title>

            {TripData!="undifined"?TripData.map((item,index)=>(
                <View key={index+1}>
                <Text style={styles.titleScreen}>From Location : {item.fromLocation} </Text>
                <Text style={styles.titleScreen}>To Location : {item.toLocation} </Text>
                <Text style={styles.titleScreen}>bookedseats : {item.totalseatsBooked} </Text>
                <Text style={styles.titleScreen}>Schedules of Driver : {item.time} </Text>
                </View>

            )):null}
            <View style={{marginVertical:20}}>
            <Button
            onPress={()=>GetTripData()}
            title="Refresh"
             /></View>
            
            <Button
            onPress={()=>logout()}
            title="Logout"
             />
        </View>
    )
}
const styles = StyleSheet.create({
    main: {
        flex: 2,
        backgroundColor: '#25282c',
        borderTopColor: '#B0B0B000',
        borderBottomColor: '#B0B0B000',
        
        alignItems:'center'
      },
      titleScreen:{color:'#ffff',marginVertical:30},
})