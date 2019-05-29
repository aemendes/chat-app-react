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
		if(wsclients[req.user.id])
			wsclients[req.user.id].close()
		wsclients[req.user.id] = ws;
		ws.send("asd")
		ws.on("open", ()=>{
		})
		ws.onopen(()=>{
			ws.send("hello")
		})
		ws.onclose(()=>{
			delete wsclients[req.user.id];
		});
		ws.onerror(()=>{
			wsclients[req.user.id].close();
			delete wsclients[req.user.id];
		})
	}catch(e){
			}
});

MessageDriver.addOnMessageCallback(message=>{
	if(wsclients[message.to]){
		wsclients[message.to].send(JSON.stringify({op:"new", message}));
		MessageDriver.sent(message.id);
	}
});

messageRouter.get("/getSince", auth_isLogged, (req, res)=>{
		if(!req.query.since || parseInt(req.query.since) == NaN)
		return res.status(400).send(messageErrors.invalidSince);

		return MessageDriver.getSince(req.user._id, parseInt(req.query.since)).then(messages=>{
		return res.status(200).send({code:1, messages});
	}).catch(err=>{
				return res.status(500).send(err);
	});
});

messageRouter.post("/send", auth_isLogged, (req, res)=>{
	if(!req.body.to)
		return res.status(400).send(messageErrors.invalidTo);
	if(typeof req.body.message != "string" || req.body.message.length > 500)
		return res.status(400).send(messageErrors.invalidMessage);

	return UserDriver.addContactFromName(req.user._id, req.body.to).then(()=>{
				return MessageDriver.newMessageToName(req.user.name, req.body.to, req.body.message);
	}).then(message=>{
		return res.status(201).send({code:1, message:"message sent"});
	}).catch(err=>{
				return res.status(500).send(err);
	});
});

messageRouter.post("/seen", auth_isLogged, (req, res)=>{
	if(!mongoose.Types.ObjectId.isValid(req.body.messageId))
		return res.status(400).send(messageErrors.invalidMessageId);

	return MessageDriver.seen(mongoose.Types.ObjectId(req.body.messageId))
});

module.exports = messageRouter;
