import React, {Component} from 'react';
import './styles/css/App.css';
import Login from './components/login/Login';
import Chat from './components/chat/Chat';
import './App.css';
import './Contact.css'


import { checkSession } from './connections';

export default class App extends Component {
  constructor(props){
<<<<<<< Updated upstream
		super(props);
		this.state = {
			username: ''
		};
  }
  
  componentDidMount(){
    checkSession().then(res =>{
      this.setState({ username: res });
    });
  }
=======
    super(props);
    this.state = {
      username: 'aa',
      contacts:[
        { id: 1, name: "Leanne Graham" },
        { id: 2, name: "Ervin Howell" },
        { id: 3, name: "Clementine Bauch" },
        { id: 4, name: "Patricia Lebsack" }]
    };
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
    
>>>>>>> Stashed changes

  render(){
    return(
      <div style={{ height: '100vh', backgroundColor: '#e1e1e1' }}>
        { !this.state.username ? 
<<<<<<< Updated upstream
          <Login login={(user)=>{this.setState({username: user})}} /> 
          : 
          <Chat username={this.state.username}
               logout={()=>{this.setState({ username: '' })}} />}
=======
          <Login login={(user)=>{this.setState({username: user})}}
                logout={()=>{this.setState({username: ''})}} />: 
          <Chat username={this.state.username}
                data={this.state.contacts} />}
           

>>>>>>> Stashed changes
      </div>
    );
  }
}