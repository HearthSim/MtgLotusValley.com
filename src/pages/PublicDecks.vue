<template>
  <v-layout row class="mb-3">
    <v-flex hidden-sm-and-down md3 lg2 xl2>
    </v-flex>
    <v-flex           xs12 sm8 md6 lg8 xl8>
      <v-divider class="mt-3"/>
      <v-data-table :headers="headers" :items="currentDecks" hide-actions class="elevation-1">
        <template slot="items" slot-scope="props">
          <td>
            <div id="mana" class="mt-2">
              <img v-for="color in props.item.colors.split('')" :key="color"
                :src="require(`@/assets/mana/${color}.png`)"/>
            </div>
          </td>
          <td class="text-xs-left">
            <router-link :to="`/decks/${props.item.alias}`">
              {{props.item.name}}
            </router-link>
          </td>
          <td class="text-xs-left">{{props.item.arch}}</td>
          <td class="text-xs-right">
            <WildcardsCost class="mt-1 mr-2" :cost="props.item.wildcardCost" :small="true"/>
          </td>
          <td class="text-xs-right">
            <ManaCurveCompact class="manaCurve mt-1" :manaCurve="props.item.manaCurve"/>
          </td>
        </template>
      </v-data-table>
      <v-layout row xs9 sm9            md6            lg4 class="text-xs-right mt-2 mb-3">
        <v-spacer/>
        <v-pagination v-model="currentPage" @input="goToPage" 
          :length="totalPages" :total-visible="7"/>
      </v-layout>
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
      headers: [
        { text: 'Colors', align: 'center', value: 'colors' },
        { text: 'Name', value: 'name' },
        { text: 'Archetype', value: 'arch' },
        { text: 'Total Cost', align: 'center', value: 'total_cost', sortable: false },
        { text: 'Mana Curve', align: 'center', value: 'mana_curve', sortable: false }
      ],
      isLoading: false,
      currentPage: 1,
      totalPages: 0,
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
          this.currentDecks = res.data.data
          this.totalPages = res.data.totalPages
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
