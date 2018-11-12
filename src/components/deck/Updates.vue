<template>
  <v-layout row wrap>
    <v-flex xs12 v-for="update in updates" :key="update.date">
      <span class="subheading mt-2">{{update.date}}</span>
      <v-layout row wrap>
        <v-flex xs12>
          <span class="body-2 mt-2 green--text">In</span>
        </v-flex>
        <v-flex xs12>
          <ScrollDiv class="cards mt-2" :overflowAlways="false">
            <div v-for="(card, index) in getCardsIn(update.mainDeck)" :key="index">
              <Card :name='card.name' :imageUrl='card.imageUrl' :multiverseid='card.multiverseid'
                :imageUrlTrnaformed='card.imageUrlTransformed' :qtd="-1"/>
            </div>
          </ScrollDiv>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex xs12>
          <span class="body-2 mt-2 green--red">Out</span>
        </v-flex>
        <v-flex xs12>
          <ScrollDiv class="cards mt-2" :overflowAlways="false">
            <div v-for="(card, index) in getCardsOut(update.mainDeck)" :key="index">
              <Card :name='card.name' :imageUrl='card.imageUrl' :multiverseid='card.multiverseid'
                :imageUrlTrnaformed='card.imageUrlTransformed' :qtd="-1"/>
            </div>
          </ScrollDiv>
        </v-flex>
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
      type: Object,
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
  .cards {
    display: flex;
  }
  .cardContainer {
    width: 8em;
    margin: 1px;
  }
</style>
