<template>
  <v-layout class="pl-3 pr-3 pb-3" row wrap>
    <v-flex xs6>
      <TypeDistribution :cards="cards"/>
    </v-flex>
    <v-flex xs6>
      <CardsColorDistribution :cards="cards"/>
    </v-flex>

    <v-flex xs6 class="mt-4">
      <CardsManaDistribution :cards="cards" type="symbol"/>
    </v-flex>
    <v-flex xs6 class="mt-4">
      <CardsManaDistribution :cards="cards" type="source"/>
    </v-flex>
  </v-layout>
</template>

<script>
import CardsColorDistribution from '@/components/charts/CardsColorDistribution'
import CardsManaDistribution from '@/components/charts/CardsManaDistribution'
import TypeDistribution from '@/components/charts/TypeDistribution'

export default {
  components: {
    CardsColorDistribution, CardsManaDistribution, TypeDistribution
  },
  props: {
    cards: {
      type: Object,
      required: true
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
