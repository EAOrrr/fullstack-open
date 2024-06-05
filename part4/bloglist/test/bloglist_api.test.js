const { test, after, beforeEach, describe} = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const _ = require('lodash')

const bcrypt = require('bcrypt')

const helper = require('./test_helper')

const Blog = require('../models/blog')
const User = require('../models/user')

describe('when there is initially one user at db', () => {
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
            
})

describe.only('test blogs api with one user and 6 blogs of that user at db', () => {
    beforeEach(async () => {
        await Blog.deleteMany({})
        await User.deleteMany({})
        const passwordHash = await bcrypt.hash('salainen', 10)
        const newUser = new User({
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            passwordHash,
        })
        await newUser.save()
        const blogObject = helper.initialBlogs
            .map(blog => new Blog({ ...blog, user: newUser._id }))
        await Promise.all(blogObject.map(blog => blog.save()))
    })


    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('there are 6 blogs', async() => {
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, helper.initialBlogs.length) 
    })

    test('every blog has a unique id property', async () => {
        const response = (await api.get('/api/blogs'))
        idList = response.body.map(blog => blog.id)
        assert(idList.every(id => id !== undefined))
        assert(idList.every(_id => _id !== undefined))
        assert(idList.every(__v => __v !== undefined))
        assert.strictEqual(new Set(idList).size, helper.initialBlogs.length)
    })


    test('a valid blog can be added', async () => {

        const token = await helper.getUserToken(api, 'mluukkai', 'salainen')
        
        const newBlog = {
            title: "New Blog",
            author: 'Tiffiany',
            url: 'https://www.tiffiany.com',
            likes: 1,
        }   
        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `Bearer ${token}`)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogAtEnd.length, helper.initialBlogs.length + 1)
        const content = blogAtEnd
            .map(({ title, author, url, likes }) => {
                return {
                    title,
                    author,
                    url,
                    likes
                }
            })
        assert(_.some(content, newBlog))
    })
            
    test('missing likes will default to 0', async () => {
        const token = await helper.getUserToken(api, 'mluukkai', 'salainen')
        const newBlog = {
            title: "New Blog",
            author: 'Tiffiany',
            url: 'https://www.tiffiany.com',
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `Bearer ${token}`)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const blogAtEnd = await helper.blogsInDb()
        const blog = blogAtEnd.find(blog => blog.title === newBlog.title)
        assert.strictEqual(blog.likes, 0)
    })

    test('missing title and url will return 400', async () => {
        const token = await helper.getUserToken(api, 'mluukkai', 'salainen')
        const blogsPreviousLength = (await helper.blogsInDb()).length
        const blogMissingUrl = {
            title: "New Blog",
            author: 'tiffiany'
        }

        const blogMissingTitle = {
            author: 'tiffiany',
            url: 'https://www.tiffiany.com'
        }

        await api
            .post('/api/blogs')
            .send(blogMissingUrl)
            .set('Authorization', `Bearer ${token}`)
            .expect(400)
        
        await api
            .post('/api/blogs')
            .send(blogMissingTitle)
            .set('Authorization', `Bearer ${token}`)
            .expect(400)
        
        const blogsNowLength = (await helper.blogsInDb()).length
        assert.strictEqual(blogsNowLength, blogsPreviousLength)
    })

    test('a blog can be deleted', async () => {
        const token = await helper.getUserToken(api, 'mluukkai', 'salainen')
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]
        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)
        const blogAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogAtEnd.length, blogsAtStart.length - 1)
        const titles = blogAtEnd.map(blog => blog.title)
        assert(!titles.includes(blogToDelete.title))
    })

    test('missing token will return 401', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]
        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(401)
            .expect('Content-Type', /application\/json/)
        const blogAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogAtEnd.length, blogsAtStart.length)
        const titles = blogAtEnd.map(blog => blog.title)
        assert(titles.includes(blogToDelete.title))
    })

    test('wrong token will return 401', async() => {
        const blogsAtStart = await helper.blogsInDb()
        const token = 'wrong token'
        const newBlog = {
            title: "New Blog",
            author: 'newBlog',
            url: 'https://www.newblog.com',
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('Authorization', `Bearer ${token}`)
            .expect(401)
            .expect('Content-Type', /application\/json/)
        const blogAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtStart.length, blogAtEnd.length)
    })

    test.only('a blog can be changed with missing argument', async() => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToChange = blogsAtStart[0]
        const oldLikes = blogToChange.likes
        const newBlog = {
            likes: blogToChange.likes + 1
        }
        const updated = await api
            .put(`/api/blogs/${blogToChange.id}`)
            .send(newBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        console.log(updated.body)
        const blogAtEnd = await helper.blogsInDb()
        const changedBlog = blogAtEnd.find(blog => blog.id === blogToChange.id)
        assert(changedBlog)
        assert(changedBlog.user)
        assert.strictEqual(changedBlog.user.toString(), blogToChange.user.toString())
        assert.strictEqual(changedBlog.title, blogToChange.title)
        assert.strictEqual(changedBlog.author, blogToChange.author)
        assert.strictEqual(changedBlog.url, blogToChange.url)
        assert.strictEqual(changedBlog.likes, oldLikes + 1)
        assert.strictEqual(blogsAtStart.length, blogAtEnd.length)
    })

    test.only('a blog can be changed with all argument', async() => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToChange = blogsAtStart[1]
        const oldLikes = blogToChange.likes
        const newBlog = {
            user: blogToChange.user.toString(),
            title: blogToChange.title,
            url: blogToChange.url,
            author: blogToChange.author,
            likes: blogToChange.likes + 1
        }
        const updated = await api
            .put(`/api/blogs/${blogToChange.id}`)
            .send(newBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        const blogAtEnd = await helper.blogsInDb()
        const changedBlog = blogAtEnd.find(blog => blog.id === blogToChange.id)
        assert(changedBlog)
        assert(changedBlog.user)
        console.log(updated.body)
        assert.strictEqual(changedBlog.user.toString(), blogToChange.user.toString())
        assert.strictEqual(changedBlog.title, blogToChange.title)
        assert.strictEqual(changedBlog.author, blogToChange.author)
        assert.strictEqual(changedBlog.url, blogToChange.url)
        assert.strictEqual(changedBlog.likes, oldLikes + 1)
        assert.strictEqual(blogsAtStart.length, blogAtEnd.length)
    })
    
})

after(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})
    await mongoose.connection.close()
})