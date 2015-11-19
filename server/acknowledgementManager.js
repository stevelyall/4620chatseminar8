exports.send = function (client_socket, command, user, msg) {
	var message = {
		'command' : 'acknowledgement',
		'commandPerformed' : command,
		'user' : user,
		'message' : msg
	};
	client_socket.send(JSON.stringify(message))
};