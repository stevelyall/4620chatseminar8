var sockets = [];

exports.addClient = function(client_socket, username) {
	client_socket.username = username;
	sockets.push(client_socket);
};

exports.removeClient = function(client_socket, username) {
	sockets.forEach(function (currentValue, index, array) {
		if (currentValue.username == username) {
			console.log("Client " + currentValue.username + " removed");
			sockets.splice(index,1);

		}
	});
};

exports.sendUsersListUpdates = function () {
	checkForAndRemoveDeadClients();
	console.log(sockets.length + ' clients connected. ');
	var usernames = [];

	sockets.forEach(function(currentValue) {
		usernames.push(currentValue.username);
	});

	var message = {
		'command' : 'user list update',
		'list' : usernames
	};

	if (sockets.length == 0) {
		console.log('tried sending user list update, no clients connected');
	}
	sockets.forEach(function(currentValue) {
		currentValue.send(JSON.stringify(message));
	});
	console.log("Sent user list updates");
};

exports.getAllConnectedClients = function() {
	checkForAndRemoveDeadClients();
	return sockets;
};

exports.getClientForUser = function(user) {
	checkForAndRemoveDeadClients();
	for (var i = 0; i<sockets.length; i++) {
		if (sockets[i].username == user) {
			return sockets[i];
		}
	}
	console.log("couldn't find client for user " + user);
};

function checkForAndRemoveDeadClients() {
	sockets.forEach(function (currentValue, index, array) {
		if (currentValue.readyState != 1) {
			console.log('removing dead client ' + currentValue.username);
			array.splice(index,1);
		}
	})
}