<template>
  <div>
    <v-layout row nowrap class="pt-2 pb-2">
      <v-flex sm2/>
      <v-flex sm2>
        <div id="deckTitle">
          <div id="mana" class="mt-2">
            <img v-for="color in deckColors.split('')" :key="color"
              :src="require(`@/assets/mana/${color}.png`)"/>
          </div>
          <span class='title'>{{ deckName }}</span>
          <span class='subheading'> - {{ deckArch }}</span>
        </div>
      </v-flex>
      <v-flex sm4/>
      <v-flex sm2 v-if="$isUserLogged()">
        <span class='subheading'>Cost to build:</span>
        <WildcardsCost class="mt-1" :cost="deckWCMissingCost"/>
      </v-flex>
      <v-flex sm2>
        <span class='subheading'>Total deck cost:</span>
        <WildcardsCost class="mt-1" :cost="deckWCCost"/>
      </v-flex>
    </v-layout>
    <v-divider/>
    <v-layout row>
      <v-flex hidden-sm-and-down md3 lg2 xl3>
      </v-flex>
      <v-flex           xs12 sm8 md6 lg7 xl6>
        <div>
          <DeckPreview class="deck mt-4" :cards="deckCards" :userCollection="userCollection" largeName/>
          <v-layout row class="mt-2">
            <v-spacer/>
            <v-dialog id="btExport" v-model="deckExportDialogVisible" width="250">
              <v-btn flat small color="primary" v-on:click="exportDeck()" 
                slot="activator">Export to MTGArena</v-btn>
              <v-card>
                <v-card-text class='subheading'>Deck copied to clipboard.</v-card-text>
                <v-card-actions>
                  <v-spacer/>
                  <v-btn color="primary" flat="flat" @click="deckExportDialogVisible = false">OK</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-layout>
          <SampleHand class="mt-2" :cards="deckCards"/>
        </div>
      </v-flex>
      <v-flex id="rSide" hidden-xs-only sm4 md3 lg3 xl3 class="mb-3">
        <ManaCurve class='mt-4' :manaCurve="deckManaCurve"/>
        <CardsColorDistribution class='mt-4' :cards="deckCards"/>
        <TypeDistribution class='mt-4' :cards="deckCards"/>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import DeckPreview from '@/components/mtg/DeckPreview'
import WildcardsCost from '@/components/mtg/WildcardsCost'
import CardsColorDistribution from '@/components/charts/CardsColorDistribution'
import TypeDistribution from '@/components/charts/TypeDistribution'
import ManaCurve from '@/components/charts/ManaCurve'
import SampleHand from '@/components/SampleHand'
import Utils from '@/scripts/utils'

export default {
  name: 'PublicDeck',
  components: {
    DeckPreview, SampleHand, ManaCurve, WildcardsCost, CardsColorDistribution, TypeDistribution
  },
  created () {
    this.requestDeck()
  },
  data () {
    return {
      deckAlias: this.$route.params.alias,
      deckCards: {},
      deckName: '',
      deckArch: '',
      deckColors: '',
      deckManaCurve: {},
      deckWCCost: {},
      deckWCMissingCost: {},
      isLoading: false,
      userCollection: {},
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
          console.log(error)
        })
    },
    getUserCollection: function () {
      this.isLoading = false
      this.$api.getUserCollection()
        .then(res => {
          this.isLoading = false
          this.userCollection = res.data
          this.deckWCMissingCost = this.getDeckWCMissingCost()
        })
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
    exportDeck: function () {
      let data = ''
      const cardsByType = Utils.groupCardsByType(this.deckCards)
      Object.keys(cardsByType).forEach(type => {
        const cards = cardsByType[type]
        Object.keys(cards).forEach(mtgaId => {
          const card = cards[mtgaId]
          data += `${card.qtd} ${card.name} (${card.set}) ${card.number}\n`
        })
      })
      Utils.copyStringToClipboard(data)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .deck {
    column-count: 2;
    padding-left: 3%;
    padding-right: 3%;
  }
  #deckTitle {
    min-height: 40px;
    transform: translateY(20px);
    display: inline;
  }
  #btExport {
    padding-right: 3%;
  }
  #rSide > div {
    margin: auto;
    width: fit-content;
  }
  #mana img {
    height: 20px;
    width: 20px;
  }
</style>
