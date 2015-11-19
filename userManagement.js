var userManagement = {

	'signin' : function(server_socket) {
		var osignin = {
			command: 'signin',
			name: document.getElementById('signin_username').value,
			password: document.getElementById('signin_password').value
		};
		server_socket.send(JSON.stringify(osignin));  // Convert the above object to a string and send it
	},

	'join' : function (server_socket) {
		var ojoin = {
			command: 'join',
			name: document.getElementById('join_username').value,
			password: document.getElementById('join_password').value
		};
		server_socket.send(JSON.stringify(ojoin));  // Convert the above object to a string and send it
	},

	'unsubscribe' : function (server_socket) {
		if (window.loggedInUser == undefined) {
			alert('Not Signed In');
		}
		else {
			var ounsubscribe = {
				command: 'unsubscribe',
				name: window.loggedInUser
			};
			server_socket.send(JSON.stringify(ounsubscribe));
		}
	},

	'signout' : function (server_socket) {
		if (window.loggedInUser == undefined) {
			alert('Not Signed In');
		}
		else {
			var osignout = {
				command: 'signout',
				name: window.loggedInUser
			};
			server_socket.send(JSON.stringify(osignout));
		}
	}

};