import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, FlatList } from 'react-native'
import {SearchBar} from "react-native-elements"
import firebase from 'firebase/compat/app'


const Search = () => {
    const [search, setSearch] = useState();
    const [filterdData, setfilterdData] = useState([]);
    const [masterData, setmasterData] = useState([]);

    useEffect(()=>{
        fetchPosts();
    }, [])

    const fetchPosts = () => {
        const apiURL = "https://jsonplaceholder.typicode.com/posts";
        fetch(apiURL)
        .then((response)=> response.json())
        .then((responseJson) => {
            setfilterdData(responseJson);
            setmasterData(responseJson);
        }).catch((eror)=>{
            console.log(error);
        })
    }

        const searchFilter = (text) => {
            if(text){
                const newData= masterData.filter((item) => {
                    const itemData = item.title ? item.title.toUpperCase() : "".toUpperCase();

                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
                });

                setfilterdData(newData);
                setSearch(text);
            }else{
                setfilterdData(masterData);
                setSearch(text);
            }
        }

        const ItemView = ({item}) => {
            return(
                <Text style={styles.itemStyle}>
                    {item.id}{". "}{item.title.toUpperCase()}
                </Text>
            )
        }

        const ItemSeparatorView = () =>{
            return(
                <View
                style={{height: 0.5, width: "100%", backgroundColor:"#c8c8c8"}}
                />
            )
        }
    


    return (
        <View style={styles.cont}>
            <SearchBar
        placeholder="Ara..."
        onChangeText={text => searchFilter(text)}
        value={search}
        inputContainerStyle={styles.search}
        lightTheme={true}
        platform="ios"
        cancelButtonTitle="Vazgeç"
      />
      <FlatList 
      data={filterdData}
      keyExtractor={(item, index) => index.toString()}
      ItemSeparatorComponent={ItemSeparatorView}
    renderItem={ItemView}
      />
        </View>
    )
}

const styles = StyleSheet.create({
    cont:{
        flex:1,
        backgroundColor:"white"
    },
    search:{
        borderRadius:25,
        height:20
    },
    itemStyle:{
        padding:15
    }
})

export default Search;
