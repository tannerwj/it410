//Tanner Johnson
//IT410

const fs 		= require('fs')
const util 		= require('util')
const Promise 	= require('bluebird')

//getPathType ( path : String )
//Determine if the path points to a file, a directory, nothing, or other. This is done using fs.stat
var getPathType = function (path){
	return new Promise(function (resolve, reject){
		if(typeof path !== 'string'){
			reject('not string')
		}else{
			fs.stat(path, function (err, stats){
				if(err || !stats){
					resolve('nothing')
				}else if(stats.isFile()){
					resolve('file')
				}else if(stats.isDirectory()){
					resolve('directory')
				}else{
					resolve('other')
				}
			})
		}
	})
}

//getDirectoryTypes ( path : String [, depth : Number = -1 ] [, filter : Function = function(path, type) { return true; } )
//Read a directory and get the path types, using fs.readdir and getPathType, for each file path in the directory
var getDirectoryTypes = function  (path, depth, filter){
	if(!(depth || depth === 0)){ depth = -1 }
	var filter = filter || function () { return true }

	return new Promise(function (resolve, reject){
		if(typeof path !== 'string'){
			reject('not string')
		}else if(typeof depth !== 'number'){
			reject('not number')
		}else if(typeof filter !== 'function'){
			reject('not function')
		}else{
			getPathType(path).then(function (val){
				if(val === 'directory'){
					fs.readdir(path, function (err, files){
						if(err){ 
							reject(err)
						}else{
							var tmp = {}

							Promise.map(files, function (file){
								return getPathType(path + '/' + file).then(function (type){
									if(type === 'directory' && depth !== 0){
										if(depth === -1){
											return getDirectoryTypes(path + '/' + file, depth, filter).then(function (obj){
												tmp[path + '/' + file] = obj
											})
										}else{
											return getDirectoryTypes(path + '/' + file, depth - 1, filter).then(function (obj){
												tmp[path + '/' + file] = obj
											})
										}
									}else if(filter(path + '/' + file, type)){
										tmp[path + '/' + file] = type
									}
								})
							}).then(function (){
								resolve(tmp)
							})
						}
					})
				}else{
					reject('not a directory')
				}
			}).catch(function (err){
				reject('not a directory')
			})			
		}	
	})
}

//exists ( path : String )
//Check to see if something exists at the specified path by using getPathType
var exists = function  (path){
	return new Promise(function (resolve, reject){
		if(typeof path !== 'string'){ 
			reject('not string')
		}else{
			getPathType(path).then(function (type){
				if(type === 'nothing'){
					resolve(false)
				}else{
					resolve(true)
				}
			}).catch(function (err) {
				resolve(false)
			})
		}
	})
}

//getFilePaths ( path: String [, depth : Number = -1 ] )
//Read a directory (and possibly sub-directories) to get an array of all paths to files, using getDirectoryTypes
var getFilePaths = function  (path, depth){
	if(!(depth || depth === 0)){ depth = -1 }

	return new Promise(function (resolve, reject){
		getDirectoryTypes(path, depth, function (path, type){
			return type === 'file'
		}).then(function (obj){
			resolve(objToArray(obj, []))
		})
	})
}

function objToArray (obj, arr){
	for (var key in obj) {
		if (obj.hasOwnProperty(key)) {
			if(typeof obj[key] === 'object'){
				arr.concat(objToArray(obj[key], arr))
			}else if(obj[key] === 'file'){
				arr.push(key)
			}
		}
	}
	return arr
}

//readFile ( path: String )
//Get the contents of a file
var readFile = function  (path){
	return new Promise(function (resolve, reject){
		if(typeof path !== 'string'){ 
			reject('not string')
		}else{
			getPathType(path).then(function (type){
				if(type !== 'file'){
					reject('not file')
				}else{
					fs.readFile(path, 'utf8', function (err, data){
						if(err){
							reject(err)
						}else{
							resolve(data)
						}
					})
				}
			}).catch(function (err) {
				reject(err)
			})
		}
	})
}

//readFiles ( paths: String[] )
//Get the contents of multiple files using readFile
var readFiles = function  (paths){
	return new Promise(function (resolve, reject){
		var tmp = {}
		return Promise.map(paths, function (path){
			return readFile(path).then(function (data){
				tmp[path] = data
			}).catch(function (err){
				reject(err)
			})
		}).then(function (){
			resolve(tmp)
		})
	})
}

module.exports = {
	getPathType : getPathType,

	getDirectoryTypes : getDirectoryTypes,

	exists : exists,

	getFilePaths : getFilePaths,

	readFile : readFile,

	readFiles : readFiles
}
