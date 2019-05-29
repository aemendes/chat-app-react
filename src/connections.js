import axios from 'axios';

const axioBackend = axios.create({
	baseURL: 'http://10.42.0.1:4020',
	timeout: 5000,
	withCredentials: true
});


// Functions Login, Logout and Sign up

function login(username, password){
	return axioBackend.post('/account/login', {"username": username, "password": password}).then(res =>{
			return {"code": res.data.code, "username": username};
		}).catch(err =>	
			console.log('erro login ' + err)
		);
};

function signup(username, password){
	return axioBackend.post('/account/signup', {"username": username, "password": password}).then(res => {
			return {"code": res.data.code, "username": username};
		}).catch(err => 
			console.log('erro sign up: ' + err)
		);
};

function logout(){
	return axioBackend.post('/account/logout').then(res =>{
			if(res.data.code === 1)
				return true
			return false
		}).catch(err => 
			console.log('erro logout ' + err)
		);
};


// Function to check if user is logged in

function checkSession(){	
	return axioBackend.get('/account/checkSession').then(res => {
				return res.data.username;
			}).catch(err => 
				console.log('erro checksession: ' + err)
			);
};

// Function to get all messages 
function getAllMessages(){
	return axioBackend.get('/message/getSince', {"since": Date.now()-24*60*60 }).then(res => {
		console.log('entrei aqui');
	}).catch(err =>{
		console.log('erro get messages: ' + err);
	});
};



export {
	login,
	signup,
	logout,
	checkSession
};
