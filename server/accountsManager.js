var MongoClient = require('mongodb').MongoClient;
var dbConnection = require('./chat_db');
var acknowlegementManager= require('./acknowledgementManager');

var clientsManager = require('./clientsManager');


exports.join = function (client_socket, user, password) {

	MongoClient.connect(dbConnection.connectionString, function (err, db) {
		if (err) throw err;
		console.log('inserting user... ' + user);
		var userCollection = db.collection('user');
		userCollection.find({username: user}).toArray(function (err, items) {
			if (err) throw  err;

			console.log(items.length);

			if (items.length != 0) {
				console.log('user already exists');
				acknowlegementManager.send(client_socket, 'join', user, 'exists');
			}
			else {
				console.log('user not exists, adding');
				userCollection.insert({username: user, password: password}, function (err, result) {
					if (err) throw err;
					console.log('inserted user ' + user);
					acknowlegementManager.send(client_socket, 'join', user, 'success');
				})
			}
		});
	});
};

exports.unsubscribe = function(client_socket, user) {
	MongoClient.connect(dbConnection.connectionString, function (err, db) {
		if (err) throw err;
		console.log('connected to db');
		var userCollection = db.collection('user');
		userCollection.deleteOne({username : user}, function (err, result) {
			if (err)  {
				console.log('could not delete user ' + user);
				acknowlegementManager.send(client_socket, 'unsubscribe', user, 'fail');
			}
			else {
				console.log('user unsubscribed successfully ' + user);
				acknowlegementManager.send(client_socket, 'unsubscribe', user, 'success');
			}
		})
	})
};

exports.signIn = function(client_socket, user, password) {
	MongoClient.connect(dbConnection.connectionString, function (err, db) {
		if (err) throw err;
		console.log('logging in as ' + user);
		var toFind = {username: user};
		db.collection('user').findOne(toFind, function(err, doc) {
			if (err) throw err;
			if (doc != null && doc.password == password) {
				clientsManager.addClient(client_socket, user);
				acknowlegementManager.send(client_socket, 'sign in', user, 'success');
				console.log('login succeeded');
				clientsManager.sendUsersListUpdates();
			}
			else {
				console.log('login failed');
				acknowlegementManager.send(client_socket, 'sign in', user, 'fail');
			}
		})
	});
};

exports.signOut = function(client_socket, user) {
	console.log('singing out...');
	if (user == undefined) {
		acknowlegementManager.send(client_socket, 'sign out', user, 'fail');
	}
	else {
		console.log('sign out succeeded ' + user);
		clientsManager.removeClient(client_socket, user);
		clientsManager.sendUsersListUpdates();
		acknowlegementManager.send(client_socket, 'sign out', user, 'success');
	}
};