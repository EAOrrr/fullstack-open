const logger = require('./logger')
const { SECRET } = require('./config')
const jwt = require('jsonwebtoken')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const errorHandler = (error, req, res, next) => {
  console.log('error', error.name)

  if (error.name === 'CastError') {
    return res.status(400).send({error: 'malfomatted id'})
  } else if (error.name === 'SequelizeUniqueConstraintError') {
    // return response.status(400).send({ error: error.message })
    const errors = error.errors.map(err => ({
      field: err.path,
      message: `${err.path} must be unique`
    }))
    return res.status(400).json({ errors });
  } else if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

const unknownEndpoint = (req, res) => {
  res.status(404).send('unknown endpoint')
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      console.log(authorization.substring(7), SECRET)
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch{
      return res.status(401).json({ error: 'token invalid' })
    }
  }  else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

module.exports = {
    requestLogger,
    errorHandler,
    unknownEndpoint,
    tokenExtractor,
}
