const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
                        .find({})
                        .populate('user', 
                            {username: 1,
                             name: 1,
                             id: 1,
                            })
    response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
    const body = request.body
    const user = request.user

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user._id
    })

    const savedBlogs = await blog.save()
    user.blogs = user.blogs.concat(savedBlogs._id)
    await user.save()
    response.status(201).json(savedBlogs)
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
    const blog = await Blog.findById(request.params.id)
    if (!blog) {
        return response.status(404).json({ error: 'blog not found' })
    }
    const user = request.user
    const userId = user.id
    if (blog.user.toString() === userId.toString()) {
        await Blog.findByIdAndDelete(request.params.id)
        response.status(204).end()
    }
    else {
        response.status(401).json({ error: 'unauthorized' })
    }
})
module.exports = blogsRouter