<template>
  <v-layout row wrap>
    <v-flex xs12 class="text-xs-center">
      <v-progress-circular v-if="isLoading" color="deep-orange"
        :width="2" :size="24" :indeterminate="true"/>
    </v-flex>
    <v-flex xs6>
      <WinRatePieDistribution :data="winrateByColors" id="colorsWins" title="Wins Vs Colors"/>
    </v-flex>
    <v-flex xs6>
      <WinRatePieDistribution :data="winrateByColors" id="colorsLosses" title="Losses Vs Colors"/>
    </v-flex>
    <v-flex xs6 class="mt-5">
      <WinRateHBarDistribution :data="winrateByArchs" id="archsWins" title="Wins Vs Archetypes"/>
    </v-flex>
    <v-flex xs6 class="mt-5">
      <WinRateHBarDistribution :data="winrateByArchs" id="archsLoses" title="Losses Vs Archetypes"/>
    </v-flex>
    <v-flex xs6 class="mt-5">
      <WinRateHBarDistribution :data="winrateByGuilds" id="guildsWins" title="Wins Vs Guilds"/>
    </v-flex>
    <v-flex xs6 class="mt-5">
      <WinRateHBarDistribution :data="winrateByGuilds" id="guildsLoses" title="Losses Vs Guilds"/>
    </v-flex>
  </v-layout>
</template>

<script>
import WinRateHBarDistribution from '@/components/charts/WinRateHBarDistribution'
import WinRatePieDistribution from '@/components/charts/WinRatePieDistribution'

export default {
  components: {
    WinRateHBarDistribution, WinRatePieDistribution
  },
  props: {
    deckId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      isLoading: false,
      winrateByArchs: {},
      winrateByColors: {},
      winrateByGuilds: {}
    }
  },
  mounted () {
    this.$api.getDeckOverview(this.deckId)
      .then(res => {
        this.isLoading = false
        this.winrateByArchs = res.data.archs
        this.winrateByColors = res.data.colors
        this.winrateByGuilds = res.data.guilds
      })
      .catch(error => {
        this.isLoading = false
        console.log(error)
      })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
