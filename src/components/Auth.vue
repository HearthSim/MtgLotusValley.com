<template>
  <v-toolbar-items>
    <v-btn v-if="!logged" flat @click="signInDialog = true">Sign In</v-btn>
    <v-btn v-if="!logged" flat>Register</v-btn>
    <v-btn v-if="logged" flat>
      <v-menu bottom transition="slide-y-transition">
        <div slot="activator">
          {{ loggedUserName }}
        </div>
        <v-list>
          <v-list-tile v-for="(item, i) in signedMenuItems" :key="i" @click="signedMenuClick(i)">
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </v-btn>
    
    <v-dialog v-model="signInDialog" width="300">
      <v-card>
        <v-card-text>
          <v-text-field flat label="Email" v-model="email"/>
          <v-text-field flat label="Password" v-model="password" 
            :append-icon="showPassword ? 'visibility_off' : 'visibility'"
            @click:append="showPassword = !showPassword"
            :rules="[passwordRules.required, passwordRules.min]"
            :type="showPassword ? 'text' : 'password'"/>
        </v-card-text>
        <p class="text-md-center red--text darken-1" v-if="showSignError">Invalid credentials</p>
        <p class="text-md-center" v-if="showSignLoading">
          <v-progress-circular :indeterminate="true"/>
        </p>
        <v-divider/>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat :disabled="showSignLoading" @click="onSignInEnter">
            Enter
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-toolbar-items>
</template>

<script>
import { axios } from "../main";

export default {
  name: 'Auth',
  created () {
      const tokenDate = new Date(localStorage.getItem("expiresIn"))
      const date = new Date()
      if (date < tokenDate) {
        this.showLoggedInfo()
      } else {
        const refreshToken = localStorage.getItem("refreshToken")
        if (refreshToken !== undefined && refreshToken !== "") {
          this.refreshUserToken(refreshToken)
        }
      }
  },
  data () {
    return {
      logged: false,
      loggedUserName: false,
      signInDialog: false,
      showSignError: false,
      showSignLoading: false,
      email: '',
      password: '',
      passwordRules: {
        required: value => !!value || 'Required.',
        min: v => (v != null && v.length >= 6) || 'Min 6 characters'
      },
      showPassword: false,
      signedMenuItems: [
        { title: 'My Collection' },
        { title: 'My Decks' },
        { title: 'Logout' }
      ]
    }
  },
  methods: {
    onSignInEnter: function () {
      this.showSignError = false
      this.showSignLoading = true
      axios.post('/signin', {
        email: this.email,
        password: this.password,
        returnSecureToken: true
      })
      .then(res => {
        this.signInDialog = false
        this.showSignLoading = false
        const userEmail = res.data.email
        this.loggedUserName = userEmail.substring(0, userEmail.indexOf('@'))
        localStorage.setItem("email", userEmail);
        localStorage.setItem("idToken", res.data.idToken)
        localStorage.setItem("refreshToken", res.data.refreshToken)
        const date = new Date()
        date.setSeconds(date.getSeconds() + Number.parseInt(res.data.expiresIn))
        localStorage.setItem("expiresIn", date.toString())
        this.showLoggedInfo()
      })
      .catch(error => {
        this.showSignError = true
        this.showSignLoading = false
        console.log(error);
      })
    },
    refreshUserToken: function (refreshToken) {
      axios.post('/refreshtoken', {
        refresh_token: refreshToken
      })
      .then(res => {
        localStorage.setItem("idToken", res.data.id_token)
        localStorage.setItem("refreshToken", res.data.refresh_token)
        const date = new Date()
        date.setSeconds(date.getSeconds() + Number.parseInt(res.data.expires_in))
        localStorage.setItem("expiresIn", date.toString())
        this.showLoggedInfo()
      })
      .catch(error => {
        console.log(error);
      })
    },
    showLoggedInfo: function () {
      const userEmail = localStorage.getItem("email")
      const userName = userEmail.substring(0, userEmail.indexOf('@'))
      this.loggedUserName = userName.charAt(0).toUpperCase() + userName.slice(1);
      this.logged = true
    },
    signedMenuClick: function (index) {
      console.log(index)
      if (index == 2) {
        this.logout()
      }
    },
    logout: function () {
      localStorage.removeItem("idToken")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("expiresIn")
      this.loggedUserName = "";
      this.logged = false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
