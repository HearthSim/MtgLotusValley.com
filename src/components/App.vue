<template>
  <v-app>
    <v-toolbar app dark :clipped-left="clipped">
      <v-toolbar-items>
        <v-btn flat>
          <router-link to="/">
            <img src="@/assets/logo.png" alt="Logo" height="38px" width="38px">
          </router-link>
        </v-btn>
      </v-toolbar-items>
      <v-toolbar-title v-text="title" class="hidden-xs-only"/>
      <v-spacer/>
      <Auth/>
    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>
    <!-- <v-footer :fixed="fixed" app>
      <span>&copy; 2017</span>
    </v-footer> -->
  </v-app>
</template>

<script>
import Auth from '@/components/Auth'
import 'mana-font/css/mana.min.css'
import 'keyrune/css/keyrune.min.css'

export default {
  name: 'App',
  components: {
    Auth
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