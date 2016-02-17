const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const cookieParser = require('cookie-parser')
const session = require('express-session')

const acc = require('./src/account')

var app = express()

app.set('port', process.env.PORT || 4242)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

app.use(express.static(__dirname + 'public'))

passport.use(new LocalStrategy(function (user, pass, done) {
	acc.checkLogin(user, pass).then(function (user){
		if(user){
			return done(null, user)
		}else{
			return done(null, false)
		}
	}).catch(function (){
		return done(null, false)
	})
}))

// tell passport how to turn a user into serialized data that will be stored with the session
passport.serializeUser(function (user, done) {
	done(null, user.username)
})

// tell passport how to go from the serialized data back to the user
passport.deserializeUser (function(username, done) {
	acc.findUser(username).then(function (user){
		done(null, user)
	})
})

app.use(session({ secret: 'even secreter key', resave: false, saveUninitialized: true }))
app.use(passport.initialize())
app.use(passport.session())

app.use('/', require('./routes/account'))

http.createServer(app).listen(app.get('port'), function(){
	console.log('Server started on port ' + app.get('port'))
})
