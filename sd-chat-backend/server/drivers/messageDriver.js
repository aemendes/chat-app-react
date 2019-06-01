"use strict";

const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const uuid = require("uuid/v4");

const Message = require("../models/message");

const {Message: MessageCollection, User: UserCollection} = require("../models/collections");
const {message: MessageError} = require("../errors/codes")

const userDriver = require("../drivers/userDriver");

/**
 * @typedef {import("../models/message").Message}  MessageDocument
 * @typedef {import("../database/config").WriteResult} WriteResult
 */

let newMessageCallbacks = {}

Message.watch({fullDocument: 'updateLookup'}).on('change', change => {
	if(change.operationType === "insert"){
		// new message
		console.log(change.fullDocument.from.id.hexSlice(), change.fullDocument.to.id.hexSlice())
		userDriver.getUserPairFromId(mongoose.Types.ObjectId(change.fullDocument.from.id.hexSlice()), mongoose.Types.ObjectId(change.fullDocument.to.id.hexSlice())).then(users=>{
			console.log("userpair: ", users)
			Object.values(newMessageCallbacks).forEach(cb=>cb(change.fullDocument, users[0].name, users[1].name));
		}).catch(err=>console.log("err on hcnage",err));
	} else if(change.operationType === "update"){

	}
});


/**
 * onMessage callback
 *
 * @callback onMessage
 * @param {MessageDocument} message The new message
 */
/**
 * Add callback to message
 * @param {onMessage} cb Function to execute with every new message
 * @returns {string} 
 */
function addOnMessageCallback(cb){
	let id = uuid();
	newMessageCallbacks[id] = cb;

	return id;
}

/**
 * Remove a callback from on message
 * @param {mongoose.Types.ObjectId} id Id of callback to remove
 */
function removeOnMessageCallback(id){
	return delete newMessageCallbacks[id];
}

/**
 * 
 * @param {mongoose.Types.ObjectId} from Who wrote the message
 * @param {mongoose.Types.ObjectId} to Who received the message
 * @param {String} message The message
 * @param {mongoose.ClientSession} session Mongodb session to use in find
 * @param {String} why Why this function was called
 * @param {String} who Who called this function
 * @returns {Promise<MessageDocument>}
 */
function newMessage(from, to, message, session, why="unspecified reason", who="unspecified origin"){
		if(!(from instanceof mongoose.Types.ObjectId) || !(to instanceof mongoose.Types.ObjectId))
		return Promise.reject({...MessageError.invalidToFrom, why, who});
	if(typeof message != "string" || message.length > 500)
		return Promise.reject({...MessageError.invalidMessage, why, who});

	return userDriver.getUserPairFromId(from, to, session, "getting from and to to create message", "newMessage@messageDriver").then(users=>{
		if(!users)
			throw new Error({...MessageError.invalidToFrom, why, who});

		return Message.create([{
			[MessageCollection.keys.from]: users[0].id,
			[MessageCollection.keys.to]: users[1].id,
			[MessageCollection.keys.message]: message
		}], {session});
	});
}

function newMessageToName(from, to, message, session, why="unspecified reason", who="unspecified origin"){
	if(typeof from != "string" || typeof to != "string")
		return Promise.reject({...MessageError.invalidToFrom, why, who});
	if(typeof message != "string" || message.length > 500)
		return Promise.reject({...MessageError.invalidMessage, why, who});

	return userDriver.getUserPairFromName(from, to, session, "getting from and to to create message", "newMessage@messageDriver").then(users=>{
		if(!users)
			throw new Error({...MessageError.invalidToFrom, why, who});

		return Message.create([{
			[MessageCollection.keys.from]: users[0].id,
			[MessageCollection.keys.to]: users[1].id,
			[MessageCollection.keys.message]: message
		}], {session});
	});
}

/**
 * 
 * @param {mognoose.Types.ObjectId} id User Id
 * @param {mongoose.ClientSession} session Mongodb session to use in find
 * @param {String} why Why this function was called
 * @param {String} who Who called this function
 * @return {Promise<boolean>}
 */
function deleteMessage(id, session, why="unspecified reason", who="unspecified origin"){
	if(!(id instanceof mongoose.Types.ObjectId))
		return Promise.reject({...MessageError.invalidMessageId, why, who});

	return Message.updateOne(
		{id, [MessageCollection.keys.deletedOn]: null},
		{[MessageCollection.keys.deletedOn]: Date.now()}
	).setOptions({session}).exec().then(/** @param {WriteResult} res */res=>{
		if(res.nModified === 0)
			throw new Error(MessageError.invalidMessageOrAlreadyDeleted);

		return true;
	});
}

/**
 * 
 * @param {mognoose.Types.ObjectId} id User Id
 * @param {mongoose.ClientSession} session Mongodb session to use in find
 * @param {String} why Why this function was called
 * @param {String} who Who called this function
 * @return {Promise<boolean>}
 */
function like(id, session, why="unspecified reason", who="unspecified origin"){
	if(!(id instanceof mongoose.Types.ObjectId))
		return Promise.reject({...MessageError.invalidMessageId, why, who});

	return Message.updateOne(
		{id},
		{[MessageCollection.keys.likedByTo]: true}
	).setOptions({session}).exec().then(/** @param {WriteResult} res*/res=>{
		if(res.nMatched === 0)
			throw new Error({...MessageError.invalidMessageId, who, why});
		if(res.nModified === 0)
			throw new Error({...MessageError.messageAlreadyLiked, who, why});
		
		return true;
	});
}

/**
 * 
 * @param {mognoose.Types.ObjectId} id User Id
 * @param {mongoose.ClientSession} session Mongodb session to use in find
 * @param {String} why Why this function was called
 * @param {String} who Who called this function
 * @return {Promise<boolean>}
 */
function seen(id, session, why="unspecified reason", who="unspecified origin"){
	if(!(id instanceof mongoose.Types.ObjectId))
		return Promise.reject({...MessageError.invalidMessageId, why, who});

	return Message.updateOne(
		{id, [MessageCollection.keys.seenAt]: null},
		{[MessageCollection.keys.seenAt]: Date.now()}
	).setOptions({session}).exec().then(/** @param {WriteResult} res*/res=>{
		if(res.nMatched === 0)
			return false;
		if(res.nModified === 0)
			return false;
		
		return true;
	});
}

/**
 * 
 * @param {mognoose.Types.ObjectId} id User Id
 * @param {mongoose.ClientSession} session Mongodb session to use in find
 * @param {String} why Why this function was called
 * @param {String} who Who called this function
 * @return {Promise<boolean>}
 */
function sent(id, session, why="unspecified reason", who="unspecified origin"){
	if(!(id instanceof mongoose.Types.ObjectId))
		return Promise.reject({...MessageError.invalidMessageId, why, who});

	return Message.updateOne(
		{id, [MessageCollection.keys.timeReceived]: null},
		{[MessageCollection.keys.timeReceived]: Date.now()}
	).setOptions({session}).exec().then(/** @param {WriteResult} res*/res=>{
		if(res.nMatched === 0)
			return false;
		if(res.nModified === 0)
			return false;
		
		return true;
	});
}

/**
 * 
 * @param {mognoose.Types.ObjectId} id User Id
 * @param {mongoose.ClientSession} session Mongodb session to use in find
 * @param {String} why Why this function was called
 * @param {String} who Who called this function
 * @return {Promise<boolean>}
 */
function received(id, session, why="unspecified reason", who="unspecified origin"){
	if(!(id instanceof mongoose.Types.ObjectId))
		return Promise.reject({...MessageError.invalidMessageId, why, who});

	return Message.updateOne(
		{id, [MessageCollection.keys.timeReceived]: null},
		{[MessageCollection.keys.timeReceived]: Date.now()}
	).setOptions({session}).exec().then(/** @param {WriteResult} res*/res=>{
		if(res.nMatched === 0)
			return false;
		if(res.nModified === 0)
			return false;
		
		return true;
	});
}

/**
 * 
 * @param {mognoose.Types.ObjectId} from Who wrote the message
 * @param {mognoose.Types.ObjectId} to Who received the message
 * @param {Date} since Since when
 * @param {mongoose.ClientSession} session Mongodb session to use in find
 * @param {String} why Why this function was called
 * @param {String} who Who called this function
 * @returns {Promise<Array<MessageDocument>>}
 */
function getSince(to, since=Date.now(), session, why="unspecified reason", who="unspecified origin"){
	if(!(to instanceof mongoose.Types.ObjectId))
		return Promise.reject({...MessageError.invalidToFrom, why, who});
	if(typeof since != "number")
		return Promise.reject({...MessageError.invalidSince, why, who});

	return Message.find({[MessageCollection.keys.to]: to, [MessageCollection.keys.timeSent]: {$gte: since}}).populate(MessageCollection.keys.from + " " + MessageCollection.keys.to, UserCollection.keys.name).setOptions({session}).exec().then(messagesTo=>{
		return Message.find({[MessageCollection.keys.from]: to, [MessageCollection.keys.timeSent]: {$gte: since}}).populate(MessageCollection.keys.from + " " + MessageCollection.keys.to, UserCollection.keys.name).setOptions({session}).exec().then(messagesFrom=>{
			console.log("messages",[...messagesTo, ...messagesFrom])
			return [...messagesTo, ...messagesFrom];
		});
	})
}

module.exports = {
	addOnMessageCallback,
	removeOnMessageCallback,
	newMessage,
	newMessageToName,
	deleteMessage,
	like,
	seen,
	sent,
	received,
	getSince
}
