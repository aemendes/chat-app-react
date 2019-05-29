import React, { Component } from 'react'
import '../../App.css';
import Messages from "../../Messages";
import Input from "../../Input";

function randomName() {
  const adjectives = ["autumn", "hidden", "bitter", "misty", "silent", "empty", "dry", "dark", "summer", "icy", "delicate", "quiet", "white", "cool", "spring", "winter", "patient", "twilight", "dawn", "crimson", "wispy", "weathered", "blue", "billowing", "broken", "cold", "damp", "falling", "frosty", "green", "long", "late", "lingering", "bold", "little", "morning", "muddy", "old", "red", "rough", "still", "small", "sparkling", "throbbing", "shy", "wandering", "withered", "wild", "black", "young", "holy", "solitary", "fragrant", "aged", "snowy", "proud", "floral", "restless", "divine", "polished", "ancient", "purple", "lively", "nameless"];
  const nouns = ["waterfall", "river", "breeze", "moon", "rain", "wind", "sea", "morning", "snow", "lake", "sunset", "pine", "shadow", "leaf", "dawn", "glitter", "forest", "hill", "cloud", "meadow", "sun", "glade", "bird", "brook", "butterfly", "bush", "dew", "dust", "field", "fire", "flower", "firefly", "feather", "grass", "haze", "mountain", "night", "pond", "darkness", "snowflake", "silence", "sound", "sky", "shape", "surf", "thunder", "violet", "water", "wildflower", "wave", "water", "resonance", "sun", "wood", "dream", "cherry", "tree", "fog", "frost", "voice", "paper", "frog", "smoke", "star"];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return adjective + noun;
}

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
          	 username: "bluemoon"
        }
      }
    ],
    member: {
      username: randomName(),
      color: randomColor()
    }
  }
}
onSendMessage = (message) => {
  const messages = this.state.messages
  messages.push({
    text: message,
    member: this.state.member
  })
  this.setState({messages: messages})
}
 logout() {
        localStorage.clear();
        {/*window.location.href = '/';*/}
    }


	
	render() {
		return (
			<div style={{ height: '100%' , overflow: 'hidden'}}>
				<div class="columns" style={{ height: '10%' }}>
					<div class="column is-3" style={{ fontWeight: '100%', borderRight: '1px solid grey' }}>Username {this.props.username.toUpperCase()} <button onclick="logout()">Terminar Sessão</button> </div>
					<div class="column" >Titulo da conversa e horas</div>
				</div>

				<div class="columns" style={{ height: '90%', backgroundColor: 'white' }}>
					<div class="column is-3" style={{ borderRight: '1px solid grey', overflow: 'auto' }}>Lista dos contatos</div>
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