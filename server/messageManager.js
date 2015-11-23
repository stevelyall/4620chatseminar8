var clientsManager = require('./clientsManager');

exports.sendMessage = function(message_obj) {
	//console.log(message_obj);
	var send_socket = clientsManager.getClientForUser(message_obj.toUser);
	if (send_socket == null) {
		console.log("user doesn't exist");
		var noUserMsg = {
			'command' : 'message',
			'toUser' : message_obj.fromUser,
			'fromUser' : 'SYSTEM',
			'text' : "Cannot find user " + message_obj.toUser
		};
		this.sendMessage(noUserMsg);
	}
	try {
		console.log('message from ' + message_obj.fromUser + ' to ' + message_obj.toUser);
		send_socket.send(JSON.stringify(message_obj));
		console.log('Sent');
		clientsManager.sendUsersListUpdates();
	}
	catch (e){
		console.log('ERROR SENDING MESSAGE');
		console.log(e)
	}
};

exports.sendBroadcast = function(message_obj) {
	var clients = clientsManager.getAllConnectedClients();

	for (var client in clients) {
		if (clients.hasOwnProperty(client)) {
			try {
				console.log('sending broadcast from:' + message_obj.fromUser + " msg: " + message_obj.text);
				clients[client].send(JSON.stringify(message_obj));
				console.log('sent');
				clientsManager.sendUsersListUpdates();
			}
			catch (e) {
				console.log("ERROR SENDING BROADCAST");
				console.log(e)
			}
		}

	}
};