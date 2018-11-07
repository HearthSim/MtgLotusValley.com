<template>
  <v-layout class="mb-3" row wrap>
    <!-- Top -->
    <v-flex class="text-xs-left" xs12>
      <v-breadcrumbs class="ml-2">
        <v-icon slot="divider">chevron_right</v-icon>
        <v-breadcrumbs-item exact ripple to="/">Home</v-breadcrumbs-item>
        <v-breadcrumbs-item exact ripple to="/user">User</v-breadcrumbs-item>
        <v-breadcrumbs-item exact ripple to="/user/decks">Decks</v-breadcrumbs-item>
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
      
      <v-flex class="mt-4">
        <span class='subheading'>Total deck cost:</span>
        <WildcardsCost class="mt-1 ml-3 mr-3" :cost="deckWCCost"/>
      </v-flex>

      <v-divider class="mt-4 ml-3 mr-3"/>

      <v-layout column>
        <v-btn class="mt-4" color="primary" flat small v-on:click="changeDeckMode()">
          {{ textMode ? 'Visual Mode' : 'Text Mode'}}
        </v-btn>

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
      <div>
        <v-layout row class="mt-4 ml-5">
          <span class="subheading mt-2">Main Deck</span>
        </v-layout>
        <v-divider class="mt-1 ml-5 mr-5"/>
        <Deck v-if="textMode" class="deck deckContainer mt-4" :cards="deckCards"
          :userCollection="userCollection" largeName/>
        <DeckVisual v-if="!textMode" class="deck mt-3" :cards="deckCards"
          :userCollection="userCollection"/>
      </div>

      <div v-if="Object.keys(sideboardCards).length > 0">
        <v-layout row class="mt-4 ml-5">
          <span class="subheading mt-2">Sideboard</span>
        </v-layout>
        <v-divider class="mt-1 ml-5 mr-5"/>
        <Deck v-if="textMode" class="deck deckContainer mt-4" :sideboard="sideboardCards"
          :userCollectionWithoutMainDeck="userCollectionWithoutMainDeck" largeName/>
        <DeckVisual v-if="!textMode" class="deck mt-3" :sideboard="sideboardCards"
          :userCollectionWithoutMainDeck="userCollectionWithoutMainDeck"/>
      </div>
        
      <v-layout row class="mt-4 ml-5">
        <span class="subheading mt-2">Sample Hand</span>
      </v-layout>
      <v-divider class="mt-1 ml-5 mr-5"/>
      <SampleHand class="mt-3" :cards="deckCards"/>
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
import SampleHand from '@/components/SampleHand'
import DeckUtils from '@/scripts/deckutils'
import Utils from '@/scripts/utils'

export default {
  name: 'PrivateDeck',
  components: {
    Deck, DeckVisual, SampleHand, ManaCurve, WildcardsCost, CardsColorDistribution, TypeDistribution
  },
  created () {
    this.requestDeck()
  },
  data () {
    return {
      deckId: this.$route.params.id,
      deckCards: {},
      sideboardCards: {},
      deckName: '',
      deckArch: '',
      deckColors: '',
      deckManaCurve: {},
      deckWCCost: {},
      isLoading: false,
      textMode: true,
      deckExportDialogVisible: false
    }
  },
  methods: {
    requestDeck: function () {
      this.isLoading = true
      this.$api.getPrivateDeck(this.deckId)
        .then(res => {
          this.isLoading = false
          this.deckCards = res.data.cards
          this.sideboardCards = res.data.sideboard
          this.deckName = res.data.name
          this.deckArch = res.data.arch
          this.deckColors = res.data.colors
          this.deckManaCurve = res.data.manaCurve
          this.deckWCCost = DeckUtils.getDeckWCCost(this.deckCards, this.sideboardCards)
        })
        .catch(error => {
          this.isLoading = false
          console.log(error)
        })
    },
    changeDeckMode: function () {
      this.textMode = !this.textMode
    },
    exportDeckToArena: function () {
      let data = ''
      const cardsByType = DeckUtils.groupCardsByType(this.deckCards)
      cardsByType['Sideboard'] = this.sideboardCards
      Object.keys(cardsByType).forEach(type => {
        const cards = cardsByType[type]
        if (type === 'Sideboard' && Object.keys(cards).length > 0) {
          data += '\n'
        }
        Object.keys(cards).forEach(mtgaId => {
          const card = cards[mtgaId]
          let set = card.set
          let number = card.number
          if (number === 'GR5' || number === 'GR8') {
            set = 'GRN'
          }
          if (number === 'GR6') {
            set = 'DAR'
          }
          if (number.endsWith('a')) {
            number = number.replace('a', '')
          }
          data += `${card.qtd} ${card.name} (${set}) ${number}\n`
        })
      })
      Utils.copyStringToClipboard(data)
    },
    exportDeckToReading: function () {
      let data = ''
      const cardsByType = DeckUtils.groupCardsByType(this.deckCards)
      cardsByType['Sideboard'] = this.sideboardCards
      Object.keys(cardsByType).forEach(type => {
        const cards = cardsByType[type]
        if (Object.keys(cards).length > 0) {
          const qtd = Object.keys(cards).map(mtgaId => cards[mtgaId].qtd).reduce((p, n) => p + n)
          data += `\n${type} (${qtd})\n`
          Object.keys(cards).forEach(mtgaId => {
            const card = cards[mtgaId]
            data += `${card.qtd} ${card.name}\n`
          })
        }
      })
      Utils.copyStringToClipboard(data)
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
    width: 150px;
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
