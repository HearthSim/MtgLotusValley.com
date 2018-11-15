  <template>
    <v-layout row wrap>
      <!-- Left -->
      <v-flex xs2>
      </v-flex>
      <!-- Center -->
      <v-flex xs7 class="mb-3">
        <div class="mt-3 ta-l">
          <span class='body-2 grey--text text--darken-2'>
            <strong>Most Played Cards (Last 7 days)</strong>
          </span>
        </div>
        <v-card class="mt-2 pt-2 pb-3">
          <v-layout class="ml-2 mr-2" row wrap>
            <v-flex xs12 sm6>
              <MostPlayedCards class="mt-1 ml-2 mostPlayedCards"
                :cards="mostPlayedCardsConstructed" title="Constructed" largeName/>
            </v-flex>
            <v-flex xs12 sm6>
              <MostPlayedCards class="mt-1 ml-2 mostPlayedCards"
                :cards="mostPlayedCardsLimited" title="Limited" largeName/>
            </v-flex>
          </v-layout>
        </v-card>
        <div class="mt-3 ta-l">
          <span class='body-2 grey--text text--darken-2'>
            <strong>Deck by Archetype</strong>
          </span>
        </div>
        <v-card class="mt-2 pt-2 pb-2">
          <v-layout class="ml-2 mr-2" row nowrap>
            <v-flex xs12 sm6>
              <DecksByArch class="ml-3 mr-3" :dateMin="getMonthFirstDay()" 
                :dateMax="getDaysAgo(1)" eventType="Constructed" title="Constructed"/>
            </v-flex>
            <v-flex xs12 sm6>
              <DecksByArch class="ml-3 mr-3" :dateMin="getMonthFirstDay()" 
                :dateMax="getDaysAgo(1)" eventType="Limited" title="Limited"/>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
      <!-- Right -->
      <v-flex xs3>
        <div>
          <DecksColorDistribution class="mt-3" :colors="decksByColorsBasics"/>
          <DecksGuildsDistribution class="mt-4" :colors="decksByColorsGuilds"/>
        </div>
      </v-flex>
    </v-layout>
</template>

<script>
import DecksByArch from '@/components/charts/DecksByArch'
import DecksColorDistribution from '@/components/charts/DecksColorDistribution'
import DecksGuildsDistribution from '@/components/charts/DecksGuildsDistribution'
import MostPlayedCards from '@/components/MostPlayedCards'

export default {
  name: 'Home',
  components: {
    DecksByArch, DecksColorDistribution, DecksGuildsDistribution, MostPlayedCards
  },
  created () {
    this.requestDeckByColorsBasics()
    this.requestDeckByColorsGuilds()
    this.requestMostPlayedCards()
  },
  data () {
    return {
      mostPlayedCardsConstructed: {},
      mostPlayedCardsLimited: {},
      decksByColorsBasics: {},
      decksByColorsGuilds: {}
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
    requestDeckByColorsBasics: function () {
      this.$api.getDecksByColors(this.getDaysAgo(8), this.getDaysAgo(1), true)
        .then(res => {
          this.decksByColorsBasics = res.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    requestDeckByColorsGuilds: function () {
      this.$api.getDecksByColors(this.getDaysAgo(8), this.getDaysAgo(1), false)
        .then(res => {
          const data = {}
          Object.keys(res.data).forEach(colors => {
            if (colors.length > 1) {
              data[colors] = res.data[colors]
            }
          })
          this.decksByColorsGuilds = data
        })
        .catch(error => {
          console.log(error)
        })
    },
    requestMostPlayedCards: function () {
      this.$api.getMostPlayedCards(this.getDaysAgo(8), this.getDaysAgo(1), 'constructed', 15)
        .then(res => {
          this.mostPlayedCardsConstructed = res.data
        })
        .catch(error => {
          console.log(error)
        })
      this.$api.getMostPlayedCards(this.getDaysAgo(8), this.getDaysAgo(1), 'limited', 15)
        .then(res => {
          this.mostPlayedCardsLimited = res.data
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
