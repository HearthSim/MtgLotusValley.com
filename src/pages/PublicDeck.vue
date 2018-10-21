<template>
  <v-layout row>
    <!-- Left -->
    <v-flex class="" hidden-sm-and-down    md3 lg2 xl3>

      <div :class="`mt-3 ml-3 mr-3 bp-c cover cover-${deckColors} white--text`">
        <v-layout class="mt-2 ml-2" sm12 row nowrap>
          <span class="title textNoWrap mr-2">{{ deckName }}</span>
          <v-spacer/>
          <div class="mana mr-2">
            <img v-for="color in deckColors.split('')" :key="color"
              :src="require(`@/assets/mana/${color}.png`)"/>
          </div>
        </v-layout>
        <v-layout class="mt-2 ml-2" sm12 row nowrap>
          <span class='subheading'>{{ deckArch }}</span>
        </v-layout>
      </div>

      <v-flex class="mt-4">
        <span class='subheading'>Total deck cost:</span>
        <WildcardsCost class="mt-1 mr-1" :cost="deckWCCost"/>
      </v-flex>

      <v-flex class="mt-4" v-if="$isUserLogged()">
        <span class='subheading'>Cost to build:</span>
        <WildcardsCost class="mt-1 mr-1" :cost="deckWCMissingCost"/>
      </v-flex>

      <v-divider class="mt-5 ml-3 mr-3"/>
      <v-btn class="mt-4" color="primary" flat small v-on:click="changeDeckMode()">
        {{ textMode ? 'Visual Mode' : 'Text Mode'}}
      </v-btn>
      <v-dialog class="btExport mt-1" v-model="deckExportDialogVisible" width="350">
        <v-btn flat small color="primary" v-on:click="exportDeck()" 
          slot="activator">Export to Arena</v-btn>
        <v-card>
          <v-card-text class='subheading'>Deck copied to clipboard.</v-card-text>
          <v-card-actions>
            <v-spacer/>
            <v-btn color="primary" flat @click="deckExportDialogVisible = false">OK</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-flex>
    <!-- Center -->
    <v-flex xs12 sm8 md6 lg7 xl6>
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
      <ManaCurve class='mt-4' :manaCurve="deckManaCurve"/>
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
import Utils from '@/scripts/utils'

export default {
  name: 'PublicDeck',
  components: {
    Deck, DeckVisual, SampleHand, ManaCurve, WildcardsCost, CardsColorDistribution, TypeDistribution
  },
  created () {
    this.requestDeck()
  },
  data () {
    return {
      deckAlias: this.$route.params.alias,
      deckCards: {},
      sideboardCards: {},
      deckName: '',
      deckArch: '',
      deckColors: '',
      deckManaCurve: {},
      deckWCCost: {},
      deckWCMissingCost: {},
      isLoading: false,
      textMode: true,
      userCollection: {},
      userCollectionWithoutMainDeck: {},
      deckExportDialogVisible: false
    }
  },
  methods: {
    requestDeck: function () {
      this.isLoading = true
      this.$api.getPublicDeck(this.deckAlias)
        .then(res => {
          this.isLoading = false
          this.deckCards = res.data.cards
          this.sideboardCards = res.data.sideboard
          this.deckName = res.data.name
          this.deckArch = res.data.arch
          this.deckColors = res.data.colors
          this.deckManaCurve = res.data.manaCurve
          this.deckWCCost = this.getDeckWCCost()
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
          this.deckWCMissingCost = this.getDeckWCMissingCost()
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
    getDeckWCCost: function () {
      const wcCost = {}
      Object.keys(this.deckCards).forEach(mtgaid => {
        const card = this.deckCards[mtgaid]
        if (!card.type.includes('Basic Land')) {
          if (wcCost[card.rarity] === undefined) {
            wcCost[card.rarity] = card.qtd
          } else {
            wcCost[card.rarity] += card.qtd
          }
        }
      })
      return {
        'mythic': wcCost['mythic'],
        'rare': wcCost['rare'],
        'uncommon': wcCost['uncommon'],
        'common': wcCost['common']
      }
    },
    getDeckWCMissingCost: function () {
      const wcMissingCost = {}
      Object.keys(this.deckCards).forEach(mtgaId => {
        const card = this.deckCards[mtgaId]
        const qtdOwned = this.userCollection[mtgaId] !== undefined ? this.userCollection[mtgaId] : 0
        const missingQtd = card.qtd - qtdOwned
        if (!card.type.includes('Basic Land') && missingQtd > 0) {
          if (wcMissingCost[card.rarity] === undefined) {
            wcMissingCost[card.rarity] = missingQtd
          } else {
            wcMissingCost[card.rarity] += missingQtd
          }
        }
      })
      return {
        'mythic': wcMissingCost['mythic'] !== undefined ? wcMissingCost['mythic'] : 0,
        'rare': wcMissingCost['rare'] !== undefined ? wcMissingCost['rare'] : 0,
        'uncommon': wcMissingCost['uncommon'] !== undefined ? wcMissingCost['uncommon'] : 0,
        'common': wcMissingCost['common'] !== undefined ? wcMissingCost['common'] : 0
      }
    },
    changeDeckMode: function () {
      this.textMode = !this.textMode
      this.getUserCollection()
    },
    exportDeck: function () {
      let data = ''
      const cardsByType = Utils.groupCardsByType(this.deckCards)
      Object.keys(cardsByType).forEach(type => {
        const cards = cardsByType[type]
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
