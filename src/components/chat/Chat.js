import React, { Component } from 'react'

export default class Chat extends Component {
	constructor(props){
		super(props);
		this.state = {
			
		}
	}
	render() {
		return (
			<div style={{ height: '100%' , overflow: 'hidden'}}>
				<div class="columns" style={{ height: '10%' }}>
					<div class="column is-3" style={{ fontWeight: '100%', borderRight: '1px solid grey' }}>Username {this.props.username.toUpperCase()}</div>
					<div class="column" >Titulo da conversa e horas</div>
				</div>

				<div class="columns" style={{ height: '100%', backgroundColor: 'white' }}>
					<div class="column is-3" style={{ borderRight: '1px solid grey', overflow: 'auto' }}>Lista dos contatos</div>
					<div class="column" >Conversa</div>
				</div>


			</div>
		)
	}
}
