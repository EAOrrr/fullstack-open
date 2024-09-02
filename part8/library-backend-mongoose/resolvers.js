const { GraphQLError } = require('graphql')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()
const jwt = require('jsonwebtoken')
const Book = require('./models/book')
const User = require('./models/user')
const Author = require('./models/author')

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments({}),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const author = await Author.findOne({
        name: args.author
      })
      return books = await Book.find({
        author: author ? author._id : { $exists: true },
        genres: args.genre ? args.genre : { $exists: true }
      }).populate('author')
    },
    allAuthors: async() => {
      const authors = await Author.aggregate([
      // Perform a lookup to join Book collection with Author collection
      {
        $lookup: {
          from: 'books', // the name of the Book collection in the database
          localField: '_id',
          foreignField: 'author',
          as: 'books'
        }
      },
      // Add a new field "bookCount" that counts the number of books
      {
        $addFields: {
          bookCount: { $size: '$books' }
        }
      },
    ]);
    return authors.map(author => ({...author, id: author._id.toString()}))
    },
    me: (root, args, context) => {
      return context.currentUser
    }
  },

  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'USER_BAD_INPUT'
          }
        })
      }
      const book = new Book(args)
      let author = await Author.findOne({
        name: args.author
      })
      try {
        if (!author) {
          const newAuthor = new Author({ name: args.author })
          author = await newAuthor.save()
        }
      } catch (error) {
        throw new GraphQLError('Saving author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.author,
            error
          }
        })
      }

      book.author = author
      try{

        await book.save()
      } catch (error) {
        throw new GraphQLError('saving book fail', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalideArgs: args.title,
            error
          }
        })
      }
      pubsub.publish('BOOK_ADDED', { bookAdded: book })
      return book
    },
    editAuthor: async (root, args, context) => { // TODO
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'USER_BAD_INPUT'
          }
        })
      }
      const author = await Author.findOneAndUpdate({
        name: args.name,
      },
      {
        born: args.setBornTo
      },
      {new: true})
      return author

    },
    createUser: async (root, args) => {
      const user = new User({ ...args })
      try {
        const savedUser = await user.save()
        return savedUser
      } catch (error) {
        throw new GraphQLError('saving user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error
          }
        })
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username})
      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }
      const userForToken = {
        username: user.username,
        id: user._id,
      }
      return { value: jwt.sign(userForToken, process.env.JWT_SECRET)}
    }

  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
    },
  }

}

module.exports = resolvers