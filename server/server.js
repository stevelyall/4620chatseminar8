var crypto = require('crypto');

var accountsManager = require('./accountsManager');
var messageManager = require('./messageManager');
var chatEchoServer = require('ws').Server,
    ws_server = new chatEchoServer({port: 8841});

ws_server.on('connection', function(ws_client) {
    console.log('connected to client ' + ws_client);

	ws_client.on('message', function(message) {

        if (message == 'end')  // 'end' is an application level message.
            ws_client.close();

        // parse message string
        var messageObj = JSON.parse(message);

        if (messageObj.password != undefined) {
            // hash password
            var hash = crypto.createHash('sha512');
            messageObj.hashedpassword = hash.update(messageObj.password).digest('hex');
        }

        var user = messageObj.name;
        var password = messageObj.hashedpassword;

        // commmand cases
		switch (messageObj.command) {
			case 'join' :
				accountsManager.join(ws_client, user, password);
				break;

			case 'unsubscribe' :
				accountsManager.unsubscribe(ws_client, user);
				break;

			case 'signin' :
				accountsManager.signIn(ws_client, user, password);
				break;

			case 'signout' :
				accountsManager.signOut(ws_client, user);
				break;

			case 'message' :
				messageManager.sendMessage(messageObj);
				break;

			case 'broadcasting' :
				messageManager.sendBroadcast(messageObj);
				break;
		}
    });

    ws_client.on('close', function(code) {
        console.log('close');
        console.log(code);
        ws_client.close();
    });
    ws_client.on('error', function(err) {
        console.log('error\n' + err);
        ws_client.close();
    });

});
