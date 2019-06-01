"use strict";

const express = require('express');
const mongoose = require("mongoose");

const {message: messageErrors} = require("../errors/codes");
const {auth_isLogged,auth_isNotLogged} = require("../middlewares/auth_middleware");
const {leakErrors} = require("../config");

const MessageDriver = require("../drivers/messageDriver");
const UserDriver = require("../drivers/userDriver");


const messageRouter = express.Router();

/** @type {Map.<any,WebSocket>} */
let wsclients = {}

messageRouter.ws("/ws", (ws, req)=>{
	try{
		console.log(req.user.id)
		if(wsclients[req.user.id])
			wsclients[req.user.id].close()
		wsclients[req.user.id] = ws;

		ws.on("message", (msg)=>{
			console.log(`got data from ${req.user.name}: `, msg)
		})

		ws.on("close", (data)=>{
			console.log("bye1 close",data)
			try{
				wsclients[req.user.id].close();
				delete wsclients[req.user.id];
				console.log("bye2 close")
			}catch(e){
				console.log("error wile: close ->",e)
			}
		});
		ws.on("error", (data)=>{
			console.log("bye1 error", data)
			try{
				wsclients[req.user.id].close();
				delete wsclients[req.user.id];
				console.log("bye2 error")
			}catch(e){
				console.log("error wile: error ->",e)
			}
		})
	}catch(e){
		console.log("err on message ws:", e);
	}
});

MessageDriver.addOnMessageCallback((message, from, to)=>{
	console.log("new message", message, {from, to})
	console.log(message.to.id,message._id.id.hexSlice())
	if(wsclients[message.to] || wsclients[message.from]){
		if(wsclients[message.to])
			wsclients[message.to].send(JSON.stringify({op:"new", message, from, to}));
		if(wsclients[message.from])
			wsclients[message.from].send(JSON.stringify({op:"new", message, from, to}));
		setTimeout(()=>MessageDriver.sent(mongoose.Types.ObjectId(message._id.id.hexSlice()),null,"message sent","onmessagecb").catch(err=>console.log("err on sendws",err)));
	}
});

messageRouter.get("/getSince", auth_isLogged, (req, res)=>{
	if(!req.query.since || isNaN(req.query.since))
		return res.status(400).send(messageErrors.invalidSince);
	console.log(req.user)
	return MessageDriver.getSince(req.user._id, parseInt(req.query.since)).then(messages=>{
		return res.status(200).send({code:1, messages});
	}).catch(err=>{
		return res.status(500).send(err);
	});
});

messageRouter.post("/send", auth_isLogged, (req, res)=>{
	console.log("asd", req.body)
	if(!req.body.to)
		return res.status(400).send(messageErrors.invalidTo);
	if(typeof req.body.message != "string" || req.body.message.length > 500){
		console.log("asd")
		return res.status(400).send(messageErrors.invalidMessage);
	}

		console.log("asd")
	return UserDriver.addContactFromName(req.user.name, req.body.to).then((res)=>{
		console.log("asd", res)
		return UserDriver.addContactFromName(req.body.to, req.user.name);
	}).then((res)=>{
		return MessageDriver.newMessageToName(req.user.name, req.body.to, req.body.message);
	}).then(message=>{
		console.log("asd")
		return res.status(201).send({code:1, message:"message sent"});
	}).catch(err=>{
		console.log("asd err",err)
		return res.status(500).send(err);
	});
});

messageRouter.post("/seen", auth_isLogged, (req, res)=>{
	if(!mongoose.Types.ObjectId.isValid(req.body.messageId))
		return res.status(400).send(messageErrors.invalidMessageId);

	return MessageDriver.seen(mongoose.Types.ObjectId(req.body.messageId))
});

module.exports = messageRouter;
