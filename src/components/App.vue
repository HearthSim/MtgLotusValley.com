<template>
  <v-app>
    <v-toolbar app dark dense>
      <v-toolbar-items>
        <v-btn flat>
          <router-link to="/">
            <img class="mt-1" src="@/assets/home.png" alt="Logo" height="38px">
          </router-link>
        </v-btn>
      </v-toolbar-items>
      <v-spacer/>
      <Auth/>
    </v-toolbar>
    <v-content id="body">
      <div id="content" class="mt-4 mb-4">
        <v-toolbar id="menu" dark dense>
          <v-toolbar-items>
            <v-btn flat icon href="/">
              <img src="@/assets/logo.png" alt="Home" height="38px">
            </v-btn>
            <v-divider class="ml-2" vertical/>
            <v-btn flat to="/meta">Meta</v-btn>
            <v-divider vertical/>
            <v-btn flat to="/decks">Decks</v-btn>
            <v-divider vertical/>
            <v-btn flat @click="onDeckLoadClick()">
              Load List
              <!-- Upload dialog -->
              <v-dialog v-model="loadDeckDialog" max-width="350">
                <v-card>
                  <v-card-title class="headline">Load Deck</v-card-title>
                  <v-textarea class="ml-4 mr-4" no-resize rows="15"
                    v-model="loadDeckText" :placeholder="loadDeckHint"/>
                  <p class="text-md-center red--text darken-1" v-if="showError">{{ errorMsg }}</p>
                  <p class="text-md-center" v-if="isLoading">
                    <v-progress-circular color="deep-orange" :indeterminate="true"/>
                  </p>
                  <v-divider/>
                  <v-card-actions>
                    <v-spacer/>
                    <v-btn color="green darken-1" flat @click.native="onLoadDeckLoadClick()">Load</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-btn>
            <v-divider vertical/>
          </v-toolbar-items>
          <v-spacer/>
          <v-btn icon href="https://twitter.com/MtgLotusValley" target="_blank">
            <img src="@/assets/twitter.png" alt="Twitter" height="24px">
          </v-btn>
        </v-toolbar>
        <router-view/>
      </div>
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
      fixed: false,
      loadDeckDialog: false,
      loadDeckText: '',
      loadDeckHint: 'Creature (14)\n4 Arclight Phoenix\n3 Crackling Drake\n4 Enigma Drake\n3 Goblin Electromancer\nSorcery (12)\n1 Beacon Bolt\n4 Chart a Course\n1 Lava Coil\n2 Maximize Velocity\n4 Tormenting Voice\nInstant (13)\n1 Dive Down\n4 Opt\n4 Radical Idea\n4 Shock\nLand (21)\n7 Island\n6 Mountain\n4 Steam Vents\n4 Sulfur Falls',
      isLoading: false,
      showError: false,
      errorMsg: ''
    }
  },
  methods: {
    onDeckLoadClick: function () {
      this.loadDeckText = ''
      this.loadDeckDialog = true
    },
    onLoadDeckLoadClick: function () {
      this.isLoading = false
      this.showError = false
      try {
        let mainDeckText = this.loadDeckText
          .replace(/\t/g, ' ')  // Replace tab for space
          .replace(/\d+x\s/g, s => s.replace('x', ''))  // Remove qtd x
          .replace(/sideboard/gi, 'sideboard')  // Lowercase sideboard
        let sideboardDeckText = ''
        if (mainDeckText.includes('sideboard')) {
          const loadText = mainDeckText.split('sideboard')
          mainDeckText = loadText[0]
          sideboardDeckText = loadText[1]
        }
        const re = /^\d+\s+(['/,A-Za-z]+[^\S\n]*)+/gm // Match any digit plus words with space but not newline
        const cardLines = mainDeckText.match(re)
        const cards = cardLines.map(line => line.replace(' ', ':')
          .replace(/\s{2,10}/, '')  // Trim between text
          .replace(/\s\d*[bgruw]+\s/g, '')  // Remove mana cost if has
          .trim()
        )
        let sideboard = []
        if (sideboardDeckText.length > 0) {
          const sideboardLines = sideboardDeckText.match(re)
          sideboard = sideboardLines.map(line => line.replace(' ', ':')
          .replace(/\s{2,10}/, '')  // Trim between text
          .replace(/\s\d*[bgruw]+\s/g, '')  // Remove mana cost if has
          .trim()
        )
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
            console.log(error)
            this.isLoading = false
            this.errorMsg = error.response.data
            this.showError = true
          })
      } catch (e) {
        console.log(e)
        this.isLoading = false
        this.errorMsg = 'Invalid deck list'
        this.showError = true
      }
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
#body {
  background: url('~@/assets/bg.jpg') repeat;
}
#menu {
  background: url('~@/assets/bg_header.jpg') no-repeat;
}
#menu .v-toolbar__content {
  padding-left: 8px;
  padding-right: 16px;
}
#content {
  background: url('~@/assets/bg_content.jpg') repeat;
  margin: auto;
  max-width: 1000px;
}
.box {
  border: 4px solid grey;
  margin: 8px;
  background: url('~@/assets/bg_box.jpg') repeat;
}
.boxHeader {
  background: url('~@/assets/bg_header.jpg') repeat;
  color: #fff!important;
  caret-color: #fff!important;
  padding: 4px;
}
.boxContent {
  padding: 8px;
}

.m-auto { margin: auto; }
.d-block { display: block; }

.textNoSelect {
  -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
     -khtml-user-select: none; /* Konqueror HTML */
       -moz-user-select: none; /* Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
            user-select: none; /* Non-prefixed version, currently supported by Chrome and Opera */
}

.textNoWrap {
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-flex; /* block; */
  overflow: hidden;
}

.cover {
  background-size: cover;
  background-position: center;
  height: 100%;
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