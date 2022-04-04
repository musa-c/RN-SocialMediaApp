import React, { useState, useEffect } from 'react'
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import firebase from 'firebase/compat/app';
import {Ionicons} from "@expo/vector-icons";



import Home from '../screen/Home';
import Profile from '../screen/Profile';
import Search from '../screen/Search';
import SignIn from '../screen/SignIn';
import SignUp from '../screen/SignUp';
import Settings from '../screen/Settings';
import Kesfet from '../screen/Kesfet';

const Tab = createBottomTabNavigator();
const TabBottom = ({navigation}) => {
  const [userName, setUserName] = useState("");
  useEffect(() => {
    let unmounted = false;
    firebase.auth().onAuthStateChanged(user => {
      if (!user) { // kullanıcı oturum açmadıysa
        navigation.navigate("SignIn");
      }
      else{
        firebase.firestore().collection("user").doc(user.uid).onSnapshot((snapshot)=>{
          if(!unmounted){
            setUserName(snapshot.data().UserName);
          }
        })
      }
    })

  
 
  }, [])



  

  return (
      <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused
              ? 'home'
              : "home-outline";
          } else if (route.name === 'Kesfet') {
            iconName = focused ? 'search' : "search-outline";
            
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person-circle' : "person-circle-outline";

          } 
          // 
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'black',
        // tabBarInactiveTintColor: '#E57373',
      }) 
    }

    TabBar={props => <MyTabBar {...props} />}
    >
        <Tab.Screen name="Home" component={Home} options={{headerShown:false}} />
        <Tab.Screen name="Kesfet" component={Kesfet} options={{headerShown:false}} />
        <Tab.Screen name="Profile" component={Profile} options={{headerShown:false, title:userName}} />
      </Tab.Navigator>
  );
}



import UsersProfile from '../screen/UsersProfile';
import Chats from "../screen/Chats";
import Chat from '../screen/Chat';
import Followers from '../screen/Followers';
import Followed from '../screen/Followed';
import UserFollowers from '../screen/UserFollowers';
import UserFollowed from '../screen/UserFollowed';

const MainStack = createStackNavigator();

const Tabs = () => {

  return(
    <MainStack.Navigator>
      <MainStack.Screen name="SignIn" component={SignIn} options={{headerShown:false}}/>
      <MainStack.Screen name="SignUp" component={SignUp} options={{headerShown:false}}/>
      <MainStack.Screen name="Main" component={TabBottom} options={{headerShown:false}}/>
      <MainStack.Screen name="UsersProfile" component={UsersProfile} options={({route}) => ({title: route.params.UserName, headerBackTitle:"Keşfet"})}/>
      <MainStack.Screen name="Chats" component={Chats} options={{headerShown:true, headerBackTitle:"Profil"}}/>
      <MainStack.Screen name="Chat" component={Chat} options={{headerTitle:"", headerBackTitle:"Mesajlarım"}}/>
      <MainStack.Screen name="Settings" component={Settings} options={{title:"Ayarlar", headerBackTitle:"Profil"}}/>
      <MainStack.Screen name="Followers" component={Followers} options={{title:"", headerBackTitle:"Geri"}}/>
      <MainStack.Screen name="UserFollowers" component={UserFollowers} options={{title:"", headerBackTitle:"Geri"}}/>
      <MainStack.Screen name="Followed" component={Followed} options={{title:"", headerBackTitle:"Geri"}}/>
      <MainStack.Screen name="UserFollowed" component={UserFollowed} options={{title:"", headerBackTitle:"Geri"}}/>
    </MainStack.Navigator>
  )
}


export default Tabs;