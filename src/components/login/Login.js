import React, { Component } from 'react'
import "../../styles/css/bulma.css";

export default class Login extends Component {	
	constructor(props){
		super(props);
		this.state = {
			activeIndex: 1,
			usernameInvalid: false,
			passwordInvalid: false
		};
	}

	login(){
		return(
			<div className="card-content" style={{ minHeight: '55vh'}}>
				<p style={{ marginBottom: 30, textAlign: 'center', width: '100%', fontSize: 25}}>Welcome!!</p>
				Username:
				<div className="field" style={{ marginTop: 10, marginBottom: 20 }}>
					<p className="control has-icons-left has-icons-right">
						<input className="input is-rounded" type="text" placeholder="Email"/>
						<span className="icon is-small is-left">
							<i className="fas fa-envelope"></i>
						</span>
						{(this.state.usernameInvalid) && 
							<p className="help is-danger">
								Username invalid!
							</p>
						}
					</p>
				</div>
				Password:
				<div className="field" style={{ marginTop: 10 }}>
					<p className="control has-icons-left">
						<input className="input is-rounded" type="password" placeholder="Password" />
						<span className="icon is-small is-left">
							<i className="fas fa-lock"></i>
						</span>
						{(this.state.passwordInvalid) && 
							<p className="help is-danger">
								Password invalid!
							</p>
						}
					</p>
				</div>
				<div className="control" style={{ width: '100%', marginTop: 25}}>
					<button className="button is-primary" style={{ width: '100%' }}>Submit</button>
				</div>
			</div>
		);
	}

	signin(){
		return(
			<div className="card-content" style={{ minHeight: '55vh'}}>
				<p style={{ marginBottom: 30, textAlign: 'center', width: '100%', fontSize: 25}}>Create your account!</p>
				<div className="field" style={{ marginTop: 10, marginBottom: 20 }}>
					<p className="control has-icons-left has-icons-right">
						<input className="input is-rounded" type="text" placeholder="Insert Username"/>
						<span className="icon is-small is-left">
							<i className="fas fa-user"></i>
						</span>
					</p>
				</div>
				<div className="field" style={{ marginTop: 10, marginBottom: 20 }}>
					<p className="control has-icons-left has-icons-right">
						<input className="input is-rounded" type="text" placeholder="Insert your email"/>
						<span className="icon is-small is-left">
							<i className="fas fa-envelope"></i>
						</span>
					</p>
				</div>
				<div className="field" style={{ marginTop: 15 }}>
					<p className="control has-icons-left">
						<input className="input is-rounded" type="password" placeholder="Password" />
						<span className="icon is-small is-left">
							<i className="fas fa-lock"></i>
						</span>
					</p>
				</div>
				<div className="field" style={{ marginTop: 15 }}>
					<p className="control has-icons-left">
						<input className="input is-rounded" type="password" placeholder="Verify Password" />
						<span className="icon is-small is-left">
							<i className="fas fa-lock"></i>
						</span>
					</p>
				</div>
				<div className="control" style={{ width: '100%', marginTop: 35}}>
					<button className="button is-primary" 
							style={{ width: '100%' }}
							onClick={()=>{
								this.setState({ activeIndex: 0 })
							}}
							>Create Account!</button>
				</div>
			</div>
		);
	}

	render() {
		return (
			<div className="columns login-columns-height">
				<div className="column login-align-center"></div>
				<div className="column is-half login-align-center" >
					<div className="card">
						<div className="tabs is-boxed" style={{width: '100%'}}>
							<ul>
								<li style={{width: '100%'}} 
									className={`${(this.state.activeIndex === 0) ? "is-active" : ""}`} 
									onClick={()=>{this.setState({activeIndex: 0})}}>
									<a>Login</a>
								</li>
								<li style={{width: '100%'}} 
									className={`${(this.state.activeIndex === 1) ? "is-active" : ""}`} 
									onClick={()=>{this.setState({activeIndex: 1})}}>
									<a>Sign up</a>
								</li>
							</ul>
						</div>
						{(this.state.activeIndex === 0) ? this.login() : this.signin()}
					</div>
				</div>
				<div className="column login-align-center"></div>
			</div>
		);
	}
}
