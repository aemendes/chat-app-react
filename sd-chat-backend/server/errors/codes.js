"use strict";

module.exports = {
	user: {
		userNotFound: {
			code: -0x10001,
			codeString: "user:-1",
			message: "User not found."
		},
		unexpectedInternal: {
			code: -0x10002,
			codeString: "user:-2",
			message: "Unexpected Internal Error."
		},
		nameNotWithinLimits: {
			code: -0x10003,
			codeString: "user:-3",
			message: "Username length not within limits"
		},
		passwordNotWithinLimits: {
			code: -0x10004,
			codeString: "user:-4",
			message: "Password length not within limits"
		},
		userAlreadyExists: {
			code: -0x10005,
			codeString: "user:-5",
			message: "User already exists."
		},
		invalidUserField: {
			code: -0x10006,
			codeString: "user:-6",
			message: "Provided user argument is invalid."
		},
		invalidId: {
			code: -0x10007,
			codeString: "user:-7",
			message: "Provided user ID is invalid."
		},
		userNotLogged: {
			code: -0x10008,
			codeString: "user:-8",
			message: "User not logged in."
		},
		userAlreadyLogged: {
			code: -0x10009,
			codeString: "user:-9",
			message: "User already logged in."
		},
		couldntAddContact: {
			code: -0x10010,
			codeString: "user:-10",
			message: "Couldn't add contact."
		},
		invalidName: {
			code: -0x10011,
			codeString: "user:-11",
			message: "Invalid name."
		},
	},
	message: {
		invalidToFrom: {
			code: -0x20001,
			codeString: "message:-1",
			message: "Invalid recipiente or sender."
		},
		invalidMessage: {
			code: -0x20002,
			codeString: "message:-2",
			message: "Message is invalid, should be string with a maximum of 500 characters."
		},
		invalidMessageId: {
			code: -0x20003,
			codeString: "message:-3",
			message: "Message id is invalid."
		},
		invalidMessageOrAlreadyDeleted: {
			code: -0x20004,
			codeString: "message:-4",
			message: "Invalid message or already deleted."
		},
		messageAlreadyLiked: {
			code: -0x20005,
			codeString: "message:-5",
			message: "Message already liked."
		},
		invalidSince: {
			code: -0x20006,
			codeString: "message:-6",
			message: "Invalid since param specified."
		},
		invalidTo: {
			code: -0x20007,
			codeString: "message:-7",
			message: "Invalid to param specified."
		}

	}
};
