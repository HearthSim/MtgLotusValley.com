<template>
  <v-toolbar-items>
    <v-btn v-if="!logged" flat @click="signInDialog = true">Sign In</v-btn>
    <v-btn v-if="!logged" flat @click="signUpDialog = true">Register</v-btn>
    <v-menu v-if="logged" class="ml-5" open-on-hover offset-y bottom transition="slide-y-transition">
      <v-btn flat slot="activator">
          {{ loggedUserName }}
          <v-icon>arrow_drop_down</v-icon>
      </v-btn>
        <v-list>
          <WildcardsCost class="mt-2 ml-2 mr-2" :cost="userWildcards"/>
          <v-divider class="mt-2 mb-1"/>
          <v-list-tile v-for="(item, i) in signedMenuItems" :key="i" @click="signedMenuClick(i)">
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile>
        </v-list>
    </v-menu>

    <v-dialog v-model="signInDialog" width="300">
      <v-card>
        <v-card-text>
          <v-text-field flat label="Email" v-model="email"/>
          <v-text-field flat label="Password" v-model="password" @keyup.native.enter="onSignInEnter"
            :append-icon="showPassword ? 'visibility_off' : 'visibility'"
            @click:append="showPassword = !showPassword"
            :rules="[passwordRules.required, passwordRules.min]"
            :type="showPassword ? 'text' : 'password'"/>
        </v-card-text>
        <p class="text-md-center red--text darken-1" v-if="showSignError">{{ errorMsg }}</p>
        <p class="text-md-center" v-if="showSignLoading">
          <v-progress-circular color="deep-orange" :indeterminate="true"/>
        </p>
        <v-divider/>
        <v-card-actions>
          <div id="recoverPassLink">
            <a @click="onRecoverPassClick">Recover password</a>
          </div>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat :disabled="showSignLoading" @click="onSignInEnter">Enter</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="recoverPasswordDialog" width="250">
      <v-card>
        <v-card-text class='subheading'>Recover instruction send to your email.</v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="primary" flat="flat" @click="recoverPasswordDialog = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="signUpDialog" width="300">
      <v-card>
        <v-card-text>
          <v-text-field flat label="Email" v-model="email"/>
          <v-text-field flat label="Password" v-model="password"
            :append-icon="showPassword ? 'visibility_off' : 'visibility'"
            @click:append="showPassword = !showPassword"
            :rules="[passwordRules.required, passwordRules.min]"
            :type="showPassword ? 'text' : 'password'"/>
          <v-text-field flat label="Confirm Password" v-model="confirmPassword" @keyup.native.enter="onSignUpEnter"
            :append-icon="showPassword ? 'visibility_off' : 'visibility'"
            @click:append="showPassword = !showPassword"
            :rules="[passwordRules.required, passwordRules.min]"
            :type="showPassword ? 'text' : 'password'"/>
        </v-card-text>
        <p class="text-md-center red--text darken-1" v-if="showSignError">{{ errorMsg }}</p>
        <p class="text-md-center" v-if="showSignLoading">
          <v-progress-circular color="deep-orange" :indeterminate="true"/>
        </p>
        <v-divider/>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat :disabled="showSignLoading" @click="onSignUpEnter">Register</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-toolbar-items>
</template>

<script>
import Utils from '@/scripts/utils'
import WildcardsCost from '@/components/mtg/WildcardsCost'

export default {
  name: 'Auth',
  components: {
    WildcardsCost
  },
  mounted () {
    if (this.$isUserLogged()) {
      this.setUserAsLogged()
    } else {
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        this.refreshUserToken(refreshToken)
      }
    }
  },
  data () {
    return {
      logged: false,
      loggedUserName: false,
      signInDialog: false,
      signUpDialog: false,
      recoverPasswordDialog: false,
      showSignError: false,
      showSignLoading: false,
      errorMsg: '',
      email: '',
      password: '',
      confirmPassword: '',
      passwordRules: {
        required: value => !!value || 'Required.',
        min: v => (v != null && v.length >= 6) || 'Min 6 characters'
      },
      showPassword: false,
      signedMenuItems: [
        { title: 'My Profile' },
        { title: 'My Collection' },
        { title: 'My Decks' },
        { title: 'Logout' }
      ],
      userWildcards: {}
    }
  },
  methods: {
    signedMenuClick: function (index) {
      switch (index) {
        case 0: this.$router.replace('/user')
          break
        case 1: this.$router.replace('/user/collection')
          break
        case 2: this.$router.replace('/user/decks')
          break
        case 3: this.logout()
          break
      }
    },
    onSignInEnter: function () {
      if (this.email === '') {
        this.errorMsg = 'Please enter your email'
        this.showSignError = true
        return
      }
      if (this.password === '') {
        this.errorMsg = 'Please enter your password'
        this.showSignError = true
        return
      }
      this.showSignError = false
      this.showSignLoading = true
      this.$api.login(this.email, this.password)
        .then(res => {
          this.signInDialog = false
          this.showSignLoading = false
          this.$api.saveUserToken(res.data)
          location.reload()
        })
        .catch(error => {
          console.log(error)
          this.errorMsg = 'Invalid credentials'
          this.showSignError = true
          this.showSignLoading = false
        })
    },
    onSignUpEnter: function () {
      if (this.email === '') {
        this.errorMsg = 'Please enter your email'
        this.showSignError = true
        return
      }
      if (this.password === '') {
        this.errorMsg = 'Please enter your password'
        this.showSignError = true
        return
      }
      if (this.password.length < 6) {
        this.errorMsg = 'Please enter a password with at least 6 characters'
        this.showSignError = true
        return
      }
      if (this.password !== this.confirmPassword) {
        this.errorMsg = 'Password and Confirm don`t match'
        this.showSignError = true
        return
      }
      this.showSignError = false
      this.showSignLoading = true
      this.$api.register(this.email, this.password)
        .then(res => {
          this.signUpDialog = false
          this.showSignLoading = false
          this.$api.saveUserToken(res.data)
          location.reload()
        })
        .catch(error => {
          console.log(error.response)
          const errorReason = error.response.data.error.message
          if (errorReason === 'EMAIL_EXISTS') {
            this.errorMsg = 'Email already in use. Try do login.'
          } else if (errorReason === 'INVALID_PASSWORD') {
            this.errorMsg = 'Invalid password.'
          } else if (errorReason === 'WEAK_PASSWORD') {
            this.errorMsg = 'Password should be at least 6 characters.'
          }
          this.showSignError = true
          this.showSignLoading = false
        })
    },
    refreshUserToken: function (refreshToken) {
      this.$api.refreshUserToken(refreshToken)
        .then(res => {
          this.$api.updateUserToken(res.data)
          this.setUserAsLogged()
        })
        .catch(error => {
          console.log(error)
        })
    },
    setUserAsLogged: function () {
      const userEmail = localStorage.getItem('email')
      const userName = userEmail.substring(0, userEmail.indexOf('@'))
      this.loggedUserName = Utils.captalize(userName)
      this.logged = true
      this.requestUserWildcards()
    },
    logout: function () {
      this.$api.deleteUserToken()
      this.loggedUserName = ''
      this.logged = false
      location.reload()
    },
    onRecoverPassClick: function () {
      if (this.email === '') {
        this.errorMsg = 'Please enter your email'
        this.showSignError = true
        return
      }
      this.showSignError = false
      this.showSignLoading = true
      this.$api.recoverpassword(this.email)
        .then(res => {
          this.showSignLoading = false
          this.signInDialog = false
          this.recoverPasswordDialog = true
        })
        .catch(error => {
          this.errorMsg = 'Error. Please try again'
          this.showSignError = true
          this.showSignLoading = false
          console.log(error)
        })
    },
    requestUserWildcards: function () {
      this.$api.getUserExtras(this.deckAlias)
        .then(res => {
          if (res.data === '') {
            this.userWildcards = {}
            return
          }
          this.userWildcards = {
            'mythic': res.data['wcMythic'],
            'rare': res.data['wcRare'],
            'uncommon': res.data['wcUncommon'],
            'common': res.data['wcCommon']
          }
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>
#recoverPassLink {
  margin-left: 10px;
}
</style>
