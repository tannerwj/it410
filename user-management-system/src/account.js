const bcrypt = require('bcrypt')
const Promise = require('bluebird')

const db = require('../config/db')

var checkLogin = function (user){
	return new Promise( function (resolve, reject){
		return db.findUser(user).then( function (res){
			if(!res){ return reject()}
			return resolve(res)
		})
	})
}

var addUser = function (user, pass){
	return new Promise( function (resolve, reject){
		return db.findUser(user).then( function (res){
			if(res){ return reject('User already exists') }

			bcrypt.hash(pass, 12, function (err, hash){
				if(err){ return reject('bcrypt error')}

				return db.addUser(user, hash)
			})
		})
	})
}

var updateUser = function (user, pass){

}

module.exports = {
	checkLogin : checkLogin,
	addUser : addUser,
	updateUser : addUser
}
