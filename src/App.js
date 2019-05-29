import React, {Component} from 'react';
import './styles/css/App.css';
import Login from './components/login/Login';
import Chat from './components/chat/Chat';
import './App.css';

import { checkSession } from './connections';

export default class App extends Component {
  constructor(props){
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

  render(){
    return(
      <div style={{ height: '100vh', backgroundColor: '#e1e1e1' }}>
        { !this.state.username ? 
          <Login login={(user)=>{this.setState({username: user})}}
                logout={()=>{this.setState({username: ''})}} /> 
          : 
          <Chat username={this.state.username} />}
      </div>
    );
  }
}
	