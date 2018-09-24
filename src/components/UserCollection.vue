<template>
    <v-layout row fill-height>
      <v-flex sm2>
      </v-flex>
      <v-flex           xs12 sm8>
        <CardFilter class="mt-3"/>
        <v-container id="cards" class='mt-1' grid-list-md fluid fill-height>
          <v-layout row wrap>
            <v-flex v-for="card in currentPageCards" :key="card.mtgaid" md4 lg2 xl2>
              <Card :name='card.name' :multiverseid='card.multiverseid' :qtd='userCollection[card.mtgaid]'/>
            </v-flex>
          </v-layout>
        </v-container>
        <v-layout row align-center justify-space-between>
          <v-flex xs3 sm3 md1 offset-md5 lg4 offset-lg4 class="text-xs-center">
            <v-progress-circular v-if="isLoading" color="deep-orange" :width="2" :size="25" :indeterminate="true"/>
          </v-flex>
          <v-flex xs9 sm9            md6            lg4 class="text-xs-right">
            <div id="pages">
              <v-btn v-if="currentPage > 1" small flat @click="goToPage(currentPage - 1)">
                <v-icon>keyboard_arrow_left</v-icon>
              </v-btn>
              <v-btn v-for="page in getPages()" :key="page" small flat @click="goToPage(page)">
                <span v-if="page !== currentPage">{{ page }}</span>
                <span v-if="page === currentPage" class="deep-orange--text">{{ page }}</span>
              </v-btn>
              <v-btn v-if="currentPage < totalPages" small flat @click="goToPage(currentPage + 1)">
                <v-icon>keyboard_arrow_right</v-icon>
              </v-btn>
            </div>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex hidden-xs-only sm2>
      </v-flex>
    </v-layout>
</template>

<script>
import Card from './internals/Card'
import CardFilter from './internals/CardFilter'

export default {
  name: 'UserCollection',
  components: {
    Card, CardFilter
  },
  created () {
    this.getCards(this.currentPage)
  },
  data () {
    return {
      currentPage: parseInt(this.$route.query.page),
      currentPageCards: {},
      isLoading: false,
      totalPages: 0,
      userCollection: {}
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
      if (this.currentPage === 2) {
        firstPage -= 1
      } else if (this.currentPage === this.totalPages - 1) {
        firstPage -= 3
      } else if (this.currentPage === this.totalPages) {
        firstPage -= 4
      } else if (this.currentPage > 1) {
        firstPage -= 2
      }
      return [...Array(5).keys()].map(i => firstPage + i)
    },
    getCards: function (page) {
      this.isLoading = true
      const pageSize = 12
      this.$api.getCards(page, pageSize)
        .then(res => {
          this.currentPageCards = res.data.data
          this.totalPages = res.data.totalPages
          this.getUserCollection()
        })
        .catch(error => {
          this.isLoading = false
          console.log(error)
        })
    },
    getUserCollection: function () {
      this.$api.getUserCollection()
        .then(res => {
          this.isLoading = false
          this.userCollection = res.data
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #cards {
    padding: 12px;
  }
  #pages button {
    min-width: 32px;
    margin: 0;
  }
</style>
