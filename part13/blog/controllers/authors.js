const { Sequelize } = require('sequelize')
const { Blog } = require('../models')

const router = require('express').Router()

router.get('/', async (req, res) => {
  const authors = await Blog.findAll({
    attributes:[
      'author',
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'article'],
      [Sequelize.fn('SUM', Sequelize.col('likes')), 'likes']
    ],
    group: [
      'author',
    ],
    order: [
      [Sequelize.fn('SUM', Sequelize.col('likes')), 'DESC'],
    ]
  })
  res.json(authors)
})

module.exports = router