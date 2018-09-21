import Vue from 'vue'

const testing = false

const axios = require('axios')
axios.defaults.baseURL = testing ? 'http://localhost:5000/api'
                                 : 'https://blacklotusvalley-ca867.firebaseapp.com/api'
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*'

export default {
  login (username, password) {
    return axios.post('/signin', {
      email: username,
      password: password,
      returnSecureToken: true
    })
  },
  refreshToken (refreshToken) {
    return axios.post('/refreshtoken', {
      refresh_token: refreshToken
    })
  },
  getDeckOfDay: function (date) {
    const params = {}
    if (date !== undefined) {
      params['date'] = date
    }
    return axios.get('/stats/deckOfDay', {
      params: params
    })
  },
  getDecksByArch (dateMin, dateMax) {
    return axios.get('/stats/decksByArch', {
      params: {
        dateMin: dateMin,
        dateMax: dateMax
      }
    })
  },
}
