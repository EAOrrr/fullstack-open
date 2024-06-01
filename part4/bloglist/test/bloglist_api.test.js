const { test, after, beforeEach} = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('node:assert')
const _ = require('lodash')

const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const { link } = require('node:fs')
const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    
    const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
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
    const response = await api.get('/api/blogs')
    idList = response.body.map(blog => blog.id)
    assert(idList.every(id => id !== undefined))
    assert(idList.every(_id => _id !== undefined))
    assert(idList.every(__v => __v !== undefined))
    assert.strictEqual(new Set(idList).size, helper.initialBlogs.length)
})


test('a valid blog can be added', async () => {
    const newBlog = {
        title: "New Blog",
        author: 'Tiffiany',
        url: 'https://www.tiffiany.com',
        likes: 1,
    }   
    
    await api
        .post('/api/blogs')
        .send(newBlog)
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
    const newBlog = {
        title: "New Blog",
        author: 'Tiffiany',
        url: 'https://www.tiffiany.com',
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    const blogAtEnd = await helper.blogsInDb()
    const blog = blogAtEnd.find(blog => blog.title === newBlog.title)
    assert.strictEqual(blog.likes, 0)
})

test.only('missing title and url will return 400', async () => {
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
        .expect(400)
    
    await api
        .post('/api/blogs')
        .send(blogMissingTitle)
        .expect(400)
    
    const blogsNowLength = (await helper.blogsInDb()).length
    assert.strictEqual(blogsNowLength, blogsPreviousLength)

})

after(async () => {
  await mongoose.connection.close()
})