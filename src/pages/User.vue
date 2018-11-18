<template>
  <v-layout class="mb-3" row wrap>
    <!-- Top -->
    <v-flex class="text-xs-left" xs12>
      <v-layout row nowrap>
        <v-breadcrumbs class="breadcrumbs" :items="breadcrumbs">
          <v-icon slot="divider">chevron_right</v-icon>
        </v-breadcrumbs>
        <v-layout row class="userSummary">
          <v-layout column class="mr-2">
            <span class="headline">{{totalGames}} games</span>
          </v-layout>
          <v-layout column>
            <span class="display-1">(</span>
          </v-layout>
          <v-layout column class="ml-2 mr-2 body-2 text-xs-center">
            <span>{{totalConstructed}} Constructed</span>
            <span>{{totalLimited}} Limited</span>
          </v-layout>
          <v-layout column class="mr-4">
            <span class="display-1">)</span>
          </v-layout>
        </v-layout>
      </v-layout>
    </v-flex>
    <v-flex xs12>
      <v-divider/>
    </v-flex>
    <!-- Left -->
    <v-flex class="center pt-3 pl-4 pr-2" xs7>
      <span class='body-2 grey--text text--darken-2'>
        <strong>Collection Summary</strong>
      </span>
      <v-layout row wrap>
        <v-card class="setSummary mt-4 m-auto" v-for="set in userCollectionSummary" :key="set.code">
          <div class="summaryTitle pt-1 pb-1 white--text body-1">{{set.name}}</div>
          <v-tooltip v-for="rarity in rarities" :key="`${set.code}_${rarity.name.toLowerCase()}`" right lazy>
            <router-link :to="`/user/collection?page=1&sets=${set.code}&rarities=${rarity.name.toLowerCase()[0]}`"
              slot="activator">
              <v-layout row nowrap>
                <SetSymbol class="setSymbol ml-2" :set="set.code" :rarity="rarity.name.toLowerCase()"/>
                <v-progress-linear class="ml-2" :color="rarity.color" height="5"
                  :value="set.unique[rarity.name.toLowerCase()] / set.all[rarity.name.toLowerCase()] * 100"/>
                <span class="summaryValue">{{getSummaryUniquePercent(set, rarity.name.toLowerCase())}}%</span>
              </v-layout>
            </router-link>
            <v-layout column>
              <span>Unique cards: {{set.unique[rarity.name.toLowerCase()]}} / {{set.all[rarity.name.toLowerCase()]}}</span>
              <span>Playset: {{set.owned[rarity.name.toLowerCase()]}} / {{set.all[rarity.name.toLowerCase()] * 4}}</span>
            </v-layout>
          </v-tooltip>
        </v-card>
      </v-layout>
    </v-flex>
    <!-- Right -->
    <v-flex class="rSide pt-3 pl-2 pr-2 pb-3" xs5>
      <span class='body-2 grey--text text--darken-2'>
        <strong>Events Summary</strong>
      </span>
      <v-layout row wrap>
        <v-flex xs6 class="eventStat" v-for="eventStat in userEventsStats" :key="eventStat.name">
          <EventStats class="mt-3" :data="eventStat" :id="eventStat.name"/>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import EventStats from '@/components/charts/EventStats'
import SetSymbol from '@/components/mtg/SetSymbol'
import Utils from '@/scripts/utils'

export default {
  name: 'PublicDeck',
  components: {
    EventStats, SetSymbol
  },
  created () {
    this.requestUserCollectionSummary()
    this.requestUserEventsStats()
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
      rarities: Utils.rarities,
      totalGames: 0,
      totalConstructed: 0,
      totalLimited: 0
    }
  },
  methods: {
    requestUserCollectionSummary: function () {
      this.$api.getUserCollection(true)
        .then(res => {
          this.userCollectionSummary = res.data.filter(set => set.code !== 'ANA' && set.code !== 'MED')
        })
        .catch(error => {
          console.log(error)
        })
    },
    requestUserEventsStats: function () {
      this.$api.getUserEventsStats()
        .then(res => {
          const data = res.data.map(stat => {
            const event = Utils.events.find(event => event.name === stat.name)
            stat['type'] = event.type
            return stat
          })
          data.sort((e1, e2) => {
            const e1Index = Utils.events.findIndex(event => event.name === e1.name)
            const e2Index = Utils.events.findIndex(event => event.name === e2.name)
            return e1Index - e2Index
          })
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
    getSummaryUniquePercent: function (set, rarity) {
      const percent = set.unique[rarity] / set.all[rarity] * 100
      return parseFloat(percent.toFixed(0))
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .userSummary {
    justify-content: flex-end;
  }
  .userSummary .layout {
    justify-content: center;
    flex: none;
  }
  .eventStat {
    min-height: 200px;
  }
  .setSummary {
    width: 200px;
  }
  .setSymbol {
    transform: translateY(5px);
  }
  .summaryValue {
    min-width: 60px;
    text-align: center !important;
    transform: translateY(5px);
  }
  .summaryTitle {
    background-color: darkorange;
  }
  a {
    color: black;
    text-decoration: none;
  }
</style>
