import React, {Component} from 'react';
import './styles/css/App.css';
import Login from './components/login/Login';
import Chat from './components/chat/Chat';
import Messages from "./Messages";
import Input from "./Input";
import './App.css';

export default class App extends Component {
  constructor(props){
		super(props);
		this.state = {
			username: 'dawfqwf'
		};
	}

	

	render(){
		return(
			<div style={{ height: '100%', backgroundColor: '#e1e1e1' }}>
				{ !this.state.username ? <Login /> : <Chat username={this.state.username} onSendMessage={this.onSendMessage} />}
			</div>
		
		);
	}


}
	