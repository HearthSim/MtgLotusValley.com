<template>
  <div>
    <v-layout row wrap fill-height>
      <!-- Top -->
      <v-flex class="text-xs-left" xs12>
        <v-breadcrumbs class="breadcrumbs" :items="breadcrumbs">
          <v-icon slot="divider">chevron_right</v-icon>
        </v-breadcrumbs>
      </v-flex>
      <v-flex xs12>
        <v-layout class="box" row wrap>
          <v-layout class="boxContent mb-1" row nowrap>
            <div>
              <v-layout column wrap>
                <QueryFilter class="filterQuery m-auto" v-model="searchQuery"
                  v-on:onQuery="updateFilters()" title="Name or Archetype"/>
                <RarityFilter class="filterRarity pl-2 pr-2" v-model="activeRarities"/>
              </v-layout>
            </div>
            <v-divider class="pt-2 ml-2 mr-2 pb-2" vertical/>
            <div>
              <v-layout column wrap>
                <ColorFilter class="filterColors pl-2 pr-2" v-model="activeColors"/>
                <TypeFilter class="filterTypes pl-2 pr-2" v-model="activeTypes"/>
              </v-layout>
            </div>
            <v-divider class="pt-2 ml-2 mr-2 pb-2" vertical/>
            <div>
              <v-layout column wrap>
                <SetFilter class="filterSets pl-2 pr-2" v-model="activeSets"/>
                <v-switch class="mt-0 ml-4 mr-3" label="Only my collection" v-model="onlyOwnedCards"/>
              </v-layout>
            </div>
            <v-divider class="pt-2 ml-2 mr-2 pb-2" vertical/>
            <div class="m-auto">
              <v-layout class="mt-2" column wrap>
                <v-btn class="mt-2" color="white" @click="updateFilters()">Apply Filters</v-btn>
                <v-btn class="mt-3" color="white" @click="clearFilters()">Clear Filters</v-btn>
              </v-layout>
            </div>
          </v-layout>
        </v-layout>
      </v-flex>
      <!-- Center -->
      <v-flex xs12>
        <v-layout class="box" row wrap>
          <v-layout class="boxContent mb-0" row wrap>
            <v-container class="pt-2 pl-2 pr-2 pb-2" grid-list-md fluid>
              <v-layout row wrap>
                <v-flex v-for="card in currentPageCards" :key="card.mtgaid" xs2>
                  <Card :name='card.name' :imageUrl='card.imageUrl' :imageUrlTransformed='card.imageUrlTransformed'
                    :multiverseid='card.multiverseid' :qtd='userCollection[card.mtgaid]'/>
                </v-flex>
              </v-layout>
              <v-layout row align-center justify-space-between xs12>
                <v-flex xs3 sm3 md1 offset-md5 lg2 offset-lg2 class="text-xs-center">
                  <v-progress-circular v-if="isLoading" color="deep-orange" 
                    :width="2" :size="24" :indeterminate="true"/>
                </v-flex>
                <v-flex xs9 sm9            md6            lg6 class="text-xs-right">
                  <v-pagination v-model="currentPage" @input="goToPage" 
                    :length="totalPages" :total-visible="7"/>
                </v-flex>
              </v-layout>
            </v-container>
          </v-layout>
        </v-layout>
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
import QueryFilter from '@/components/filters/QueryFilter'

export default {
  name: 'UserCollection',
  components: {
    Card, ColorFilter, RarityFilter, TypeFilter, SetFilter, QueryFilter
  },
  mounted () {
    this.getCards()
  },
  data () {
    return {
      breadcrumbs: [
        {
          text: 'Home',
          href: '/'
        },
        {
          text: 'User',
          href: '/user'
        },
        {
          text: 'Collection',
          disabled: true
        }
      ],
      currentPage: this.$route.query.page !== undefined ? parseInt(this.$route.query.page) : 1,
      activeColors: this.$route.query.colors !== undefined ? this.$route.query.colors : '',
      activeRarities: this.$route.query.rarities !== undefined ? this.$route.query.rarities : '',
      activeTypes: this.$route.query.types !== undefined ? this.$route.query.types : '',
      activeSets: this.$route.query.sets !== undefined ? this.$route.query.sets : '',
      onlyOwnedCards: this.$route.query.onlyOwnedCards !== undefined ? this.$route.query.onlyOwnedCards : '',
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
      this.$api.getCards(this.currentPage, pageSize, this.searchQuery, this.activeColors,
        this.activeRarities, this.activeTypes, this.activeSets, this.onlyOwnedCards)
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
      const query = {
        page: 1
      }
      if (this.searchQuery !== '') {
        query['query'] = this.searchQuery
      }
      if (this.activeColors !== '') {
        query['colors'] = this.activeColors
      }
      if (this.activeRarities !== '') {
        query['rarities'] = this.activeRarities
      }
      if (this.activeTypes !== '') {
        query['types'] = this.activeTypes
      }
      if (this.activeSets !== '') {
        query['sets'] = this.activeSets
      }
      if (this.onlyOwnedCards !== '') {
        query['onlyOwnedCards'] = this.onlyOwnedCards
      }
      this.$router.push({
        path: 'collection',
        query: query
      })
      this.currentPage = 1
      this.getCards()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .filters {
    height: 110px;
  }
  .filters button {
    width: 150px;
  }
  .filterQuery {
    max-width: 160px;
  }
  .filterColors, .filterTypes {
    max-width: 270px;
  }
  .filterSets {
    max-width: 220px;
  }
  .v-text-field {
    display: inline-block;
    max-width: 240px;
  }
  .v-input--switch {
    height: 32px;
  }
  #pages button {
    min-width: 32px;
    margin: 0;
  }
</style>
