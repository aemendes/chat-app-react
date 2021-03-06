import React, {Component} from 'react';
import './styles/css/App.css';
import Login from './components/login/Login';
import Chat from './components/chat/Chat';
import './App.css';
import './Contact.css'


import { checkSession, getAllMessages } from './connections';

export default class App extends Component {
	constructor(props){
		super(props);
		this.state = {
			username: '',
			messages:[],
			contacts: []
		};
	}
	
	componentDidMount(){
		checkSession().then(res =>{
			this.setState({ username: res });
		});
	}

	render(){
		return(
			<div style={{ height: '100%', backgroundColor: '#e1e1e1' }}>
				{!this.state.username ? 
					<Login login={(user)=>{this.setState({username: user})}} />
				:
					<Chat
						username={this.state.username}
						setUsername={()=>{this.setState({username: ''})}}
					/>
				}
					 

			</div>
		);
	}
}