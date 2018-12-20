<template>
  <v-layout row nowrap>
    <!-- Left -->
    <v-flex xs8>

      <div class="box mr-0">
        <v-flex xs12 class="boxHeader">Top played Cards</v-flex>
        <v-layout class="boxContent line1" column nowrap>
          <v-layout class="mt-1 ml-2 mr-2" row wrap>
            <v-flex xs12 sm6>
              <MostPlayedCards class="ml-2 mostPlayedCards"
                :cards="mostPlayedCardsConstructed" title="Constructed" largeName/>
            </v-flex>
            <v-flex xs12 sm6>
              <MostPlayedCards class="ml-2 mostPlayedCards"
                :cards="mostPlayedCardsLimited" title="Limited" largeName/>
            </v-flex>
          </v-layout>
        </v-layout>
      </div>

      <div class="box mt-0 mr-0">
        <v-flex xs12 class="boxHeader">Deck by Archetype</v-flex>
        <v-layout class="boxContent line2" column nowrap>
          <v-layout class="ml-2 mr-2" row nowrap>
            <v-flex xs12 sm6>
              <DecksByArch class="ml-3 mr-3" :dateMin="startsDate" 
                :dateMax="endsDate" eventType="Constructed" title="Constructed"/>
            </v-flex>
            <v-flex xs12 sm6>
              <DecksByArch class="ml-3 mr-3" :dateMin="startsDate" 
                :dateMax="endsDate" eventType="Limited" title="Limited"/>
            </v-flex>
          </v-layout>
        </v-layout>
      </div>

    </v-flex>
    <!-- Right -->
    <v-flex xs4>
      <div class="box">
        <v-flex xs12 class="boxHeader">Constructed Color Distribution</v-flex>
        <v-layout class="boxContent line1" column nowrap>
          <DecksColorDistribution class="pie mt-4" :id="index" :colors="decksByColorsBasics" :title="false"/>
        </v-layout>
      </div>
      <div class="box mt-0">
        <v-flex xs12 class="boxHeader">Constructed Guilds Distribution</v-flex>
        <v-layout class="boxContent line2" column nowrap>
          <DecksGuildsDistribution class="pie mt-4" :id="index" :colors="decksByColorsGuilds" :title="false"/>
        </v-layout>
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
  components: {
    DecksByArch, DecksColorDistribution, DecksGuildsDistribution, MostPlayedCards
  },
  props: {
    startsDate: {
      type: String,
      required: true
    },
    endsDate: {
      type: String,
      required: true
    },
    index: {
      type: Number,
      required: false
    }
  },
  mounted () {
    this.requestDeckByColorsBasics()
    this.requestDeckByColorsGuilds()
    this.requestMostPlayedCards()
  },
  data () {
    return {
      mostPlayedCardsQtd: 13,
      mostPlayedCardsConstructed: {},
      mostPlayedCardsLimited: {},
      decksByColorsBasics: {},
      decksByColorsGuilds: {}
    }
  },
  methods: {
    requestDeckByColorsBasics: function () {
      this.$api.getDecksByColors(this.startsDate, this.endsDate, true, 'Constructed')
        .then(res => {
          this.decksByColorsBasics = res.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    requestDeckByColorsGuilds: function () {
      this.$api.getDecksByColors(this.startsDate, this.endsDate, false, 'Constructed')
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
      this.$api.getMostPlayedCards(this.startsDate, this.endsDate,
        'Constructed', this.mostPlayedCardsQtd)
        .then(res => {
          this.mostPlayedCardsConstructed = res.data
        })
        .catch(error => {
          console.log(error)
        })
      this.$api.getMostPlayedCards(this.startsDate, this.endsDate,
        'Limited', this.mostPlayedCardsQtd)
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
.line1 {
  min-height: 300px;
}
.line2 {
  min-height: 400px;
}
.mostPlayedCards {
  min-width: 280px;
}
.ta-l {
  text-align: left;
}
.pie {
  max-width: 250px;
}
</style>
