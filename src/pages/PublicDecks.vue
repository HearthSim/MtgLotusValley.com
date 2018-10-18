<template>
  <v-layout row class="mb-3">
    <v-flex hidden-sm-and-down md3 lg2 xl2>
    </v-flex>
    <v-flex           xs12 sm8 md6 lg8 xl8>
      <v-divider class="mt-3"/>
      <table class="mt-3">
        <tr v-for="deck in currentDecks" :key="deck.alias">
          <td id="columnColors">
            <div id="mana" class="mt-2">
              <img v-for="color in deck.colors.split('')" :key="color"
                :src="require(`@/assets/mana/${color}.png`)"/>
            </div>
          </td>
          <td id="columnName">
            <router-link :to="`/decks/${deck.alias}`">
              {{deck.name}}
            </router-link>
          </td>
          <td id="columnArch">{{deck.arch}}</td>
          <td id="columnCost">
            <WildcardsCost class="mt-1 mr-2" :cost="deck.wildcardCost" :small="true"/>
          </td>
          <td id="columnCurve">
            <ManaCurveCompact class="manaCurve mt-1" :manaCurve="deck.manaCurve"/>
          </td>
        </tr>
      </table>
    </v-flex>
    <v-flex hidden-xs-only sm4 md3 lg2 xl2>
    </v-flex>
  </v-layout>
</template>

<script>
import ManaCurveCompact from '@/components/ManaCurveCompact'
import WildcardsCost from '@/components/mtg/WildcardsCost'

export default {
  name: 'PublicDecks',
  components: {
    ManaCurveCompact, WildcardsCost
  },
  created () {
    this.requestDecks()
  },
  data () {
    return {
      isLoading: false,
      currentPage: 1,
      currentDecks: {},
      userCollection: {}
    }
  },
  methods: {
    requestDecks: function () {
      this.isLoading = true
      this.$api.getPublicDecks()
      const pageSize = 20
      this.$api.getPublicDecks(this.currentPage, pageSize)
        .then(res => {
          this.currentDecks = res.data
          this.getUserCollection()
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
          // this.getDeckWCMissingCost()
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #mana {
    margin-left: 8px;
    margin-right: 8px;
    white-space: nowrap;
  }
  #mana img {
    height: 20px;
    width: 20px;
  }
  table {
    text-align: left;
    margin: auto;
  }
  #columnColors {
    min-width: 100px;
  }
  #columnName {
    min-width: 200px;
  }
  #columnArch {
    min-width: 100px;
  }
  #columnCost {
    min-width: 200px;
  }
  #columnCurve {
    min-width: 100px;
  }
</style>
