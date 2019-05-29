import axios from 'axios';

const axioBackend = axios.create({
	baseURL: '192.168.43.47:4020',
	timeout: 5000,
	withCredentials: true
});

function login(username, password){
	return axioBackend.post('/account/login', {"username": username, "password": password})
		.then(res =>{
			console.log('data login: ' + res.data);
			return res.data.code;
		}).catch(err =>	console.log('erro login ' + err));
};

function signup(username, password){
	console.log('recebi username: ' + username + ' e pass: ' + password);
	return axioBackend.post('/account/signup', {"username": username, "password": password})
		.then(res => {
			console.log('data signup: ' + res.data);
			return res.data.code;
		}).catch(err => console.log('errrrooooo: ', err));
};

function logout(changeUsername){
	return axioBackend.post('/logout')
		.then(res =>{
			console.log('data logout: ' + res.data);
			if(res.data.code === 1)
				return true
			return false
		}).catch(err => console.log('erro logout ' + err));
};

export {
	login,
	signup,
	logout
}
