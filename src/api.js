
const testing = false
let isRefreshingToken = false
let subscribers = []

const axios = require('axios')
axios.defaults.baseURL = testing ? 'http://localhost:5000/api'
                                 : 'https://blacklotusvalley-ca867.firebaseapp.com/api'
axios.defaults.headers.post['Content-Type'] = 'application/json'

axios.interceptors.request.use(
  config => {
    if (config.headers.Authorization === 'required') {
      const token = localStorage.getItem('idToken')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  error => Promise.reject(error)
)

axios.interceptors.response.use(undefined, err => {
  const { config, response: { status, data } } = err
  const originalRequest = config
  if (status === 401 && data.error === 'TOKEN_EXPIRED') {
    if (!isRefreshingToken) {
      console.log('Token expired. Refreshing...')
      isRefreshingToken = true
      refreshUserToken(localStorage.getItem('refreshToken'))
        .then(res => {
          isRefreshingToken = false
          updateUserToken(res.data)
          onUserTokenRefreshed(res.data.id_token)
          subscribers = []
        })
        .catch(error => {
          console.log(error)
        })
    }
    const requestSubscribers = new Promise(resolve => {
      subscribeUserTokenRefresh(token => {
        originalRequest.headers.Authorization = `Bearer ${token}`
        resolve(axios(originalRequest))
      })
    })
    return requestSubscribers
  }
  return Promise.reject(err)
})

function subscribeUserTokenRefresh (cb) {
  subscribers.push(cb)
}

function onUserTokenRefreshed (token) {
  subscribers.map(cb => cb(token))
}

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
  getCards (page, pageSize) {
    return axios.get('/cards', {
      params: {
        pageNumber: page,
        pageSize: pageSize,
        fields: 'name,mtgaid,multiverseid'
      }
    })
  },
  getUserCollection () {
    return axios.get('/users/collection', {
      headers: {
        Authorization: 'required'
      },
      params: {
        userId: localStorage.getItem('localId')
      }
    })
  }
}
