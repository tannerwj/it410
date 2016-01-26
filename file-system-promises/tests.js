const file = require('./file')
const expect = require('chai').expect

describe('getPath', function (){
	it('resolves file', function(){
		return file.getPathType('file.js').then(function (val){
			expect(val).to.equal('file')
		})
	})
	it('resolves directory', function(){
		return file.getPathType('node_modules').then(function (val){
			expect(val).to.equal('directory')
		})
	})
	it('resolves nothing', function(){
		return file.getPathType('thisdoesnotexist').then(function (val){
			expect(val).to.equal('nothing')
		})
	})
	it('rejects not a string', function(){
		return file.getPathType(4242).catch(function (val){
			expect(val).to.equal('not string')
		})
	})
})

describe('getDirectoryTypes', function (){
	it('rejects not string', function(){
		return file.getDirectoryTypes(4242).catch(function (val){
			expect(val).to.equal('not string')
		})
	})
	it('rejects not a directory', function(){
		return file.getDirectoryTypes('file.js').catch(function (val){
			expect(val).to.equal('not a directory')
		})
	})
	it('rejects not number', function(){
		return file.getDirectoryTypes('../file-system-promises', 'nope').catch(function (val){
			expect(val).to.equal('not number')
		})
	})
	it('rejects not function', function(){
		return file.getDirectoryTypes('../file-system-promises', 1, 'nope').catch(function (val){
			expect(val).to.equal('not function')
		})
	})
	it('resolves obj map of paths to types', function (){
		return file.getDirectoryTypes('../file-system-promises', 0).then(function (obj){
			expect(obj).to.include.property('../file-system-promises/file.js', 'file')
			expect(obj).to.include.property('../file-system-promises/node_modules', 'directory')
		})
	})
})

describe('exists', function (){
	it('rejects not a string', function(){
		return file.exists(4242).catch(function (val){
			expect(val).to.equal('not string')
		})
	})
	it('resolves false', function(){
		return file.exists('node_modules').then(function (val){
			expect(val).to.equal(true)
		})
	})
	it('resolves true', function(){
		return file.exists('thisdoesnotexist').then(function (val){
			expect(val).to.equal(false)
		})
	})
})

describe('readFile', function (){
	it('resolves a file', function (){
		return file.readFile('small.js').then(function (file){
			expect(file).to.equal('small')
		})
	})
	it('rejects not a string', function(){
		return file.readFile(4242).catch(function (val){
			expect(val).to.equal('not string')
		})
	})
	it('rejects not a file', function(){
		return file.readFile('node_modules').catch(function (val){
			expect(val).to.equal('not file')
		})
	})
})

describe('readFiles', function (){
	it('resolves arrays of file contents', function (){
		return file.readFiles(['small.js', 'smaller.js']).then(function (obj){
			expect(obj).to.have.property('small.js', 'small')
			expect(obj).to.have.property('smaller.js', 'sma')
		})
	})
	it('rejects not a string', function(){
		return file.readFiles([4242]).catch(function (val){
			expect(val).to.equal('not string')
		})
	})
	it('rejects not a file', function(){
		return file.readFiles(['node_modules']).catch(function (val){
			expect(val).to.equal('not file')
		})
	})
})

describe('getFilePaths', function (){
	it('resolves array of file names', function (){
		var folder = '../file-system-promises'
		return file.getFilePaths(folder, 0).then(function (val){
			var should = [folder + '/file.js', folder + '/small.js', folder + '/smaller.js', folder + '/tests.js']
			expect(val).to.have.members(should)
		})
	})
	it('rejects not a string', function(){
		return file.getFilePaths(4242).catch(function (val){
			expect(val).to.equal('not string')
		})
	})
})
