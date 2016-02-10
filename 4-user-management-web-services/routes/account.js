const express = require('express')
const router = express.Router()
const path = require('path')

const acc = require('../src/account')

router.get('/', function (req, res) { 
	acc.checkLogin()
	res.sendFile('index.html', { root: path.join(__dirname, '../public') }) 
})

router.get('/account', function (req, res) { 
	res.sendFile('account.html', { root: path.join(__dirname, '../public') }) 
})

router.post('/login', function (req, res) {
	res.sendFile('account.html', { root: path.join(__dirname, '../public') }) 
})

router.post('/logout', function (req, res) { 
	if(req.user){ req.logout() }
	res.redirect('/')
})

router.get('*', function (req, res) {
	console.log('catch all')
	res.redirect('/')
})

module.exports = router
