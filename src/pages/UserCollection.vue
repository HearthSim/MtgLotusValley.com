<template>
  <div>
    <v-text-field class="pl-2 pr-2" label="Search" v-model="searchQuery" @keyup.native.enter="updateFilters"
      solo single-line hide-details clearable />
    <CardFilter class="mt-3" ref="cardFilter"/>
    <v-btn color="white" @click="updateFilters()">Apply</v-btn>
    <v-layout row fill-height>
      <v-flex sm2>
      </v-flex>
      <v-flex           xs12 sm8>
        <v-container id="cards" class='mt-1' grid-list-md fluid>
          <v-layout row wrap>
            <v-flex v-for="card in currentPageCards" :key="card.mtgaid" md4 lg2 xl2>
              <Card :name='card.name' :imageUrl='card.imageUrl' :multiverseid='card.multiverseid' :qtd='userCollection[card.mtgaid]'/>
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
  </div>
</template>

<script>
import Card from '@/components/mtg/Card'
import CardFilter from '@/components/CardFilter'

export default {
  name: 'UserCollection',
  components: {
    Card, CardFilter
  },
  mounted () {
    this.$refs.cardFilter.activeColors = this.activeColors.split(',')
    this.$refs.cardFilter.activeTypes = this.activeTypes.split(',')
    this.$refs.cardFilter.activeSets = this.activeSets.split(',')
    this.getCards()
  },
  data () {
    return {
      currentPage: parseInt(this.$route.query.page),
      activeColors: this.$route.query.colors !== undefined ? this.$route.query.colors : 'b,c,g,m,r,u,w',
      activeTypes: this.$route.query.types !== undefined ? this.$route.query.types : 'a,c,e,i,l,p,s',
      activeSets: this.$route.query.sets !== undefined ? this.$route.query.sets : 'ANA,XLN,RIX,DAR,M19,GRN,MED',
      searchQuery: this.$route.query.query,
      currentPageCards: {},
      isLoading: false,
      totalPages: 0,
      userCollection: {}
    }
  },
  methods: {
    goToPage: function (page) {
      this.$router.push({
        path: 'collection',
        query: { page: page }
      })
      this.currentPage = page
      this.getCards()
    },
    getPages: function () {
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
      const max = this.totalPages < 5 ? this.totalPages : 5
      return [...Array(max).keys()].map(i => firstPage + i)
    },
    getCards: function () {
      this.isLoading = true
      const pageSize = 12
      this.$api.getCards(this.currentPage, pageSize, this.searchQuery,
        this.activeColors, this.activeTypes, this.activeSets)
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
    },
    updateFilters () {
      this.activeColors = this.$refs.cardFilter.activeColors.sort().join()
      this.activeTypes = this.$refs.cardFilter.activeTypes.sort().join()
      this.activeSets = this.$refs.cardFilter.activeSets.sort().join()
      this.$router.push({
        path: 'collection',
        query: {
          page: this.currentPage,
          query: this.searchQuery,
          colors: this.activeColors,
          types: this.activeTypes,
          sets: this.activeSets
        }
      })
      this.getCards()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .v-input {
    display: inline-block;
    max-width: 240px;
  }
  #cards {
    padding: 12px;
  }
  #pages button {
    min-width: 32px;
    margin: 0;
  }
</style>
