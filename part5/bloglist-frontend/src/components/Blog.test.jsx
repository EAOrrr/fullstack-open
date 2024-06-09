import { describe, expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {

  test('display title and author but not display url or numbers of likes', () => {
    const blog = {
      title: 'Test Title',
      author: 'Test Author',
      url: 'Test URL',
      likes: 11,
      user: {
        name: 'Test User',
        username: 'testuser',
      }
    } 
    const container = render(<Blog blog={blog}/>).container
    const blogDiv = container.querySelector('.blog')
    expect(blogDiv).toHaveTextContent('Test Title Test Author')
    expect(blogDiv).not.toHaveStyle('display: none')
    const detailDiv = container.querySelector('.detail')
    expect(detailDiv).toHaveTextContent('Test URL')
    expect(detailDiv).toHaveTextContent('likes: 11')
    expect(detailDiv).toHaveStyle('display: none')
  })

  test('display url and numbers of likes when view button is clicked', async () => {
    const blog = {
      title: 'Test Title',
      author: 'Test Author',
      url: 'Test URL',
      likes: 11,
      user: {
        name: 'Test User',
        username: 'testuser',
      }
    } 
    const container = render(<Blog blog={blog}/>).container
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const div = container.querySelector('.detail')
    expect(div).not.toHaveStyle('display: none')
  })

  test('if the like button is clicked twice, \
    the event handler the component received \
    as props is called twice.',  async () => {
    const blog = {
      title: 'Test Title',
      author: 'Test Author',
      url: 'Test URL',
      likes: 11,
      user: {
        name: 'Test User',
        username: 'testuser',
      }
    } 
    const mockHandler = vi.fn()
    const container = render(<Blog blog={blog} likeBlog={mockHandler}/>).container
    const user = userEvent.setup()
    const button = screen.getByText('like')
    await user.click(button)
    await user.click(button)
    expect(mockHandler.mock.calls).toHaveLength(2)
    })

})
