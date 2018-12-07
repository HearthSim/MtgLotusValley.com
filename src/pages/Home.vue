  <template>
    <v-layout row wrap>
      <v-flex xs12>
        <Events/>
      </v-flex>
      <v-flex xs12>
        <v-layout class="box mt-0" row wrap>
          <v-flex xs12 class="boxHeader">Latest Decks</v-flex>
          <v-layout class="boxContent" row wrap>
            <LatestDecks />
          </v-layout>
        </v-layout>
      </v-flex>
      <v-layout row wrap>
        <v-flex xs8>
          <v-layout class="box mt-0 mr-0" row wrap>
            <v-flex xs12 class="boxHeader">News</v-flex>
            <v-layout class="boxContent" row wrap>
            </v-layout>
          </v-layout>
        </v-flex>
        <v-flex xs4>
          <v-layout class="box mt-0 pb-2" row wrap>
            <v-flex xs12 class="boxHeader">Colors Distribution (Last 7 days)</v-flex>
            <v-layout class="boxContent" row wrap>
              <DecksColorDistribution :colors="decksByColorsBasics" :title="false"/>
            </v-layout>
          </v-layout>
          <v-layout class="box mt-0" row wrap>
            <v-flex xs12 class="boxHeader">Deck of Day</v-flex>
            <v-layout class="boxContent" row wrap>
              <Deck class="mt-2 mb-2 m-auto" :cards="deckOfDayCards" :name="deckOfDayName"/>
            </v-layout>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-layout>
</template>

<script>
import Deck from '@/components/mtg/Deck'
import Events from '@/components/home/Events'
import LatestDecks from '@/components/home/LatestDecks'
import DecksColorDistribution from '@/components/charts/DecksColorDistribution'

export default {
  name: 'Home',
  components: {
    Deck, Events, LatestDecks, DecksColorDistribution
  },
  created () {
    this.requestDeckOfDay()
    this.requestDeckByColorsBasics()
  },
  data () {
    return {
      deckOfDayName: '',
      deckOfDayCards: {},
      decksByColorsBasics: {}
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
.mostPlayedCards {
  min-width: 280px;
}
.ta-l {
  text-align: left;
}
</style>
