<template>
  <v-layout class="mb-3" row wrap>
    <!-- Top -->
    <v-flex class="text-xs-left" xs12>
      <v-breadcrumbs class="breadcrumbs" :items="breadcrumbs">
        <v-icon slot="divider">chevron_right</v-icon>
      </v-breadcrumbs>
    </v-flex>
    <v-flex xs12>
      <v-layout row class="headerContainer mt-2_5 ml-2_5 mr-2_5">
        <div :class="`header header-${deckColors !== '' ? deckColors : 'default'} white--text`">
          <v-layout class="line pt-2 ml-3" row nowrap>
            <div class="mana mt-2 ml-1">
              <img class="mr-1" v-for="color in deckColors.split('')" :key="color"
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
            <ManaCurve :manaCurve="deckManaCurve" :height="75" :width="150" :showTitle="false"/>
          </v-layout>

          <v-divider class="mt-2 mb-2 mr-05" vertical color="gray"/>
          <v-layout column>
            <v-btn flat small color="white" @click="deckImportDialogVisible = true">Import</v-btn>
            <v-btn flat small color="white" @click="deckNameDialogVisible = true">Save</v-btn>
          </v-layout>
        </v-layout>
      </v-layout>
    </v-flex>
    <!-- Left -->
    <v-flex xs9>
      <div class="box mr-0">
        <v-layout class="mainContainer boxContent mt-0 ml-0 mr-0 mb-0" column nowrap>

          <v-layout row nowrap class="filtersButtons">
            <v-switch class="mt-2 mr-3" label="Only my collection" v-model="onlyOwnedCards" @change="getCards()"/>
            <v-btn flat color="primary" @click="filtersDialogVisible = true">Filters</v-btn>
          </v-layout>

          <v-layout row wrap>
            <v-tabs class="width100 mt-2 mb-3" color="transparent">

              <v-tab class="tabColor" v-for="color in colors" :key="`tab${color.code}`">
                <v-tooltip top open-delay=500>
                  <img class="" slot="activator" :src="require(`@/assets/mana/${color.code}.png`)"/>
                  {{ color.name }}
                </v-tooltip>
              </v-tab>
              <v-tab-item v-for="color in colors" :key="`cards${color.code}`">
                <v-layout class="cardsContainer" column>
                  <v-progress-circular v-if="isCardsLoading" class="mt-4 m-auto" color="deep-orange" :indeterminate="true"/>
                  <v-layout v-if="!isCardsLoading" row wrap>
                    <v-flex v-for="card in getCardList(color.code)" :key="card.mtgaid"
                      class="cardContainer pointer mt-2 ml-1 mr-1">
                      <Card :name='card.name' :imageUrl='card.imageUrl' :imageUrlTransformed='card.imageUrlTransformed'
                        :multiverseid='card.multiverseid' :qtd='getUserCardQtd(card.mtgaid)'
                        :scaleOnHover="false" :clickable="true" :clickableKey="card" @click="onLibraryCardClick"/>
                    </v-flex>
                  </v-layout>
                </v-layout>
              </v-tab-item>

            </v-tabs>
          </v-layout>
        </v-layout>

      </div>
    </v-flex>
    <!-- Right -->
    <v-flex class="ml-0" xs3>
      <div class="box currentDeck">
        <v-layout class="boxContent mt-0 ml-0 mr-0 pb-2" column nowrap>

          <WildcardsCost class="wildcardsCost mt-3 m-auto" :cost="deckWCCost"/>

          <v-tabs class="mt-1 ml-2 mr-2 mb-3" color="transparent" v-model="currentDeckTab">

            <v-tab>Main ({{deckCardsQtd}})</v-tab>
            <v-tab-item>
              <DeckVisualPile class="deck deckContainer mt-3" :cardsPile="deckCards"
                :clickable="true" :showQtd="true" @click="onMainDeckCardClick"/>
            </v-tab-item>

            <v-tab>Sideboard ({{sideboardCardsQtd}})</v-tab>
            <v-tab-item>
              <DeckVisualPile class="deck deckContainer mt-3" :cardsPile="sideboardCards"
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

    <v-dialog v-model="deckImportDialogVisible" max-width="350">
      <v-card>
        <v-card-title class="headline">Deck Import</v-card-title>
        <v-textarea class="ml-1 mr-1" no-resize rows="15"
          v-model="importDeckText" :placeholder="importDeckHint"/>
        <p class="text-md-center red--text darken-1" v-if="showError">{{ errorMsg }}</p>
        <p class="text-md-center" v-if="isLoading">
          <v-progress-circular color="deep-orange" :indeterminate="true"/>
        </p>
        <v-divider/>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="green darken-1" flat @click.native="importDeck()">Import</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="deckNameDialogVisible" max-width="350">
      <v-card>
        <v-card-title class="headline">Deck Name</v-card-title>
        <v-card-text>
          <v-text-field class="ml-4 mr-4" v-model="deckName" @keyup.native.enter="saveDeck()"/>
          <p class="text-md-center red--text darken-1" v-if="showError">{{ errorMsg }}</p>
          <p class="text-md-center" v-if="isLoading">
            <v-progress-circular color="deep-orange" :indeterminate="true"/>
          </p>
          <v-divider/>
        </v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="green darken-1" :disabled="isLoading" flat
            @click.native="saveDeck()">Save</v-btn>
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
      deckArch: '',
      deckName: '',
      deckColors: '',
      deckManaCurve: {},
      deckWCCost: {
        'common': 0,
        'uncommon': 0,
        'rare': 0,
        'mythic': 0
      },
      importDeckText: '',
      importDeckHint: 'Creature (14)\n4 Arclight Phoenix\n3 Crackling Drake\n4 Enigma Drake\n3 Goblin Electromancer\nSorcery (12)\n1 Beacon Bolt\n4 Chart a Course\n1 Lava Coil\n2 Maximize Velocity\n4 Tormenting Voice\nInstant (13)\n1 Dive Down\n4 Opt\n4 Radical Idea\n4 Shock\nLand (21)\n7 Island\n6 Mountain\n4 Steam Vents\n4 Sulfur Falls',
      errorMsg: '',
      showError: false,
      isLoading: false,
      isCardsLoading: false,
      filtersDialogVisible: false,
      deckImportDialogVisible: false,
      needLoginDialogVisible: false,
      deckNameDialogVisible: false,
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
      onlyOwnedCards: false,
      searchQuery: '',
      currentDeckTab: 0,
      cardFields: 'name,mtgaid,multiverseid,cmc,colors,type,rarity,imageUrl,imageUrlTransformed'
    }
  },
  computed: {
    colors: function () {
      return Utils.colors
    }
  },
  methods: {
    getCards: function () {
      this.isCardsLoading = true
      this.$api.getCards(this.searchQuery, this.activeColors, this.activeRarities,
        this.activeTypes, this.activeSets, this.onlyOwnedCards, 1, 10000, this.cardFields)
        .then(res => {
          this.isCardsLoading = false
          const cards = res.data.data
          this.bCards = this.getCardsByColor(cards, 'B')
          this.gCards = this.getCardsByColor(cards, 'G')
          this.rCards = this.getCardsByColor(cards, 'R')
          this.uCards = this.getCardsByColor(cards, 'U')
          this.wCards = this.getCardsByColor(cards, 'W')
          this.mCards = this.getCardsByColor(cards, 'M')
          this.cCards = this.getCardsByColor(cards, 'C')
          if (this.onlyOwnedCards) {
            this.getUserCollection()
          } else {
            this.userCollection = {}
          }
        })
        .catch(error => {
          this.isCardsLoading = false
          console.log(error)
        })
    },
    getUserCollection: function () {
      this.isLoading = true
      this.$api.getUserCollection()
        .then(res => {
          this.isLoading = false
          this.userCollection = res.data
        })
        .catch(error => {
          this.isLoading = false
          console.log(error)
        })
    },
    getUserCardQtd: function (mtgaid) {
      const qtd = this.userCollection[mtgaid]
      return qtd !== undefined ? qtd : -1
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
        this.addCard(card, this.deckCards, true)
      } else {
        this.addCard(card, this.sideboardCards, false)
      }
    },
    onMainDeckCardClick: function (card) {
      this.remCard(card, this.deckCards, true)
    },
    onSideboardCardClick: function (card) {
      this.remCard(card, this.sideboardCards, false)
    },
    addCard: function (card, pile, mainDeck) {
      if (this.onlyOwnedCards) {
        const cardQtd = this.userCollection[card.mtgaid]
        if (cardQtd > 0) {
          this.userCollection[card.mtgaid] -= 1
        } else {
          return
        }
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
        DeckUtils.sortByCmc(pile)
        this.updateDeckInfo()
      })
      if (mainDeck) {
        this.deckCardsQtd += 1
      } else {
        this.sideboardCardsQtd += 1
      }
    },
    remCard: function (card, pile, mainDeck) {
      if (this.onlyOwnedCards) {
        this.userCollection[card.mtgaid] += 1
      }
      let deckCard = pile.find(c => c.mtgaid === card.mtgaid)
      if (deckCard.qtd > 1) {
        deckCard.qtd -= 1
        Utils.remove(pile, deckCard)
        this.$nextTick(() => {
          pile.push(deckCard)
          this.updateDeckInfo()
        })
      } else {
        Utils.remove(pile, deckCard)
        this.updateDeckInfo()
      }
      if (mainDeck) {
        this.deckCardsQtd -= 1
      } else {
        this.sideboardCardsQtd -= 1
      }
    },
    updateDeckInfo: function () {
      this.deckColors = DeckUtils.getDeckColors(this.deckCards)
      this.deckManaCurve = DeckUtils.getDeckManaCurve(this.deckCards)
      this.deckWCCost = DeckUtils.getDeckWCCost(this.deckCards, this.sideboardCards)
    },
    updateFilters: function () {
      this.filtersDialogVisible = false
      this.getCards()
    },
    clearFilters: function () {
      this.filtersDialogVisible = false
      this.searchQuery = ''
      this.activeColors = ''
      this.activeRarities = ''
      this.activeTypes = ''
      this.activeSets = ''
      this.onlyOwnedCards = ''
      this.getCards()
    },
    importDeck: function () {
      try {
        this.isLoading = true
        const deckCards = DeckUtils.parseDeckText(this.importDeckText)
        this.$api.convertNamesToCards(deckCards.cards, deckCards.sideboard, 'true', this.cardFields)
          .then(res => {
            this.isLoading = false
            this.showError = false
            this.deckImportDialogVisible = false
            this.deckArch = res.data.arch
            this.deckColors = res.data.colors
            this.deckManaCurve = res.data.ManaCurve
            this.deckWCCost = res.data.wildcardCost
            const cards = []
            Object.keys(res.data.cards).forEach(mtgaid => {
              cards.push(res.data.cards[mtgaid])
            })
            DeckUtils.sortByCmc(cards)
            this.deckCards = cards
            this.deckCardsQtd = DeckUtils.getGroupCardsQtd(cards)
            const sideboard = []
            Object.keys(res.data.sideboard).forEach(mtgaid => {
              sideboard.push(res.data.sideboard[mtgaid])
            })
            DeckUtils.sortByCmc(sideboard)
            this.sideboardCards = sideboard
            this.sideboardCardsQtd = DeckUtils.getGroupCardsQtd(sideboard)
          })
          .catch(error => {
            console.log(error)
            this.isLoading = false
            this.errorMsg = error.response.data
            this.showError = true
          })
      } catch (e) {
        console.log(e)
        this.isLoading = false
        this.errorMsg = 'Invalid deck list'
        this.showError = true
      }
    },
    guid: function () {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0
        var v = c === 'x' ? r : (r & 0x3 | 0x8)
        return v.toString(16)
      })
    },
    saveDeck: function () {
      this.isLoading = true
      const deckId = this.guid()
      const cards = {}
      this.deckCards.forEach(card => {
        cards[card.mtgaid] = card.qtd
      })
      const sideboard = {}
      this.sideboardCards.forEach(card => {
        sideboard[card.mtgaid] = card.qtd
      })
      this.$api.postUserDeck(deckId, this.deckName, this.deckColors, cards, sideboard)
        .then(res => {
          this.isLoading = false
          this.showError = false
          this.deckNameDialogVisible = false
          this.$router.replace(`/user/decks/${deckId}`)
        })
        .catch(error => {
          console.log(error)
          this.isLoading = false
          this.errorMsg = error.response.data
          this.showError = true
        })
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
    margin-left: 12%;
    margin-right: 12%;
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
    height: 30px;
    width: 30px;
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
  .v-input--switch {
    height: 32px;
  }
  .tabColor img {
    height: 32px;
    width: 32px;
  }
  @media (max-height: 800px) {
    .cardsContainer {
      min-height: 400px;
      max-height: 400px;
      overflow-y: auto;
      padding: 15px;
    }
    .currentDeck {
      height: 480px;
      overflow-y: overlay;
    }
  }
  @media (min-height: 800px) {
    .cardsContainer {
      min-height: 600px;
      max-height: 600px;
      overflow-y: auto;
      padding: 15px;
    }
    .currentDeck {
      height: 680px;
      overflow-y: overlay;
    }
  }
  .width100 {
    width: 100%;
  }
  .cardContainer {
    width: 128px;
  }
  .mainContainer {
    position: relative;
  }
  .filtersButtons {
    position: absolute;
    right: 0;
    margin-top: 8px;
    z-index: 99;
  }
  .pointer {
    cursor: cell;
  }
</style>
