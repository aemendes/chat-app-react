import React, { Component } from 'react'
import '../../App.css';
import Messages from "../../Messages";
import Input from "../../Input";

//axios
import { logout, getAllMessages, getContacts, sendMessage } from './../../connections';

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
			socket: new WebSocket("ws://localhost:4020/message/ws"),
			contacts: []
		}
		
		this.state.socket.onopen= ()=>console.log("ws opened")
		this.state.socket.onmessage = (msg) =>{
			let data = JSON.parse(msg.data);
			if(data.op === "new"){
				// new message
				let user = this.props.username === data.to? data.from : data.to;
				let new_data = {...this.state.data};
				new_data[user] = [
					...(new_data[user]||[]),
					{
						from: data.from,
						message: data.message.message,
						time: new Date(data.message.timeSent)
					}
				]
				console.log("new_Data",new_data)
				this.setState({data: new_data});
			}
		}
		this.state.socket.onclose = console.log;
	}

	componentDidMount() {
		getAllMessages().then(res => {
			console.log(res)
			let new_data = {}
			let user;
			res.forEach(message=>{
				user = this.props.username === message.to.name? message.from.name : message.to.name
				new_data[user] = [
					...(new_data[user]||[]),
					...(this.state.data[user]||[]),
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
			console.log("messages:" ,new_data)
	
			this.setState({data: new_data, talkingWith: Object.keys(new_data)[0] || this.state.talkingWith});
		});

		getContacts().then(contacts=>{
			console.log({contacts})
			contacts && this.setState({contacts});
		});
	}



	onSendMessage = (message) => {
		// const messages = this.state.messages;
		// messages.push({
		// 	text: message,
		// 	member: this.state.member
		// });
		// let msg = {
		// 	text: "ok ok!",
		// 	member: {
		// 		color: "blue",
		// 		username: "opponent"
		// 	}
		// }
		// messages.push(msg);
		// this.setState({ messages: messages });
		this.state.talkingWith && sendMessage(message, this.state.talkingWith);
	}

	
	displayContacts(){
		return this.state.contacts.map(msg =>{
			console.log("contact",msg)
			return(
				<div className="contact" key={msg.id} onClick={()=>{console.log("talng with ",msg.name,this.state.data[msg.name]);this.setState({talkingWith: msg.name})}}>
					<span>{msg.name}</span>
				</div>
			)
		})
	}
		

	render() {
		return (
			<div style={{ height: '100%', overflow: 'hidden', display:"flex", flexDirection:"column" }}>
				<div class="columns" style={{ flex: "0 0 auto" }}>
					<div class="column is-3" style={{ fontWeight: '100%', borderRight: '1px solid grey' }}>Username {this.props.username.toUpperCase()}
						<button onClick={() => logout().then(res => res && this.props.setUsername())} >Terminar Sessão </button>
					</div>
					<div class="column" >Titulo da conversa e horas</div>
				</div>

				<div class="columns" style={{ flex:"1 1 auto", backgroundColor: 'white' }}>
					<div class="column is-3" style={{ borderRight: '1px solid grey', overflow: 'auto', height: '100%' }}>
						{this.displayContacts()}
					</div>

					<div className="App" style={{ width: '100%' }}>
						{/* <div className="App-header" style={{flex:"0 0 100px"}}>
						</div> */}
						<Messages messages={this.state.data}
							currentMember={this.props.username}
							talkingWith={this.state.talkingWith}
						/>
						<Input onSendMessage={this.onSendMessage} />
					</div>
				</div>
			</div>
		);
	}
}



