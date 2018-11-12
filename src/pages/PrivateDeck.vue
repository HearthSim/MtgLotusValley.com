<template>
  <v-layout class="mb-3" row wrap>
    <!-- Top -->
    <v-flex class="text-xs-left" xs12>
      <v-breadcrumbs class="ml-2">
        <v-icon slot="divider">chevron_right</v-icon>
        <v-breadcrumbs-item exact ripple to="/">Home</v-breadcrumbs-item>
        <v-breadcrumbs-item exact ripple to="/user">User</v-breadcrumbs-item>
        <v-breadcrumbs-item exact ripple to="/user/decks">Decks</v-breadcrumbs-item>
        <v-breadcrumbs-item exact ripple disabled>{{ deckName }}</v-breadcrumbs-item>
      </v-breadcrumbs>
    </v-flex>
    <v-flex xs12>
      <v-divider/>
    </v-flex>
    <!-- Left -->
    <v-flex hidden-sm-and-down    md3 lg2 xl3>

      <div class="pl-2 pr-2">
        <div :class="`mt-4 m-auto cover cover-${deckColors} white--text`">
          <v-layout class="mt-2 ml-2" row nowrap>
            <span class="title textNoWrap mr-2">{{ deckName }}</span>
            <v-spacer/>
            <div class="mana mr-2">
              <img v-for="color in deckColors.split('')" :key="color"
                :src="require(`@/assets/mana/${color}.png`)"/>
            </div>
          </v-layout>
          <v-layout class="mt-2 ml-2" row nowrap>
            <span class='subheading'>{{ deckArch }}</span>
          </v-layout>
        </div>
      </div>

      <ManaCurve class="mt-3" :manaCurve="deckManaCurve"/>
      
      <v-flex class="mt-4">
        <span class='subheading'>Total Cost</span>
        <WildcardsCost class="mt-1 ml-3 mr-3" :cost="deckWCCost"/>
      </v-flex>

      <v-divider class="mt-4 ml-3 mr-3"/>

      <v-layout column>
        <v-dialog class="btExport mt-1" v-model="deckExportDialogVisible" width="350">
          <v-btn flat small color="primary" v-on:click="exportDeckToArena()" 
            slot="activator">Export to Arena</v-btn>
          <v-card>
            <v-card-text class='subheading'>Deck copied to clipboard.</v-card-text>
            <v-card-actions>
              <v-spacer/>
              <v-btn color="primary" flat @click="deckExportDialogVisible = false">OK</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog class="btExport mt-1" v-model="deckExportDialogVisible" width="350">
          <v-btn flat small color="primary" v-on:click="exportDeckToReading()" 
            slot="activator">Export to Reading</v-btn>
          <v-card>
            <v-card-text class='subheading'>Deck copied to clipboard.</v-card-text>
            <v-card-actions>
              <v-spacer/>
              <v-btn color="primary" flat @click="deckExportDialogVisible = false">OK</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>
    </v-flex>
    <!-- Center -->
    <v-flex class="center" xs12 sm8 md6 lg7 xl6>
      <v-tabs class="mt-3 ml-3 mr-3" color="#fafafa">

        <v-tab>Overview</v-tab>
        <v-tab-item>
        </v-tab-item>

        <v-tab>Stats</v-tab>
        <v-tab-item>
          <Stats class='mt-3' :cards="deckCards"/>
        </v-tab-item>

        <v-tab>Matches</v-tab>
        <v-tab-item lazy>
          <v-data-table class="elevation-1 mt-2" :headers="matchesHeaders" :items="deckMatches" hide-actions
            :loading="isLoading" :pagination.sync="pagination" :total-items="deckMatches.length">
            <template slot="items" slot-scope="props">
              <td :class="`text-xs-center ${props.item.wins ? 'green--text' : 'red--text'}`">
                {{ props.item.wins ? 'Won' : 'Lost' }}
              </td>
              <td class="text-xs-left">{{props.item.opponentName}}</td>
              <td class="text-xs-center" width="150">
                <div id="mana" class="mt-2">
                  <img v-for="color in props.item.opponentDeckColors.split('')" :key="color"
                    :src="require(`@/assets/mana/${color}.png`)"/>
                </div>
              </td>
              <td class="text-xs-left">{{props.item.opponentDeckArch}}</td>
              <td class="text-xs-center">
                {{ new Date(props.item.date.replace('_', ':')).toLocaleString().split(' ')[0].replace(',', '') }}
              </td>
            </template>
          </v-data-table>
          <v-layout row xs12 class="mt-2 mb-2">
            <v-spacer/>
            <v-pagination v-model="pagination.page" :length="totalPages" :total-visible="5"/>
          </v-layout>
        </v-tab-item>

        <v-tab>Play Test</v-tab>
        <v-tab-item>
          <PlayTest class="mt-3" :cards="deckCards"/>
        </v-tab-item>
      </v-tabs>
    </v-flex>
    <!-- Right -->
    <v-flex class="rSide mb-3" hidden-xs-only sm4 md3 lg3 xl3>
      <Deck class="deck deckContainer mt-4" :cards="deckCards"
        :sideboard="sideboardCards" largeName/>
    </v-flex>
  </v-layout>
</template>

<script>
import Deck from '@/components/mtg/Deck'
import Stats from '@/components/deck/Stats'
import PlayTest from '@/components/deck/PlayTest'
import WildcardsCost from '@/components/mtg/WildcardsCost'
import ManaCurve from '@/components/charts/ManaCurve'
import DeckUtils from '@/scripts/deckutils'

export default {
  name: 'PrivateDeck',
  components: {
    Deck, Stats, PlayTest, ManaCurve, WildcardsCost
  },
  data () {
    return {
      matchesHeaders: [
        { text: 'Result', align: 'center', value: 'wins' },
        { text: 'Opponent', value: 'opponent', sortable: false },
        { text: 'Opponent Colors', value: 'opponentDeckColors' },
        { text: 'Opponent Archetype', value: 'opponentDeckArch' },
        { text: 'Date', align: 'center', value: 'date' }
      ],
      deckId: this.$route.params.id,
      deckCards: {},
      sideboardCards: {},
      deckName: '',
      deckArch: '',
      deckColors: '',
      deckManaCurve: {},
      deckWCCost: {},
      deckMatches: [],
      isLoading: false,
      pagination: {},
      totalPages: 1,
      deckExportDialogVisible: false
    }
  },
  mounted () {
    this.pagination.page = this.$route.query.page !== undefined ? parseInt(this.$route.query.page) : 1
    this.pagination.sortBy = 'date'
    this.pagination.descending = true
    this.requestDeck()
    this.requestDeckMatches()
  },
  methods: {
    requestDeck: function () {
      this.isLoading = true
      this.$api.getUserDeck(this.deckId)
        .then(res => {
          this.isLoading = false
          this.deckCards = res.data.cards
          this.sideboardCards = res.data.sideboard
          this.deckName = res.data.name
          this.deckArch = res.data.arch
          this.deckColors = res.data.colors
          this.deckManaCurve = res.data.manaCurve
          this.deckWCCost = DeckUtils.getDeckWCCost(this.deckCards, this.sideboardCards)
        })
        .catch(error => {
          this.isLoading = false
          console.log(error)
        })
    },
    requestDeckMatches: function () {
      this.isLoading = true
      this.pagination.rowsPerPage = 10
      const { sortBy, descending, page, rowsPerPage } = this.pagination
      this.$api.getUserDeckMatches(this.deckId, page, rowsPerPage, sortBy, descending)
        .then(res => {
          this.isLoading = false
          this.totalPages = res.data.length < rowsPerPage ? page : page + 1
          this.deckMatches = res.data
        })
        .catch(error => {
          this.isLoading = false
          console.log(error)
        })
    },
    exportDeckToArena: function () {
      DeckUtils.exportDeckToArena(this.deckCards, this.sideboardCards)
    },
    exportDeckToReading: function () {
      DeckUtils.exportDeckToReading(this.deckCards, this.sideboardCards)
    }
  },
  watch: {
    pagination: {
      handler () {
        this.requestDeckMatches()
      },
      deep: true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .center .v-divider {
    width: 150px;
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
