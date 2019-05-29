import React, { Component } from 'react'
import '../../App.css';
import Messages from "../../Messages";
import Input from "../../Input";

//axios
import { logout, getAllMessages } from './../../connections';

function randomColor() {
	return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
}

export default class Chat extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: {},
			talkingWith: false,
			messages: [],
			member: {
				username: props.username,
				color: randomColor()
			},
			socket: new WebSocket("ws://localhost:4020/message/ws")
		}
		
		this.state.socket.onopen= ()=>		this.state.socket.onmessage = (msg) =>{
					}
		this.state.socket.onclose = 	}

	componentDidMount() {
		getAllMessages().then(res => {
			let new_data = {}
			res.forEach(message=>{
				new_data[message.from.name] = [
					...this.state.data[message.from.name],
					{
						from: message.from.name,
						message: message.message,
						time: new Date(message.timeSent)
					}
				]
			});
			Object.entries(new_data).forEach(([name, messages])=>{
				new_data[name] = messages.sort((a,b)=>a.time-b.time);
			});
			this.setState({data: new_data});
		});
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
		this.setState({ messages: messages });
	}


	addNewFriend() {
			}


	displayContacts() {
		return this.props.data.map(msg => {
			return (
				<div className="contact" key={msg.id}>
					<span>{msg.name}</span>
				</div>
			)
		})
	}



	render() {
		return (
			<div style={{ height: '100%', overflow: 'hidden' }}>
				<div class="columns" style={{ height: '10%' }}>

					<div class="column is-3" style={{ fontWeight: '100%', borderRight: '1px solid grey' }}>Username {this.props.username.toUpperCase()}
						<button onClick={() => logout().then(res => res && this.props.setUsername())} style={{ marginLeft: 200 }}>Terminar Sessão </button>
					</div>
					<div class="column" >Titulo da conversa e horas</div>
				</div>

				<div class="columns" style={{ height: '90%', backgroundColor: 'white' }}>

					<div class="column is-3" style={{ borderRight: '1px solid grey', overflow: 'auto', height: '100%' }}>

						<div class="conversas" style={{ height: '90%', width: '100%' }}>
							{this.displayContacts()}
						</div>

						<div class="Bconversas" style={{ height: '10%', width: '100%' }}>
							<button onclick="NovoAmigo()" style={{ height: '100%', width: '100%' }}> Adicionar Contacto </button>
						</div>

					</div>

					<div className="App" style={{ width: '100%' }}>

						<div className="App-header">

						</div>

						<Messages messages={this.state.data}
							currentMember={this.props.username} />

						<Input onSendMessage={this.onSendMessage} />

					</div>

				</div>
			</div>
		);
	}
}



