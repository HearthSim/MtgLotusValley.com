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
            <v-flex xs12 class="boxHeader">Casual Matches Summary</v-flex>
            <v-layout class="boxContent pb-2" column nowrap>
              <v-layout row nowrap>
                <v-flex v-for="(summary, index) in userCasualConstructedSummary" v-bind:key="index">
                  <EventStats :data="summary" :id="summary.event"/>
                </v-flex>
              </v-layout>
              <MatchesTimeline class="mt-4 pr-2" :matches="userCasualMatchesData"/>
              <v-layout row xs12 class="mt-1">
                <v-spacer/>
                <v-pagination v-model="paginationCasual.page" @input="requestCasualUserMatches"
                  :length="totalCasualPages" :total-visible="5"/>
              </v-layout>

            </v-layout>
          </v-layout>

        </v-tab-item>
        
        <v-tab>Collection</v-tab>
        <v-tab-item lazy>

          <v-layout class="box" row wrap>
            <v-flex xs12 class="boxHeader">Collection Summary</v-flex>
            <v-layout class="boxContent collections mt-0 ml-0 mr-0 pb-2" row wrap>
              <v-card class="setSummary mt-4 pb-2" v-for="set in userCollectionSummary" :key="set.code">
                <v-layout column class="summaryTitle pt-1 mb-1">
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
          
        </v-tab-item>

        <v-tab>Events</v-tab>
        <v-tab-item lazy>
          <v-layout class="box" row nowrap>
            <v-layout class="boxContent pb-2" row wrap>

              <v-flex xs3>
                <v-layout column nowrap>
                  <EventStats :data="userEventsSummaryData" id="userEventSummary"/>
                  <v-divider class="mt-3"/>
                  <strong class="mt-3">Runs</strong>
                  <v-card class="mx-2 my-1 px-2 py-2" v-for="eventRun in userEventsRunsData" :key="eventRun.id">
                    <v-layout row nowrap>
                      <span :class="`mt-1 body-2 ${eventRun.wins > eventRun.losses ? 'green--text' : ''}`">{{eventRun.wins}}</span>
                      <span class="mt-1"> x </span>
                      <span :class="`mt-1 body-2 ${eventRun.losses > eventRun.wins ? 'red--text' : ''}`">{{eventRun.losses}}</span>
                      <router-link :to="`/user/decks/${eventRun.deckId}`">        
                        <div class="ml-2 pt-1 mana">
                          <img v-for="color in eventRun.deckColors? eventRun.deckColors.split('') : []" :key="color"
                            :src="require(`@/assets/mana/${color}.png`)"/>
                        </div>
                      </router-link>
                      <v-spacer/>
                      <span class="caption mt-1 pt-1">
                        {{ new Date(eventRun.date.replace('_', ':')).toLocaleString().replace(':00', '') }}
                      </span>
                    </v-layout>
                  </v-card>
                  <v-layout row xs12 class="mt-1">
                    <v-spacer/>
                    <v-pagination v-model="paginationEventsRuns.page" @input="requestUserEventsRuns"
                      :length="totalEventsRunsPages" :total-visible="5"/>
                  </v-layout>
                </v-layout>
              </v-flex>
              
              <v-flex xs9>
                <v-layout row xs12 class="mt-1">
                  <v-spacer/>
                  <v-select class="ml-2 mt-1" v-model="currentEventName" :items="userEventsNames"
                    @change="onEventChange" label="Event" solo dense hide-details/>
                </v-layout>
                <MatchesTimeline class="pr-3" :matches="userEventsMatchesData" :eventName="false"/>                
                <v-layout row xs12 class="mt-1">
                  <v-spacer/>
                  <v-pagination v-model="paginationEvents.page" @input="requestUserEventsMatches"
                    :length="totalEventsPages" :total-visible="5"/>
                </v-layout>

              </v-flex>

            </v-layout>
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
      localId: this.$route.query.localId,
      email: this.$route.query.email,
      idToken: this.$route.query.idToken,
      refreshToken: this.$route.query.refreshToken,
      userName: this.$route.query.userName,
      expiresIn: this.$route.query.expiresIn,
      userCollectionSummary: [],
      userGold: 0,
      userGems: 0,
      userVault: 0.0,
      userWildcards: {},
      rarities: Utils.rarities,
      totalGames: 0,
      totalConstructed: 0,
      totalLimited: 0,
      isLoading: false,
      userCasualConstructedSummary: [],
      userEventsSummary: [],
      userEventsNames: [],
      paginationCasual: { page: 1 },
      totalCasualPages: 1,
      userCasualMatchesData: [],
      paginationEvents: { page: 1 },
      totalEventsPages: 1,
      currentEvent: '',
      currentEventName: '',
      userEventsSummaryData: {},
      userEventsMatchesData: [],
      paginationEventsRuns: { page: 1 },
      userEventsRunsData: [],
      totalEventsRunsPages: 1
    }
  },
  created () {
    this.checkAuthQueryParams()
    this.requestUserExtras()
    this.requestUserCollectionSummary()
    this.requestUserEventsSummary()
    this.requestCasualUserMatches()
  },
  methods: {
    checkAuthQueryParams: function () {
      this.$router.push({
        path: 'user'
      })
      if (!this.$isUserLogged()) {
        if (this.idToken === undefined || this.idToken === '') {
          this.$router.replace('/')
        } else {
          const emailUserName = this.email.substring(0, this.email.indexOf('@'))
          this.$api.saveUserToken({
            localId: this.localId,
            email: this.email,
            idToken: this.idToken,
            refreshToken: this.refreshToken,
            userName: this.userName.length > 0 ? this.userName : emailUserName,
            expiresIn: this.expiresIn
          })
          this.$router.replace('/user')
        }
      }
    },
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
    requestUserEventsSummary: function () {
      this.$api.getUserEventsSummary()
        .then(res => {
          const data = res.data
          this.totalGames = data.map(summary => summary.wins + summary.losses).reduce((acc, value) => acc + value)
          const totalConstructedData = data.filter(summary => summary.type === 'Constructed')
            .map(summary => summary.wins + summary.losses)
          this.totalConstructed = totalConstructedData.length > 0
            ? totalConstructedData.reduce((acc, value) => acc + value) : 0
          const totalLimitedData = data.filter(summary => summary.type === 'Limited')
            .map(summary => summary.wins + summary.losses)
          this.totalLimited = totalLimitedData.length > 0
            ? totalLimitedData.reduce((acc, value) => acc + value) : 0
          this.userCasualConstructedSummary = data.filter(summary => summary.casual)
          const events = data.filter(summary => !summary.casual)
          this.userEventsSummary = events
          this.userEventsNames = events.map(summary => summary.name)
          if (events.length > 0) {
            this.currentEventName = events[0].name
            this.onEventChange(events[0].name)
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    onEventChange: function (newValue) {
      this.userEventsMatchesData = []
      this.userEventsRunsData = []
      this.userEventsSummaryData = this.userEventsSummary.find(summary => summary.name === newValue)
      this.currentEvent = this.userEventsSummaryData.event
      this.requestUserEventsMatches()
      this.requestUserEventsRuns()
    },
    requestCasualUserMatches: function () {
      this.isLoading = true
      this.paginationCasual.rowsPerPage = 10
      const { sortBy, descending, page, rowsPerPage } = this.paginationCasual
      this.$api.getUserDeckMatches(this.deckId, page, rowsPerPage, sortBy, descending, undefined, true)
        .then(res => {
          this.isLoading = false
          this.userCasualMatchesData = []
          this.totalCasualPages = res.data.length < rowsPerPage ? page : page + 1
          res.data.forEach(match => {
            const userMatchesSize = this.userCasualMatchesData.length
            const lastUserMatch = this.userCasualMatchesData[userMatchesSize - 1]
            if (userMatchesSize === 0 || lastUserMatch.date.substring(0, 10) !== match.date.substring(0, 10)) {
              const date = new Date(match.date.replace('_', ':'))
              this.userCasualMatchesData.push({
                isHeader: true,
                dateFormatted: date.toLocaleString().split(' ')[0].replace(',', '')
              })
            }
            this.userCasualMatchesData.push(match)
          })
        })
        .catch(error => {
          this.isLoading = false
          console.log(error)
        })
    },
    requestUserEventsMatches: function () {
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
            const lastUserMatch = this.userEventsMatchesData[userMatchesSize - 1]
            if (userMatchesSize === 0 || lastUserMatch.date.substring(0, 10) !== match.date.substring(0, 10)) {
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
    },
    requestUserEventsRuns: function () {
      this.isLoading = true
      this.paginationEventsRuns.rowsPerPage = 4
      const page = this.paginationEventsRuns.page
      const rowsPerPage = this.paginationEventsRuns.rowsPerPage
      this.$api.getUserEvents(this.currentEvent, page, rowsPerPage)
        .then(res => {
          this.isLoading = false
          this.userEventsRunsData = res.data
          this.totalEventsRunsPages = res.data.length < rowsPerPage ? page : page + 1
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
    width: 210px;
  }
  .setSummary:not(:first-child) {
    margin-left: 24px !important;
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
  .collections {
    justify-content: center;
  }
  .mana img {
    height: 20px;
    width: 20px;
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
