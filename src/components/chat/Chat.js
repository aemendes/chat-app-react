import React, { Component } from 'react'
import '../../App.css';
import Messages from "../../Messages";
import Input from "../../Input";

//axios
import { logout } from './../../connections';

function randomColor() {
  return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
}

export default class Chat extends Component {
	constructor(props){
		super(props);
		this.state = {
			messages: [
				{
					text: "This is a test message!",
					member: {
						color: "blue",
						username: "opponent"
					}
				}
			],
			member: {
				username: props.username,
				color: randomColor()
			}
  	}
	}



onSendMessage = (message) => {
  const messages = this.state.messages;
  messages.push({
    text: message,
    member: this.state.member
	});
	let msg = {
		text: "ok ok!",
		member: {
			color: "blue",
			username: "opponent"
		}
	}
	messages.push(msg);
  this.setState({messages: messages});
}


addNewFriend() {
  console.log('this is:', this);
}

	
	render() {
		return (
			<div style={{ height: '100%' , overflow: 'hidden'}}>
				<div class="columns" style={{ height: '10%' }}>
					<div class="column is-3" style={{ fontWeight: '100%', borderRight: '1px solid grey' }}>Username {this.props.username.toUpperCase()} 
						<button onClick={() => logout().then(res => res && this.props.logout())} style={{ marginLeft: 200 }}>Terminar Sessão </button>
          </div>
					<div class="column" >Titulo da conversa e horas</div>
				</div>

				<div class="columns" style={{ height: '90%', backgroundColor: 'white' }}>

					<div class="column is-3" style={{ borderRight: '1px solid grey', overflow: 'auto', height: '100%'}}>
            <button onclick={this.addNewFriend()} style={{ height: '40px', width: '100%' }}> Adicionar Contacto </button>
          </div>
					
          <div className="App" style={{width: '100%'}}>
						<div className="App-header">
						</div>
						<Messages
							messages={this.state.messages}
							currentMember={this.state.member}/>
						<Input
							onSendMessage={this.onSendMessage}/>
					</div>
				</div>
			</div>
		);
	}
}