const bcrypt = require('bcryptjs')
const Promise = require('bluebird')

const db = require('../config/db')
const BCRYPT_ROUNDS = 5

var checkLogin = function (user, pass){
	return new Promise( function (resolve, reject){
		return db.findUser(user).then(function (user){
			if(!user){ return reject('User does not exist') }

			bcrypt.compare(pass, user.pass, function (err, res){
				if(err){ return reject('bcrypt error') }
				if(!res){ return reject('Incorrect password') }

				return resolve(user)
			})
		})
	})
}

var addUser = function (user, pass){
	return new Promise( function (resolve, reject){
		return db.findUser(user).then( function (res){
			if(res){ return reject('User already exists') }

			bcrypt.hash(pass, BCRYPT_ROUNDS, function (err, hash){
				if(err){ return reject('bcrypt error') }

				return resolve(db.addUser(user, hash))
			})
		})
	})
}

var updateUser = function (user, pass){
	return new Promise( function (resolve, reject){
		return db.findUser(user).then( function (res){
			if(!res){ return reject('User does not exists') }

			bcrypt.hash(pass, BCRYPT_ROUNDS, function (err, hash){
				if(err){ return reject('bcrypt error') }

				return resolve(db.updateUser(user, hash))
			})
		})
	})

}

var findUser = function (username){
	return db.findUser(username)
}

var deleteUser = function (user){
	return db.deleteUser(user)
}

module.exports = {
	checkLogin : checkLogin,
	addUser : addUser,
	updateUser : updateUser,
	deleteUser : deleteUser,
	findUser: findUser
}
