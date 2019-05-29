import axios from 'axios';

const axioBackend = axios.create({
	baseURL: 'http://10.42.0.1:4020',
	timeout: 5000,
	withCredentials: true
});

function login(username, password){
	return axioBackend.post('/account/login', {"username": username, "password": password})
		.then(res =>{
			//console.log('data login: ' + res.data);
			return {"code": res.data.code, "username": username};
		}).catch(err =>	console.log('erro login ' + err));
};

function signup(username, password){
	//console.log('recebi username: ' + username + ' e pass: ' + password);
	return axioBackend.post('/account/signup', {"username": username, "password": password})
		.then(res => {
			//console.log('data signup: ' + res.data);
			return {"code": res.data.code, "username": username};
		}).catch(err => console.log('errrrooooo: ', err));
};

function logout(){
	return axioBackend.post('/account/logout')
		.then(res =>{
			//console.log('data logout: ' + res.data);
			if(res.data.code === 1)
				return true
			return false
		}).catch(err => console.log('erro logout ' + err));
};

function checkSession(){	
	return axioBackend.get('/account/checkSession')
			.then(res => {
				return res.data.username;
			});
}

export {
	login,
	signup,
	logout,
	checkSession
}
