
import Utils from '@/scripts/utils'

const isProduction = process.env.NODE_ENV === 'production'
let isRefreshingToken = false
let refreshSubscribers = []

const axios = require('axios')
axios.defaults.baseURL = isProduction ? 'https://www.mtglotusvalley.com/api'
                                      : 'http://localhost:5000/api'
axios.defaults.headers.post['Content-Type'] = 'application/json'

axios.interceptors.request.use(
  config => {
    if (config.headers.Authorization === 'required' ||
          config.headers.Authorization === 'optional') {
      const token = localStorage.getItem('idToken')
      if (token && token !== '') {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  error => Promise.reject(error)
)

axios.interceptors.response.use(response => {
  return response
}, error => {
  const { config, response: { status, data } } = error
  const originalRequest = config
  if (status === 401 && data.error === 'TOKEN_EXPIRED') {
    const updateTime = localStorage.getItem('updateTime') || 0
    const nowTime = new Date().getTime()
    const isRecentlyUpdated = (nowTime - updateTime) < 60000
    if (isRecentlyUpdated) {
      console.log('Token recently Updated.')
      return new Promise(resolve => {
        const token = localStorage.getItem('idToken')
        originalRequest.headers.Authorization = `Bearer ${token}`
        resolve(axios(originalRequest))
      })
    } else if (!isRefreshingToken) {
      isRefreshingToken = true
      console.log('Token expired. Refreshing...')
      axios.post('/refreshtoken', {
        refresh_token: localStorage.getItem('refreshToken')
      })
      .then(res => {
        isRefreshingToken = false
        console.log('Token refreshed.')
        updateUserToken(res.data)
        onUserTokenRefreshed(res.data.id_token)
      })
      .catch(error => {
        console.log(error)
      })
    }
    return new Promise(resolve => {
      subscribeUserTokenRefresh(token => {
        originalRequest.headers.Authorization = `Bearer ${token}`
        resolve(axios(originalRequest))
      })
    })
  } else {
    return Promise.reject(error)
  }
})

function subscribeUserTokenRefresh (cb) {
  console.log('Subscribing for Refresh token.')
  refreshSubscribers.push(cb)
}

function onUserTokenRefreshed (token) {
  refreshSubscribers.forEach(callback => {
    callback(token)
  })
  refreshSubscribers = []
}

function refreshUserToken (refreshToken) {
  console.log('Token expired. Refreshing...')
  return axios.post('/refreshtoken', {
    refresh_token: refreshToken
  })
}

function saveUserToken (data) {
  localStorage.setItem('localId', data.localId)
  localStorage.setItem('email', data.email)
  localStorage.setItem('idToken', data.idToken)
  localStorage.setItem('refreshToken', data.refreshToken)
  localStorage.setItem('userName', data.userName)
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
  localStorage.setItem('updateTime', new Date().getTime())
}

function deleteUserToken () {
  localStorage.removeItem('localId')
  localStorage.removeItem('idToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('expiresIn')
  localStorage.removeItem('email')
  localStorage.removeItem('userName')
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
  getDeckOfDay: function (date, eventType) {
    return axios.get('/stats/deckOfDay', {
      params: {
        date: date,
        eventType: eventType
      }
    })
  },
  getDecksByArch (dateMin, dateMax, eventType) {
    return axios.get('/stats/decksByArch', {
      params: {
        dateMin: dateMin,
        dateMax: dateMax,
        eventType: eventType
      }
    })
  },
  getDecksByColors (dateMin, dateMax, onlyBasics, eventType) {
    return axios.get('/stats/decksByColors', {
      params: {
        dateMin: dateMin,
        dateMax: dateMax,
        onlyBasics: onlyBasics,
        eventType: eventType
      }
    })
  },
  getMostPlayedCards (dateMin, dateMax, eventType, size) {
    return axios.get('/stats/mostPlayedCards', {
      params: {
        dateMin: dateMin,
        dateMax: dateMax,
        eventType: eventType,
        size: size
      }
    })
  },
  getCards (query, colors, rarities, types, sets, onlyOwnedCards, page, pageSize, fields) {
    const headers = {}
    const params = {
      query: query,
      colors: colors === '' ? 'b,c,g,m,r,u,w' : colors,
      rarities: rarities === '' ? 'c,u,r,m' : rarities,
      types: types === '' ? 'a,c,e,i,l,p,s' : types,
      sets: sets === '' ? Utils.sets.map(set => set.code).join() : sets,
      pageNumber: page,
      pageSize: pageSize,
      fields: fields !== undefined ? fields : 'name,mtgaid,multiverseid,imageUrl,imageUrlTransformed'
    }
    if (onlyOwnedCards === true) {
      headers['Authorization'] = 'required'
      params['onlyOwnedCards'] = true
    }
    return axios.get('/cards', {
      headers: headers,
      params: params
    })
  },
  getUserCollection (summarized) {
    return axios.get('/users/collection', {
      headers: {
        Authorization: 'required'
      },
      params: {
        summarized: summarized
      }
    })
  },
  getUserEvents (event, page, pageSize) {
    const params = {
      pageNumber: page,
      pageSize: pageSize
    }
    if (event !== undefined) {
      params['event'] = event
    }
    return axios.get('/users/events', {
      headers: {
        Authorization: 'required'
      },
      params: params
    })
  },
  getUserEventsSummary () {
    return axios.get('/users/events/summary', {
      headers: {
        Authorization: 'required'
      }
    })
  },
  getUserDecks (page, pageSize, sortBy, descending, format, colors, query, cards, cardDetails) {
    const params = {
      pageNumber: page,
      pageSize: pageSize,
      sortBy: `${descending ? '-' : ''}${sortBy !== undefined ? sortBy : '-date'}`,
      cardDetails: cardDetails,
      containsCards: cards,
      colors: colors,
      query: query
    }
    if (format === 'Constructed' || format === 'Limited') {
      params['format'] = format
    }
    return axios.get('/users/decks', {
      headers: {
        Authorization: 'required'
      },
      params: params
    })
  },
  getUserDeck (id) {
    return axios.get('/users/decks', {
      headers: {
        Authorization: 'required'
      },
      params: {
        deckId: id,
        cardDetails: true,
        fields: 'mtgaid,cmc,colors,manaCost,name,multiverseid,rarity,set,number,type,imageUrl,imageUrlTransformed,colorIdentity,qtd',
        updates: true,
        winRate: true
      }
    })
  },
  postUserDeck (deckId, deckName, deckColors, deckCards, deckSideboard) {
    return axios.post('/users/decks', {
      deckId: deckId,
      name: deckName,
      colors: deckColors,
      cards: deckCards,
      sideboard: deckSideboard
    }, {
      headers: {
        Authorization: 'required'
      }
    })
  },
  publishUserDeck (deckId, deckName, deckArch, deckColors, deckCards, deckSideboard, owner) {
    return axios.post('/users/decks/publish', {
      deckId: deckId,
      arch: deckArch,
      name: deckName,
      colors: deckColors,
      cards: deckCards,
      sideboard: deckSideboard,
      owner: owner
    }, {
      headers: {
        Authorization: 'required'
      }
    })
  },
  getUserDeckMatches (id, page, pageSize, sortBy, descending, event, casual) {
    return axios.get('/users/matches', {
      headers: {
        Authorization: 'required'
      },
      params: {
        deckId: id,
        eventName: event,
        eventCasual: casual,
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
        deckId: id
      }
    })
  },
  deleteUserDecks (ids) {
    return axios.delete('/users/decks', {
      headers: {
        Authorization: 'required'
      },
      params: {
        deckIds: ids
      }
    })
  },
  getUserExtras () {
    return axios.get('/users/extras', {
      headers: {
        Authorization: 'required'
      }
    })
  },
  getPublicDecks (page, pageSize, sortBy, descending, format, colors, query, cards, cardDetails, fields) {
    const params = {
      pageNumber: page,
      pageSize: pageSize,
      sortBy: `${descending ? '-' : ''}${sortBy !== undefined ? sortBy : '-date'}`,
      containsCards: cards,
      colors: colors === '' ? 'b,g,r,u,w' : colors,
      query: query,
      cardDetails: cardDetails,
      fields: fields
    }
    if (format === 'Constructed' || format === 'Limited') {
      params['format'] = format
    }
    return axios.get('/decks/published', {
      params: params
    })
  },
  getPublicDeck (alias) {
    return axios.get('/decks/published', {
      headers: {
        Authorization: 'optional'
      },
      params: {
        alias: escape(alias),
        cardDetails: true,
        fields: 'mtgaid,cmc,colors,manaCost,name,multiverseid,rarity,set,number,type,imageUrl,imageUrlTransformed,colorIdentity,qtd',
        updates: true,
        deckGuide: true,
        userLikeId: localStorage.getItem('localId')
      }
    })
  },
  deletePublicDeck (id) {
    return axios.delete('/decks', {
      headers: {
        Authorization: 'required'
      },
      params: {
        deckId: id
      }
    })
  },
  postUserDeckGuide (deckId, deckGuide) {
    return axios.post('/decks/guide', {
      deckId: deckId,
      deckGuide: deckGuide
    }, {
      headers: {
        Authorization: 'required'
      }
    })
  },
  postUserDeckLike (deckId) {
    return axios.post('/decks/like', {
      deckId: deckId
    }, {
      headers: {
        Authorization: 'required'
      }
    })
  },
  deleteUserDeckLike (deckId) {
    return axios.delete('/decks/like', {
      headers: {
        Authorization: 'required'
      },
      params: {
        deckId: deckId
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
  convertNamesToCards (cards, sideboard, cardDetails, fields) {
    return axios.post('/decks/converter', {
      cards: cards,
      sideboard: sideboard,
      format: 'reading',
      cardDetails: cardDetails,
      fields: fields
    })
  },
  convertMtgaIdToCards (cards, sideboard) {
    return axios.post('/decks/converter', {
      cards: escape(cards),
      sideboard: escape(sideboard),
      format: 'mtga',
      cardDetails: 'true',
      fields: 'mtgaid,cmc,colors,manaCost,name,multiverseid,rarity,set,number,type,imageUrl,imageUrlTransformed,colorIdentity,qtd'
    })
  }
}
