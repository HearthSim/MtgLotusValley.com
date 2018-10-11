<template>
  <div>
    <div class='mostPlayedCards'>
      <div>
        <span class='body-2'>Most Played Cards (Last 7 days)</span>
      </div>
      <table class="mt-1">
        <DeckCard v-for='card in cardsSorted' v-bind:key='card.mtgaId' v-bind:card='card'/>
      </table>
    </div>
  </div>
</template>

<script>
import DeckCard from '@/components/mtg/DeckCard'

export default {
  components: {
    DeckCard
  },
  props: {
    cards: {
      type: Object,
      required: true
    }
  },
  computed: {
    cardsSorted: function () {
      const cardsArray = []
      Object.keys(this.cards).forEach(cardId => {
        const card = this.cards[cardId]
        cardsArray.push(card)
      })
      cardsArray.sort(function (card1, card2) {
        if (card1.qtd !== card2.qtd) {
          return card2.qtd - card1.qtd
        }
        if (card1.name > card2.name) {
          return 1
        } else {
          return -1
        }
      })
      return cardsArray
    }
  }
}
</script>

<style>
.mostPlayedCards {
  overflow-x: auto;
  font-size: 11pt;
}
table {
  margin: auto;
  text-align: right;
  table-layout: fixed;
  border-spacing: 0;
}
table td {
  padding: 0;
}
</style>
