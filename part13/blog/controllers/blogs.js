const router = require('express').Router()

const { Op } = require('sequelize')
const { Blog, User } = require('../models')
const { tokenExtractor } = require('../utils/middleware')

router.get('/', async (req, res, next) => {
  try {
    const where = {}
    console.log('where', where)

    if (req.query.search) {
      Object.assign (where, {
          [Op.or]: [
          { title: { [Op.substring]: req.query.search} },
          { author: { [Op.substring]: req.query.search} },
        ]
      })
    }

    const blogs = await Blog.findAll({
      attributes: {
        exclude: ['userId']
      },
      include: {
        model: User,
        attributes: ['username']
      },
      order: [
        ['likes', 'DESC']
      ],
      where,
    })
    res.json(blogs)
  } catch (error) {
    next(error)
  }
})

router.get('/:id', async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id)
    if (blog) {
      res.json(blog)
    } else {
      res.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

router.post('/', tokenExtractor, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const blog = await Blog.create({...req.body, userId:user .id })
    res.status(201).json(blog)
  }
  catch (error) {
    next(error)
  }
})

router.delete('/:id', tokenExtractor, async(req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id)
    if (!blog) {
      return res.status(204).end()
    }
    if (req.decodedToken.id !== blog.userId) {
      return res.status(403).json({error: 'user not authorized to delete this blog'})
    }
    if (blog) {
      await blog.destroy()
    }
    res.status(204).end()
  } catch (error) {
    next(error)
  }
})

router.put('/:id', async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id)
    if (!blog) {
      res.status(404).json(
        {error: 'could not find blog'}
      )
    }
    await blog.update(req.body)
    res.json(blog)
  }
  catch (error) {
    next(error)
  }
})
module.exports = router