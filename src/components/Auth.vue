<template>
  <v-toolbar-items>
    <v-btn v-if="!logged" flat @click="signInDialog = true">Sign In</v-btn>
    <v-btn v-if="!logged" flat>Register</v-btn>
    <v-menu bottom transition="slide-y-transition">
      <v-btn v-if="logged" flat slot="activator">
          {{ loggedUserName }}
      </v-btn>
      <v-list>
        <v-list-tile v-for="(item, i) in signedMenuItems" :key="i" @click="signedMenuClick(i)">
          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
    
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

export default {
  name: 'Auth',
  created () {
    const tokenDate = new Date(localStorage.getItem('expiresIn'))
    const date = new Date()
    if (date < tokenDate) {
      this.showLoggedInfo()
    } else {
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken !== undefined && refreshToken !== '') {
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
    signedMenuClick: function (index) {
      console.log(index)
      switch (index) {
        case 0: this.$router.replace('collection')
          break
        case 2: this.logout()
          break
      }
    },
    onSignInEnter: function () {
      this.showSignError = false
      this.showSignLoading = true
      this.$api.login(this.email, this.password)
        .then(res => {
          this.signInDialog = false
          this.showSignLoading = false
          this.saveUserToken(res.data)
          this.showLoggedInfo()
          this.loggedUserName = res.data.email.substring(0, res.data.email.indexOf('@'))
        })
        .catch(error => {
          this.showSignError = true
          this.showSignLoading = false
          console.log(error)
        })
    },
    refreshUserToken: function (refreshToken) {
      this.$api.refreshToken(refreshToken)
        .then(res => {
          this.updateUserToken(res.data)
          this.showLoggedInfo()
        })
        .catch(error => {
          console.log(error)
        })
    },
    saveUserToken: function (data) {
      localStorage.setItem('localId', data.localId)
      localStorage.setItem('email', data.email)
      localStorage.setItem('idToken', data.idToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      const date = new Date()
      date.setSeconds(date.getSeconds() + Number.parseInt(data.expiresIn))
      localStorage.setItem('expiresIn', date.toString())
    },
    updateUserToken: function (data) {
      localStorage.setItem('idToken', data.id_token)
      localStorage.setItem('refreshToken', data.refresh_token)
      const date = new Date()
      date.setSeconds(date.getSeconds() + Number.parseInt(data.expires_in))
      localStorage.setItem('expiresIn', date.toString())
    },
    deleteUserToken: function () {
      localStorage.removeItem('localId')
      localStorage.removeItem('idToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('expiresIn')
    },
    showLoggedInfo: function () {
      const userEmail = localStorage.getItem('email')
      const userName = userEmail.substring(0, userEmail.indexOf('@'))
      this.loggedUserName = userName.charAt(0).toUpperCase() + userName.slice(1)
      this.logged = true
      this.$currentUser['id'] = localStorage.getItem('localId')
      this.$currentUser['token'] = localStorage.getItem('idToken')
    },
    logout: function () {
      this.deleteUserToken()
      this.loggedUserName = ''
      this.logged = false
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>

</style>
