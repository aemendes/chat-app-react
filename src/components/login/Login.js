import React, { Component } from 'react'
import "../../styles/css/bulma.css";

//axios
import { login, signup } from './../../connections';

export default class Login extends Component {	
	constructor(props){
		super(props);
		this.state = {
			activeIndex: 1,
			loginInvalid: false,
			usernameInvalid: false,
			passwordInvalid: false,

			inputLoginUsername: '',
			inputLoginPassword: '',

			inputSigninUsername: '',
			inputSigninPassword: '',
			inputSigninPasswordVerification: ''
		};
	};

	updateValueUsernameLogin(evt){
		this.setState({ inputLoginUsername: evt.target.value });
	}

	updateValuePasswordLogin(evt){
		this.setState({ inputLoginPassword: evt.target.value })
	}

	loginTab(){
		return(
			<div className="card-content" style={{ minHeight: '55vh' }}>
				<p style={{ marginBottom: 30, textAlign: 'center', width: '100%', fontSize: 25}}>Welcome!!</p>
				Username:
				<div className="field" style={{ marginTop: 10, marginBottom: 20 }}>
					<p className="control has-icons-left has-icons-right">
						<input className="input is-rounded" 
								type="text" 
								placeholder="email"
								value={this.state.inputLoginUsername}
								onChange={(e) => this.updateValueUsernameLogin(e)} />
						<span className="icon is-small is-left">
							<i className="fas fa-user"></i>
						</span>
					</p>
				</div>
				Password:
				<div className="field" style={{ marginTop: 10 }}>
					<p className="control has-icons-left">
						<input className="input is-rounded" 
								type="password" 
								placeholder="Password"
								value={this.state.inputLoginPassword}
								onChange={(e) => this.updateValuePasswordLogin(e)} />
						<span className="icon is-small is-left">
							<i className="fas fa-lock"></i>
						</span>
						{(this.state.loginInvalid) && 
							<p className="help is-danger">
								Login Invalid!!
							</p>
						}
					</p>
				</div>
				<div className="control" style={{ width: '100%', marginTop: 25}}>
					<button className="button is-primary" 
							style={{ width: '100%' }}
							onClick={() => {
								login(this.state.inputLoginUsername, this.state.inputLoginPassword)
									.then(res => {
										if(res.code === 1){
											this.props.login(res.username);
											this.setState({ inputLoginUsername: '', inputLoginPassword: '', loginInvalid: false });
										}else{
											this.setState({ loginInvalid: true, inputLoginPassword: '' });
										}
									})
							}} >Submit</button>
				</div>
			</div>
		);
	}

	updateValueUsernameSignup(evt){
		this.setState({inputSigninUsername: evt.target.value});
	};

	updateValuePasswordSignup(evt){
		this.setState({inputSigninPassword: evt.target.value});
	};

	updateValuePasswordVerificationSignup(evt){
		this.setState({inputSigninPasswordVerification: evt.target.value});
	};

	signupTab(){
		return(
			<div className="card-content" style={{ minHeight: '55vh'}}>
				<p style={{ marginBottom: 30, textAlign: 'center', width: '100%', fontSize: 25}}>Create your account!</p>
				<div className="field" style={{ marginTop: 10, marginBottom: 20 }}>
					<p className="control has-icons-left has-icons-right">
						<input className="input is-rounded" 
								type="text" 
								placeholder="Insert Username"
								value={this.state.inputSigninUsername} 
								onChange={(e) => this.updateValueUsernameSignup(e)}/>
						<span className="icon is-small is-left">
							<i className="fas fa-user"></i>
						</span>
					</p>
				</div>
				{/*<div className="field" style={{ marginTop: 10, marginBottom: 20 }}>
					<p className="control has-icons-left has-icons-right">
						<input className="input is-rounded" type="text" placeholder="Insert your email"/>
						<span className="icon is-small is-left">
							<i className="fas fa-envelope"></i>
						</span>
					</p>
				</div>*/}
				<div className="field" style={{ marginTop: 15 }}>
					<p className="control has-icons-left">
						<input className="input is-rounded" 
								type="password" 
								placeholder="Password"
								value={this.state.inputSigninPassword}
								onChange={(e) => this.updateValuePasswordSignup(e)} />
						<span className="icon is-small is-left">
							<i className="fas fa-lock"></i>
						</span>
					</p>
				</div>
				<div className="field" style={{ marginTop: 15 }}>
					<p className="control has-icons-left">
						<input className="input is-rounded" 
								type="password" 
								placeholder="Verify Password"
								value={this.state.inputSigninPasswordVerification}
								onChange={(e) => this.updateValuePasswordVerificationSignup(e)} />
						<span className="icon is-small is-left">
							<i className="fas fa-lock"></i>
						</span>
						{(this.state.passwordInvalid) && 
							<p className="help is-danger">
								Invalid Password!!
							</p>
						}
					</p>
				</div>
				<div className="control" style={{ width: '100%', marginTop: 35}}>
					<button className="button is-primary" 
							style={{ width: '100%' }}
							onClick={()=>{
								if(this.state.inputSigninPassword !== this.state.inputSigninPasswordVerification){
									this.setState({ passwordInvalid: true})
								}else{
									signup(this.state.inputSigninUsername, this.state.inputSigninPassword)
											.then(res => {
																								if(res.code === 1){
																										
													this.props.login(res.username);
													this.setState({ usernameInvalid: false, passwordInvalid: false });
												}else{
													this.setState({ usernameInvalid: true, passwordInvalid: true });
												}
											});
									this.setState({ inputSigninUsername: '', inputSigninPassword: '', inputSigninPasswordVerification: '' });
								}
							}}
							>Create Account!</button>
				</div>
			</div>
		);
	}

	render() {
		return (
			<div className="columns Tab-columns-height" style={{ height: '100%' }}>
				<div className="column login-align-center"></div>
				<div className="column is-half login-align-center" >
					<div className="card">
						<div className="tabs is-boxed" style={{width: '100%'}}>
							<ul>
								<li style={{width: '100%'}} 
									className={`${(this.state.activeIndex === 0) ? "is-active" : ""}`} 
									onClick={()=>{this.setState({activeIndex: 0})}}>
									<a href="#null" >Login</a>
								</li>
								<li style={{width: '100%'}} 
									className={`${(this.state.activeIndex === 1) ? "is-active" : ""}`} 
									onClick={()=>{this.setState({activeIndex: 1})}}>
									<a href="#null" >Sign up</a>
								</li>
							</ul>
						</div>
						{(this.state.activeIndex === 0) ? this.loginTab() : this.signupTab()}
					</div>
				</div>
				<div className="column login-align-center"></div>
			</div>
		);
	};
};
