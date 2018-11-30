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
            <div class="mana mt-2 ml-1">
              <img v-for="color in deckColors.split('')" :key="color"
                :src="require(`@/assets/mana/${color}.png`)"/>
            </div>
            <span class="title textNoWrap mt-2 ml-3">{{ deckName }}</span>
          </v-layout>
          <v-layout class="line ml-3" row nowrap>
            <span class='subheading mt-2'>{{ deckArch }}</span>
          </v-layout>
        </div>
        <v-layout row class="overlay">
          <v-divider class="mt-2 mb-2" vertical color="gray"/>
          <v-layout column class='manaCurve mt-2'>
            <ManaCurve :manaCurve="deckManaCurve" :height="75" :showTitle="false"/>
          </v-layout>

          <v-divider class="mt-2 mb-2 mr-05" vertical color="gray"/>
          <v-layout column>
            <v-btn flat small color="white" @click="importDeck()">Import</v-btn>
            <v-btn flat small color="white" @click="saveDeck()">Save</v-btn>
          </v-layout>
        </v-layout>
      </v-layout>
    </v-flex>
    <!-- Left -->
    <v-flex xs9>
      <div class="box mr-0">
        <v-layout class="mainContainer boxContent mt-0 ml-0 mr-0 mb-0" column nowrap>

          <v-btn flat color="primary" @click="filtersDialogVisible = true">Filters</v-btn>
          <v-layout row wrap>
            <v-tabs class="mt-2 mb-3" color="transparent">

              <v-tab class="tabColor" v-for="color in colors" :key="`tab${color.code}`">
                <v-tooltip top open-delay=500>
                  <img class="" slot="activator" :src="require(`@/assets/mana/${color.code}.png`)"/>
                  {{ color.name }}
                </v-tooltip>
              </v-tab>
              <v-tab-item v-for="color in colors" :key="`cards${color.code}`">
                <v-layout class="cardsContainer" row wrap>
                  <v-flex v-for="card in getCardList(color.code)" :key="card.mtgaid"
                    class="cardContainer pointer mt-2 ml-1 mr-1">
                    <Card :name='card.name' :imageUrl='card.imageUrl' :imageUrlTransformed='card.imageUrlTransformed'
                      :multiverseid='card.multiverseid' :qtd='userCollection[card.mtgaid]'
                      :scaleOnHover="false" :clickable="true" :clickableKey="card" @click="onLibraryCardClick"/>
                  </v-flex>
                </v-layout>
              </v-tab-item>

            </v-tabs>
          </v-layout>
        </v-layout>

      </div>
    </v-flex>
    <!-- Right -->
    <v-flex class="ml-0 mb-3" xs3>
      <div class="box">
        <v-layout class="boxContent mt-0 ml-0 mr-0 pb-2" column nowrap>
          <v-tabs class="mb-3" color="transparent" v-model="currentDeckTab">

            <WildcardsCost class="wildcardsCost mt-1 ml-1 mr-1" :cost="deckWCCost"/>

            <v-tab>Main ({{deckCardsQtd}})</v-tab>
            <v-tab-item>
              <DeckVisualPile class="deck deckContainer mt-4" :cardsPile="deckCards"
                :clickable="true" :showQtd="true" @click="onMainDeckCardClick"/>
            </v-tab-item>

            <v-tab>Sideboard ({{sideboardCardsQtd}})</v-tab>
            <v-tab-item>
              <DeckVisualPile class="deck deckContainer mt-4" :cardsPile="sideboardCards"
                :clickable="true" :showQtd="true" @click="onSideboardCardClick"/>
            </v-tab-item>

          </v-tabs>
        </v-layout>
      </div>
    </v-flex>

    <!-- Dialogs -->
    <v-dialog v-model="filtersDialogVisible" width="550">
      <v-card>
        <v-card-title class="title">Filters</v-card-title>
        <v-card-text>
          <v-layout column wrap>
            <v-layout row nowrap>
              <div>
                <v-layout column wrap>
                  <QueryFilter class="filterQuery m-auto" v-model="searchQuery"
                    v-on:onQuery="updateFilters()" title="Name or Archetype"/>
                  <RarityFilter class="filterRarity pl-2 pr-2" v-model="activeRarities"/>
                </v-layout>
              </div>
              <v-divider class="pt-2 ml-2 mr-2 pb-2" vertical/>
              <div>
                <v-layout column wrap>
                  <TypeFilter class="filterTypes pl-2 pr-2" v-model="activeTypes"/>
                  <SetFilter class="filterSets pl-2 pr-2" v-model="activeSets"/>
                </v-layout>
              </div>
            </v-layout>
            <div class="mt-3 m-auto">
              <v-switch class="mt-0 mb-0" label="Only my collection" v-model="onlyOwnedCards"/>
            </div>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="white" @click="filtersDialogVisible = false">Cancel</v-btn>
          <v-btn color="white" @click="clearFilters()">Clear</v-btn>
          <v-btn color="white" @click="updateFilters()">Apply</v-btn>
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

    <v-dialog v-model="needLoginDialogVisible" width="350">
      <v-card>
        <v-card-text class='subheading'>User not logged.</v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="primary" flat @click="needLoginDialogVisible = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-layout>
</template>

<script>
import Card from '@/components/mtg/Card'
import DeckVisualPile from '@/components/deck/DeckVisualPile'
import ManaCurve from '@/components/charts/ManaCurve'
import WildcardsCost from '@/components/mtg/WildcardsCost'
import ColorFilter from '@/components/filters/ColorFilter'
import RarityFilter from '@/components/filters/RarityFilter'
import TypeFilter from '@/components/filters/TypeFilter'
import SetFilter from '@/components/filters/SetFilter'
import QueryFilter from '@/components/filters/QueryFilter'
import DeckUtils from '@/scripts/deckutils'
import Utils from '@/scripts/utils'

export default {
  name: 'DeckBuilder',
  components: {
    Card, DeckVisualPile, ManaCurve, WildcardsCost, ColorFilter, RarityFilter, TypeFilter, SetFilter, QueryFilter, DeckUtils, Utils
  },
  created () {
    this.getCards()
  },
  data () {
    return {
      breadcrumbs: [
        {
          text: 'Home',
          href: '/'
        },
        {
          text: 'Decks',
          href: '/decks'
        },
        {
          text: 'Builder',
          href: '/builder',
          disabled: true
        }
      ],
      deckCards: [],
      deckCardsQtd: 0,
      sideboardCards: [],
      sideboardCardsQtd: 0,
      deckName: '',
      deckArch: '',
      deckColors: '',
      deckManaCurve: {},
      deckWCCost: {},
      isLoading: false,
      filtersDialogVisible: false,
      deckExportDialogVisible: false,
      needLoginDialogVisible: false,
      userCollection: {},
      bCards: [],
      gCards: [],
      rCards: [],
      uCards: [],
      wCards: [],
      mCards: [],
      cCards: [],
      activeColors: '',
      activeRarities: '',
      activeTypes: '',
      activeSets: '',
      onlyOwnedCards: '',
      searchQuery: '',
      currentDeckTab: 0
    }
  },
  computed: {
    colors: function () {
      return Utils.colors
    }
  },
  methods: {
    getCards: function () {
      this.isLoading = true
      this.$api.getCards(this.searchQuery, this.activeColors, this.activeRarities,
        this.activeTypes, this.activeSets, this.onlyOwnedCards, 1, 10000)
        .then(res => {
          const cards = res.data.data
          this.bCards = this.getCardsByColor(cards, 'B')
          this.gCards = this.getCardsByColor(cards, 'G')
          this.rCards = this.getCardsByColor(cards, 'R')
          this.uCards = this.getCardsByColor(cards, 'U')
          this.wCards = this.getCardsByColor(cards, 'W')
          this.mCards = this.getCardsByColor(cards, 'M')
          this.cCards = this.getCardsByColor(cards, 'C')
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
          this.userCollection = res.data
        })
    },
    getCardsByColor: function (cards, colorCode) {
      if (colorCode === 'C') {
        return cards.filter(card => card.colors.length === 0)
      } else if (colorCode === 'M') {
        return cards.filter(card => card.colors.length > 1)
      } else {
        return cards.filter(card => card.colors.length === 1 && card.colors.includes(colorCode))
      }
    },
    getCardList: function (colorCode) {
      if (colorCode === 'b') return this.bCards
      if (colorCode === 'g') return this.gCards
      if (colorCode === 'r') return this.rCards
      if (colorCode === 'u') return this.uCards
      if (colorCode === 'w') return this.wCards
      if (colorCode === 'c') return this.cCards
      if (colorCode === 'm') return this.mCards
    },
    onLibraryCardClick: function (card) {
      if (this.currentDeckTab === 0) {
        this.addCard(card, this.deckCards, this.deckCardsQtd)
      } else {
        this.addCard(card, this.sideboardCards, this.sideboardCardsQtd)
      }
    },
    onMainDeckCardClick: function (card) {
        this.remCard(card, this.deckCards, this.deckCardsQtd)
    },
    onSideboardCardClick: function (card) {
        this.remCard(card, this.sideboardCards, this.sideboardCardsQtd)
    },
    addCard: function (card, pile, pileQtd) {
      const cardQtd = this.userCollection[card.mtgaid]
      if (cardQtd > 0) {
        this.userCollection[card.mtgaid] -= 1
      } else {
        return
      }
      let deckCard = pile.find(c => c.mtgaid === card.mtgaid)
      if (deckCard === undefined) {
        deckCard = Object.assign({}, card)
        deckCard.qtd = 1
      } else {
        deckCard.qtd += 1
        Utils.remove(pile, deckCard)
      }
      this.$nextTick(() => {
        pile.push(deckCard)
        pileQtd = DeckUtils.getGroupCardsQtd(pile)
        DeckUtils.sortByCmc(pile)
      })
    },
    remCard: function (card, pile, pileQtd) {
      this.userCollection[card.mtgaid] += 1
      let deckCard = pile.find(c => c.mtgaid === card.mtgaid)
      if (deckCard.qtd > 1) {
        deckCard.qtd -= 1
        Utils.remove(pile, deckCard)
        this.$nextTick(() => {
          pile.push(deckCard)
          pileQtd = DeckUtils.getGroupCardsQtd(pile)
          DeckUtils.sortByCmc(pile)
        })
      } else {
        Utils.remove(pile, deckCard)
      }
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
    margin-left: 14%;
    margin-right: 14%;
  }
  .deckTitle {
    justify-content: center;
  }
  .deckInfo {
    height: 100px;
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
    max-height: 76px;
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
  .filters {
    height: 110px;
  }
  .filters button {
    width: 150px;
  }
  .filterQuery {
    max-width: 160px;
  }
  .filterColors, .filterTypes {
    max-width: 270px;
  }
  .filterSets {
    max-width: 300px;
  }
  .v-text-field {
    display: inline-block;
    max-width: 240px;
  }
  .v-input--switch {
    height: 32px;
  }
  .tabColor img {
    height: 32px;
    width: 32px;
  }
  .cardsContainer {
    max-height: 370px;
    overflow-y: auto;
    padding: 15px;
  }
  .cardContainer {
    width: 128px;
  }
  .mainContainer {
    position: relative;
  }
  .mainContainer > button {
    position: absolute;
    right: 0;
    margin-top: 12px;
    z-index: 99;
  }
  .pointer {
    cursor: cell;
  }
</style>
