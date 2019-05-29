import React, {Component} from 'react';
import './styles/css/App.css';
import Login from './components/login/Login';
import Chat from './components/chat/Chat';
import './App.css';
import './Contact.css'


import { checkSession } from './connections';

export default class App extends Component {
  constructor(props){
		super(props);
		this.state = {
      username: '',
      contacts:[
        { id: 1, name: "Leanne Graham" },
        { id: 2, name: "Ervin Howell" },
        { id: 3, name: "Clementine Bauch" },
        { id: 4, name: "Patricia Lebsack" }
      ]
		};
  }
  
  componentDidMount(){
    checkSession().then(res =>{
      this.setState({ username: res });
    });
  }

  displayContacts(){
    return this.state.contacts.map(msg =>{
      return(
        <div className="contact" key={msg.id}>
          <span>{msg.name}</span>
        </div>
      )
    })
  }
    

  render(){
    return(
      <div style={{ height: '100vh', backgroundColor: '#e1e1e1' }}>
        { !this.state.username ? 
          <Login login={(user)=>{this.setState({username: user})}}
                logout={()=>{this.setState({username: ''})}} />: 
          <Chat username={this.state.username}
                data={this.state.contacts} />}
           

      </div>
    );
  }
}