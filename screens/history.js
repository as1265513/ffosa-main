import React, { Component } from 'react';
import {
    Button,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
  } from 'react-native';
import firestore, { firebase } from "@react-native-firebase/firestore";
import Auth from "@react-native-firebase/auth";

import Icon from 'react-native-vector-icons/Ionicons'
import { Title } from 'react-native-paper';
import Panel from '../source/Panel';

let DataStructure=[{"documentId": "No Trip", "fromlocation": "No Trip", "seat": "No Trip", "startingTime": "No Trip", "tolocation": "No Trip", "tripStatus": "No Trip"}]
function history ({navigation}) {
  
 const [UpcomingTrips,setUpcomingTrips] = React.useState([])
  const [TripTime,SetTripTime] = React.useState([])
 const [TripHistory,setTripHistory] = React.useState([])
 const [MissedTrip,setMissedTrips] = React.useState([])
 const [historyData,setHistoryData] = React.useState([])
 const deleteTrip=async()=>{
  let data=await firestore()
  .collection('Users')
  .doc(Auth().currentUser.uid)
  .collection("TripData")
  .doc('bookedData');
  let documentId=(await data.get()).data().documentId;
  data.delete();

  let refRemoveTrip=firestore().collection('Upcoming_Trips').doc(documentId)
  let bookedseats=(await refRemoveTrip.get()).data().bookedSeatsNumber
  refRemoveTrip.update({
    bookedSeatsNumber:bookedseats.filter(x => x.StudentBooked!=Auth().currentUser.uid)
  }).then(()=>{
    console.log("deleted")
    setUpcomingTrips([])
  })
  
}


  const getUpcomingTrips = async () => {
    let TripData= await firestore()
    .collection('Users')
    .doc(Auth().currentUser.uid)
    .collection("TripData")
    .doc('bookedData')
    if((await TripData.get()).exists){
      setUpcomingTrips([(await TripData.get()).data()])
    }
  }
  React.useEffect(()=>{ 
    getUpcomingTrips()
    getTripTime()
    GetHistoryRecord()
  },[])
  React.useEffect(()=>{ 
    if(historyData.length>0)
    {setTripHistory(historyData.filter(item=>item.tripStatus=="finished"))
    setMissedTrips(historyData.filter(item=>item.tripStatus=="missed"))
    }
  },[historyData])
  
  const GetHistoryRecord=()=>{
  
     firestore()
    .collection('Users')
    .doc(Auth().currentUser.uid)
    .collection("TripData")
    .doc('HistorybookedData').get().then((data)=>{
      setHistoryData(data.data().TripNumber)
    })

   
  }


  
  const getTripTime=()=>{
    var TripTimefirestore;
     firestore()
    .collection('Users')
    .doc(Auth().currentUser.uid)
    .collection("TripData")
    .doc('bookedData').get().then((data)=>{
      if(data.exists)
  {
    TripTimefirestore=data.data().startingTime;
    let arr=formatAMPM(TripTimefirestore)
    SetTripTime(arr)
    return arr;
  }})
  
  }
  const dhm=(t)=>{
    var cd = 24 * 60 * 60 * 1000,
        ch = 60 * 60 * 1000,
        
        d = Math.floor(t / cd),
        h = Math.floor( (t - d * cd) / ch),
        m = Math.round( (t - d * cd - h * ch) / 60000),
        pad = function(n){ return n < 10 ? 0 + n : n; };
        // console.log(d)  
  if( m >= 60 ){
    h++;
    m = 0;
  }
  if( h >= 24 ){
    d++;
    h = 0;
  }
  return [d, pad(h), pad(m)];
}

const ReturnTimeFormat=(value)=>{
let a=value.split(" ")

if(a[1].toLowerCase()=="AM".toLowerCase())
{
  return a[0]
}
else {
  
  var abc=a[0].split(":")
  var hours=parseInt(abc[0])+12
  return hours+":"+"00"
}
}

const formatAMPM=(timeRef)=> {

  var TimeTrip = ReturnTimeFormat(timeRef)
// console.log(TimeTrip)
  
  var myDate2 = new Date();
  var year=myDate2.getFullYear();
  var month=myDate2.getMonth()+1
  var date=myDate2.getDate();
  var hour=myDate2.getHours()
  var minute=myDate2.getMinutes()
  
  let timeString=""+year+"-"+(month<10?"0"+month:month)+"-"+(date<10?"0"+date:date)+"T"+TimeTrip+":00"
  let CureentTimeString=""+year+"-"+(month<10?"0"+month:month)+"-"+(date<10?"0"+date:date)+"T"+(hour<10?"0"+hour:hour)+":"+(minute<10?"0"+minute:minute)+":"+"00"+"";

  var CurrentTime = new Date(CureentTimeString);
  var myDate = new Date(timeString);
  

  var TripstartTime = myDate.getTime()
  var currentTimeInMiliSeconde = CurrentTime.getTime()
 
    var countdowndate=dhm(TripstartTime-currentTimeInMiliSeconde)
    
    return countdowndate
 }


  return(
      <ScrollView style={styles.container}>
       <View >
     <View style={{height:50,backgroundColor:'blue',marginTop:-5,justifyContent:'center',alignItems:'center'}}>
      <Title style={{color:'#FFF'}} >History</Title>
     </View>
     <Panel title="Upcoming Trips">
     {UpcomingTrips.map((item,index)=>(
     <View key={index+10}>
     <View style={styles.TripDetailCard}>
     <Text style={styles.tripdetailtext}>From Location:</Text>
     <Text style={styles.tripdetailtext}>{item.fromlocation}</Text>
     </View>
     <View style={styles.TripDetailCard}>
     <Text style={styles.tripdetailtext}>To Location:</Text>
     <Text style={styles.tripdetailtext}>{item.tolocation}</Text>
     </View>
     <View style={styles.TripDetailCard}>
     <Text style={styles.tripdetailtext}>Seat Number:</Text>
     <Text style={styles.tripdetailtext}>{item.seat}</Text>
     </View>
     <View style={styles.TripDetailCard}>
     <Text style={styles.tripdetailtext}>Starting Time:</Text>
     <Text style={styles.tripdetailtext}>{item.startingTime}</Text>
     </View>
      {Number(TripTime[0])==0 && Number(TripTime[1])==0&& Number(TripTime[2])<=60 && UpcomingTrips.length>0 ?
        (<View style={styles.TripDetailCard}>
      <TouchableOpacity style={styles.ButtonStyle} onPress={()=>{navigation.navigate("TrackBus")}} ><Text style={styles.ButtonText}>Track Bus</Text></TouchableOpacity>

     <TouchableOpacity style={styles.ButtonStyle} onPress={()=>deleteTrip()} ><Text style={styles.ButtonText}> Delete Trip</Text></TouchableOpacity>
     </View>)
      :null}
     </View>
     ))}
     {UpcomingTrips.length<=0 ?
        (<View style={{justifyContent:'center'}}>
        <Text style={{textAlign:'center',}}>No Upcoming Trip Please Book you trip right now</Text>
     <TouchableOpacity style={styles.ButtonStyle} onPress={()=>navigation.navigate("subscription")}><Text style={styles.ButtonText}>Book Trip</Text></TouchableOpacity>
        
      </View>):null
      }
        </Panel>
        <Panel title="Finished Trips">
      {TripHistory.map((item,index)=>(
        <View key={index}>
        <Title style={{textAlign:'center'}}>Trip Date {new Date(item.TimeTrip.toDate()).toDateString()}</Title>
     <View style={styles.TripDetailCard}>
     <Text style={styles.tripdetailtext}>From Location:</Text>
     <Text style={styles.tripdetailtext}>{item.fromlocation}</Text>
     </View>
     <View style={styles.TripDetailCard}>
     <Text style={styles.tripdetailtext}>To Location:</Text>
     <Text style={styles.tripdetailtext}>{item.tolocation}</Text>
     </View>
        </View>
      ))}
      {TripHistory.length<=0 ?
        (<View style={{justifyContent:'center'}}>
        <Text style={{textAlign:'center',}}>You have not take any trip</Text>
     <TouchableOpacity style={styles.ButtonStyle} onPress={()=>navigation.navigate("subscription")}><Text style={styles.ButtonText}>Book Trip</Text></TouchableOpacity>
        
      </View>):null
      }
      

      </Panel>

      <Panel title="Missed Trips">
      {MissedTrip.map((item,index)=>(
        <View key={index}>
        <Title style={{textAlign:'center'}}>Trip Date {new Date(item.TimeTrip.toDate()).toDateString()}</Title>
     <View style={styles.TripDetailCard}>
     <Text style={styles.tripdetailtext}>From Location:</Text>
     <Text style={styles.tripdetailtext}>{item.fromlocation}</Text>
     </View>
     <View style={styles.TripDetailCard}>
     <Text style={styles.tripdetailtext}>To Location:</Text>
     <Text style={styles.tripdetailtext}>{item.tolocation}</Text>
     </View>
        </View>
      ))}</Panel>
     
       </View>
      </ScrollView>
    );
  
  };
  export default history;

  const styles = StyleSheet.create({
      container: {
         
        
      },
      TripDetailCard:{flexDirection:'row',justifyContent:'space-between',marginHorizontal:5,marginTop:5},
      tripdetailtext:{fontSize:16},
      ButtonStyle:{height:50,backgroundColor:'#3366FF',padding:10,justifyContent:'center',alignItems:'center',borderRadius:10},
      ButtonText:{color:"#FFFFFF"}
  });