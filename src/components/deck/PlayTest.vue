<template>
  <v-layout class="pt-2 pb-2" row wrap>
    <v-flex xs12>
      <div class="text-xs-right textNoSelect">
        <a class="mr-4" v-on:click="regenerateSampleHand(7)">Generate new hand</a>
        <a class="mr-4" v-on:click="restart()">Restart</a>
        <a class="mr-4" v-on:click="mulligan()">Mulligan</a>
        <a class="mr-1" v-on:click="drawCard()">Draw card</a>
      </div>
    </v-flex>
    <!-- Hand -->
    <v-flex xs12>
      <ScrollDiv class="cards mt-3" :overflowAlways="false" ref="handList">
        <div v-for="(card, index) in handCards" :key="index" class="pointer">
          <Card :name='card.name' :imageUrl='card.imageUrl' :multiverseid='card.multiverseid'
            :qtd="-1" :scaleOnHover="false" :clickable="true" :clickableKey="index" @click="onHandCardClick"/>
        </div>
      </ScrollDiv>
      <v-divider class="mt-1"/>
    </v-flex>
    <!-- Field -->
    <v-flex xs9 class="mt-3">
      <v-layout row wrap>
        <!-- Non-Land -->
        <v-flex xs12>
          <ScrollDiv class="cards mt-2" :overflowAlways="false" ref="landList">
            <div v-for="(card, index) in nonLandCards" :key="index">
              <Card :name='card.name' :imageUrl='card.imageUrl' :multiverseid='card.multiverseid'
                :qtd="-1" :scaleOnHover="false"/>
            </div>
          </ScrollDiv>
        </v-flex>
        <!-- Lands -->
        <v-flex xs12>
          <ScrollDiv class="cards mt-1" :overflowAlways="false" ref="nonLandList">
            <div v-for="(card, index) in landCards" :key="index">
              <Card :name='card.name' :imageUrl='card.imageUrl' :multiverseid='card.multiverseid'
                :qtd="-1" :scaleOnHover="false"/>
            </div>
          </ScrollDiv>
        </v-flex>
      </v-layout>
    </v-flex>
    <!-- Graveyard -->
    <v-flex xs3 class="mt-3 pl-3 pr-3">
      <v-layout class="graveyard" row nowrap>
        <v-divider class="mt-3 mb-3 mr-3" vertical/>
        <v-flex>
          <DeckVisualPile class="m-auto" :cardsPile="graveyardCards"/>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import Card from '@/components/mtg/Card'
import DeckVisualPile from '@/components/deck/DeckVisualPile'
import ScrollDiv from '@/components/ScrollDiv'

export default {
  components: {
    Card, DeckVisualPile, ScrollDiv
  },
  props: {
    cards: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      cardsPool: [],
      handCards: [],
      landCards: [],
      nonLandCards: [],
      graveyardCards: [],
      lastSampleCardsLength: 0,
      shuffleCardsPool: [],
      cardsDrawIndex: []
    }
  },
  methods: {
    shuffleArray: function (arr) {
      return arr.map(a => [Math.random(), a])
        .sort((a, b) => a[0] - b[0])
        .map(a => a[1])
    },
    drawCard: function () {
      if (this.cardsDrawIndex.length >= this.shuffleCardsPool.length) {
        return
      }
      const indexChoosed = Math.floor(Math.random() * this.shuffleCardsPool.length - 1) + 1
      if (this.cardsDrawIndex.includes(indexChoosed)) {
        this.drawCard()
        return
      }
      this.cardsDrawIndex.push(indexChoosed)
      this.handCards.push(this.shuffleCardsPool[indexChoosed])
    },
    mulligan: function () {
      if (this.lastSampleCardsLength === 1) {
        this.lastSampleCardsLength = 2
      }
      this.regenerateSampleHand(this.lastSampleCardsLength - 1)
    },
    restart: function () {
      this.landCards = []
      this.nonLandCards = []
      this.graveyardCards = []
      this.regenerateSampleHand(7)
    },
    regenerateSampleHand: function (size) {
      this.handCards = []
      this.generateSampleHand(size)
    },
    generateSampleHand: function (size) {
      if (this.cardsPool.length < 7) {
        return
      }
      this.lastSampleCardsLength = size
      this.shuffleCardsPool = this.shuffleArray(this.cardsPool)
      this.cardsDrawIndex = []
      const mulliganCards = 7 - size
      while (this.handCards.length < mulliganCards) {
        this.handCards.push({
          name: '',
          multiverseid: 0,
          imageUrl: require('@/assets/card.png')
        })
      }
      while (this.handCards.length < 7) {
        const indexChoosed = Math.floor(Math.random() * this.shuffleCardsPool.length - 1) + 1
        if (!this.cardsDrawIndex.includes(indexChoosed)) {
          this.cardsDrawIndex.push(indexChoosed)
          this.handCards.push(this.shuffleCardsPool[indexChoosed])
        }
      }
    },
    onHandCardClick: function (index) {
      const card = this.handCards[index]
      this.handCards.splice(index, 1)
      if (card.multiverseid === 0) {
        return
      }
      if (card.type.includes('Land') && !card.type.includes('Creature')) {
        this.landCards.push(card)
      } else if (card.type.includes('Instant') || card.type.includes('Sorcery')) {
        this.graveyardCards.push(card)
      } else {
        this.nonLandCards.push(card)
      }
    }
  },
  watch: {
    cards: function (value) {
      Object.keys(value).forEach(mtgaId => {
        const card = this.cards[mtgaId]
        for (let i = 0; i < card.qtd; i++) {
          this.cardsPool.push(card)
        }
      })
      this.generateSampleHand(7)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .cards {
    display: flex;
    min-height: 170px;
  }
  .cardContainer {
    width: 96px;
    margin: 1px;
  }
  .graveyard {
    height: 100%;
  }
  .pointer {
    cursor: cell;
  }
  .m-auto { margin: auto !important; }
</style>
