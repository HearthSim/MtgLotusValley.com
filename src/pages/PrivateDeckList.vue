<template>
  <v-layout class="mb-3" row wrap>
    <!-- Top -->
    <v-flex class="text-xs-left" xs12>
      <v-breadcrumbs class="breadcrumbs" :items="breadcrumbs">
        <v-icon slot="divider">chevron_right</v-icon>
      </v-breadcrumbs>
    </v-flex>
    <v-flex xs12>
      <v-divider/>
    </v-flex>
    <!-- Left -->
    <v-flex hidden-sm-and-down md3 lg2 xl2>
      <v-text-field class="mt-3 pl-3 pr-3" label="Search"
        v-model="searchQuery" @keyup.native.enter="requestDecks()"
        solo single-line hide-details clearable />
      <ColorFilter class="mt-3 pl-2 pr-2" v-model="activeColors" simple expand/>
      <CardsFilter class="mt-3 pl-2 pr-2" v-model="containsCards" simple expand/>
      <v-divider class="mt-3 ml-4 mr-4"/>
      <v-btn id="filterApply" color="mt-3 white" @click="requestDecks()">Apply</v-btn>
    </v-flex>
    <!-- Right -->
    <v-flex          xs12 sm11 md8 lg9 xl9>
      <v-data-table class="mt-3 elevation-1" :headers="headers" :items="currentDecks"
        :loading="isLoading" :pagination.sync="pagination" :total-items="totalItems"
        v-model="selectedDecks" item-key="id" select-all hide-actions>
        <template slot="items" slot-scope="props">
          <td class="text-xs-center" width="80">
            <v-checkbox v-model="props.selected" primary hide-details/>
          </td>
          <td class="text-xs-center" width="150">
            <div id="mana" class="mt-2">
              <img v-for="color in props.item.colors.split('')" :key="color"
                :src="require(`@/assets/mana/${color}.png`)"/>
            </div>
          </td>
          <td class="text-xs-left">
            <router-link :to="`/user/decks/${props.item.id}`">
              {{props.item.name}}
            </router-link>
          </td>
          <td class="text-xs-left">{{props.item.arch}}</td>
          <td class="text-xs-center">
            <ManaCurveCompact class="manaCurve ml-1 mt-1" :manaCurve="props.item.manaCurve"/>
          </td>
          <td class="text-xs-right" width="200">
            <WildcardsCost class="mt-1" :cost="props.item.wildcardCost" :small="true"/>
          </td>
          <td class="text-xs-center">
            {{ new Date(props.item.date.replace('_', ':')).toLocaleString().split(' ')[0].replace(',', '') }}
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
import ManaCurveCompact from '@/components/charts/ManaCurveCompact'
import WildcardsCost from '@/components/mtg/WildcardsCost'

export default {
  name: 'PrivateDeckList',
  components: {
    CardsFilter, ColorFilter, ManaCurveCompact, WildcardsCost
  },
  data () {
    return {
      breadcrumbs: [
        {
          text: 'Home',
          href: '/'
        },
        {
          text: 'User',
          href: '/user'
        },
        {
          text: 'Decks',
          disabled: true
        }
      ],
      headers: [
        { text: 'Colors', align: 'center', value: 'colors' },
        { text: 'Name', value: 'name' },
        { text: 'Archetype', value: 'arch' },
        { text: 'Mana Curve', align: 'center', value: 'mana_curve', sortable: false },
        { text: 'Total Cost', align: 'center', value: 'total_cost', sortable: false },
        { text: 'Last Update', align: 'center', value: 'date' }
      ],
      isLoading: false,
      pagination: {},
      totalPages: 0,
      totalItems: 0,
      selectedDecks: [],
      currentDecks: [],
      activeColors: this.$route.query.colors !== undefined ? this.$route.query.colors : 'b,g,r,u,w',
      containsCards: this.$route.query.cards !== undefined ? this.$route.query.cards : '',
      searchQuery: this.$route.query.query !== undefined ? this.$route.query.query : ''
    }
  },
  mounted () {
    this.pagination.page = this.$route.query.page !== undefined ? parseInt(this.$route.query.page) : 1
    this.pagination.sortBy = 'name'
    this.pagination.descending = true
  },
  methods: {
    requestDecks: function () {
      this.updateRouter()
      this.isLoading = true
      this.pagination.rowsPerPage = 10
      const { sortBy, descending, page, rowsPerPage } = this.pagination
      this.$api.getUserDecks(page, rowsPerPage, sortBy, descending,
        this.activeColors, this.searchQuery, this.containsCards, true)
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
  .wildcards {
    justify-content: space-between;
  }
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
