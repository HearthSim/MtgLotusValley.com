<template>
  <v-layout row wrap>
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
    winrate: {
      type: Object,
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
  watch: {
    winrate: function (value) {
      this.winrateByArchs = value.archs
      this.winrateByColors = value.colors
      this.winrateByGuilds = value.guilds
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
