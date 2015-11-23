var sockets = {};

exports.addClient = function(client_socket, username) {
	sockets[username] = client_socket;
};

exports.removeClient = function(client_socket, username) {
	sockets[username] = undefined;
};

function size() {
	var size = 0;
	for (var i in sockets) {
		size++;
	}
	return size;
}

// TODO
exports.sendUsersListUpdates = function () {
	checkForAndRemoveDeadClients();
	//console.log(sockets.size + ' clients connected. ');
	//
	//var message = {
	//	'command' : 'user list update',
	//	'list' : []
	//};
	//
	//for (var socket in sockets) {
	//	if (socket != undefined) {
	//		message.list.push(socket);
	//	}
	//}
	//
	//if (sockets.length == 0) {
	//	console.log('tried sending user list update, no clients connected');
	//}
	//
	//for (socket in sockets) {
	//	if (socket == undefined || !sockets.hasOwnProperty(socket)) {
	//		continue;
	//	}
	//	console.log(socket);
	//	if (socket != undefined) {
	//		socket.send(JSON.stringify(message));
	//	}
	//}
	//console.log("Sent user list updates");
};

exports.getAllConnectedClients = function() {
	checkForAndRemoveDeadClients();
	return sockets;
};

exports.getClientForUser = function(user) {
	checkForAndRemoveDeadClients();

	var result = sockets[user];
	if (result == undefined) {
		console.log("couldn't find client for user " + user);
	}
	else {
		return result;
	}
};

function checkForAndRemoveDeadClients() {
	// TODO
	//for (var i = 0; i < size(); i++) {
	//	if (sockets[i]== undefined) {
	//		continue;
	//	}
	//	if (sockets[i].readyState != 1) {
	//		console.log('removing dead client ' + index);
	//		sockets[i] = undefined;
	//	}
	//}
}