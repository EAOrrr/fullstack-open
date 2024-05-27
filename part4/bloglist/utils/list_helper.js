const { reverse } = require('lodash');

_ = require('lodash')

const dummy = (blogs) => {
  // ...
  return 1;
}

const totalLikes = (blogs) => {
    reducer = (sumLikes, blog) => {
     return sumLikes + blog.likes   
    }
    return blogs.reduce(reducer, 0)
}

const favouriteBlog = (blogs) => {
    reducer = (favBlog, blog) => {
        return favBlog.likes > blog.likes ? favBlog : blog;
    }
    return blogs.length == 0
        ? null
        : blogs.reduce(reducer)
}
const mostBlog = (blogs) => {
    if (blogs.length == 0) {
        return null
    }
    maxAuthorAndBlogs = _
                          .chain(blogs)
                          .map('author')
                          .countBy()
                          .entries()
                          .maxBy(_.last)
                          .value()
    return {name: maxAuthorAndBlogs[0], blogs: maxAuthorAndBlogs[1]}
}

const mostLikes = (blogs) => {
  if (blogs.length == 0) {
    return null
  }
  return _
      .chain(blogs)
      .groupBy('author')
      .map((info, author) => {
        return {
          author: author,
          likes: _.sumBy(info, 'likes')
        }
      })
      .sortBy('likes')
      .last()
      .value()
  

}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlog,
  mostLikes,
}