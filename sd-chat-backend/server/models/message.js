"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const {Message: MessageCollection, User: UserCollection} = require("./collections");

let MessageSchema = new Schema({
	[MessageCollection.keys.from]: {
		type: "ObjectId",
		ref: UserCollection.name,
		required: true,
		index: true
	},
	[MessageCollection.keys.to]: {
		type: "ObjectId",
		ref: UserCollection.name,
		required: true,
		index: true
	},
	[MessageCollection.keys.message]: {
		type: String,
		default: '',
		max: 500,
		text: true
	},
	[MessageCollection.keys.likedByTo]: {
		type: Boolean,
		default: false
	},
	[MessageCollection.keys.deletedOn]: {
		type: Date,
		default: null
	},
	[MessageCollection.keys.timeSent]: {
		type: Date,
		default: Date.now,
		index: true
	},
	[MessageCollection.keys.timeReceived]: {
		type: Date,
		default: null
	},
	[MessageCollection.keys.seenAt]: {
		type: Date,
		default: null
	}
});

module.exports = mongoose.model(MessageCollection.name, MessageSchema);

/**
 * @typedef {Object} Message
 * @property {mongoose.Types.ObjectId} id Document Id
 * @property {mongoose.Types.ObjectId} _id Document Id
 * @property {ObjectId} from Who wrote the message
 * @property {ObjectId} to Who received the message
 * @property {String} message The message 
 * @property {Boolean} likedByTo Was the message liked by the receiver
 * @property {Date} deletedOn Was the message delted
 * @property {Date} timeSent Time the message was sent
 * @property {Date} timeReceived Time the message was received
 * @property {Date} seenAt Time the message was seen
*/
