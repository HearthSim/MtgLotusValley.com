<template>
  <v-layout row class="mb-3">
    <v-flex hidden-sm-and-down md3 lg2 xl2>
    </v-flex>
    <v-flex           xs12 sm8 md6 lg8 xl8>
      <v-layout class="mt-5">
        <v-spacer/>
        <ColorFilter v-model="activeColors" simple/>
        <v-btn id="filterApply" color="white" @click="requestDecks()">Apply</v-btn>
      </v-layout>
      <v-divider class="mt-3"/>
      <v-data-table class="elevation-1" :headers="headers" :items="currentDecks"
        :loading="isLoading" :pagination.sync="pagination" :total-items="totalItems" hide-actions>
        <template slot="items" slot-scope="props">
          <td class="text-xs-center">
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
          <td class="text-xs-center">
            <ManaCurveCompact class="manaCurve mt-1" :manaCurve="props.item.manaCurve"/>
          </td>
          <td class="text-xs-center">
            {{new Date(props.item.date.replace('_', ':')).toLocaleString()}}
          </td>
        </template>
      </v-data-table>
      <v-layout row xs9 sm9            md6            lg4 class="text-xs-right mt-2 mb-3">
        <v-spacer/>
        <v-pagination v-model="pagination.page" :length="totalPages" :total-visible="7"/>
      </v-layout>
    </v-flex>
    <v-flex hidden-xs-only sm4 md3 lg2 xl2>
    </v-flex>
  </v-layout>
</template>

<script>
import ColorFilter from '@/components/filters/ColorFilter'
import ManaCurveCompact from '@/components/ManaCurveCompact'
import WildcardsCost from '@/components/mtg/WildcardsCost'

export default {
  name: 'PublicDecks',
  components: {
    ColorFilter, ManaCurveCompact, WildcardsCost
  },
  data () {
    return {
      headers: [
        { text: 'Colors', align: 'center', value: 'colors' },
        { text: 'Name', value: 'name' },
        { text: 'Archetype', value: 'arch' },
        { text: 'Total Cost', align: 'center', value: 'total_cost', sortable: false },
        { text: 'Mana Curve', align: 'center', value: 'mana_curve', sortable: false },
        { text: 'Publish Date', align: 'center', value: 'date' }
      ],
      isLoading: false,
      pagination: {},
      totalPages: 0,
      totalItems: 0,
      currentDecks: [],
      activeColors: this.$route.query.colors !== undefined ? this.$route.query.colors : 'b,g,r,u,w',
    }
  },
  mounted () {
    this.pagination.page = this.$route.query.page !== undefined ? parseInt(this.$route.query.page) : 1
    this.pagination.sortBy = 'date'
    this.pagination.descending = true
  },
  methods: {
    requestDecks: function () {
      this.$router.push({
        path: 'decks',
        query: {
          page: this.pagination.page,
          colors: this.activeColors
        }
      })
      this.isLoading = true
      this.pagination.rowsPerPage = 5
      const { sortBy, descending, page, rowsPerPage } = this.pagination
      this.$api.getPublicDecks(page, rowsPerPage, sortBy, descending, this.activeColors)
        .then(res => {
          this.isLoading = false
          this.currentDecks = res.data
          const isPageFull = res.data.length === this.pagination.rowsPerPage
          this.totalPages = isPageFull ? page + 1 : page
          this.totalItems = (this.pagination.page * this.pagination.rowsPerPage) + res.data.length
        })
        .catch(error => {
          this.isLoading = false
          console.log(error)
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
    }
  },
  watch: {
    pagination: {
      handler () {
        this.requestDecks()
      },
      deep: true
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
