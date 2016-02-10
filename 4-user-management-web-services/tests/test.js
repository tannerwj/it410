const expect = require('chai').expect
const acc = require('../src/account.js')

describe('User management', function(){	
	before(function () {
		return acc.deleteUser('testUser')
	})
	it('Create new user', function(){
		return acc.addUser('testUser', 'password').then(function (val){
			expect(val.insertedCount).to.equal(1)
		})
	})
	it('Does not create duplicate user', function(){
		return acc.addUser('testUser', 'password').catch(function (err){
			expect(err).to.equal('User already exists')
		})
	})
	it('Update user password', function(){
		return acc.updateUser('testUser', 'newPassword').then(function (val){
			expect(val.result.nModified).to.equal(1)
		})
	})
	after(function () {
		return acc.deleteUser('testUser')
	})
})

describe('User authentication', function (){
	before(function () {
		return acc.addUser('testUser', 'password')
	})
	it('Correctly authenticates user', function (){
		return acc.checkLogin('testUser', 'password').then(function (val){
			expect(val.user).to.equal('testUser')
		})
	})
	it('Correctly does not authenticate user', function (){
		return acc.checkLogin('testUser', 'password1').catch(function (err){
			expect(err).to.equal('Incorrect password')
		})
	})
	after(function () {
		return acc.deleteUser('testUser')
	})
})
