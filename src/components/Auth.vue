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
  created() {
      const tokenDate = new Date(localStorage.getItem("expiresIn"))
      const date = new Date()
      if (date < tokenDate) {
        let userEmail = localStorage.getItem("email")
        userEmail = userEmail.substring(0, userEmail.indexOf('@'))
        this.loggedUserName = userEmail.charAt(0).toUpperCase() + userEmail.slice(1);
        this.logged = true
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
        loggedUserName = userEmail.substring(0, userEmail.indexOf('@'))
        localStorage.setItem("email", userEmail);
        localStorage.setItem("idToken", res.data.idToken)
        localStorage.setItem("refreshToken", res.data.refreshToken)
        const date = new Date()
        date.setSeconds(date.getSeconds() + Number.parseInt(res.data.expiresIn))
        localStorage.setItem("expiresIn", date.toString())
      })
      .catch(error => {
        this.showSignError = true
        this.showSignLoading = false
        console.log(error);
      })
    },
    signedMenuClick: function (index) {
      console.log(index)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
