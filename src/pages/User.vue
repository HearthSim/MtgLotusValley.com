<template>
  <v-layout class="mb-3" row wrap>
    <!-- Top -->
    <v-flex class="text-xs-left" xs12>
      <v-layout row nowrap>
        <v-breadcrumbs class="breadcrumbs" :items="breadcrumbs">
          <v-icon slot="divider">chevron_right</v-icon>
        </v-breadcrumbs>
      </v-layout>
    </v-flex>
    <v-flex xs12>
      <v-divider/>
    </v-flex>

    <!-- Bottom -->

    <v-layout class="box" row wrap>
      <v-tabs class="width100" color="transparent">

        <v-tab>General</v-tab>
        <v-tab-item>

          <v-layout class="box" row wrap>
            <v-flex xs12 class="boxHeader">User Summary</v-flex>
            <v-layout class="boxContent pb-1" row wrap>

              <div class="ml-2">
                <v-layout row class="userSummary">
                  <v-layout column class="mt-2">
                    <span class="headline">{{totalGames}} games</span>
                  </v-layout>
                  <v-layout column>
                    <span class="display-1 ml-2">(</span>
                  </v-layout>
                  <v-layout column class="body-2 text-xs-center ml-2">
                    <span>{{totalConstructed}} Constructed</span>
                    <span>{{totalLimited}} Limited</span>
                  </v-layout>
                  <v-layout column>
                    <span class="display-1 ml-2">)</span>
                  </v-layout>
                </v-layout>
              </div>
              <v-spacer/>
              <div class="mr-2">
                <v-layout row class="mt-2">
                  <span class="subheading pt-1 mt-2">{{ userGold }} </span>
                  <img class="mt-1 ml-1 icon" :src="require('@/assets/coins.png')"/>

                  <span class="subheading pt-1 mt-2 ml-3">{{ userGems }} </span>
                  <img class="mt-1 ml-1 icon" :src="require('@/assets/gems.png')"/>

                  <span class="subheading pt-1 mt-2 ml-3">{{ userVault }}% </span>
                  <img class="mt-1 ml-1 icon" :src="require('@/assets/vault.png')"/>
                </v-layout>
              </div>

            </v-layout>
          </v-layout>

          <v-layout class="box" row wrap>
            <v-flex xs12 class="boxHeader">Collection Summary</v-flex>
            <v-layout class="boxContent mt-0 pb-2" row wrap>
              <v-card class="setSummary mt-3 pb-2 m-auto" v-for="set in userCollectionSummary" :key="set.code">
                <v-layout column class="summaryTitle pt-1 mb-2">
                  <router-link :to="`/user/collection?page=1&sets=${set.code}`">
                    <img class="setLogo" :src="require(`@/assets/sets/logos/${set.code}.png`)"/>
                  </router-link>
                </v-layout>
                <v-tooltip v-for="rarity in rarities" :key="`${set.code}_${rarity.name.toLowerCase()}`" right lazy>
                  <router-link :to="`/user/collection?page=1&sets=${set.code}&rarities=${rarity.name.toLowerCase()[0]}`"
                    slot="activator">
                    <v-layout class="setRarityLine" row nowrap>
                      <SetSymbol class="setSymbol ml-3" :set="set.code" :rarity="rarity.name.toLowerCase()"/>
                      <v-progress-linear class="ml-2" :color="rarity.color" height="5"
                        :value="set.unique[rarity.name.toLowerCase()] / set.all[rarity.name.toLowerCase()] * 100"/>
                      <span class="summaryValue">{{getSummaryUniquePercent(set, rarity.name.toLowerCase())}}%</span>
                    </v-layout>
                  </router-link>
                  <v-layout column>
                    <span>Unique cards: {{set.unique[rarity.name.toLowerCase()]}} / {{set.all[rarity.name.toLowerCase()]}}</span>
                    <span>Playset: {{set.playset[rarity.name.toLowerCase()]}} / {{set.all[rarity.name.toLowerCase()]}}</span>
                    <span>All: {{set.owned[rarity.name.toLowerCase()]}} / {{set.all[rarity.name.toLowerCase()] * 4}}</span>
                  </v-layout>
                </v-tooltip>
                <v-tooltip right lazy>
                  <span class="caption" slot="activator">5th rare/mythic chance: {{getFifthCopyChance(set)}}%</span>
                  <span>Chance to open a 5th rare/mythic copy</span>
                </v-tooltip>
              </v-card>
            </v-layout>
          </v-layout>
          
          <v-layout class="box mr-0" row wrap>
            <v-flex xs12 class="boxHeader">Ever-Green Constructed Matches</v-flex>
            <v-layout class="boxContent pb-3" row wrap>

              <MatchesTimeline :matches="userEverGreenMatchesData"/>

              <v-layout row xs12 class="mt-1">
                <v-spacer/>
                <v-pagination v-model="paginationEverGreen.page" @input="requestEverGreenUserMatches"
                  :length="totalEverGreenPages" :total-visible="5"/>
              </v-layout>

            </v-layout>
          </v-layout>

        </v-tab-item>

        <v-tab>Events</v-tab>
        <v-tab-item lazy>
          <v-layout class="box" row nowrap>

            <v-flex xs3>
              <v-layout column nowrap>
                <EventStats class="mt-3" :data="userEventsStats[0]" :id="userEventsStats[0].name"/>
              </v-layout>
            </v-flex>
            
            <v-flex xs9>
              <MatchesTimeline class="pr-3" :matches="userEventsMatchesData"/>
              
              <v-layout row xs12 class="mt-1">
                <v-spacer/>
                <v-pagination v-model="paginationEvents.page" @input="requestEventsUserMatches"
                  :length="totalEventsPages" :total-visible="5"/>
              </v-layout>

            </v-flex>

          </v-layout>
        </v-tab-item>

      </v-tabs>
    </v-layout>

  </v-layout>
</template>

<script>
import EventStats from '@/components/charts/EventStats'
import SetSymbol from '@/components/mtg/SetSymbol'
import MatchesTimeline from '@/components/MatchesTimeline'
import WildcardsCost from '@/components/mtg/WildcardsCost'
import Utils from '@/scripts/utils'

export default {
  name: 'PublicDeck',
  components: {
    EventStats, SetSymbol, MatchesTimeline, WildcardsCost, Utils
  },
  created () {
    this.requestUserExtras()
    this.requestUserCollectionSummary()
    this.requestUserEventsStats()
    this.requestEverGreenUserMatches()
    this.requestEventsUserMatches()
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
          disabled: true
        }
      ],
      userCollectionSummary: [],
      userEventsStats: [],
      userGold: 0,
      userGems: 0,
      userVault: 0.0,
      userWildcards: {},
      rarities: Utils.rarities,
      totalGames: 0,
      totalConstructed: 0,
      totalLimited: 0,
      isLoading: false,
      paginationEverGreen: {
        page: 1
      },
      totalEverGreenPages: 1,
      userEverGreenMatchesData: [],
      currentEvent: 'QuickDraft',
      paginationEvents: {
        page: 1
      },
      totalEventsPages: 1,
      userEventsMatchesData: []
    }
  },
  methods: {
    requestUserExtras: function () {
      this.$api.getUserExtras(this.deckAlias)
        .then(res => {
          if (res.data === '') {
            return
          }
          this.userGold = res.data.gold
          this.userGems = res.data.gems
          this.userVault = res.data.vaultProgress
        })
        .catch(error => {
          console.log(error)
        })
    },
    requestUserCollectionSummary: function () {
      this.$api.getUserCollection(true)
        .then(res => {
          this.userCollectionSummary = res.data.filter(set => set.code !== 'ANA' && set.code !== 'MED')
        })
        .catch(error => {
          console.log(error)
        })
    },
    getSummaryUniquePercent: function (set, rarity) {
      const percent = set.unique[rarity] / set.all[rarity] * 100
      return parseFloat(percent.toFixed(0))
    },
    getFifthCopyChance: function (set) {
      const totalRareMythicPlayset = set.unique['rare'] + set.unique['mythic']
      const ownedRareMythicPlayset = set.playset['rare'] + set.playset['mythic']
      const percent = ownedRareMythicPlayset / totalRareMythicPlayset * 100
      return parseFloat(percent.toFixed(0))
    },
    requestUserEventsStats: function () {
      this.$api.getUserEventsStats()
        .then(res => {
          const data = res.data
          this.totalGames = data.map(stat => stat.wins + stat.losses).reduce((acc, value) => acc + value)
          this.totalConstructed = data.filter(stat => stat.type === 'Constructed')
            .map(stat => stat.wins + stat.losses).reduce((acc, value) => acc + value)
          this.totalLimited = data.filter(stat => stat.type === 'Limited')
            .map(stat => stat.wins + stat.losses).reduce((acc, value) => acc + value)
          this.userEventsStats = data
        })
        .catch(error => {
          console.log(error)
        })
    },
    requestEverGreenUserMatches: function () {
      this.isLoading = true
      this.paginationEverGreen.rowsPerPage = 10
      const { sortBy, descending, page, rowsPerPage } = this.paginationEverGreen
      this.$api.getUserDeckMatches(this.deckId, page, rowsPerPage, sortBy, descending, undefined, true)
        .then(res => {
          this.isLoading = false
          this.userEverGreenMatchesData = []
          this.totalEverGreenPages = res.data.length < rowsPerPage ? page : page + 1
          res.data.forEach(match => {
            const userMatchesSize = this.userEverGreenMatchesData.length
            if (userMatchesSize === 0 || this.userEverGreenMatchesData[userMatchesSize - 1].date !== match.date) {
              const date = new Date(match.date.replace('_', ':'))
              this.userEverGreenMatchesData.push({
                isHeader: true,
                dateFormatted: date.toLocaleString().split(' ')[0].replace(',', '')
              })
            }
            this.userEverGreenMatchesData.push(match)
          })
        })
        .catch(error => {
          this.isLoading = false
          console.log(error)
        })
    },
    requestEventsUserMatches: function () {
      this.isLoading = true
      this.paginationEvents.rowsPerPage = 10
      const { sortBy, descending, page, rowsPerPage } = this.paginationEvents
      this.$api.getUserDeckMatches(this.deckId, page, rowsPerPage, sortBy, descending, this.currentEvent)
        .then(res => {
          this.isLoading = false
          this.userEventsMatchesData = []
          this.totalEventsPages = res.data.length < rowsPerPage ? page : page + 1
          res.data.forEach(match => {
            const userMatchesSize = this.userEventsMatchesData.length
            if (userMatchesSize === 0 || this.userEventsMatchesData[userMatchesSize - 1].date !== match.date) {
              const date = new Date(match.date.replace('_', ':'))
              this.userEventsMatchesData.push({
                isHeader: true,
                dateFormatted: date.toLocaleString().split(' ')[0].replace(',', '')
              })
            }
            this.userEventsMatchesData.push(match)
          })
        })
        .catch(error => {
          this.isLoading = false
          console.log(error)
        })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .eventStat {
    min-height: 150px;
  }
  .setLogo {
    max-height: 30px;
  }
  .summaryTitle {
    background-color: lightgray !important;
  }
  .setSummary {
    width: 220px;
  }
  .setSymbol {
    transform: translateY(5px);
  }
  .setRarityLine {
    height: 30px;
  }
  .summaryValue {
    min-width: 60px;
    text-align: center !important;
    transform: translateY(5px);
  }
  .summaryTitle {
    background-color: darkorange;
  }
  .icon {
    height: 32px;
    width: 32px;
  }
  a {
    color: black;
    text-decoration: none;
  }
</style>
