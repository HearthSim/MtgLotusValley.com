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
      <v-toolbar-items>
        <v-btn flat>Sign In</v-btn>
        <v-btn flat>Register</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <HelloWorld/>
    </v-content>
    <v-footer :fixed="fixed" app>
      <span>&copy; 2017</span>
    </v-footer>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld'

export default {
  name: 'App',
  components: {
    HelloWorld
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
