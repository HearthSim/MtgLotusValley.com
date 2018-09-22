<template>
    <v-layout row align-center fill-height>
      <v-flex hidden-xs-only sm2>
      </v-flex>
      <v-flex           xs12 sm8>
        <div class='mt-3'>
          <v-layout row>
            <v-spacer/>
            <div id="pages">
              <v-btn v-if="currentPage > 1" small flat @click="goToPage(currentPage - 1)">
                <v-icon>keyboard_arrow_left</v-icon>
              </v-btn>
              <v-btn v-for="page in getPages()" :key="page" small flat @click="goToPage(page)">
                <span v-if="page !== currentPage">{{ page }}</span>
                <span v-if="page === currentPage" class="red--text">{{ page }}</span>
              </v-btn>
              <v-btn small flat @click="goToPage(currentPage + 1)">
                <v-icon>keyboard_arrow_right</v-icon>
              </v-btn>
            </div>
          </v-layout>
          <v-container grid-list-md fluid>
            <v-layout row wrap>
              <v-flex v-for="card in currentPageCards" :key="card.multiverseid" md4 lg2 xl2>
                <Card :name='card.name' :multiverseid='card.multiverseid'/>
              </v-flex>
            </v-layout>
          </v-container>
        </div>
      </v-flex>
      <v-flex hidden-xs-only sm2>
      </v-flex>
    </v-layout>
</template>

<script>
import Card from './internals/Card'

export default {
  name: 'UserCollection',
  components: {
    Card
  },
  created () {
    this.getCards(this.currentPage)
  },
  data () {
    return {
      currentPageCards: {},
      userCollection: {},
      currentPage: parseInt(this.$route.query.page)
    }
  },
  methods: {
    goToPage (page) {
      this.$router.push({
        path: 'collection',
        query: { page: page }
      })
      this.currentPage = page
      this.getCards(page)
    },
    getPages () {
      let firstPage = this.currentPage
      if (this.currentPage == 2) {
        firstPage -= 1
      } else if (this.currentPage > 2) {
        firstPage -= 2
      }
      return [...Array(5).keys()].map(i => firstPage + i)
    },
    getCards: function (page) {
      this.$api.getCards(page)
        .then(res => {
          this.currentPageCards = res.data
          this.getUserCollection()
        })
        .catch(error => {
          console.log(error)
        })
    },
    getUserCollection: function () {
      this.$api.getUserCollection()
        .then(res => {
          this.userCollection = res.data
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #pages button {
    min-width: 32px;
    margin: 0;
  }
</style>
