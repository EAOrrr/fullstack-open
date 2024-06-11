const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
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
    await savedBlogs.populate('user', {
        username: 1,
        name: 1,
        id: 1,
    })
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
        user.blogs = user.blogs.filter(b => b.toString() !== request.params.id.toString())
        user.save()
        response.status(204).end()
    }
    else {
        response.status(401).json({ error: 'unauthorized' })
    }
})

blogsRouter.put('/:id', async(request, response, next) => {
    try {
        const blog = request.body
        const updatedBlog = await Blog.findByIdAndUpdate(
            request.params.id, 
            blog, 
            {
                new: true, 
                runValidators: true, 
                context: 'query'
            })
            .populate('user', {
               username: 1,
               name: 1,
               id: 1, 
            })
        return response.json(updatedBlog)
    } catch (exception) {
        next(exception)
    }

})
module.exports = blogsRouter