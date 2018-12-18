<template>
  <v-app>
    <v-toolbar id="toolbar" app dark dense>
      <v-toolbar-items>
        <router-link to="/">
          <img class="mt-1" src="@/assets/home.png" alt="Logo" height="38px">
        </router-link>
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
            <v-btn flat exact to="/decks">Decks</v-btn>
            <v-divider vertical/>
            <v-btn flat exact to="/decks/builder">Deck Builder</v-btn>
            <v-divider vertical/>
            <v-btn flat @click="onListLoadClick()">List Loader</v-btn>
            <v-divider vertical/>
            <v-btn flat exact to="/meta">Meta</v-btn>
            <v-divider vertical/>
          </v-toolbar-items>
          <v-spacer/>
          <v-toolbar-items>
            <v-divider vertical/>
            <v-btn flat exact to="/lotustracker">Lotus Tracker</v-btn>
            <v-divider vertical/>
          </v-toolbar-items>
          <v-btn class="ml-3" icon href="https://www.reddit.com/r/LotusTracker" target="_blank">
            <img src="@/assets/reddit.png" alt="Reddit" height="28px">
          </v-btn>
          <v-btn class="mr-1" icon href="https://twitter.com/MtgLotusValley" target="_blank">
            <img src="@/assets/twitter.png" alt="Twitter" height="24px">
          </v-btn>
        </v-toolbar>
        <router-view/>
      </div>
      <!-- Loader dialog -->
      <v-dialog v-model="loadDeckDialog" max-width="350">
        <v-card>
          <v-card-title class="headline">Deck Loader</v-card-title>
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
    </v-content>
    <!-- <v-footer :fixed="fixed" app>
      <span>&copy; 2017</span>
    </v-footer> -->
  </v-app>
</template>

<script>
import Auth from '@/components/Auth'
import DeckUtils from '@/scripts/deckutils'
import 'mana-font/css/mana.min.css'
import 'keyrune/css/keyrune.min.css'

export default {
  name: 'App',
  components: {
    Auth, DeckUtils
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
    onListLoadClick: function () {
      this.loadDeckText = ''
      this.loadDeckDialog = true
    },
    onLoadDeckLoadClick: function () {
      this.isLoading = false
      this.showError = false
      try {
        const deckCards = DeckUtils.parseDeckText(this.loadDeckText)
        this.$api.convertNamesToCards(deckCards.cards, deckCards.sideboard)
          .then(res => {
            this.loadDeckDialog = false
            const cards = res.data.cards.join(';')
            const sideboard = res.data.sideboard.join(';')
            if (this.$route.path.includes('/decks/')) {
              this.$router.replace(`/decks/${cards}_${sideboard}?loader=true`)
              location.reload()
            } else {
              this.$router.replace(`/decks/${cards}_${sideboard}?loader=true`)
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
#toolbar {
  z-index: 99999;
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
}
@media (min-width: 762px) {
  #content {
    width: 720px;  /* margin 24px */
  }
}
@media (min-width: 1024px) {
  #content {
    width: 1000px;  /* margin 12px */
  }
}
@media (min-width: 1280px) {
  #content {
    width: 1184px;  /* margin 48px */
  }
}

.box {
  border: 4px solid grey;
  margin: 12px;
  background: url('~@/assets/bg_box.jpg') repeat;
}
.boxHeader {
  background: url('~@/assets/bg_header.jpg') repeat;
  color: #fff!important;
  caret-color: #fff!important;
  padding: 4px;
}
.boxContent {
  margin: 8px;
}
.breadcrumbs {
  background: url('~@/assets/bg_box.jpg') repeat;
  height: 36px;
  width: 100%;
}

.m-auto { margin: auto; }
.mr-05 { margin-right: 2px !important }
.mt-2_5 { margin-top: 12px; }
.ml-2_5 { margin-left: 12px; }
.mr-2_5 { margin-right: 12px; }
.mb-2_5 { margin-bottom: 12px; }
.d-block { display: block; }
.text-valign-center {
  justify-content: center;
}
.height100 {
  height: 100%;
}
.width100 {
  width: 100%;
}

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
.cover-b { background-image: url('~@/assets/decks-covers/b.jpg') }
.cover-bg { background-image: url('~@/assets/decks-covers/bg.jpg') }
.cover-br { background-image: url('~@/assets/decks-covers/br.jpg') }
.cover-brg { background-image: url('~@/assets/decks-covers/brg.jpg') }
.cover-c { background-image: url('~@/assets/decks-covers/c.jpg') }
.cover-default { background-image: url('~@/assets/decks-covers/default.jpg') }
.cover-g { background-image: url('~@/assets/decks-covers/g.jpg') }
.cover-m { background-image: url('~@/assets/decks-covers/m.jpg') }
.cover-r { background-image: url('~@/assets/decks-covers/r.jpg') }
.cover-rg { background-image: url('~@/assets/decks-covers/rg.jpg') }
.cover-u { background-image: url('~@/assets/decks-covers/u.jpg') }
.cover-ub { background-image: url('~@/assets/decks-covers/ub.jpg') }
.cover-ubg { background-image: url('~@/assets/decks-covers/ubg.jpg') }
.cover-ubr { background-image: url('~@/assets/decks-covers/ubr.jpg') }
.cover-ug { background-image: url('~@/assets/decks-covers/ug.jpg') }
.cover-ur { background-image: url('~@/assets/decks-covers/ur.jpg') }
.cover-urg { background-image: url('~@/assets/decks-covers/urg.jpg') }
.cover-w { background-image: url('~@/assets/decks-covers/w.jpg') }
.cover-wb { background-image: url('~@/assets/decks-covers/wb.jpg') }
.cover-wbg { background-image: url('~@/assets/decks-covers/wbg.jpg') }
.cover-wbr { background-image: url('~@/assets/decks-covers/wbr.jpg') }
.cover-wg { background-image: url('~@/assets/decks-covers/wg.jpg') }
.cover-wr { background-image: url('~@/assets/decks-covers/wr.jpg') }
.cover-wrg { background-image: url('~@/assets/decks-covers/wrg.jpg') }
.cover-wu { background-image: url('~@/assets/decks-covers/wu.jpg') }
.cover-wub { background-image: url('~@/assets/decks-covers/wub.jpg') }
.cover-wug { background-image: url('~@/assets/decks-covers/wug.jpg') }
.cover-wur { background-image: url('~@/assets/decks-covers/wur.jpg') }

.header {
  background-size: cover;
  background-position: center;
  height: 85px;
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
}
.header-b { background-image: url('~@/assets/decks-headers/b.jpg') }
.header-bg { background-image: url('~@/assets/decks-headers/bg.jpg') }
.header-br { background-image: url('~@/assets/decks-headers/br.jpg') }
.header-brg { background-image: url('~@/assets/decks-headers/brg.jpg') }
.header-c { background-image: url('~@/assets/decks-headers/c.jpg') }
.header-default { background-image: url('~@/assets/decks-headers/default.jpg') }
.header-g { background-image: url('~@/assets/decks-headers/g.jpg') }
.header-m { background-image: url('~@/assets/decks-headers/m.jpg') }
.header-r { background-image: url('~@/assets/decks-headers/r.jpg') }
.header-rg { background-image: url('~@/assets/decks-headers/rg.jpg') }
.header-u { background-image: url('~@/assets/decks-headers/u.jpg') }
.header-ub { background-image: url('~@/assets/decks-headers/ub.jpg') }
.header-ubg { background-image: url('~@/assets/decks-headers/ubg.jpg') }
.header-ubr { background-image: url('~@/assets/decks-headers/ubr.jpg') }
.header-ug { background-image: url('~@/assets/decks-headers/ug.jpg') }
.header-ur { background-image: url('~@/assets/decks-headers/ur.jpg') }
.header-urg { background-image: url('~@/assets/decks-headers/urg.jpg') }
.header-w { background-image: url('~@/assets/decks-headers/w.jpg') }
.header-wb { background-image: url('~@/assets/decks-headers/wb.jpg') }
.header-wbg { background-image: url('~@/assets/decks-headers/wbg.jpg') }
.header-wbr { background-image: url('~@/assets/decks-headers/wbr.jpg') }
.header-wg { background-image: url('~@/assets/decks-headers/wg.jpg') }
.header-wr { background-image: url('~@/assets/decks-headers/wr.jpg') }
.header-wrg { background-image: url('~@/assets/decks-headers/wrg.jpg') }
.header-wu { background-image: url('~@/assets/decks-headers/wu.jpg') }
.header-wub { background-image: url('~@/assets/decks-headers/wub.jpg') }
.header-wug { background-image: url('~@/assets/decks-headers/wug.jpg') }
.header-wur { background-image: url('~@/assets/decks-headers/wur.jpg') }

</style>