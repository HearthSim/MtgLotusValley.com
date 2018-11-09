<template>
  <v-layout class="mb-3" row wrap>
    <!-- Top -->
    <v-flex class="text-xs-left" xs12>
      <v-breadcrumbs class="ml-2">
        <v-icon slot="divider">chevron_right</v-icon>
        <v-breadcrumbs-item exact ripple to="/">Home</v-breadcrumbs-item>
        <v-breadcrumbs-item exact ripple to="/decks">Decks</v-breadcrumbs-item>
        <v-breadcrumbs-item exact ripple disabled>{{ deckName }}</v-breadcrumbs-item>
      </v-breadcrumbs>
    </v-flex>
    <v-flex xs12>
      <v-divider/>
    </v-flex>
    <!-- Left -->
    <v-flex class="pl-2 pr-2" hidden-sm-and-down    md3 lg2 xl3>

      <div :class="`mt-4 m-auto cover cover-${deckColors} white--text`">
        <v-layout class="mt-2 ml-2" row nowrap>
          <span class="title textNoWrap mr-2">{{ deckName }}</span>
          <v-spacer/>
          <div class="mana mr-2">
            <img v-for="color in deckColors.split('')" :key="color"
              :src="require(`@/assets/mana/${color}.png`)"/>
          </div>
        </v-layout>
        <v-layout class="mt-2 ml-2" row nowrap>
          <span class='subheading'>{{ deckArch }}</span>
        </v-layout>
      </div>

      <ManaCurve class='mt-4' :manaCurve="deckManaCurve"/>
      
      <v-flex class="mt-4" v-if="$isUserLogged()">
        <span class='subheading'>Cost to build:</span>
        <WildcardsCost class="mt-1 ml-3 mr-3" :cost="deckWCMissingCost"/>
      </v-flex>

      <v-flex class="mt-4">
        <span class='subheading'>Total deck cost:</span>
        <WildcardsCost class="mt-1 ml-3 mr-3" :cost="deckWCCost"/>
      </v-flex>

      <v-divider class="mt-4 ml-3 mr-3"/>

      <v-layout column>

        <v-dialog class="btExport mt-1" v-model="deckExportDialogVisible" width="350">
          <v-btn flat small color="primary" v-on:click="exportDeckToArena()" 
            slot="activator">Export to Arena</v-btn>
          <v-card>
            <v-card-text class='subheading'>Deck copied to clipboard.</v-card-text>
            <v-card-actions>
              <v-spacer/>
              <v-btn color="primary" flat @click="deckExportDialogVisible = false">OK</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog class="btExport mt-1" v-model="deckExportDialogVisible" width="350">
          <v-btn flat small color="primary" v-on:click="exportDeckToReading()" 
            slot="activator">Export to Reading</v-btn>
          <v-card>
            <v-card-text class='subheading'>Deck copied to clipboard.</v-card-text>
            <v-card-actions>
              <v-spacer/>
              <v-btn color="primary" flat @click="deckExportDialogVisible = false">OK</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>
    </v-flex>
    <!-- Center -->
    <v-flex class="center" xs12 sm8 md6 lg7 xl6>

      <v-tabs class="mt-3 ml-4 mr-4" color="#fafafa">

        <v-tab>Text Mode</v-tab>
        <v-tab-item>
          <div>
            <v-layout row class="mt-4 ml-5">
              <span class="subheading mt-2">Main Deck - {{cardsTotal(deckCards)}} cards</span>
            </v-layout>
            <v-divider class="mt-1 ml-5 mr-5"/>
            <Deck class="deck deckContainer mt-4" :cards="deckCards" :userCollection="userCollection" largeName/>
          </div>
          <div v-if="Object.keys(sideboardCards).length > 0">
            <v-layout row class="mt-4 ml-5">
              <span class="subheading mt-2">Sideboard - {{cardsTotal(sideboardCards)}} cards</span>
            </v-layout>
            <v-divider class="mt-1 ml-5 mr-5"/>
            <Deck class="deck deckContainer mt-4" :sideboard="sideboardCards"
              :userCollectionWithoutMainDeck="userCollectionWithoutMainDeck" largeName/>
          </div>            
        </v-tab-item>

        <v-tab>Visual Mode</v-tab>
        <v-tab-item lazy>
          <div>
            <v-layout row class="mt-4 ml-5">
              <span class="subheading mt-2">Main Deck - {{cardsTotal(deckCards)}} cards</span>
            </v-layout>
            <v-divider class="mt-1 ml-5 mr-5"/>
            <DeckVisual class="deck mt-3" :cards="deckCards" :userCollection="userCollection"/>
          </div>
          <div v-if="Object.keys(sideboardCards).length > 0">
            <v-layout row class="mt-4 ml-5">
              <span class="subheading mt-2">Sideboard - {{cardsTotal(sideboardCards)}} cards</span>
            </v-layout>
            <v-divider class="mt-1 ml-5 mr-5"/>
            <DeckVisual class="deck mt-3" :sideboard="sideboardCards"
              :userCollectionWithoutMainDeck="userCollectionWithoutMainDeck"/>
          </div>
        </v-tab-item>

        <v-tab>Play Test</v-tab>
        <v-tab-item>
          <PlayTest class="mt-3" :cards="deckCards"/>
        </v-tab-item>
      </v-tabs>

    </v-flex>
    <!-- Right -->
    <v-flex class="rSide mb-3" hidden-xs-only sm4 md3 lg3 xl3>
      <CardsColorDistribution class='mt-4' :cards="deckCards"/>
      <TypeDistribution class='mt-4' :cards="deckCards"/>
    </v-flex>
  </v-layout>
</template>

<script>
import Deck from '@/components/mtg/Deck'
import DeckVisual from '@/components/mtg/DeckVisual'
import WildcardsCost from '@/components/mtg/WildcardsCost'
import CardsColorDistribution from '@/components/charts/CardsColorDistribution'
import TypeDistribution from '@/components/charts/TypeDistribution'
import ManaCurve from '@/components/charts/ManaCurve'
import PlayTest from '@/components/PlayTest'
import DeckUtils from '@/scripts/deckutils'

export default {
  name: 'PublicDeck',
  components: {
    Deck, DeckVisual, PlayTest, ManaCurve, WildcardsCost, CardsColorDistribution, TypeDistribution
  },
  created () {
    this.requestDeck()
  },
  data () {
    return {
      deckAlias: this.$route.params.alias,
      deckLoader: this.$route.query.loader,
      deckCards: {},
      sideboardCards: {},
      deckName: '',
      deckArch: '',
      deckColors: '',
      deckManaCurve: {},
      deckWCCost: {},
      deckWCMissingCost: {},
      isLoading: false,
      userCollection: {},
      userCollectionWithoutMainDeck: {},
      deckExportDialogVisible: false
    }
  },
  methods: {
    requestDeck: function () {
      this.isLoading = true
      if (this.deckLoader) {
        this.getDeckByCards()
      } else {
        this.getDeckByAlias()
      }
    },
    getDeckByAlias: function () {
      this.$api.getPublicDeck(this.deckAlias)
        .then(res => {
          this.isLoading = false
          this.deckCards = res.data.cards
          this.sideboardCards = res.data.sideboard
          this.deckName = res.data.name
          this.deckArch = res.data.arch
          this.deckColors = res.data.colors
          this.deckManaCurve = res.data.manaCurve
          this.deckWCCost = DeckUtils.getDeckWCCost(this.deckCards, this.sideboardCards)
          if (this.$isUserLogged()) {
            this.getUserCollection()
          }
        })
        .catch(error => {
          this.isLoading = false
          console.log(error)
        })
    },
    getDeckByCards: function () {
      const cardsInfo = this.deckAlias.split('_')
      this.$api.convertCardsToObjects(cardsInfo[0], cardsInfo[1])
        .then(res => {
          this.isLoading = false
          this.deckCards = res.data.cards
          this.sideboardCards = res.data.sideboard
          this.deckName = ''
          this.deckArch = ''
          this.deckColors = res.data.colors
          this.deckManaCurve = res.data.manaCurve
          this.deckWCCost = DeckUtils.getDeckWCCost(this.deckCards, this.sideboardCards)
          if (this.$isUserLogged()) {
            this.getUserCollection()
          }
        })
        .catch(error => {
          this.isLoading = false
          console.log(error)
        })
    },
    getUserCollection: function () {
      this.isLoading = false
      this.$api.getUserCollection()
        .then(res => {
          this.isLoading = false
          this.userCollection = res.data
          this.userCollectionWithoutMainDeck = this.getUserCollectionWithoudMainDeck()
          this.deckWCMissingCost = DeckUtils.getDeckWCMissingCost(this.userCollection,
            this.deckCards, this.sideboardCards)
        })
        .catch(error => {
          this.isLoading = false
          console.log(error)
        })
    },
    getUserCollectionWithoudMainDeck: function () {
      const data = {}
      Object.assign(data, this.userCollection)
      Object.keys(this.deckCards).forEach(mtgaId => {
        const card = this.deckCards[mtgaId]
        const owned = data[mtgaId] !== undefined ? data[mtgaId] : 0
        const qtdWithoutMainDeck = owned - card.qtd
        data[mtgaId] = qtdWithoutMainDeck > 0 ? qtdWithoutMainDeck : 0
      })
      return data
    },
    exportDeckToArena: function () {
      DeckUtils.exportDeckToArena(this.deckCards, this.sideboardCards)
    },
    exportDeckToReading: function () {
      DeckUtils.exportDeckToReading(this.deckCards, this.sideboardCards)
    },
    cardsTotal: function (cards) {
      const cardsQtd = Object.keys(cards).map(mtgaId => cards[mtgaId].qtd)
      return cardsQtd.length > 0 ? cardsQtd.reduce((p, n) => p + n) : 0
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  @media (min-width: 768px) {
    .deckContainer {
      column-count: 2;
    }
  }
  .center .v-divider {
    width: 200px;
  }
  .deck {
    padding-left: 3%;
    padding-right: 3%;
  }
  .deckTitle {
    justify-content: center;
  }
  .btExport {
    padding-right: 3%;
  }
  .rSide > div {
    margin: auto;
    width: fit-content;
  }
  .mana {
    white-space: nowrap;
  }
  .mana img {
    height: 20px;
    width: 20px;
  }
</style>
