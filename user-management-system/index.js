const http = require('http')
const express = require('express')
const bodyParser = require('body-parser')

var app = express()

app.set('port', process.env.PORT || 4242)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static(__dirname + 'public'))

app.use('/', require('./routes/account'))

http.createServer(app).listen(app.get('port'), function(){
	console.log('Server started on port ' + app.get('port'));
})
