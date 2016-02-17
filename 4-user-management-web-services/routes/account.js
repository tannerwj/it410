const express = require('express')
const router = express.Router()
const path = require('path')
const passport = require('passport')

const acc = require('../src/account')

//check to see if the current client (browser) is logged in using session data.
//If the client is logged in then send back the user name.
router.get('/services/user', function (req, res) {
	if(req.user){
		res.send(user.username)
	}else{
		res.send('user not logged in')
	}
})

//create a user account if not created, otherwise return an error.
//Send a JSON string in the body that has the information needed to create the user.
router.post('/services/user', function (req, res) {
	var username = req.body.username
	var password = req.body.password

	acc.addUser(username, password).then(function (val){
		if(val.insertedCount === 1){
			res.send('user created')
		}else{
			throw new Error()
		}
	}).catch(function (err){
		res.send('an error')
	})
})

//create a user account if not created, otherwise update the user account if the user doing the update is logged in.
//Send a JSON string in the body that has the information needed to create or update the user.
router.put('/services/user', function (req, res) {
	var username = req.body.username
	var password = req.body.password

	acc.addUser(username, password).then(function (val){
		if(val.insertedCount === 1){
			res.send('user created')
		}else{
			throw new Error()
		}
	}).catch(function (err){
		if(req.user && req.user.username === username){
			acc.updateUser(username, password).then( function (val){
				res.send('user updated')
			}).catch(function (){
				throw new Error()
			})
		}else{
			throw new Error()
		}
	}).catch(function (){
		res.send('an err')
	})
})

//authenticate the client by sending a JSON string in the body that has all the necessary authentication information.
//If the authentication passes then a session should be established for the client.
router.put('/services/login', function (req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if(err) { return next(err) }
		if (!user) { return res.send('user not logged in') }

		req.logIn(user, function(err) {
			if (err) { return next(err) }
			return res.send('user logged in')
		})
	})(req, res, next)
})

//terminate the session for the client.
router.put('/services/logout', function (req, res) {
	req.logout()
	res.send('user logged out')
})

router.get('*', function (req, res) {
	res.sendFile('index.html', { root: path.join(__dirname, '../public') })
})

module.exports = router
