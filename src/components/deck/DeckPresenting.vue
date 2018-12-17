<template>
  <v-layout row nowrap class="cardsGroup pt-3 pl-4 pr-4">
    <div class="cardContainer" v-for="(card, index) in fiveImportantCards()" :key="`p${index}`">
      <Card :class="`card card${index + 1}`" :name='card.name' :imageUrl='card.imageUrl'
        :imageUrlTransformed='card.imageUrlTransformed' :multiverseid='card.multiverseid'
        :highScaleOnHover="true" :qtd="-1"/>
    </div>
  </v-layout>
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
      rarityIndex: {
        'common': 1,
        'uncommon': 2,
        'rare': 3,
        'mythic': 4
      }
    }
  },
  methods: {
    fiveImportantCards: function () {
      if (this.cards === undefined || Object.keys(this.cards).length === 0) {
        return []
      }
      const cardsSorted = []
      Object.keys(this.cards).forEach(mtgaId => {
        const card = this.cards[mtgaId]
        if (card.qtd > 0 && !card.type.includes('Land')) {
          cardsSorted.push(card)
        }
      })
      cardsSorted.sort((card1, card2) => {
        const card1RarityIndex = this.rarityIndex[card1.rarity]
        const card2RarityIndex = this.rarityIndex[card2.rarity]
        if (card1RarityIndex === card2RarityIndex) {
          return card2.qtd - card1.qtd
        } else {
          return card2RarityIndex - card1RarityIndex
        }
      })
      while (cardsSorted.length < 5) {
        cardsSorted.push({})
      }
      const data = cardsSorted.slice(3, 5)
      data.splice(1, 0, cardsSorted[1])
      data.splice(2, 0, cardsSorted[2])
      data.splice(2, 0, cardsSorted[0])
      return data
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .cardsGroup {
    display: inline-flex;
    position: relative;
  }
  .cardContainer {
    display: block;
    position: relative;
  }
  .cardContainer:not(:first-child) {
    margin-left: -25%;
  }
  .card {
    z-index: 999;
    min-width: 85px;
  }
  .card:hover {
    z-index: 9999;
  }
  .card1 {
    transform: rotate(-30deg);
    margin-top: 10%;
  }
  .card2 {
    transform: rotate(-20deg) scale(1.05);
  }
  .card3 {
    transform: scale(1.1);
  }
  .card4 {
    transform: rotate(20deg) scale(1.05);
    z-index: 99;
  }
  .card5 {
    transform: rotate(30deg);
    margin-top: 10%;
    z-index: 9;
  }
</style>
