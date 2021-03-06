import {Component} from "react";
import React from "react";

class Messages extends Component {

	renderMessage(messageLog) {
		const {from, message} = messageLog;
		const {currentMember} = this.props;
		console.log("user is",currentMember, "from",from)
		const messageFromMe = from === currentMember;
		const className = messageFromMe ?
		"Messages-message currentMember" : "Messages-message";
		return (
			<li className={className}>
				<span
					className="avatar"
					style={{backgroundColor: messageFromMe? "#9b05a0":"#20e038"}}
				/>
				<div className="Message-content">
				<div className="username">
					{from}
				</div>
				<div className="text">{message}</div>
				</div>
			</li>
		);
	}

	render() {
		const {messages} = this.props;
		console.log(this.props.talkingWith)
		return (
			<ul className="Messages-list" style={{flex:"1 1 30px", marginBottom:"10px"}}>
				{this.props.talkingWith && messages[this.props.talkingWith] && messages[this.props.talkingWith].map(m => this.renderMessage(m))}
			</ul>
		);
	}


}

export default Messages;