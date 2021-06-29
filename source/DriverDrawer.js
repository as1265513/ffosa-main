import 'react-native-gesture-handler';

 import React, {useState, useContext, useEffect} from 'react';

 import { createDrawerNavigator } from '@react-navigation/drawer';

 import { SliderS } from '../screens/SliderS';
 import DetailScreen from '../screens/DetailTripDriverScreen';


const Drawer = createDrawerNavigator();

const DriverDrawers = () => {
  
 return(
       
     <Drawer.Navigator>

           <Drawer.Screen name ="TripDetail" component = {DetailScreen}/>

     </Drawer.Navigator> 
  
  ) }
   
   export default DriverDrawers;