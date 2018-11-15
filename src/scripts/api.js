
const isProduction = process.env.NODE_ENV === 'production'
let isRefreshingToken = false
let subscribers = []

const axios = require('axios')
axios.defaults.baseURL = isProduction ? 'https://blacklotusvalley-ca867.firebaseapp.com/api'
                                      : 'http://localhost:5000/api'
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
  login (email, password) {
    return axios.post('/signin', {
      email: email,
      password: password
    })
  },
  register (email, password) {
    return axios.post('/signup', {
      email: email,
      password: password
    })
  },
  recoverpassword (email) {
    return axios.post('/recoverpassword', {
      email: email
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
  getDecksByArch (dateMin, dateMax, event) {
    return axios.get('/stats/decksByArch', {
      params: {
        dateMin: dateMin,
        dateMax: dateMax,
        event: event
      }
    })
  },
  getDecksByColors (dateMin, dateMax, onlyBasics) {
    return axios.get('/stats/decksByColors', {
      params: {
        dateMin: dateMin,
        dateMax: dateMax,
        onlyBasics: onlyBasics
      }
    })
  },
  getMostPlayedCards (dateMin, dateMax, event, size) {
    return axios.get('/stats/mostPlayedCards', {
      params: {
        dateMin: dateMin,
        dateMax: dateMax,
        event: event,
        size: size
      }
    })
  },
  getCards (page, pageSize, query, colors, rarities, types, sets) {
    return axios.get('/cards', {
      params: {
        pageNumber: page,
        pageSize: pageSize,
        query: query,
        colors: colors,
        rarities: rarities,
        types: types,
        sets: sets,
        fields: 'name,mtgaid,multiverseid,imageUrl,imageUrlTransformed'
      }
    })
  },
  getUserCollection (summarized) {
    return axios.get('/users/collection', {
      headers: {
        Authorization: 'required'
      },
      params: {
        userId: localStorage.getItem('localId'),
        summarized: summarized
      }
    })
  },
  getUserDecks (page, pageSize, sortBy, descending, colors, query, cards, cardDetails) {
    return axios.get('/users/decks', {
      headers: {
        Authorization: 'required'
      },
      params: {
        userId: localStorage.getItem('localId'),
        pageNumber: page,
        pageSize: pageSize,
        sortBy: `${descending ? '-' : ''}${sortBy !== undefined ? sortBy : '-date'}`,
        cardDetails: cardDetails,
        containsCards: cards,
        colors: colors,
        query: query
      }
    })
  },
  getUserDeck (id) {
    return axios.get('/users/decks', {
      headers: {
        Authorization: 'required'
      },
      params: {
        deckId: id,
        userId: localStorage.getItem('localId'),
        cardDetails: true,
        fields: 'cmc,colors,manaCost,name,multiverseid,rarity,set,type,imageUrl,colorIdentity',
        updates: true
      }
    })
  },
  getUserDeckMatches (id, page, pageSize, sortBy, descending) {
    return axios.get('/users/matches', {
      headers: {
        Authorization: 'required'
      },
      params: {
        deckId: id,
        userId: localStorage.getItem('localId'),
        pageNumber: page,
        pageSize: pageSize,
        sortBy: `${descending ? '-' : ''}${sortBy !== undefined ? sortBy : '-date'}`
      }
    })
  },
  getUserDeckOverview (id) {
    return axios.get('/users/decks/stats', {
      headers: {
        Authorization: 'required'
      },
      params: {
        deckId: id,
        userId: localStorage.getItem('localId')
      }
    })
  },
  getUserExtras () {
    return axios.get('/users/extras', {
      headers: {
        Authorization: 'required'
      },
      params: {
        userId: localStorage.getItem('localId')
      }
    })
  },
  getPublicDecks (page, pageSize, sortBy, descending, colors, query, cards, cardDetails) {
    return axios.get('/decks/published', {
      params: {
        pageNumber: page,
        pageSize: pageSize,
        sortBy: `${descending ? '-' : ''}${sortBy !== undefined ? sortBy : '-date'}`,
        cardDetails: cardDetails,
        containsCards: cards,
        colors: colors,
        query: query
      }
    })
  },
  getPublicDeck (alias) {
    return axios.get('/decks/published', {
      params: {
        alias: escape(alias),
        cardDetails: true,
        fields: 'cmc,colors,manaCost,name,multiverseid,rarity,set,type,imageUrl,colorIdentity',
        updates: true
      }
    })
  },
  getEvents () {
    return axios.get('/events', {
      params: {
        notFinished: true
      }
    })
  },
  convertCardsToMtgaId (cards, sideboard) {
    return axios.post('/decks/converter', {
      cards: cards,
      sideboard: sideboard,
      format: 'reading'
    })
  },
  convertCardsToObjects (cards, sideboard) {
    return axios.post('/decks/converter', {
      cards: escape(cards),
      sideboard: escape(sideboard),
      format: 'mtga'
    })
  }
}
