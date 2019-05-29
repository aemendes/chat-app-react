"use strict";

const uuid = require("uuid/v4");
const fs = require("fs");

/**
 * Write log to local filesystem
 * @param {(id:Number)=>String} where Function that output a string location where to write the log
 * @param {String} what What to write
 */
function writeLog(where=(id)=>`./log${id}.json`, what="", onerror=()=>{}){
	let logId = uuid();
	fs.writeFile(where(logId), what, (err)=>{
		if(err)
			return onerror(err);
	});

	return logId;
}

module.exports = {
	writeLog
}
