import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/Home'
import PublicDeck from '@/pages/PublicDeck'
import PublicDecks from '@/pages/PublicDecks'
import UserCollection from '@/pages/UserCollection'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/collection',
      name: 'UserCollection',
      component: UserCollection,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/decks',
      name: 'PublicDecks',
      component: PublicDecks
    },
    {
      path: '/decks/:alias',
      name: 'PublicDeck',
      component: PublicDeck
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

router.beforeEach((to, from, next) => {
  document.title = 'Black Lotus Valley'
  const currentUserId = localStorage.getItem('localId')
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  if (requiresAuth && !currentUserId) {
    next('/')
  } else {
    next()
  }
})

export default router
