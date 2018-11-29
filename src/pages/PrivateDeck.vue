<template>
  <v-layout class="mb-3" row wrap>
    <!-- Top -->
    <v-flex class="text-xs-left" xs12>
      <v-breadcrumbs class="breadcrumbs" :items="breadcrumbs">
        <v-icon slot="divider">chevron_right</v-icon>
      </v-breadcrumbs>
    </v-flex>
    <v-flex xs12>
      <v-layout row class="headerContainer mt-2 ml-2 mr-2">
        <div :class="`header header-${deckColors !== '' ? deckColors : 'default'} white--text`">
          <v-layout class="line pt-2 ml-3" row nowrap>
            <div class="mana mt-2">
              <img v-for="color in deckColors.split('')" :key="color"
                :src="require(`@/assets/mana/${color}.png`)"/>
            </div>
            <span class="title textNoWrap mt-2 ml-2">{{ deckName }}</span>
          </v-layout>
          <v-layout class="line pt-2 ml-3" row nowrap>
            <span class='subheading'>{{ deckArch }}</span>
          </v-layout>
        </div>
        <v-layout row class="overlay">
          <v-divider class="mt-2 mb-2" vertical color="gray"/>
          <v-layout column class='manaCurve mt-2'>
            <ManaCurve :manaCurve="deckManaCurve" :height="75" :showTitle="false"/>
          </v-layout>

          <v-divider class="mt-2 mb-2 mr-05" vertical color="gray"/>
          <v-layout column>
            <v-btn flat small color="white" @click="exportDeckToArena()">Export to Arena</v-btn>
            <v-btn flat small color="white" @click="exportDeckToText()">Export to Text</v-btn>
          </v-layout>
        </v-layout>
      </v-layout>
    </v-flex>
    <!-- Left -->
    <v-flex xs8>
      <div class="box mr-0">
        <v-layout class="boxContent pb-2" column nowrap>
          <v-tabs class="mt-1 ml-3 mr-3" color="transparent">

            <v-tab>Overview</v-tab>
            <v-tab-item>
              <v-layout column wrap>
                <v-layout class="mt-1" row nowrap>
                  <v-spacer/>
                  <v-layout v-if="winRateTotal !== undefined" column wrap class="mt-4">
                    <span class='subheading'>Deck WinRate</span>
                    <span class='title mt-2'>
                      {{winRateTotal.wins}}-{{winRateTotal.losses}} ({{winRateTotal.winrate}}%)
                    </span>
                  </v-layout>
                  <v-spacer/>
                  <v-flex class="mt-4">
                    <span class='subheading'>Total Cost</span>
                    <WildcardsCost class="wildcardsCost mt-1 ml-1 mr-1" :cost="deckWCCost"/>
                  </v-flex>
                  <v-spacer/>
                </v-layout>
                <Overview class='mt-4' :winrate="deckWinRate"/>
              </v-layout>
            </v-tab-item>

            <v-tab>Visual Mode</v-tab>
            <v-tab-item lazy>
              <div>
                <v-layout row class="mt-4 ml-5">
                  <span class="subheading mt-2">Main Deck - {{cardsTotal(deckCards)}} cards</span>
                </v-layout>
                <v-divider class="mt-1 ml-5 mr-5"/>
                <DeckVisual class="deck mt-3" :cards="deckCards"/>
              </div>
              <div v-if="Object.keys(sideboardCards).length > 0">
                <v-layout row class="mt-4 ml-5">
                  <span class="subheading mt-2">Sideboard - {{cardsTotal(sideboardCards)}} cards</span>
                </v-layout>
                <v-divider class="mt-1 ml-5 mr-5"/>
                <DeckVisual class="deck mt-3" :sideboard="sideboardCards"/>
              </div>
            </v-tab-item>

            <v-tab :disabled="deckUpdates.length === 0">Updates</v-tab>
            <v-tab-item>
              <Updates class='mt-3 ml-3 mr-3' :updates="deckUpdates"/>
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
                  <td class="text-xs-center">
                    {{ new Date(props.item.date.replace('_', ':')).toLocaleString().split(' ')[0].replace(',', '') }}
                  </td>
                  <td :class="`text-xs-center ${props.item.wins ? 'green--text' : 'red--text'}`">
                    {{ props.item.wins ? 'Won' : 'Lost' }}
                  </td>
                  <td class="text-xs-center">
                    <div class="mana mt-2">
                      <img v-for="color in props.item.opponentDeckColors.split('')" :key="color"
                        :src="require(`@/assets/mana/${color}.png`)"/>
                    </div>
                  </td>
                  <td class="text-xs-left">{{props.item.opponentDeckArch}}</td>
                  <td class="text-xs-left">{{props.item.opponentName}}</td>
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
        </v-layout>
      </div>
    </v-flex>
    <!-- Right -->
    <v-flex class="mb-3" xs4>
      <div class="box">
        <v-layout class="boxContent pb-2" column nowrap>
          <v-layout row class="deckActions">
            <v-flex xs6>
              <v-btn flat small color="primary" @click="editDeck()">Edit</v-btn>
            </v-flex>
            <v-divider class="mt-2 ml-2 mr-2 mb-2" vertical color="gray"/>
            <v-flex xs6>
              <v-btn flat small color="primary" @click="deleteConfirmationDialogVisible = true">Delete</v-btn>
            </v-flex>
          </v-layout>

          <DeckPresenting v-if="Object.keys(deckCards).length > 0" class="mt-2 ml-1 mr-1" :cards="deckCards"/>
          <Deck class="deck deckContainer mt-4" :cards="deckCards"
            :sideboard="sideboardCards" largeName/>
        </v-layout>
      </div>
    </v-flex>

    <!-- Dialogs -->
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
            @click="deleteDeck()">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog class="btExport" v-model="deckExportDialogVisible" width="350">
      <v-card>
        <v-card-text class='subheading'>Deck copied to clipboard.</v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="primary" flat @click="deckExportDialogVisible = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog class="btExport" v-model="deckExportDialogVisible" width="350">
      <v-card>
        <v-card-text class='subheading'>Deck copied to clipboard.</v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="primary" flat @click="deckExportDialogVisible = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-layout>

</template>

<script>
import Deck from '@/components/mtg/Deck'
import DeckPresenting from '@/components/deck/DeckPresenting'
import DeckVisual from '@/components/deck/DeckVisual'
import Overview from '@/components/deck/Overview'
import Stats from '@/components/deck/Stats'
import Updates from '@/components/deck/Updates'
import PlayTest from '@/components/deck/PlayTest'
import WildcardsCost from '@/components/mtg/WildcardsCost'
import ManaCurve from '@/components/charts/ManaCurve'
import DeckUtils from '@/scripts/deckutils'

export default {
  name: 'PrivateDeck',
  components: {
    Deck, DeckPresenting, DeckVisual, Overview, Stats, Updates, PlayTest, ManaCurve, WildcardsCost
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
          href: '/user/decks'
        }
      ],
      matchesHeaders: [
        { text: 'Date', align: 'center', value: 'date' },
        { text: 'Result', align: 'center', value: 'wins' },
        { text: 'Opponent Colors', value: 'opponentDeckColors' },
        { text: 'Opponent Archetype', value: 'opponentDeckArch' },
        { text: 'Opponent Name', value: 'opponent', sortable: false }
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
      deckUpdates: [],
      deckWinRate: {},
      winRateTotal: undefined,
      isLoading: false,
      pagination: {},
      totalPages: 1,
      deckExportDialogVisible: false,
      deleteConfirmationDialogVisible: false
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
          this.breadcrumbs.push({
            text: res.data.name,
            disabled: true
          })
          this.deckCards = res.data.cards
          this.sideboardCards = res.data.sideboard
          this.deckName = res.data.name
          this.deckArch = res.data.arch
          this.deckColors = res.data.colors
          this.deckManaCurve = res.data.manaCurve
          this.deckWCCost = DeckUtils.getDeckWCCost(this.deckCards, this.sideboardCards)
          this.deckUpdates = res.data.updates
          this.deckWinRate = res.data.winRate
          this.winRateTotal = res.data.winRate.totalWinRate
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
      this.deckExportDialogVisible = true
      DeckUtils.exportDeckToArena(this.deckCards, this.sideboardCards)
    },
    exportDeckToText: function () {
      this.deckExportDialogVisible = true
      DeckUtils.exportDeckToText(this.deckCards, this.sideboardCards)
    },
    cardsTotal: function (cards) {
      const cardsQtd = Object.keys(cards).map(mtgaId => cards[mtgaId].qtd)
      return cardsQtd.length > 0 ? cardsQtd.reduce((p, n) => p + n) : 0
    },
    editDeck: function () {
      this.$router.replace(`/user/decks/${this.deckId}/edit`)
    },
    deleteDeck: function () {
      this.isLoading = true
      this.$api.deleteUserDecks(this.deckId)
        .then(res => {
          this.isLoading = false
          this.deleteConfirmationDialogVisible = false
          this.$router.replace('/user/decks')
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
        this.requestDeckMatches()
      },
      deep: true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .line {
    height: 50%;
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
  .mana {
    white-space: nowrap;
  }
  .mana img {
    height: 20px;
    width: 20px;
  }
  .manaCurve {
    width: 164px;
  }
  .headerContainer {
    position: relative;
  }
  .overlay {
    position: absolute;
    margin-top: 0;
    top: 0;
    right: 0;
  }
  .deckActions button {
    width: 90%;
  }
</style>
