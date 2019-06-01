"use strict";

const express = require('express');

const {leakErrors, writeErrors} = require("../config");
const {auth_isLogged,auth_isNotLogged} = require("../middlewares/auth_middleware");
const {writeLog} = require("../snippets");


const passportRouter = express.Router();

module.exports = passport=>{
	passportRouter.post('/login', auth_isNotLogged, function(req, res, next) {
		console.log("logging in")

		return passport.authenticate('local-login', function(err, user) {
			if (err){
				console.log("err loging in", err)
				return res.status(500).send(leakErrors? err : {code:0, message: "Internal Error."});
			}
	
			if(!user){
				console.log("user doesnt exist")
				return res.status(400).send({code:0, message: "User not found"});
			}
			
			return req.logIn(user, function(err) {
				if(err)
					return res.send({code:-2, err});
				return res.send({code:1, message:"User logged.", username:user.username});
			});
		})(req, res, next);
	});
	passportRouter.post("/signup", auth_isNotLogged, function(req, res, next) {
		return passport.authenticate('local-signup', function(err, user) {
			if (err)
				return res.status(500).send({code:-1, err:err.message});
			if (!user)
				return res.send({code:0, err:"User already exists or invalid credentials."});

			return req.logIn(user, function(err) {
				if(err)
					return res.status(500).send({code:-2, err});
				return res.status(201).send({code:1, message:"User logged.", username: user.name, id: user.id});
			});
		})(req, res, next);
	});
	passportRouter.post("/logout", auth_isLogged, (req, res)=>{
		req.logout();
		res.send({code:1, message:"User logged out"});
	});
	passportRouter.get("/checkSession", auth_isLogged, (req,res)=>{
		res.send({code:1, message:"User logged", username: req.user.name, id:req.user.id});
	});	
	
	return passportRouter;
}
