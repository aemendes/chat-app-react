"use strict";

const mongoose = require("mongoose");
const LocalStrategy = require('passport-local').Strategy;

const {user: UserError} = require("../errors/codes");
const UserDriver = require("../drivers/userDriver");

const {writeErrors} = require("../config");
const {writeLog} = require("../snippets");

/**
 * @typedef {import("../models/user").User} UserDocument
 * @typedef {import("../database/config").WriteResult} WriteResult
 */


function registerUser(username, password, pub, priv, done){
	// find a user whose username is the same as the forms username
	// we are checking to see if the user trying to login already exists
	if(username.length < 3 || username.length > 15)
		return done(UserError.nameNotWithinLimits);

	if(password.length < 5)
		return done(UserError.passwordNotWithinLimits);
	
	let session;
	return mongoose.startSession().then(_session=>{
		session = _session;
		session.startTransaction();

		return UserDriver.getUserFromName(username, session, "finding out if user already exists", "passport.js@registerUser~checking user");
	}).then(user=>{
		if(user)
			return done(UserError.userAlreadyExists);
				return UserDriver.newUser(
			username,
			pub||"0", priv||"0",
			password,
			session,
			"creating user",
			"passport.js@registerUser~registering user"
		).then(/** @param {UserDocument} */ user=>{
			return session.commitTransaction().then(()=>{
				session.endSession();
				return done(null, user);
			});
		})
	}).catch(done);
	// .catch(err=>{
	// 	let errorId;
	// 	if(writeErrors)
	// 		errorId = writeLog(
	// 			(errorId)=>`./logs/errors/${errorId}@${new Date().getTime()}.json`,
	// 			"reservationRouter@post:unreserve\n"+error.toString()+"\n"+error.stack,
	// 			(errorWriting)=>console.error(`reservationRouter@post:unreserve~writing log file for error Id ${errorId}:`, error, errorWriting)
	// 		);

	// 	console.err(err);
	// 	return done(err);
	// });
}

function loginUser(username, password, done){
		return UserDriver.getUserFromName(username, null, "Finding user to login", "passport.js@loginUser~finding user").then(user=>{
		if(!user)
			return done(UserError.userNotFound);
		return UserDriver.validateUserPassword(user, password, "validating user password", "passport.js@loginUser~validating").then(result=>done(null, result && user));
	}).catch(done);
}


module.exports = function(passport) {

	// =========================================================================
	// passport session setup ==================================================
	// =========================================================================
	// required for persistent login sessions
	// passport needs ability to serialize and unserialize users out of session
2
	// used to serialize the user for the session
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});
	// used to deserialize the user
	passport.deserializeUser(function(id, done) {
				return UserDriver.getUserFromId(mongoose.Types.ObjectId(id), null, "Deserializing user", "passport.js@deseralizeUser~getting user").then(user=>{
			done(null, user);
		}).catch(err=>{
			let errorId;
			if(writeErrors)
				errorId = writeLog(
					(errorId)=>`./logs/errors/${errorId}@${new Date().getTime()}.json`,
					"passport.js@deseralizeUser~getting user\n"+err.toString()+"\n"+err.stack,
					(errorWriting)=>console.error(`passport.js@deseralizeUser~getting user~writing log file for error Id ${errorId}:`, err, errorWriting)
				);
	
			console.error(err);
			return done(err);
		});
	});

	// =========================================================================
	// LOCAL SIGNUP ============================================================
	// =========================================================================
	// we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'

	passport.use('local-signup', new LocalStrategy({usernameField: 'username',passwordField: 'password'}, (username, password, done) => {
		return registerUser(username, password, null, null, done);
	}));


	// =========================================================================
	// LOCAL LOGIN ============================================================
	// =========================================================================
	// we are using named strategies since we have one for login and one for signup
	// by default, if there was no name, it would just be called 'local'
	passport.use('local-login', new LocalStrategy(loginUser));
};

