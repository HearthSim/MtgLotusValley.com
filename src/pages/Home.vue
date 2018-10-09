<template>
    <v-layout row>
      <v-flex hidden-sm-and-down md3 lg2 xl3>
      </v-flex>
      <v-flex           xs12 sm8 md6 lg7 xl6>
        <PublicDecks class="mt-2" />
        <DecksByArch :dateMin="getMonthFirstDay()" :dateMax="getDaysAgo(1)"/>
      </v-flex>
      <v-flex hidden-xs-only sm4 md3 lg3 xl3>
        <div class='mt-4'>
          <DecksColorDistribution :colors="decksByColorsBasics"/>
          <div class="mt-5">
            <span class='title'>Deck of Day</span>
          </div>
          <Deck class="mt-1 mb-4" :cards="deckOfDayCards" :name="deckOfDayName"/>
        </div>
      </v-flex>
    </v-layout>
</template>

<script>
import Deck from '@/components/mtg/Deck'
import DecksByArch from '@/components/charts/DecksByArch'
import DecksColorDistribution from '@/components/charts/DecksColorDistribution'
import PublicDecks from '@/components/PublicDecks'

export default {
  name: 'Home',
  components: {
    Deck, DecksByArch, PublicDecks, DecksColorDistribution
  },
  created () {
    this.requestDeckOfDay()
    this.requestDeckByColorsBasics()
  },
  data () {
    return {
      deckOfDayCards: {},
      deckOfDayName: '',
      decksByColorsBasics: {}
    }
  },
  methods: {
    getMonthFirstDay: function () {
      const date = new Date()
      const month = date.getUTCMonth() + (date.getUTCDate() === 1 ? 0 : 1)
      return date.getUTCFullYear() + '-' + `0${month}`.slice(-2) + '-01'
    },
    getDaysAgo: function (days) {
      const date = new Date()
      date.setDate(date.getDate() - days)
      return date.getUTCFullYear() + '-' +
          (`0${date.getUTCMonth() + 1}`).slice(-2) + '-' +
          (`0${date.getUTCDate()}`).slice(-2)
    },
    requestDeckOfDay: function () {
      this.$api.getDeckOfDay(this.getDaysAgo(1))
        .then(res => {
          this.deckOfDayCards = res.data.cards
          this.deckOfDayName = res.data.name
        })
        .catch(error => {
          console.log(error)
        })
    },
    requestDeckByColorsBasics: function () {
      this.$api.getDecksByColors(this.getDaysAgo(8), this.getDaysAgo(1), true)
        .then(res => {
          this.decksByColorsBasics = res.data
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
