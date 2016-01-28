//Tanner Johnson
//IT410

const fs 		= require('fs')
const Promise 	= require('bluebird')

//getPathType ( path : String )
//Determine if the path points to a file, a directory, nothing, or other. This is done using fs.stat
var getPathType = function (path){
	return new Promise(function (resolve, reject){
		if(typeof path !== 'string'){ return reject('not string') }

		fs.stat(path, function (err, stats){
			if(err || !stats){ return resolve('nothing') }
			if(stats.isFile()){ return resolve('file') }
			if(stats.isDirectory()){ return resolve('directory') }
			return resolve('other')
		})
	})
}

//getDirectoryTypes ( path : String [, depth : Number = -1 ] [, filter : Function = function(path, type) { return true; } )
//Read a directory and get the path types, using fs.readdir and getPathType, for each file path in the directory
var getDirectoryTypes = function (path, depth, filter){
	if(!(depth || depth === 0)){ depth = -1 }
	var filter = filter || function () { return true }

	return new Promise(function (resolve, reject){
		if(typeof depth !== 'number'){ return reject('not number') }
		if(typeof filter !== 'function'){ return reject('not function') }

		return getPathType(path).then(function (val){
			if(val === 'directory'){
				fs.readdir(path, function (err, files){
					if(err){ return reject(err) }
					var tmp = {}

					return Promise.map(files, function (file){
						return getPathType(path + '/' + file).then(function (type){
							if(filter(path + '/' + file, type)){
								tmp[path + '/' + file] = type
							}
							if(type === 'directory' && depth){
								return getDirectoryTypes(path + '/' + file, (depth === -1 ? depth : depth -1), filter).then(function (obj){
									for(var i in obj) { tmp[i] = obj[i] }
								})
							}
						})
					}).then(function (){
						return resolve(tmp)
					})
				})
			}else{
				return reject('not a directory')
			}
		}).catch(function (err){
			return reject(err)
		})
	})
}

//exists ( path : String )
//Check to see if something exists at the specified path by using getPathType
var exists = function (path){
	return new Promise(function (resolve, reject){
		return getPathType(path).then(function (type){
			return type === 'nothing' ? resolve(false) : resolve(true)
		}).catch(function (err) {
			return reject(err)
		})
	})
}

//getFilePaths ( path: String [, depth : Number = -1 ] )
//Read a directory (and possibly sub-directories) to get an array of all paths to files, using getDirectoryTypes
var getFilePaths = function (path, depth){
	return new Promise(function (resolve, reject){
		return getDirectoryTypes(path, depth, function (path, type){
			return type === 'file'
		}).then(function (obj){
			return resolve(Object.keys(obj))
		}).catch(function (err){
			return reject(err)
		})
	})
}

//readFile ( path: String )
//Get the contents of a file
var readFile = function (path){
	return new Promise(function (resolve, reject){
		return getPathType(path).then(function (type){
			if(type !== 'file'){ return reject('not file') }

			fs.readFile(path, 'utf8', function (err, data){
				return err ? reject(err) : resolve(data)
			})
		}).catch(function (err) {
			return reject(err)
		})
	})
}

//readFiles ( paths: String[] )
//Get the contents of multiple files using readFile
var readFiles = function (paths){
	return new Promise(function (resolve, reject){
		return Promise.reduce(paths, function (obj, path){
			return readFile(path).then(function (data){
				obj[path] = data
				return obj
			})
		}, {}).then(function (obj){
			return resolve(obj)
		}).catch(function (err){
			return reject(err)
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
