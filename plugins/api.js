import axios from 'axios'

export default (context, inject) => {
  const api = axios.create({
    baseURL: 'http://localhost:8000',
    headers: { 'Content-Type': 'application/json' }
  })

  inject('api', api)
}
