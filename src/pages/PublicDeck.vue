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
        <div :class="`header header-${deckColors} white--text`">
          <v-layout class="line pt-2 ml-3" row nowrap>
            <div class="mana mt-1">
              <img v-for="color in deckColors.split('')" :key="color"
                :src="require(`@/assets/mana/${color}.png`)"/>
            </div>
            <span class="title textNoWrap mt-1 ml-2">{{ deckName }}</span>
          </v-layout>
          <v-layout class="line pt-2 ml-3" row nowrap>
            <span class='subheading'>{{ deckArch }}</span>
          </v-layout>
        </div>
        <v-layout row class="overlay">
          <v-divider class="mt-2 mb-2" vertical color="gray"/>
          <v-layout column class='manaCurve mt-2'>
            <ManaCurve :manaCurve="deckManaCurve" :height="70" :showTitle="false"/>
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
        <v-layout class="boxContent" column nowrap>
          <v-tabs class="mb-3" color="transparent">

            <v-tab>Overview</v-tab>
            <v-tab-item>
              <v-layout class="overview" column wrap>
                <v-layout class="mt-2" row nowrap>
                  <v-spacer/>
                  <v-flex v-if="$isUserLogged()" class="mt-4">
                    <span class='subheading'>Build Cost</span>
                    <WildcardsCost class="wildcardsCost mt-1 ml-1 mr-1" :cost="deckWCMissingCost"/>
                  </v-flex>
                  <v-spacer/>
                  <v-flex class="mt-4">
                    <span class='subheading'>Total Cost</span>
                    <WildcardsCost class="wildcardsCost mt-1 ml-1 mr-1" :cost="deckWCCost"/>
                  </v-flex>
                  <v-spacer/>
                </v-layout>
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

            <v-tab>Play Test</v-tab>
            <v-tab-item>
              <PlayTest class="mt-3" :cards="deckCards"/>
            </v-tab-item>
          </v-tabs>
        </v-layout>
      </div>
    </v-flex>
    <!-- Right -->
    <v-flex class="ml-0 mb-3" xs4>
      <div class="box">
        <v-layout class="boxContent pb-2" column nowrap>
          <DeckPresenting v-if="Object.keys(deckCards).length > 0"
            class="ml-1 mr-1" :cards="deckCards"/>
          <Deck class="deck deckContainer mt-4" :cards="deckCards"
            :sideboard="sideboardCards"/>
        </v-layout>
      </div>
    </v-flex>

    <!-- Dialogs -->
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
import Stats from '@/components/deck/Stats'
import Updates from '@/components/deck/Updates'
import PlayTest from '@/components/deck/PlayTest'
import ManaCurve from '@/components/charts/ManaCurve'
import WildcardsCost from '@/components/mtg/WildcardsCost'
import DeckUtils from '@/scripts/deckutils'

export default {
  name: 'PublicDeck',
  components: {
    Deck, DeckPresenting, DeckVisual, Stats, Updates, PlayTest, ManaCurve, WildcardsCost
  },
  created () {
    this.requestDeck()
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
        }
      ],
      deckAlias: this.$route.params.alias,
      deckLoader: this.$route.query.loader,
      deckCards: {},
      sideboardCards: {},
      reprintsCards: {},
      deckName: '',
      deckArch: '',
      deckColors: '',
      deckManaCurve: {},
      deckWCCost: {},
      deckWCMissingCost: {},
      deckUpdates: [],
      isLoading: false,
      deckExportDialogVisible: false
    }
  },
  methods: {
    requestDeck: function () {
      this.isLoading = true
      if (this.deckLoader) {
        this.getDeckByCards()
      } else {
        this.getDeckByAlias()
      }
    },
    getDeckByAlias: function () {
      this.$api.getPublicDeck(this.deckAlias)
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
          if (this.$isUserLogged()) {
            this.getDeckMissingCards()
          }
        })
        .catch(error => {
          this.isLoading = false
          console.log(error)
        })
    },
    getDeckByCards: function () {
      const cardsInfo = this.deckAlias.split('_')
      this.$api.convertCardsToObjects(cardsInfo[0], cardsInfo[1])
        .then(res => {
          this.isLoading = false
          this.deckCards = res.data.cards
          this.sideboardCards = res.data.sideboard
          this.reprintsCards = res.data.reprints
          this.deckName = res.data.name
          this.deckArch = res.data.arch
          this.deckColors = res.data.colors
          this.deckManaCurve = res.data.manaCurve
          this.deckWCCost = DeckUtils.getDeckWCCost(this.deckCards, this.sideboardCards)
          if (this.$isUserLogged()) {
            this.getDeckMissingCards()
          }
        })
        .catch(error => {
          this.isLoading = false
          console.log(error)
        })
    },
    getDeckMissingCards: function () {
      this.isLoading = false
      this.$api.getUserCollection()
        .then(res => {
          this.isLoading = false
          const userCollection = res.data
          const cardsWithMissingQtd = {}
          Object.keys(this.deckCards).forEach(mtgaId => {
            const card = this.deckCards[mtgaId]
            if (!card.type.includes('Basic Land')) {
              card.missingQtd = this.getCardMissingQtd(mtgaId, card.qtd, userCollection)
            }
            cardsWithMissingQtd[mtgaId] = card
          })
          this.deckCards = cardsWithMissingQtd
          const userCollectionWithoutMainDeck = this.getUserCollectionWithoutMainDeck(userCollection)
          const sideboardWithMissingQtd = {}
          Object.keys(this.sideboardCards).forEach(mtgaId => {
            const card = this.sideboardCards[mtgaId]
            if (!card.type.includes('Basic Land')) {
              card.missingQtd = this.getCardMissingQtd(mtgaId, card.qtd, userCollectionWithoutMainDeck)
            }
            sideboardWithMissingQtd[mtgaId] = card
          })
          this.sideboardCards = sideboardWithMissingQtd
          this.deckWCMissingCost = DeckUtils.getDeckWCMissingCost(userCollection,
            this.deckCards, this.sideboardCards, this.reprintsCards)
        })
        .catch(error => {
          this.isLoading = false
          console.log(error)
        })
    },
    getCardMissingQtd: function (mtgaId, cardQtd, userCollection) {
      let qtdOwned = userCollection[mtgaId] !== undefined ? userCollection[mtgaId] : 0
      if (this.reprintsCards !== undefined && this.reprintsCards[mtgaId] !== undefined) {
        this.reprintsCards[mtgaId].forEach(reprintCard => {
          qtdOwned += userCollection[reprintCard.mtgaid] !== undefined ? userCollection[reprintCard.mtgaid] : 0
        })
      }
      const missingQtd = cardQtd - qtdOwned
      return missingQtd > 0 ? missingQtd : 0
    },
    getUserCollectionWithoutMainDeck: function (userCollection) {
      const data = {}
      Object.assign(data, userCollection)
      Object.keys(this.deckCards).forEach(mtgaId => {
        const card = this.deckCards[mtgaId]
        const owned = data[mtgaId] !== undefined ? data[mtgaId] : 0
        const qtdWithoutMainDeck = owned - card.qtd
        data[mtgaId] = qtdWithoutMainDeck > 0 ? qtdWithoutMainDeck : 0
      })
      return data
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .line {
    height: 50%;
  }
  .center .v-divider {
    width: 200px;
  }
  .deck {
    padding-left: 3%;
    padding-right: 3%;
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
  .manaCurve {
    width: 162px;
  }
  .wildcardsCost {
    transform: translateX(-5px);
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
  .overview {
    min-height: 600px;
  }
</style>
