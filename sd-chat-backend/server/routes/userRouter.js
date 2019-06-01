"use strict";

const express = require('express');
const mongoose = require("mongoose");

const {user: userErrors} = require("../errors/codes");
const {leakErrors} = require("../config");
const {auth_isLogged,auth_isNotLogged} = require("../middlewares/auth_middleware");

const UserDriver = require("../drivers/userDriver");


const userRouter = express.Router();

userRouter.get("/user/:name/pub", (req, res)=>{
	return UserDriver.getUserPub(req.params.name).then(pub=>{
		if(!pub)
			return res.status(400).send(userErrors.userNotFound);
		return res.send({name:req.params.name,pub});
	}).catch(err=>{
		return res.status(500).send(leakErrors? userErrors.unexpectedInternal : {...userErrors.unexpectedInternal, err});
	});
});

userRouter.get("/contacts", auth_isLogged, (req,res)=>{
	return UserDriver.getContacts(mongoose.Types.ObjectId(req.user.id),"getting contacts from route", "userRouter@get:contacts~getting contacts").then(contacts=>{
		console.log(contacts)
		res.status(200).send({code:1, contacts});
	}).catch(err=>{
		console.log("error found on get contacts", err);
		res.status(500).send(err);
	});
})

module.exports = userRouter;
