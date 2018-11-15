<template>
  <div>
    <v-layout row wrap fill-height>
      <!-- Top -->
      <v-flex class="text-xs-left" xs12>
        <v-breadcrumbs class="ml-2">
          <v-icon slot="divider">chevron_right</v-icon>
          <v-breadcrumbs-item exact ripple to="/">Home</v-breadcrumbs-item>
          <v-breadcrumbs-item exact ripple to="/user">User</v-breadcrumbs-item>
          <v-breadcrumbs-item exact ripple disabled>Collection</v-breadcrumbs-item>
        </v-breadcrumbs>
      </v-flex>
      <v-flex xs12>
        <v-divider/>
      </v-flex>
      <!-- Left -->
      <v-flex sm2>
        <v-text-field class="mt-4 pl-4 pr-4" label="Search" 
          v-model="searchQuery" @keyup.native.enter="updateFilters"
          solo single-line hide-details clearable />
        <ColorFilter class="mt-3 pl-3 pr-3" v-model="activeColors"/>
        <RarityFilter class="mt-3 pl-3 pr-3" v-model="activeRarities"/>
      </v-flex>
      <!-- Center -->
      <v-flex           xs12 sm8>
        <v-container id="cards" class='mt-3' grid-list-md fluid>
          <v-layout row wrap>
            <v-flex v-for="card in currentPageCards" :key="card.mtgaid" md4 lg2 xl2>
              <Card :name='card.name' :imageUrl='card.imageUrl' :imageUrlTransformed='card.imageUrlTransformed'
                :multiverseid='card.multiverseid' :qtd='userCollection[card.mtgaid]'/>
            </v-flex>
          </v-layout>
          <v-layout row align-center justify-space-between xs12>
            <v-flex xs3 sm3 md1 offset-md5 lg2 offset-lg2 class="text-xs-center">
              <v-progress-circular v-if="isLoading" color="deep-orange" 
                :width="2" :size="24" :indeterminate="true"/>
            </v-flex>
            <v-flex xs9 sm9            md6            lg6 class="text-xs-right mb-3">
              <v-pagination v-model="currentPage" @input="goToPage" 
                :length="totalPages" :total-visible="7"/>
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>
      <!-- Right -->
      <v-flex hidden-xs-only sm2>
        <TypeFilter class="mt-4 pl-3 pr-3" v-model="activeTypes"/>
        <SetFilter class="mt-3 pl-3 pr-3" v-model="activeSets"/>
        <v-btn class="mt-3" color="white" @click="updateFilters()">Apply</v-btn>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
import Card from '@/components/mtg/Card'
import ColorFilter from '@/components/filters/ColorFilter'
import RarityFilter from '@/components/filters/RarityFilter'
import TypeFilter from '@/components/filters/TypeFilter'
import SetFilter from '@/components/filters/SetFilter'

export default {
  name: 'UserCollection',
  components: {
    Card, ColorFilter, RarityFilter, TypeFilter, SetFilter
  },
  mounted () {
    this.getCards()
  },
  data () {
    return {
      currentPage: this.$route.query.page !== undefined ? parseInt(this.$route.query.page) : 1,
      activeColors: this.$route.query.colors !== undefined ? this.$route.query.colors : 'b,c,g,m,r,u,w',
      activeRarities: this.$route.query.rarities !== undefined ? this.$route.query.rarities : 'c,u,r,m',
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
    getCards: function () {
      this.isLoading = true
      const pageSize = 12
      this.$api.getCards(this.currentPage, pageSize, this.searchQuery,
        this.activeColors, this.activeRarities, this.activeTypes, this.activeSets)
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
    updateFilters: function () {
      this.$router.push({
        path: 'collection',
        query: {
          page: 1,
          query: this.searchQuery,
          colors: this.activeColors,
          rarities: this.activeRarities,
          types: this.activeTypes,
          sets: this.activeSets
        }
      })
      this.currentPage = 1
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
