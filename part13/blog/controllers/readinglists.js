const { ReadingList, User } = require('../models')
const { tokenExtractor } = require('../utils/middleware')

const router = require('express').Router()

router.post('/', async (req, res, next) => {
    try {
        const { userId, blogId}  = req.body
        const readingList = await ReadingList.create({ userId, blogId, read:false})
        res.status(201).json(readingList)
    }
    catch (error) {
        next(error)
    }
})

router.put('/:id',  tokenExtractor, async (req, res, next) => {
    try {
        const id = req.params.id
        const readingList = await ReadingList.findByPk(id)
        if (! readingList) {
            return res.status(404).json({ error: 'readingList not found' })
        }
        const user = await User.findByPk(req.decodedToken.id)
        if (readingList.userId !== user.id) {
            return res.status(403).json({ error: 'user not authorized to update this readingList' })
        }
        await readingList.update(req.body)
        res.json(readingList)
    }
    catch (error) {
        next(error)
    }
})

module.exports = router