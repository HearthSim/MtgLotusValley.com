import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import PublicDeck from '@/components/PublicDeck'
import UserCollection from '@/components/UserCollection'

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
  const currentUserId = localStorage.getItem('localId')
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  if (requiresAuth && !currentUserId) {
    next('/')
  } else {
    next()
  }
})

export default router
