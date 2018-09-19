import '@babel/polyfill'
import App from './App.vue'
import Vue from 'vue'

import './plugins/vuetify'

const testing = true

const axios = require('axios');
axios.defaults.headers.post['Content-Type'] = 'application/json'
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*'
axios.defaults.baseURL = testing ? 'http://localhost:5000/api'
                                 : 'https://blacklotusvalley-ca867.firebaseapp.com/api'

Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')

export { axios }