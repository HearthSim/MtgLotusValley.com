<template>
    <v-layout row align-center>
      <v-flex xs3>
      </v-flex>
      <v-flex xs6>
        <blockquote>
          &#8220;First, solve the problem. Then, write the code.&#8221;
          <footer>
            <small>
              <em>&mdash;John Johnson</em>
            </small>
          </footer>
        </blockquote>
      </v-flex>
      <v-flex xs3>
        <div class='mt-5'>
          <span class='title'>Deck of Day</span>
          <Deck :cards="deckOfDayCards" :name="deckOfDayName"/>
        </div>
      </v-flex>
    </v-layout>
</template>

<script>
import { axios } from "../main";
import Deck from "./internals/Deck";

export default {
  name: 'Home',
  components: {
    Deck
  },
  created () {
    this.getDeckOfDay()
  },
  data () {
    return {
      deckOfDayCards: {},
      deckOfDayName: ""
    }
  },
  methods: {
    getDeckOfDay: function () {
      axios.get('/stats/deckOfDay?date=2018-09-15')
      .then(res => {
        this.deckOfDayCards = res.data.cards
        this.deckOfDayName = res.data.name
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
