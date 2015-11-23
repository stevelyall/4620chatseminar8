var messageInHandler = {

	'userListUpdate' : function (message) {
		console.log("user list update recieved");
		var listDisplay = document.getElementById('user_list');
		listDisplay.innerHTML = "";
		message.list.forEach(function(current, index, array) {
			listDisplay.innerHTML += current;
		})
	},

	'oneToOneMessageIn' : function(message) {
		printOutput("Message from " + message.fromUser + ": " + message.text);
	},

	'broadcastMessageIn' : function(message) {
		printOutput("Broadcast from " + message.fromUser + ": " + message.text);
	},

	'acknowledgementIn' : function (message) {
		// join successful
		if (message.commandPerformed == 'join' && message.message == 'success')
			printOutput("User " + message.user + " joined successfully.");
		else if (message.commandPerformed == 'join' && message.message == 'exists' )
			printOutput("Could not join. User already exists.");
		else if (message.commandPerformed == 'join') {
			printOutput("Could not join. An error occurred");
		}

		//sign in successful
		if (message.commandPerformed == 'sign in' && message.message == 'success') {
			printOutput("User " + message.user + " signed in successfully.");
			window.loggedInUser = message.user;
		}
		else if (message.commandPerformed == 'sign in') {
			printOutput("Sign in failed");
		}

		// unsubscribe successful
		if (message.commandPerformed == 'unsubscribe' && message.message == 'success') {
			printOutput("User " + message.user + " unsubscribed");
			window.loggedInUser = undefined;
			document.getElementById('user_list').innerHTML = "NOT SIGNED IN";
		}
		else if (message.commandPerformed == 'unsubscribe'){
			printOutput("Could not unsubscribe. An error occurred");
		}
		// sign out successful
		if (message.commandPerformed === 'sign out' && message.message == 'success') {
			printOutput("Signed out successfully");
			window.loggedInUser = undefined;
			document.getElementById('user_list').innerHTML = "NOT SIGNED IN";
		}
		else if (message.commandPerformed == 'sign out') {
			printOutput("Could not sign out. An error occurred.");
		}
	}
};

function printOutput(str) {
	document.getElementById('output').innerHTML += str + '<br>';
}