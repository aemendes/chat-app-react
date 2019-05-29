"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const {User: UserCollection} = require("./collections");

let userSchema = new Schema({
	[UserCollection.keys.name]: {
		type: String,
		required: true,
		unique: true,
		index: true
	},
	[UserCollection.keys.pub]: {
		type: String,
		required: true,
	},
	[UserCollection.keys.priv]: {
		type: String,
		required: true,
	},
	[UserCollection.keys.password]: {
		type: String,
		required: true,
	},
	[UserCollection.keys.createdOn]: {
		type: Date,
		default: Date.now,
	},
	[UserCollection.keys.contacts]: [{
		type : Schema.ObjectId,
		ref: UserCollection.name,
		default: [],
		unique: true
	}],
});

module.exports = mongoose.model(UserCollection.name, userSchema);

/**
 * @typedef {Object} User
 * @property {mongoose.Types.ObjectId} _id Document Id
 * @property {mongoose.Types.ObjectId} id Document Id
 * @property {String} name Username
 * @property {String} pub User public key
 * @property {String} priv User private key
 * @property {String} password User password
 * @property {Date} createdOn Date of creation
 * @property {Array<User>} contacts List of contacts
*/
