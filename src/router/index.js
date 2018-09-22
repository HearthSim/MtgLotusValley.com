import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
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
      path: '*',
      redirect: '/'
    }
  ]
})

router.beforeEach((to, from, next) => {
  const currentUserId = localStorage.getItem('localId')
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const hasValidUser = currentUserId !== undefined
  if (requiresAuth && !hasValidUser) {
    next('/')
  } else {
    next()
  }
})

export default router
