"use strict";

const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const User = require("../models/user");

const {User: UserCollection} = require("../models/collections");
const {user: UserError} = require("../errors/codes")

/**
 * @typedef {import("../models/user").User} UserDocument
 * @typedef {import("../database/config").WriteResult} WriteResult
 */

/**
 * Returns the user public key
 * @param {String|mongoose.Types.ObjectId} user User name or internal ObjectId
 * @param {mongoose.ClientSession} session Mongodb session to use in find
 * @param {String} why Why this function was called
 * @param {String} who Who called this function
 * @returns {Promise<String>}
 */
function getUserPub(user, session,  why="unspecified reason", who="unspecified origin"){
	if(typeof user === "string")
		return User.findOne({[UserCollection.keys.name]: user}, UserCollection.keys.pub, {session}).exec();
	else if(user instanceof mongoose.Types.ObjectId)
		return User.findById(user, UserCollection.keys.pub,{session}).exec();

	return Promise.reject("User is invalid");
}

/**
 * Returns the user name from objectid
 * @param {mongoose.ObjectId} userId User objectId
 * @param {mongoose.ClientSession} session Mongodb session to use in find
 * @param {String} why Why this function was called
 * @param {String} who Who called this function
 * @returns {Promise<string>}
 */
function getUserName(userId, session, why="unspecified reason", who="unspecified origin"){
	return User.findById(userId, UserCollection.keys.name, {session}).exec();
}

/**
 * 
 * @param {String} name Name of the user
 * @param {mongoose.ClientSession} session Mongodb session to use in find
 * @param {String} why Why this function was called
 * @param {String} who Who called this function
 * @returns {Promise<UserDocument>}
 */
function getUserFromName(username, session, why="unspecified reason", who="unspecified origin"){
	return User.findOne({[UserCollection.keys.name]:username}).setOptions({session}).exec();
}

/**
 * 
 * @param {mongoose.Types.ObjectId} id Internal id of the user
 * @param {mongoose.ClientSession} session Mongodb session to use in find
 * @param {String} why Why this function was called
 * @param {String} who Who called this function
 * @returns {Promise<UserDocument>}
 */
function getUserFromId(id, session, why="unspecified reason", who="unspecified origin"){
	if(!(id instanceof mongoose.Types.ObjectId))
		return Promise.reject(UserError.invalidId);

	return User.findById(id).setOptions({session}).exec();
}

/**
 * 
 * @param {mongoose.Types.ObjectId} id1 Internal id of the user
 * @param {mongoose.Types.ObjectId} id2 Internal id of the user
 * @param {mongoose.ClientSession} session Mongodb session to use in find
 * @param {String} why Why this function was called
 * @param {String} who Who called this function
 * @returns {Promise<[UserDocument,UserDocument]|false>}
 */
function getUserPairFromId(id1, id2, session, why="unspecified reason", who="unspecified origin"){
	if(!(id1 instanceof mongoose.Types.ObjectId) || !(id2 instanceof mongoose.Types.ObjectId))
		return Promise.reject(UserError.invalidId);

	return getUserFromId(id1, session, why+" -> checking one id of two", who +" -> getUserFromId@userDriver~checking user 1").then(user1=>{
		if(!user1)
			return false;

		return getUserFromId(id2, session, why+" -> checking two ids of two", who +" -> getUserFromId@userDriver~checking user 2").then(user2=>{
			if(!user2)
				return false;
	
			return [user1, user2];
		});
	});
}
function getUserPairFromName(name1, name2, session, why="unspecified reason", who="unspecified origin"){
	if(typeof name1 != "string" || typeof name2 != "string")
		return Promise.reject(UserError.invalidName);

	return getUserFromName(name1, session, why+" -> checking one name of two", who +" -> getUserFromName@userDriver~checking user 1").then(user1=>{
		if(!user1)
			return false;

		return getUserFromName(name2, session, why+" -> checking two names of two", who +" -> getUserFromName@userDriver~checking user 2").then(user2=>{
			if(!user2)
				return false;
	
			return [user1, user2];
		});
	});
}

/**
 * 
 * @param {String} username Name of the user
 * @param {String} pub User public key
 * @param {String} priv User private key
 * @param {String} password Password in plain text
 * @param {mongoose.ClientSession} session Mongodb session to use in find
 * @param {String} why Why this function was called
 * @param {String} who Who called this function
 */
function newUser(username, pub, priv, password, session, why="unspecified reason", who="unspecified origin"){
	if(typeof username != "string" || typeof pub != "string" || typeof priv != "string" || typeof password != "string")
		return Promise.reject(`Type missmatch for the following arguments
			username: ${typeof username != "string"},
			pub: ${typeof pub != "string"},
			priv: ${typeof priv != "string"},
			password: ${typeof password != "string"}. While ${why} called from ${from}`
		);

	return new Promise((resolve, reject)=>{
		return bcrypt.hash(password, 11, (err, hashedPassword)=>{
			if(err)
				return reject(err);
		
			return User.create([{
				[UserCollection.keys.name]: username,
				[UserCollection.keys.priv]: priv,
				[UserCollection.keys.pub]: pub,
				[UserCollection.keys.password]: hashedPassword,
			}],{session}).then(/** @param {UserDocument[]} user */ ([user])=>resolve(user)).catch(reject);
		});
	});
}

/**
 * 
 * @param {UserDocument} user Name of the user
 * @param {String} password Password to check
 * @param {String} why Why this function was called
 * @param {String} who Who called this function
 * @returns {Promise<boolean>}
 */
function validateUserPassword(user, password, why="unspecified reason", who="unspecified origin"){
	if(user == null || typeof user != "object" || !user.password){
		return Promise.reject(UserError.invalidUserField);
	}

	return new Promise((resolve,reject)=>{
		return bcrypt.compare(password, user.password, (err,result)=>{
			if(err)
				return reject(err);
			resolve(result);
		});
	});
}

/**
 * 
 * @param {mognoose.Types.ObjectId} id Id of user
 * @param {String} why Why this function was called
 * @param {String} who Who called this function
 * @returns {Promise<Array<UserDocument>>}
 */
function getContacts(id, why="unspecified reason", who="unspecified origin"){
	if(!(id instanceof mongoose.Types.ObjectId))
		return Promise.reject({...UserError.invalidId, why, who});

	return User.findById(id, [UserCollection.keys.contacts]).populate(UserCollection.keys.contacts, UserCollection.keys.name +" "+UserCollection.keys._id).exec().then(contacts=>contacts.contacts);
}


function addContact(to, contact, session, why="unspecified reason", who="unspecified origin"){
	if(!(to instanceof mongoose.Types.ObjectId) || !(contact instanceof mongoose.Types.ObjectId))
		return Promise.reject({...UserError.invalidId, why, who});
	
	return User.updateOne({id: to, [UserCollection.keys.contacts]: {$not:{$all: [contact]}}}, { $push: { [UserCollection.keys.contacts]: contact } }).setOptions({session}).exec().then(/** @param {WriteResult} res*/res=>{
		if(res.nModified === 0)
			return false;

		return true;
	})
}
function addContactFromName(name, contact, session, why="unspecified reason", who="unspecified origin"){
	if(!name)
		return Promise.reject({...UserError.invalidId, why, who});
	
	return getUserFromName(contact, session).then(userContact=>{
		console.log(userContact)
		return User.updateOne({[UserCollection.keys.name]: name, [UserCollection.keys.contacts]: {$not:{$all: [userContact.id]}}}, { $push: { [UserCollection.keys.contacts]: userContact.id } }).exec().then(/** @param {WriteResult} res*/res=>{
			if(res.nModified === 0)
				return false;

			return true;
		});
	});
}


module.exports ={
	getUserPub,
	getUserName,
	getUserFromName,
	getUserFromId,
	getUserPairFromId,
	getUserPairFromName,
	newUser,
	validateUserPassword,
	getContacts,
	addContactFromName,
	addContact,
};
