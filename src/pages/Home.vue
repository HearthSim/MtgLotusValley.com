  <template>
    <v-layout row wrap>
      <v-flex xs12 sm12 md3 lg3 xl3>
        <div class="mt-4">
          <span class='body-2 grey--text text--darken-2'>
            <strong>Events</strong>
          </span>
        </div>
        <Events class="mt-2 mb-2 m-auto"/>
      </v-flex>
      <v-flex xs12 sm8 md6 lg6 xl6>
        <div class="mt-4 ta-l">
          <span class='body-2 grey--text text--darken-2'>
            <strong>Latest published Decks</strong>
          </span>
        </div>
        <LatestDecks class="mt-2" />
        
      </v-flex>
      <v-flex xs12 sm4 md3 lg3 xl3>
        <div class='mt-4'>
          <span class='body-2 grey--text text--darken-2'>
            <strong>Deck of Day</strong>
          </span>
          <Deck class="mt-3 mb-4" :cards="deckOfDayCards" :name="deckOfDayName"/>
        </div>
      </v-flex>
    </v-layout>
</template>

<script>
import Deck from '@/components/mtg/Deck'
import Events from '@/components/home/Events'
import LatestDecks from '@/components/home/LatestDecks'

export default {
  name: 'Home',
  components: {
    Deck, Events, LatestDecks
  },
  created () {
    this.requestDeckOfDay()
  },
  data () {
    return {
      deckOfDayCards: {},
      deckOfDayName: ''
    }
  },
  methods: {
    getDaysAgo: function (days) {
      const date = new Date()
      date.setDate(date.getDate() - days)
      return date.getUTCFullYear() + '-' +
          (`0${date.getUTCMonth() + 1}`).slice(-2) + '-' +
          (`0${date.getUTCDate()}`).slice(-2)
    },
    requestDeckOfDay: function () {
      this.$api.getDeckOfDay(this.getDaysAgo(1), 'Constructed')
        .then(res => {
          this.deckOfDayCards = res.data.cards
          this.deckOfDayName = `${res.data.name} | ${res.data.wins}-${res.data.losses} (${res.data.winRate}%)`
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
.ta-l {
  text-align: left;
}
</style>
