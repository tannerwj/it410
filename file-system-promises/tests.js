const file = require('./file')

file.readFiles(['testsa.js', 'file.js']).then(function (data){
	console.log(data)
}).catch(function (err){
	console.error(err)
})

/*file.readFile('tests.js').then(function (data){
	console.log(data)
}).catch(function (err){
	console.error(err)
})*/

/*file.getFilePaths('../file-system-promises', 4).then( function (item){
	console.log(item)
}).catch(function (err){
	console.error(err)
})*/

/*file.getDirectoryTypes('../file-system-promises').then( function (item){
	console.log(item)
}).catch(function (err){
	console.error(err)
})*/

/*file.exists('test.js').then(function (val){
	console.log('exists', val)
}).catch(function (err){
	console.error(err)
})*/
