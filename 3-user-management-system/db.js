const MongoClient = require('mongodb').MongoClient

var url = 'mongodb://localhost:27017/user_management'
var db

var getDB = function(){
	return new Promise(function (resolve, reject){
		if(db) return resolve(db)
		MongoClient.connect(url, function (err, database) {
			if(err) return reject(err)
			db = database
			return resolve(database)
		})
	})
}

var findUser = function (user){
	return getDB().then(function (db){
		return db.collection('user_management').findOne({user: user})
	})
}

var addUser = function (user, pass){
	return getDB().then(function (db){
		return db.collection('user_management').insertOne({user: user, pass: pass})
	})
}

var updateUser = function (user, pass){
	return getDB().then(function (db){
		return db.collection('user_management').update({user: user}, {$set: {pass: pass}}, {upsert: true})
	})
}

var deleteUser = function (user){
	return getDB().then(function (db){
		return db.collection('user_management').remove({user: user})
	})
}

module.exports = {
	findUser : findUser,
	addUser : addUser,
	updateUser : updateUser, 
	deleteUser : deleteUser
}
