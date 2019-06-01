import axios from 'axios';

const axioBackend = axios.create({
	baseURL: 'http://localhost:4020',
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
		return res.data.code === 1;
	}).catch(err => 
		console.log('erro logout ' + err)
	);
};


// Function to check if user is logged in

function checkSession(){	
	return axioBackend.get('/account/checkSession').then(res => {
		if(res.data.username)
			return res.data.username;
		return '';
	}).catch(err => 
		console.log('erro checksession: ' + err)
	);
};

// Function to get all messages 
function getAllMessages(){
	return axioBackend.get('/message/getSince', {params:{"since": 1} }).then(res => {
		if(res.data.code === 1)
			return res.data.messages
		return [];
	}).catch(err =>{
		console.log('erro get messages: ' + err);
	});
};

// Function to get user contacts
function getContacts(){
	return axioBackend.get("/users/contacts").then(res => {
		console.log("contacts",res.data)
		if(res.data.code === 1)
			return res.data.contacts.reduce((pv,cv)=>{
				console.log(pv.seen, cv.name)
				if(pv.seen.includes(cv.name))
					return pv;
				return {seen:[...pv.seen, cv.name], total:[...pv.total, cv]};
			},{seen:[],total:[]}).total;
		
		return false;
	});
}

// Function to send a message
function sendMessage(message, to){
	return axioBackend.post("/message/send", {message, to}).then(res=>{
		return res.data.code === 1;
	});
}



export {
	login,
	signup,
	logout,
	checkSession,
	getAllMessages,
	getContacts,
	sendMessage
};
