import {Component} from "react";
import React from "react";
import Chat form "./Chat"

class Contactos extends Component {
  
    renderContactos() {
    
    const className = 
    return (
      <li className={className}>
        <span
          className="avatar"
          style={{backgroundColor: member.color}}
        />
        <div className="Message-content">
          <div className="username">
            {member.username}
          </div>
          <div className="text">{text}</div>
        </div>
      </li>
    );
  }

  render() {
  	console.log(this.props.messages)
    const {messages} = this.props;
    return (
      <ul className="Messages-list">
        {messages.map(m => this.renderMessage(m))}
      </ul>
    );
  }


}

export default Messages;