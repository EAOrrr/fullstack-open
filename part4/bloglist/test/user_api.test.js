const { test, after, beforeEach, describe} = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const bcrypt = require('bcrypt')

const helper = require('./test_helper')

const User = require('../models/user')

describe.only('when there is initially one user at db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash})

        await user.save()
    })

    test('creation succedds with a fresh user', async ()=> {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()
            
        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('expected `username` to be unique'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if username is missing', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            name: 'Superuser',
            password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        assert.strictEqual(usersAtStart.length, usersAtStart.length)
    })

    test('creation fails with proper statuscode and message if password is missing or too short', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUserMissingPwd = {
            username: 'user0',
            name: 'Superuser',
        }

        const newUserWithShortPwd = {
            username: 'user1',
            name: 'Superuser',
            password: '12',
        }

        await api
            .post('/api/users')
            .send(newUserMissingPwd)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        const usersAtEnd0 = await helper.usersInDb()
        
        await api
            .post('/api/users')
            .send(newUserWithShortPwd)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        const usersAtEnd1 = await helper.usersInDb()

        assert.strictEqual(usersAtStart.length, usersAtEnd0.length)
        assert.strictEqual(usersAtStart.length, usersAtEnd1.length)
    })
            
    test.only('same username cannot be added twice', async () => {
        const usersAtStart = await helper.usersInDb()
        const newUser = {
            username: usersAtStart[0].username,
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtStart.length, usersAtEnd.length)
    })
})

after(async () => {
    await User.deleteMany({})
    await mongoose.connection.close()
})