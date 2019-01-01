// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from '@/components/App'
import api from '@/scripts/api'
import router from '@/scripts/router'

import VueAnalytics from 'vue-analytics'
import VueDisqus from 'vue-disqus'
import VueHead from 'vue-head'
import VueLazyload from 'vue-lazyload'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

// const isProduction = process.env.NODE_ENV === 'production'

Vue.use(VueAnalytics, {
  id: 'UA-129283949-1',
  router,
  autoTracking: {
    exception: true,
    screenview: true
  }
  // debug: {
  //   enabled: !isProduction,
  //   sendHitTask: isProduction
  // }
})
Vue.use(VueDisqus)
Vue.use(VueHead)
Vue.use(VueLazyload, {
  loading: require('@/assets/card.png'),
  error: require('@/assets/card.png'),
  attempt: 1
})
Vue.use(Vuetify)
Vue.config.productionTip = false

Vue.prototype.$api = api

Vue.prototype.$isUserLogged = function () {
  const tokenDate = new Date(localStorage.getItem('expiresIn'))
  const date = new Date()
  return date < tokenDate
}

Vue.prototype.$scrollToTop = function () {
  document.body.scrollTop = 0 // For Safari
  document.documentElement.scrollTop = 0 // For Chrome, Firefox, IE and Opera
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
