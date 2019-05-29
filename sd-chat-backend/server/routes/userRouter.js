"use strict";

const express = require('express');

const {user: userErrors} = require("../errors/codes");
const {leakErrors} = require("../config");

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
