import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = (event) => {
    console.log('in Blogform: ', newTitle, newAuthor, newUrl)
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    })
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <div className='blogFormDiv'>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
          title
          <input 
            type="text"
            value={newTitle} 
            name="Title" 
            onChange={({ target }) => {setNewTitle(target.value)}}
            placeholder='write blog title here'
          />
        </div>
        <div>
          author
          <input 
            type="text"
            value={newAuthor} 
            name="Author" 
            onChange={({ target }) => {setNewAuthor(target.value)}}
            placeholder='write blog author here'
          />
        </div>
        <div>
          url
          <input 
            type="text"
            value={newUrl} 
            name="Url" 
            onChange={({ target }) => {setNewUrl(target.value)}}
            placeholder='write blog url here'
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm