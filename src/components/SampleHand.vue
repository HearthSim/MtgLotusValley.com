<template>
  <div>
    <v-layout>
      <v-spacer/>
      <a class="mr-4" v-on:click="drawCard()">Draw card</a>
      <a class="mr-4" v-on:click="mulligan()">Mulligan</a>
      <a class="mr-1" v-on:click="regenerateSampleHand(7)">Generate new hand</a>
    </v-layout>
    <div id="cards" class="mt-1" ref="cardsList">
      <div v-for="(card, index) in sampleCards" :key="index">
        <Card :name='card.name' :imageUrl='card.imageUrl' :multiverseid='card.multiverseid' 
          :qtd="-1" :highScaleOnHover="true"/>
      </div>
    </div>
  </div>
</template>

<script>
import Card from '@/components/mtg/Card'

export default {
  components: {
    Card
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
      sampleCards: [],
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
      const oldHand = this.sampleCards
      this.sampleCards = []
      setTimeout(() => {
        for (let i = 1; i < oldHand.length; i++) {
          this.sampleCards.push(oldHand[i])
        }
        this.sampleCards.push(this.shuffleCardsPool[indexChoosed])
      }, 100)
    },
    mulligan: function () {
      if (this.lastSampleCardsLength === 1) {
        this.lastSampleCardsLength = 2
      }
      this.regenerateSampleHand(this.lastSampleCardsLength - 1)
    },
    regenerateSampleHand: function (size) {
      this.sampleCards = []
      setTimeout(() => {
        this.generateSampleHand(size)
      }, 100)
    },
    generateSampleHand: function (size) {
      this.lastSampleCardsLength = size
      this.shuffleCardsPool = this.shuffleArray(this.cardsPool)
      this.cardsDrawIndex = []
      const noCards = 7 - size
      while (this.sampleCards.length < noCards) {
        this.sampleCards.push({
          name: '',
          multiverseid: 0,
          imageUrl: require('@/assets/card.png')
        })
      }
      while (this.sampleCards.length < 7) {
        const indexChoosed = Math.floor(Math.random() * this.shuffleCardsPool.length - 1) + 1
        if (!this.cardsDrawIndex.includes(indexChoosed)) {
          this.cardsDrawIndex.push(indexChoosed)
          this.sampleCards.push(this.shuffleCardsPool[indexChoosed])
        }
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
      setTimeout(() => {
        this.$refs.cardsList.setAttribute('min-height', this.$refs.cardsList.clientHeight)
      }, 100)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#cards {
  display: flex;
}
#cards > div {
  margin: 1px;
  width: 100%;
}
</style>
