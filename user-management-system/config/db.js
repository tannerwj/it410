const MongoClient = require('mongodb').MongoClient

var url = 'mongodb://localhost:27017/user_management'

var db

MongoClient.connect(url, function (err, database) {
	console.log('Connected to mongodb')
	db = database
})

var findUser = function (user){
	return new Promise( function (resolve, reject){
		db.collection('user_management').findOne({user: user}, function (err, doc){
			if(err){ return reject(err) }
			resolve(doc)
		})
	})
}

var addUser = function (user, pass){
	return new Promise( function (resolve, reject){
		db.collection('user_management').insertOne({user: user, pass: pass}, function (err, res){
			if(err){ return reject(err) }
			resolve(res)
		})
	})
}

var updateUser = function (user, pass){
	return new Promise( function (resolve, reject){
		db.collection('user_management').insertOne({user: user}, {$set: {pass: pass}}, function (err, res){
			if(err){ return reject(err) }
			resolve(res)
		})
	})
}

module.exports = {
	findUser : findUser,
	addUser : addUser
}
