<template>
    <v-layout row>
      <v-flex hidden-sm-and-down md3 lg2 xl3>
      </v-flex>
      <v-flex           xs12 sm8 md6 lg7 xl6>
        <Deck class="deck" :cards="deckCards" :name="deckName" 
          :twoColumns="true" :userCollection="userCollection"/>
      </v-flex>
      <v-flex id="rSide" hidden-xs-only sm4 md3 lg3 xl3>
        <div class="mt-5">
          <span class='subheading'>Total deck cost:</span>
          <WildCardsCost class="mt-1" :cost="deckWCCost"/>
        </div>
        <div v-if="$isUserLogged()" class="mt-3">
          <span class='subheading'>Deck cost to build:</span>
          <WildCardsCost class="mt-1" :cost="deckWCMissingCost"/>
        </div>
        <ManaCurve class='mt-4' :manaCurve="deckManaCurve"/>
        <TypeDistribution class='mt-4' :cards="deckCards"/>
        <ColorDistribution class='mt-4' :cards="deckCards"/>
      </v-flex>
    </v-layout>
</template>

<script>
import ColorDistribution from '@/components/charts/ColorDistribution'
import Deck from '@/components/mtg/Deck'
import WildCardsCost from '@/components/mtg/WildCardsCost'
import ColorDistribution from '@/components/charts/ColorDistribution'
import TypeDistribution from '@/components/charts/TypeDistribution'
import ManaCurve from '@/components/charts/ManaCurve'

export default {
  name: 'PublicDeck',
  components: {
    Deck, SampleHand, ManaCurve, WildCardsCost, ColorDistribution, TypeDistribution
  },
  created () {
    this.requestDeck()
  },
  data () {
    return {
      deckAlias: this.$route.params.alias,
      deckCards: {},
      deckName: '',
      deckManaCurve: {},
      deckWCCost: {},
      deckWCMissingCost: {},
      isLoading: false,
      userCollection: {},
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
        if (wcCost[card.rarity] === undefined) {
          wcCost[card.rarity] = card.qtd
        } else {
          wcCost[card.rarity] += card.qtd
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
        if (missingQtd > 0) {
          if (wcMissingCost[card.rarity] === undefined) {
            wcMissingCost[card.rarity] = missingQtd
          } else {
            wcMissingCost[card.rarity] += missingQtd
          }
        }
      })
      return {
        'mythic': wcMissingCost['mythic'],
        'rare': wcMissingCost['rare'],
        'uncommon': wcMissingCost['uncommon'],
        'common': wcMissingCost['common']
      }
    },
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .deck {
    column-count: 2;
  }
  #rSide > div {
    margin: auto;
    width: fit-content;
  }
</style>
