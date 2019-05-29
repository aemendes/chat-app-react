// server.js

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const logger = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors')

// fix mongoose use of depricated functions
mongoose.set('useCreateIndex', true); 
mongoose.set('useFindAndModify', false);

const app = express();
const PORT = 4020;

const dbConfig = require('./database/config');
require("../server/drivers/passport")(passport);

// Database initialization
mongoose.connect(dbConfig.DB, {useNewUrlParser: true}).then(
	()=>	(err)=>);

// Express initializations
app.use(cors({credentials:true, origin:"http://localhost:3000"}))
app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({
	secret: "magic cats", // eslint-disable-line no-sync
	resave: false,
	saveUninitialized: false,
	cookie: {
		secure: false,
		// secure: env === "prod", // !prod: change to secure
		httpOnly: true,
		maxAge: 1000*60*60*12, // two days
	},
	store: new MongoStore({mongooseConnection: mongoose.connection}),
}));
app.use(passport.initialize());
app.use(passport.session());
let expressWs = require('express-ws')(app);

// load routes
const passportRouter = require("./routes/passportRouter")(passport);
const messageRouter = require("./routes/messageRouter");

// add routes
app.use("/account", passportRouter);
app.use("/message", messageRouter);

// Express routing
app.get("/ping",(req,res)=>{
	return res.status(200).send({message: "All channels working properly."});
});

app.ws("/echo", (ws,req)=>{
	try{
				ws.on("message", ws.send);
	} catch(e){
			}
});

// Server listening
app.listen(PORT, ()=>{
	});
