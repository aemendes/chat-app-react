import React, { Component } from 'react'
import "../../styles/css/App.css";

export default class Login extends Component {	
	constructor(props){
		super(props);
		this.state = {
			
		};
	}
	render() {
		return (
			<div class="columns">
				
				<div class="column login-column">
					First column
				</div>
				
				<div class="column">
					Second column
				</div>
				
				<div class="column">
					Third column
				</div>
				
				<div class="column">
					Fourth column
				</div>
			
			</div>
		);
	}
}
