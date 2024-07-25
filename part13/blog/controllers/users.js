const router = require('express').Router()
const bcrypt = require('bcrypt')

const { User, Blog } = require('../models')

router.get('/', async(req, res) => {
    const users = await User.findAll({
        attributes: ['name', 'username'],
        include: [
        {
            model: Blog,
            as: 'readings',
            through:{
                attributes: ['read', 'id'],
            }

        }
    ]
    })
    res.json(users)
})

router.get('/:id', async(req, res) => {
    const where = {}
    if (req.query.read) {
        where.read = req.query.read === "true"
    }
    const user = await User.findByPk(req.params.id, {
        include: {
            model: Blog,
            as: 'readings',
            through: {
                attributes: ['read', 'id'],
                where
            }
        }
    })

    if (!user) {
        return res.status(404).end()
    }
    res.json(user)
})




router.post('/', async(req, res, next) => {
    try {
        const body = req.body
        if (!body.password) {
            return res.status(400).send({error: 'password missing'})
        }
        if (body.password.length < 3) {
            return res.status(400).send({ error: `User validation failed: username: Path password is shorter than the minimum allowed length (3)` })
        }

        const saltRounds = 10
        const passwordHash = await bcrypt.hash(body.password, saltRounds)
        const user = await User.create({
            username: body.username,
            name: body.name,
            passwordHash,
        })
        res.json(user)
    } catch (error) {
        // if (error.name === 'SequelizeUniqueConstraintError') {
        //     return res.status(400).json({ error: 'username must be unique' })
        // }   
        next(error)
    }
})

router.put('/:username', async(req, res) => {
    const user = await User.findOne({ where: { username: req.params.username } })
    if (!user) {
        return res.status(204).end()
    }
    user.update(req.body)
    res.json(user)
})

module.exports = router