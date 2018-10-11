<template>
  <div>
    <span class='subheading'>Sample Hand</span>
    <v-layout>
      <v-spacer/>
      <a class="mr-1" v-on:click="generateSampleHand()">Generate new hand</a>
    </v-layout>
    <div id="cards" class="mt-1">
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
      sampleCards: []
    }
  },
  methods: {
    shuffleArray: function (arr) {
      return arr.map(a => [Math.random(), a])
        .sort((a, b) => a[0] - b[0])
        .map(a => a[1])
    },
    generateSampleHand: function () {
      this.sampleCards = []
      const shuffleCardsPool = this.shuffleArray(this.cardsPool)
      const cardsDrawIndex = []
      const cardsDraw = []
      while (cardsDraw.length < 7) {
        const indexChoosed = Math.floor(Math.random() * shuffleCardsPool.length) + 1
        if (!cardsDrawIndex.includes(indexChoosed)) {
          cardsDrawIndex.push(indexChoosed)
          cardsDraw.push(shuffleCardsPool[indexChoosed])
        }
      }
      this.sampleCards = cardsDraw
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
      this.generateSampleHand()
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
