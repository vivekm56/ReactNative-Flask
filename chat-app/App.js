import React from "react";
import { StyleSheet, View, Text, TextInput, Button, FlatList } from "react-native";
import axios from 'axios';
import tail from 'lodash/tail';


const serverUrl = 'http://192.168.43.242:5000';
const http = axios.create({
  baseURL: serverUrl,
});


export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      input: "",
      messages: [], 
    };
  }

  onLogin(){
    const { isLoggedIn, username } = this.state ;
    if (!isLoggedIn){
      http.post('/login', {username})
      .then(() => this.onLoginSuccess())
      .catch((err) => console.log(err));      
    }else {
      alert('You are already logged in !');
    }
  }

  onLoginSuccess(){
    this.setState({isLoggedIn: true});
    this.getMassage(); //i stuck here
  }


  addMessage(data){
    const {messages} = this.state;
    const {id, message} = data;

    messages.push(data);
    this.setState({
      lastUpdated: new Date,
      lastId: id,
    });
  }

  addMessageList(list){
    if(!list || list.length == 0){
      return;
    }
    const {messages} = this.state;
    this.setState({
      messages: [...messages, ...list],
      lastUpdated: new Date,
      lastId: tail(list).id,
    });
  }


  getMassage(){
    const{lastId} = this.state;
    // Get request to Flask Server
    http.get(lastId ? '/get/${lastId}' : '/get')
    .then((response) => this.addMessageList(response.data))
    .catch((err) => console.log(err));
  }


  onMessageSend(){
    const { input, username } = this.state;
    // POST to Flask server
    http.post('/send', {
      username,
      message: input,
    })
    .then((response) => this.addMessage({
      message: input,
      id: response.data.id,
    }));
  }

  render(){
    const { messages, isLoggedIn, lastUpdated } = this.state;
    return (
      <View style={styles.container}>
        <View>
          <Text>Login</Text>
          <TextInput onChangeText={(val) => this.setState({username: val})}/>
          <Button title = 'Login' onPress={() => this.onLogin() } />
          <Text>Online Status: {isLoggedIn ? 'Online' : 'Offline'}</Text>  
        </View>
        <FlatList
          data = {messages}
          renderItem = {({item}) => <Text>{item.message}</Text>}
          extraData= {lastUpdated}
        />
        <View>
          <TextInput 
            onChangeText={(val) => this.setState({input: val})}        
          />
          <Button title = 'Send Message' onPress={() => this.onMessageSend() } />
        </View>
      </View>
    );
  } 
  
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: "#fff",
      justifyContent: "center",
      alignItems: "center",
  },
});
