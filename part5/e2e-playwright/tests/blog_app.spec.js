const { test, expect, beforeEach, describe } = require('@playwright/test')
const {loginWith, createBlog} = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
      // empty the db here
      await request.post('/api/testing/reset')
      // create a user for the backend here
      await request.post('/api/users', {
          data: {
              username: 'mluukkai',
              name: 'Matti Luukkainen',
              password: 'salainen'
          }
      })
      await request.post('/api/users', {
        data: {
            username: 'test',
            name: 'test',
            password: 'test'
        }
      })
      await page.goto('/')
    })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
    await expect(page.getByRole('button', {name: 'login'})).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      // ...
      await loginWith(page, 'mluukkai', 'salainen')
      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      // ...
      await loginWith(page, 'mluukkai', 'wrong')
      
      const errorDiv = await page.locator('.error')
      await expect(errorDiv).toContainText('wrong username or password')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
    })

    describe('When logged in', () => {
      beforeEach(async ({ page }) => {
        await loginWith(page, 'mluukkai', 'salainen')
        await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
      })

      test('a new blog can be created', async ({ page }) => {
        await createBlog(page,
          'A blog from playwright!',
          'playwright',
          'https://playwright.dev/', 
        )
        await expect(page.getByText('A blog from playwright! playwright')).toBeVisible()
        
        const messageDiv = await page.locator('.message')
        await expect(messageDiv).toContainText('a new blog A blog from playwright! by playwright added')
        await expect(messageDiv).toHaveCSS('border-style', 'solid')
        await expect(messageDiv).toHaveCSS('color', 'rgb(0, 128, 0)')
      })

      test('a blog can be liked', async ({ page }) => {
        await createBlog(page,
          'first blog',
          'first author',
          'None'
        )
        await page.getByRole('button', {name: 'view'}).click()
        await expect(page.getByText('likes: 0')).toBeVisible()
        await page.getByRole('button', {name: 'like'}).click()
        await expect(page.getByText('likes: 1')).toBeVisible()

      })

      test('a blog can be deleted', async ({ page }) => {
        page.on('dialog', async dialog => {
          await dialog.accept()
        })
        await createBlog(page,
          'a blog to be deleted',
          'poor author',
          'None'
        )
        await page.getByRole('button', {name: 'view'}).click()
        await page.getByRole('button', {name: 'remove'}).click()
        
        await expect(page.locator('.blog')).toHaveCount(0);
      })

      test('only the user who added the blog sees the blog\'s delete button', async ({ page }) => {
        await createBlog(page,
          'a blog from mluukkai',
          'mluukkai',
          'None'
        )
        await page.getByText('a blog from mluukkai mluukkai').waitFor()
        await page.getByRole('button', {name: 'logout'}).click()
        loginWith(page, 'test', 'test')
        await page.getByRole('button', {name: 'view'}).click()
        await expect(page.locator('.remove')).toHaveCount(0);
      })


      test(' blogs are arranged in the order according to the likes, the blog with the most likes first', 
        async ({ page }) => {
        await createBlog(page,
          'first blog',
          'first author',
          'None'
        )
        await createBlog(page,
          'second blog',
          'second author',
          'None'
        )
        await createBlog(page,
          'third blog',
          'third author',
          'None'
        )
        await page.locator('.blog').filter({hasText: 'first blog'}).getByRole('button', {name: 'view'}).click()
        for (let i = 0; i < 5; i++) {
          await page.locator('.blog').filter({hasText: 'first blog'}).getByRole('button', {name: 'like'}).click()
          await page.locator('.blog').filter({hasText: 'first blog'}).getByText('likes: ' + (i + 1)).waitFor()
        }
        await page.locator('.blog').filter({hasText: 'second blog'}).getByRole('button', {name: 'view'}).click()
        for (let i = 0; i < 3; i++) {
          await page.locator('.blog').filter({hasText: 'second blog'}).getByRole('button', {name: 'like'}).click()
          await page.locator('.blog').filter({hasText: 'second blog'}).getByText('likes: ' + (i + 1)).waitFor()
        }
        await page.locator('.blog').filter({hasText: 'third blog'}).getByRole('button', {name: 'view'}).click()
        for (let i = 0; i < 7; i++) {
          await page.locator('.blog').filter({hasText: 'third blog'}).getByRole('button', {name: 'like'}).click()
          await page.locator('.blog').filter({hasText: 'third blog'}).getByText('likes: ' + (i + 1)).waitFor()
        }
        const blogs = await page.locator('.blog')
        for (let i = 0; i < 3; i++) {
          console.log(await blogs.nth(i).textContent())
        }
        await expect(blogs.nth(0)).toContainText('third blog')
        await expect(blogs.nth(1)).toContainText('first blog')
        await expect(blogs.nth(2)).toContainText('second blog')
      })
    })

  })
})