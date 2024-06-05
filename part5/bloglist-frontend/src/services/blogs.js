import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const getAll = async () => {
  const request = axios.get(baseUrl)
  const response = await request
  return response.data
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (id, newObject) => {
  const response = await axios.put(`${baseUrl}/${id}`, newObject)
  console.log('return: ', response)
  return response.data
}

const deleteId = async (id) => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

export default { getAll, create, update, deleteId, setToken }