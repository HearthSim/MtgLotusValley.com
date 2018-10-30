<template>
  <v-app>
    <v-toolbar app dark :clipped-left="clipped">
      <v-toolbar-items>
        <v-btn flat>
          <router-link to="/">
            <img src="@/assets/home.png" alt="Logo" height="38px">
          </router-link>
        </v-btn>
      </v-toolbar-items>
      <v-spacer/>
      <v-btn flat @click="onDecksClick()">Decks</v-btn>
      <v-btn flat @click="onDeckLoadClick()">
        Load List
        <!-- Upload dialog -->
        <v-dialog v-model="loadDeckDialog" max-width="350">
          <v-card>
            <v-card-title class="headline">Load Deck</v-card-title>
            <v-textarea class="ml-4 mr-4" no-resize rows="15"
              v-model="loadDeckText" :placeholder="loadDeckHint"/>
            <v-card-actions>
              <v-spacer/>
              <v-btn color="green darken-1" flat @click.native="onLoadDeckLoadClick()">Load</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-btn>
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
      loadDeckDialog: false,
      loadDeckText: '',
      loadDeckHint: 'Creature (14)\n4 Arclight Phoenix\n3 Crackling Drake\n4 Enigma Drake\n3 Goblin Electromancer\nSorcery (12)\n1 Beacon Bolt\n4 Chart a Course\n1 Lava Coil\n2 Maximize Velocity\n4 Tormenting Voice\nInstant (13)\n1 Dive Down\n4 Opt\n4 Radical Idea\n4 Shock\nLand (21)\n7 Island\n6 Mountain\n4 Steam Vents\n4 Sulfur Falls'
    }
  },
  methods: {
    onDecksClick: function () {
      this.$router.replace('/decks')
    },
    onDeckLoadClick: function () {
      this.loadDeckText = ''
      this.loadDeckDialog = true
    },
    onLoadDeckLoadClick: function () {
      let mainDeckText = this.loadDeckText.replace('Sideboard', 'sideboard').replace('SIDEBOARD', 'sideboard')
      let sideboardDeckText = ''
      if (this.loadDeckText.toLowerCase().includes('sideboard')) {
        const loadText = mainDeckText.split('sideboard')
        mainDeckText = loadText[0]
        sideboardDeckText = loadText[1]
      }
      const re = /\d+\s.+/g
      const cardLines = mainDeckText.match(re)
      const cards = cardLines.map(line => line.replace(' ', ':'))
      let sideboard = []
      if (sideboardDeckText.length > 0) {
        const sideboardLines = sideboardDeckText.match(re)
        sideboard = sideboardLines.map(line => line.replace(' ', ':'))
      }
      this.$api.convertCardsToMtgaId(cards.join(';'), sideboard.join(';'))
        .then(res => {
          this.loadDeckDialog = false
          if (this.$route.path.includes('/decks/')) {
            this.$router.replace(`/decks/${res.data.cards}_${res.data.sideboard}?loader=true`)
            location.reload()
          } else {
            this.$router.replace(`/decks/${res.data.cards}_${res.data.sideboard}?loader=true`)
          }
        })
        .catch(error => {
          this.isLoading = false
          console.log(error)
        })
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

.m-auto { margin: auto; }
.d-block { display: block; }

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
  max-width: 250px;
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