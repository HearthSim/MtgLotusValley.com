<template>
  <v-app>
    <v-toolbar app flat :clipped-left="clipped">
      <v-toolbar-items>
        <v-btn flat>
          <img src="@/assets/logo.png" alt="Home" height="38px" width="38px">
        </v-btn>
      </v-toolbar-items>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
      <Auth/>
    </v-toolbar>
    <v-content>
      <Home/>
    </v-content>
    <v-footer :fixed="fixed" app>
      <span>&copy; 2017</span>
    </v-footer>
  </v-app>
</template>

<script>
import Auth from './components/Auth'
import Home from './components/Home'
import 'mana-font/css/mana.min.css'
import 'keyrune/css/keyrune.min.css'

export default {
  name: 'App',
  components: {
    Auth, Home
  },
  data () {
    return {
      clipped: false,
      fixed: false,
      title: 'Black Lotus Valley'
    }
  }
}
</script>

<style>

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

</style>