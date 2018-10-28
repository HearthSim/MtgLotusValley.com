<template>
  <v-layout row class="mb-3">
    <v-flex hidden-sm-and-down md3 lg2 xl2>
    </v-flex>
    <v-flex           xs12 sm8 md6 lg8 xl8>
      <v-layout class="mt-5">
        <v-text-field id="filterSearch" class="pl-2 pr-2" label="Search" 
          v-model="searchQuery" @keyup.native.enter="updateFilters"
          solo single-line hide-details clearable />
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
    <v-flex hidden-xs-only sm4 md3 lg2 xl2>
    </v-flex>
  </v-layout>
</template>

<script>
import ColorFilter from '@/components/filters/ColorFilter'
import ManaCurveCompact from '@/components/ManaCurveCompact'
import WildcardsCost from '@/components/mtg/WildcardsCost'
import DeckUtils from '@/scripts/deckutils'

export default {
  name: 'PublicDecks',
  components: {
    ColorFilter, ManaCurveCompact, WildcardsCost
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
      this.$router.push({
        path: 'decks',
        query: {
          page: this.pagination.page,
          colors: this.activeColors
        }
      })
      this.isLoading = true
      this.pagination.rowsPerPage = 15
      const { sortBy, descending, page, rowsPerPage } = this.pagination
      this.$api.getPublicDecks(page, rowsPerPage, sortBy, descending, this.activeColors, true)
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
