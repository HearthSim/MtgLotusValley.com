import Vue from 'vue'

const testing = true

const axios = require('axios')
axios.defaults.baseURL = testing ? 'http://localhost:5000/api'
                                 : 'https://blacklotusvalley-ca867.firebaseapp.com/api'
axios.defaults.headers.post['Content-Type'] = 'application/json'

function refreshUserToken (refreshToken) {
  return axios.post('/refreshtoken', {
    refresh_token: refreshToken
  })
}

function saveUserToken (data) {
  localStorage.setItem('localId', data.localId)
  localStorage.setItem('email', data.email)
  localStorage.setItem('idToken', data.idToken)
  localStorage.setItem('refreshToken', data.refreshToken)
  const date = new Date()
  date.setSeconds(date.getSeconds() + Number.parseInt(data.expiresIn))
  localStorage.setItem('expiresIn', date.toString())
}

function updateUserToken (data) {
  localStorage.setItem('idToken', data.id_token)
  localStorage.setItem('refreshToken', data.refresh_token)
  const date = new Date()
  date.setSeconds(date.getSeconds() + Number.parseInt(data.expires_in))
  localStorage.setItem('expiresIn', date.toString())
}

function deleteUserToken () {
  localStorage.removeItem('localId')
  localStorage.removeItem('idToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('expiresIn')
}

export default {
  refreshUserToken,
  saveUserToken,
  updateUserToken,
  deleteUserToken,
  login (username, password) {
    return axios.post('/signin', {
      email: username,
      password: password,
      returnSecureToken: true
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
  getUserCollection () {
    const currentUser = Vue.prototype.$currentUser
    return axios.get('/users/collection', {
      headers: {
        Authorization: 'Bearer ' + currentUser.token
      },
      params: {
        userId: currentUser.id
      }
    })
  }
}
