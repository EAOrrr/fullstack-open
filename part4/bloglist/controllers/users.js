const brypt = require('bcrypt')
const User = require('../models/user')
const { request } = require('http')
const usersRouter = require('express').Router()

usersRouter.post('/', async(request, response) => {
    const {username, name, password} = request.body
    if (password === undefined || password.length < 3) {
        return response.status(400).json({'error': 'password is missing or too short'})
    }
    const saltRounds = 10
    const passwordHash = await brypt.hash(password, saltRounds)
    const user = new User({
        username,
        name,
        passwordHash
    })
    const savedUser = await user.save() 
    response.status(201).json(savedUser)
})

usersRouter.get('/', async(request, response) => {
    const users = await User
                    .find({})
                    .populate('blogs', 
                    {author: 1, title: 1, url: 1, id:1})
    response.json(users)
})

module.exports = usersRouter