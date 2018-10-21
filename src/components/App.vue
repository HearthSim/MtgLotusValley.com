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
      <v-btn flat @click="onDecksClick()">Decks</v-btn>
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
  },
  methods: {
    onDecksClick: function () {
      this.$router.replace('/decks')
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

.bp-c { background-position: center }

.textNoWrap {
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-flex;/* block; */
  overflow: hidden;
}

.cover {
  background-size: cover;
  background-position: center;
  height: 70px;
  border-radius: 5px;
  overflow: hidden;
}
.cover-bg { background-image: url('~@/assets/decks/bg.jpg') }
.cover-br { background-image: url('~@/assets/decks/br.jpg') }
.cover-brg { background-image: url('~@/assets/decks/brg.jpg') }
.cover-c { background-image: url('~@/assets/decks/c.jpg') }
.cover-default { background-image: url('~@/assets/decks/default.jpg') }
.cover-g { background-image: url('~@/assets/decks/g.jpg') }
.cover-m { background-image: url('~@/assets/decks/m.jpg') }
.cover-r { background-image: url('~@/assets/decks/r.jpg') }
.cover-rg { background-image: url('~@/assets/decks/rg.jpg') }
.cover-u { background-image: url('~@/assets/decks/u.jpg') }
.cover-ub { background-image: url('~@/assets/decks/ub.jpg') }
.cover-ubg { background-image: url('~@/assets/decks/ubg.jpg') }
.cover-ubr { background-image: url('~@/assets/decks/ubr.jpg') }
.cover-ug { background-image: url('~@/assets/decks/ug.jpg') }
.cover-ur { background-image: url('~@/assets/decks/ur.jpg') }
.cover-urg { background-image: url('~@/assets/decks/urg.jpg') }
.cover-w { background-image: url('~@/assets/decks/w.jpg') }
.cover-wb { background-image: url('~@/assets/decks/wb.jpg') }
.cover-wbg { background-image: url('~@/assets/decks/wbg.jpg') }
.cover-wbr { background-image: url('~@/assets/decks/wbr.jpg') }
.cover-wg { background-image: url('~@/assets/decks/wg.jpg') }
.cover-wr { background-image: url('~@/assets/decks/wr.jpg') }
.cover-wrg { background-image: url('~@/assets/decks/wrg.jpg') }
.cover-wu { background-image: url('~@/assets/decks/wu.jpg') }
.cover-wub { background-image: url('~@/assets/decks/wub.jpg') }
.cover-wug { background-image: url('~@/assets/decks/wug.jpg') }
.cover-wur { background-image: url('~@/assets/decks/wur.jpg') }

</style>