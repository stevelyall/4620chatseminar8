var sockets = {};

exports.addClient = function(client_socket, username) {
	sockets[username] = client_socket;
};

exports.removeClient = function(client_socket, username) {
	sockets[username] = undefined;
};

exports.sendUsersListUpdates = function () {
	checkForAndRemoveDeadClients();

	var message = {
		'command' : 'user list update',
		'list' : []
	};

	for (var socket in sockets) {
		if (sockets.hasOwnProperty(socket)) {
			if (sockets[socket] != undefined) {
				message.list.push(socket);
			}
		}
	}

	for (socket in sockets) {
		if (sockets.hasOwnProperty(socket)) {
			if (sockets[socket] != undefined) {
				sockets[socket].send(JSON.stringify(message));
			}
		}
	}
	console.log("Sent user list updates");
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

	for (var socket in sockets) {
		if (sockets.hasOwnProperty(socket)) {
			if (sockets[socket] == undefined) {
				continue;
			}
			if (sockets[socket].readyState != 1) {
				console.log('removing dead client ' + socket);
				sockets[socket] = undefined;
			}
		}
	}
}