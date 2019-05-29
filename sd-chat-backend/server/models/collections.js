"use strict";

/*
 * @typedef {Object} User
 * @property {mongoose.Types.ObjectId} _id Document Id
 * @property {String} name Username
 * @property {String} pub
 * @property {Date} createdOn Date of creation
*/

// eslint-disable-next-line no-unused-vars
const mongoose = require("mongoose");

module.exports = {
	User: {
		name: "User",
		keys: {
			name: "name",
			pub: "pub",
			priv: "priv",
			password: "password",
			createdOn: "createdOn",
			contacts: "contacts",
		}
	},
	Message: {
		name: "Message",
		keys: {
			from: "from",
			to: "to",
			message: "message",
			likedByTo: "likedByTo",
			deletedOn: "deletedOn",
			timeSent: "timeSent",
			timeReceived: "timeReceived",
			seenAt: "seenAt"
		}
	}
};
