<template>
    <v-layout row align-center>
      <v-flex hidden-sm-and-down md3 lg2 xl3>
      </v-flex>
      <v-flex           xs12 sm8 md6 lg7 xl6>
        <PublicDecks class="mt-2" />
        <DecksByArch :dateMin="'2018-09-01'" :dateMax="'2018-09-18'"/>
      </v-flex>
      <v-flex hidden-xs-only sm4 md3 lg3 xl3>
        <div class='mt-5'>
          <span class='title'>Deck of Day</span>
          <Deck :cards="deckOfDayCards" :name="deckOfDayName"/>
        </div>
      </v-flex>
    </v-layout>
</template>

<script>
import Deck from './internals/Deck'
import DecksByArch from './internals/charts/DecksByArch'
import PublicDecks from './internals/PublicDecks'

export default {
  name: 'Home',
  components: {
    Deck, DecksByArch, PublicDecks
  },
  created () {
    this.$api.getDeckOfDay('2018-09-15')
      .then(res => {
        this.deckOfDayCards = res.data.cards
        this.deckOfDayName = res.data.name
      })
      .catch(error => {
        console.log(error)
      })
  },
  data () {
    return {
      deckOfDayCards: {},
      deckOfDayName: ''
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
