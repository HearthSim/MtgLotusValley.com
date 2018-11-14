<template>
  <v-layout row wrap class="pt-2">
    <v-flex xs12 class="text-xs-left mt-3" v-for="update in updates.slice().reverse()" :key="update.date">
      <v-icon>keyboard_arrow_right</v-icon>
      <span class="subheading">
        {{ new Date(update.date.replace('_', ':')).toLocaleString().replace(' ', ' - ').replace(',', '') }}
      </span>
      <v-divider/>
      <v-layout row wrap class="mt-1 ml-3">
        <div v-if="getCardsIn(update.mainDeck).length > 0" class="mt-2">
          <span class="subheading green--text">In</span>
          <div class="cards ml-2">
            <div v-for="(card, index) in getCardsIn(update.mainDeck)" :key="index">
              <Card :name='card.name' :imageUrl='card.imageUrl' :multiverseid='card.multiverseid'
                :imageUrlTranformed='card.imageUrlTransformed' :qtd="card.qtd"/>
            </div>
          </div>
        </div>
        <div row v-if="getCardsOut(update.mainDeck).length > 0" class="mt-2 ml-4">
          <span class="subheading red--text">Out</span>
          <div class="cards ml-2">
            <div v-for="(card, index) in getCardsOut(update.mainDeck)" :key="index">
              <Card :name='card.name' :imageUrl='card.imageUrl' :multiverseid='card.multiverseid'
                :imageUrlTranformed='card.imageUrlTransformed' :qtd="card.qtd * -1"/>
            </div>
          </div>
        </div>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import Card from '@/components/mtg/Card'

export default {
  components: {
    Card
  },
  props: {
    updates: {
      type: Array,
      required: true
    }
  },
  methods: {
    getCardsIn: function (cards) {
      const data = []
      Object.keys(cards).forEach(mtgaId => {
        const card = cards[mtgaId]
        if (card.qtd > 0) {
          data.push(card)
        }
      })
      return data
    },
    getCardsOut: function (cards) {
      const data = []
      Object.keys(cards).forEach(mtgaId => {
        const card = cards[mtgaId]
        if (card.qtd < 0) {
          data.push(card)
        }
      })
      return data
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .mt-3:first-child {
    margin-top: 0px !important;
  }
  .cards {
    display: flex;
    flex-wrap: wrap;
  }
  .cardContainer {
    width: 8em;
    margin: 1px;
  }
  .v-divider {
    width: 175px;
  }
  .v-icon {
    transform: translateY(3px);
  }
</style>
