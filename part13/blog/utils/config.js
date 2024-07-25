require('dotenv').config()
const DATABASE_URL = process.env.DATABASE_URL
const PORT = process.env.PORT
const SECRET = process.env.SECRET
module.exports = { 
    DATABASE_URL,
    PORT,
    SECRET,
}