<template>
  <v-layout class="mb-3" row wrap>
    <!-- Top -->
    <v-flex class="text-xs-left" xs12>
      <v-breadcrumbs class="breadcrumbs" :items="breadcrumbs">
        <v-icon slot="divider">chevron_right</v-icon>
      </v-breadcrumbs>
    </v-flex>
    <v-flex xs12>
      <div class="box filters">
        <v-layout class="boxContent" row nowrap>
          <QueryFilter class="filter mt-1 pl-2 pr-2" v-model="searchQuery"
            v-on:onQuery="requestDecks()" title="Name or Archetype"/>
          <v-divider class="pt-2 ml-2 mr-2 pb-2" vertical/>
          <CardsFilter class="filter mt-1 pl-2 pr-2" v-model="containsCards" ref="cardsFilter"/>
          <v-divider class="pt-2 ml-2 mr-2 pb-2" vertical/>
          <ColorFilter class="filter mt-1 pl-2 pr-2" v-model="activeColors" simple/>
          <v-divider class="pt-2 ml-2 mr-2 pb-2" vertical/>
          <FormatFilter class="filter mt-1 pl-3 pr-2" v-model="deckFormat"/>
          <v-spacer/>
          <div>
            <v-layout column>
              <v-btn class="mt-0" color="primary" flat icon @click="clearFilters()">
                <v-icon>close</v-icon>
              </v-btn>
              <v-btn class="mt-1" color="primary" flat icon @click="requestDecks()">
                <v-icon>done</v-icon>
              </v-btn>
            </v-layout>
          </div>
        </v-layout>
      </div>
    </v-flex>
    <!-- Bottom -->
    <v-flex xs12>
      <v-layout class="box mt-0" row nowrap>
        <v-layout class="boxContent" row wrap>
          <v-flex xs12>
            <v-data-table class="mt-auto elevation-1" :headers="headers" :items="currentDecks"
              :loading="isLoading" :pagination.sync="pagination" :total-items="totalItems"
              v-model="selectedDecks" item-key="id" select-all hide-actions must-sort>
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
                  {{ new Date(props.item.updated.replace('_', ':')).toLocaleString().split(' ')[0].replace(',', '') }}
                </td>
              </template>
            </v-data-table>
          </v-flex>
          <v-flex xs12 class="mt-2">
            <v-layout row nowrap>
              <v-btn v-if="selectedDecks.length > 0" color="primary" flat small
                @click="deleteConfirmationDialogVisible = true">Delete Selected Decks</v-btn>
              <v-spacer/>
              <v-pagination v-model="pagination.page" :length="totalPages" :total-visible="7"/>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-layout>
    </v-flex>
    <v-dialog v-model="deleteConfirmationDialogVisible" width="250">
      <v-card>
        <v-card-title class='subheading'>Are you Sure?</v-card-title>
        <v-card-text>
          <p class="text-md-center" v-if="isLoading">
            <v-progress-circular color="deep-orange" :indeterminate="true"/>
          </p>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn :disabled="isLoading" color="primary" flat
            @click="deleteConfirmationDialogVisible = false">No</v-btn>
          <v-btn :disabled="isLoading" color="primary" flat
            @click="onDeleteSelectedsClick()">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import CardsFilter from '@/components/filters/CardsFilter'
import ColorFilter from '@/components/filters/ColorFilter'
import FormatFilter from '@/components/filters/FormatFilter'
import QueryFilter from '@/components/filters/QueryFilter'
import ManaCurveCompact from '@/components/charts/ManaCurveCompact'
import WildcardsCost from '@/components/mtg/WildcardsCost'

export default {
  name: 'PrivateDeckList',
  components: {
    CardsFilter, ColorFilter, FormatFilter, QueryFilter, ManaCurveCompact, WildcardsCost
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
        { text: 'Last Update', align: 'center', value: 'updated' }
      ],
      isLoading: false,
      pagination: {},
      totalPages: 0,
      totalItems: 0,
      selectedDecks: [],
      currentDecks: [],
      activeColors: this.$route.query.colors !== undefined ? this.$route.query.colors : 'b,g,r,u,w',
      containsCards: this.$route.query.cards !== undefined ? this.$route.query.cards : '',
      deckFormat: this.$route.query.format !== undefined ? this.$route.query.format : 'Constructed',
      searchQuery: this.$route.query.query !== undefined ? this.$route.query.query : '',
      deleteConfirmationDialogVisible: false
    }
  },
  mounted () {
    this.pagination.page = this.$route.query.page !== undefined ? parseInt(this.$route.query.page) : 1
    this.pagination.sortBy = 'updated'
    this.pagination.descending = true
    this.pagination.rowsPerPage = 10
  },
  methods: {
    requestDecks: function () {
      this.updateRouter()
      this.selectedDecks = []
      this.isLoading = true
      const { sortBy, descending, page, rowsPerPage } = this.pagination
      this.$api.getUserDecks(page, rowsPerPage, sortBy, descending, this.deckFormat,
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
    clearFilters: function () {
      this.activeColors = 'b,g,r,u,w'
      this.deckFormat = 'Constructed'
      this.searchQuery = ''
      this.containsCards = ''
      this.requestDecks()
    },
    updateRouter: function () {
      const queryParams = {
        page: this.pagination.page,
        colors: this.activeColors,
        format: this.deckFormat
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
    },
    onDeleteSelectedsClick: function () {
      const ids = this.selectedDecks.map(deck => deck.id).join()
      this.isLoading = true
      this.$api.deleteUserDecks(ids)
        .then(res => {
          this.isLoading = false
          this.deleteConfirmationDialogVisible = false
          this.requestDecks()
        })
        .catch(error => {
          this.isLoading = false
          this.deleteConfirmationDialogVisible = false
          console.log(error)
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
  .filters {
    height: 110px;
  }
  .filter {
    width: 200px;
  }
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
