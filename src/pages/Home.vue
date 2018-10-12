<template>
    <v-layout row wrap>
      <v-flex xs12 sm12 md3 lg3 xl3>
          <div class="mt-3">
            <span class='subheading'>Current Events</span>
          </div>
        <Events class="mt-2 ml-3 mr-3 mb-2"/>
      </v-flex>
      <v-flex xs12 sm8 md6 lg6 xl6>
        <div class="mt-3">
          <span class='subheading'>Latest published Decks</span>
        </div>
        <PublicDecks class="mt-1" />
        <v-layout class="mt-4 ml-2 mr-2" row nowrap>
          <MostPlayedCards class="mt-1 ml-2 mostPlayedCards" :cards="mostPlayedCards"/>
          <DecksByArch class="ml-3 mr-3" :dateMin="getMonthFirstDay()" :dateMax="getDaysAgo(1)"/>
        </v-layout>
      </v-flex>
      <v-flex xs12 sm4 md3 lg3 xl3>
        <div class='mt-3'>
          <DecksColorDistribution :colors="decksByColorsBasics"/>
          <div class="mt-5">
            <span class='subheading'>Deck of Day</span>
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
import Events from '@/components/Events'
import MostPlayedCards from '@/components/MostPlayedCards'

export default {
  name: 'Home',
  components: {
    Deck, DecksByArch, Events, PublicDecks, DecksColorDistribution, MostPlayedCards
  },
  created () {
    this.requestDeckOfDay()
    this.requestDeckByColorsBasics()
    this.requestMostPlayedCards()
  },
  data () {
    return {
      deckOfDayCards: {},
      deckOfDayName: '',
      decksByColorsBasics: {},
      mostPlayedCards: {}
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
          this.deckOfDayName = `${res.data.name} | ${res.data.wins}-${res.data.losses} (${res.data.winRate}%)`
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
    },
    requestMostPlayedCards: function () {
      this.$api.getMostPlayedCards(this.getDaysAgo(8), this.getDaysAgo(1))
        .then(res => {
          this.mostPlayedCards = res.data
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
.mostPlayedCards {
  min-width: 280px;
}
</style>
