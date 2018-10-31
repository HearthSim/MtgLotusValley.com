<template>
  <v-layout row class="mb-3">
    <!-- Left -->
    <v-flex hidden-sm-and-down md3 lg2 xl2>
      <v-text-field class="mt-4 pl-3 pr-3" label="Search" 
        v-model="searchQuery" @keyup.native.enter="requestDecks()"
        solo single-line hide-details clearable />
      <ColorFilter class="mt-3 pl-2 pr-2" v-model="activeColors" simple expand/>
      <CardsFilter class="mt-3 pl-2 pr-2" v-model="containsCards" simple expand/>
      <v-divider class="mt-3 ml-4 mr-4"/>
      <v-btn id="filterApply" color="mt-3 white" @click="requestDecks()">Apply</v-btn>
    </v-flex>
    <!-- Right -->
    <v-flex          xs12 sm11 md8 lg9 xl9>
      <v-data-table class="mt-4 elevation-1" :headers="headers" :items="currentDecks"
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
          <td class="text-xs-center">
            <ManaCurveCompact class="manaCurve ml-1 mt-1" :manaCurve="props.item.manaCurve"/>
          </td>
          <td class="text-xs-right">
            <WildcardsCost class="mt-1 mr-2" :cost="props.item.wildcardCost" :small="true"/>
          </td>
          <td v-if="isUserLogged()" class="text-xs-center">
            <v-progress-circular v-if="props.item.wildcardCostToBuild === undefined"
              color="deep-orange" :size="24" :indeterminate="true"/>
            <v-tooltip bottom>
              <span v-if="props.item.owned !== undefined" slot="activator">
                {{ `${props.item.owned}%` }}
              </span>
              <div>
                <span>Missing:</span>
                <WildcardsCost v-if="props.item.wildcardCostToBuild !== undefined"
                  class="mt-1 mr-2" :cost="props.item.wildcardCostToBuild" :small="true"/>
              </div>
            </v-tooltip>
          </td>
          <td class="text-xs-center">
            {{new Date(props.item.date.replace('_', ':')).toLocaleString().split(' ')[0]}}
          </td>
        </template>
      </v-data-table>
      <v-layout row xs9 sm9            md6            lg4 class="text-xs-right mt-2 mb-3">
        <v-spacer/>
        <v-pagination v-model="pagination.page" :length="totalPages" :total-visible="7"/>
      </v-layout>
    </v-flex>
    <v-flex hidden-xs-only sm1 md1 lg1 xl1>
    </v-flex>
  </v-layout>
</template>

<script>
import CardsFilter from '@/components/filters/CardsFilter'
import ColorFilter from '@/components/filters/ColorFilter'
import ManaCurveCompact from '@/components/ManaCurveCompact'
import WildcardsCost from '@/components/mtg/WildcardsCost'
import DeckUtils from '@/scripts/deckutils'

export default {
  name: 'PublicDecks',
  components: {
    CardsFilter, ColorFilter, ManaCurveCompact, WildcardsCost
  },
  data () {
    return {
      headers: [],
      isLoading: false,
      pagination: {},
      totalPages: 0,
      totalItems: 0,
      currentDecks: [],
      activeColors: this.$route.query.colors !== undefined ? this.$route.query.colors : 'b,g,r,u,w',
      containsCards: this.$route.query.cards !== undefined ? this.$route.query.cards : '',
      searchQuery: this.$route.query.query !== undefined ? this.$route.query.query : ''
    }
  },
  mounted () {
    this.headers.push({ text: 'Colors', align: 'center', value: 'colors' })
    this.headers.push({ text: 'Name', value: 'name' })
    this.headers.push({ text: 'Archetype', value: 'arch' })
    this.headers.push({ text: 'Mana Curve', align: 'center', value: 'mana_curve', sortable: false })
    this.headers.push({ text: 'Total Cost', align: 'center', value: 'total_cost', sortable: false })
    if (this.$isUserLogged()) {
      this.headers.push({ text: 'Owned', align: 'center', value: 'total_cost', sortable: false })
    }
    this.headers.push({ text: 'Publish Date', align: 'center', value: 'date' })
    this.pagination.page = this.$route.query.page !== undefined ? parseInt(this.$route.query.page) : 1
    this.pagination.sortBy = 'date'
    this.pagination.descending = true
  },
  methods: {
    requestDecks: function () {
      this.updateRouter()
      this.isLoading = true
      this.pagination.rowsPerPage = 15
      const { sortBy, descending, page, rowsPerPage } = this.pagination
      this.$api.getPublicDecks(page, rowsPerPage, sortBy, descending,
        this.activeColors, this.searchQuery, this.containsCards, true)
        .then(res => {
          this.isLoading = false
          this.currentDecks = res.data
          const isPageFull = res.data.length === this.pagination.rowsPerPage
          this.totalPages = isPageFull ? page + 1 : page
          this.totalItems = (this.pagination.page * this.pagination.rowsPerPage) + res.data.length
          this.getUserCollection()
        })
        .catch(error => {
          this.isLoading = false
          console.log(error)
        })
    },
    getUserCollection: function () {
      this.$api.getUserCollection()
        .then(res => {
          this.isLoading = false
          const userCollection = res.data
          const decks = this.currentDecks.map(deck => {
            deck.wildcardCostToBuild = DeckUtils.getDeckWCMissingCost(userCollection,
              deck.cards, deck.sideboard)
            deck.owned = this.getOwnedPercent(deck.wildcardCost, deck.wildcardCostToBuild)
            return deck
          })
          this.currentDecks = decks
        })
    },
    getOwnedPercent: function (wcCost, wcMissing) {
      let total = 0
      Object.keys(wcCost).forEach(rarity => {
        total += wcCost[rarity]
      })
      let missing = 0
      Object.keys(wcMissing).forEach(rarity => {
        missing += wcMissing[rarity]
      })
      const missingPercent = missing / total * 100
      return (100 - missingPercent).toFixed(1)
    },
    isUserLogged: function () {
      return this.$isUserLogged()
    },
    updateRouter: function () {
      const queryParams = {
        page: this.pagination.page,
        colors: this.activeColors
      }
      if (this.containsCards !== '') {
        queryParams['cards'] = this.containsCards
      }
      if (this.searchQuery !== '') {
        queryParams['query'] = this.searchQuery
      }
      this.$router.push({
        path: 'decks',
        query: queryParams
      })
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
