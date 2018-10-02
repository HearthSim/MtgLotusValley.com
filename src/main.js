// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from '@/components/App'
import api from '@/scripts/api'
import router from '@/scripts/router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)
Vue.config.productionTip = false

Vue.prototype.$api = api

Vue.prototype.$isUserLogged = function () {
  const tokenDate = new Date(localStorage.getItem('expiresIn'))
  const date = new Date()
  return date < tokenDate
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
