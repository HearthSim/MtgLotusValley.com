import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/Home'
import PublicDeck from '@/pages/PublicDeck'
import PublicDeckList from '@/pages/PublicDeckList'
import PrivateDeck from '@/pages/PrivateDeck'
import PrivateDeckList from '@/pages/PrivateDeckList'
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
      path: '/user/collection',
      name: 'UserCollection',
      component: UserCollection,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/user/decks/:id',
      name: 'PrivateDeck',
      component: PrivateDeck,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/user/decks',
      name: 'PrivateDeckList',
      component: PrivateDeckList,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/decks/:alias',
      name: 'PublicDeck',
      component: PublicDeck
    },
    {
      path: '/decks',
      name: 'PublicDeckList',
      component: PublicDeckList
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
