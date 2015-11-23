window.addEventListener('load', function () {
	setEventListeners();

	connect();
});

var ws;
function connect() {
	if ("WebSocket" in window) {
		ws = new WebSocket("ws://cs.tru.ca:8841/chat");
		//ws = new WebSocket("ws://localhost:8841/chat", "chat");

		ws.onopen = function () {
			console.log('open');
			printOutput("Connected");
		};

		ws.onmessage = function (e) {
			var message = JSON.parse(e.data);
			console.log('recieved message:');
			console.log(message);

			// is user list update
			if (message.command == 'user list update') {
				messageInHandler.userListUpdate(message);
			}

			// is acknowledgement of command
			if (message.command == 'acknowledgement') {
				messageInHandler.acknowledgementIn(message);
			}

			//is broadcast
			if (message.command == 'broadcasting') {
				messageInHandler.broadcastMessageIn(message);
			}
			//is one to one
			if (message.command == 'message') {
				messageInHandler.oneToOneMessageIn(message);
			}

		};

		ws.onclose = function (code) {
			printOutput("Connection Closed");
			console.log("connection closed " + code);
		};

		ws.onerror = function(err) {
			console.log("An error occured");
			console.log(err);
		}
	}
	else
		alert("WebSocket not supported!");
}

// ui

function show_signin() {
	document.getElementById('blanket').style.display = "block";
	document.getElementById('signinbox').style.display = "block";
}

function show_join() {
	document.getElementById('blanket').style.display = "block";
	document.getElementById('joinbox').style.display = "block";
}

function hide_popup_box() {
	document.getElementById('blanket').style.display = "none";
	document.getElementById('signinbox').style.display = "none";
	document.getElementById('joinbox').style.display = "none";
}

function signin_click() {
	userManagement.signin(ws);
}

function join_click() {
	userManagement.join(ws);
}

function setEventListeners() {
	document.getElementById('blanket').addEventListener('click', hide_popup_box);
	document.getElementById('cancel_signin').addEventListener('click', hide_popup_box);
	document.getElementById('cancel_join').addEventListener('click', hide_popup_box);
	document.getElementById('menu').addEventListener('change', function () {
		if (this.value == 'signin') {
			show_signin();
		}
		else if (this.value == 'join') {
			show_join();
		}
		else if (this.value == 'unsubscribe') {
			userManagement.unsubscribe(ws);
		}
		else if (this.value == 'signout') {
			userManagement.signout(ws);
		}
		else {
			hide_popup_box();
		}
	});

	// send  button click event
	document.getElementById("btn_send_msg").addEventListener('click', function () {

		if (window.loggedInUser == undefined) {
			alert("You are not signed in.");
			return;
		}

		var message = {
			'text': document.getElementById("msg_input").value,
			'fromUser' : window.loggedInUser
		};

		var toUser = document.getElementById("user_to_msg_input").value;

		if (toUser.length < 1) {
			// broadcast
			message.command = "broadcasting";

			ws.send(JSON.stringify(message));
			console.log('sending broadcast:');
			console.log(message);
		}
		else {
			// one to one
			message.command = 'message';
			message.toUser = toUser;

			ws.send(JSON.stringify(message));
			console.log('sending message to ' + message.toUser + ":");
			console.log(message);
		}
		clearInputs();

	});

	function clearInputs() {
		document.getElementById("user_to_msg_input").value = "";
		document.getElementById("msg_input").value = "";

	}
}