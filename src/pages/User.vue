<template>
  <v-layout class="mb-3" row wrap>
    <!-- Top -->
    <v-flex class="text-xs-left" xs12>
      <v-breadcrumbs class="ml-2">
        <v-icon slot="divider">chevron_right</v-icon>
        <v-breadcrumbs-item exact ripple to="/">Home</v-breadcrumbs-item>
        <v-breadcrumbs-item exact ripple disabled>User</v-breadcrumbs-item>
      </v-breadcrumbs>
    </v-flex>
    <v-flex xs12>
      <v-divider/>
    </v-flex>
    <!-- Left -->
    <v-flex hidden-sm-and-down                    md3 lg2 xl2>

      <div class="pl-2 pr-2">
        <WildcardsCost class="mt-4 m-auto" :cost="userWildcards"/>
      </div>

    </v-flex>
    <!-- Center -->
    <v-flex class="center"               xs12 sm8 md7 lg6 xl6>
    </v-flex>
    <!-- Right -->
    <v-flex class="rSide pt-3 mb-3" hidden-xs-only sm4 md2 lg4 xl4>
      <span class='body-2 grey--text text--darken-2'>
        <strong>Collection Summary</strong>
      </span>
      <v-layout row wrap class="mt-1">
        <v-card class="setSummary mt-3 mr-3" v-for="set in userCollectionSummary" :key="set.code">
          <div class="summaryTitle pt-1 pb-1 white--text body-1">{{set.name}}</div>
          <v-tooltip v-for="rarity in rarities" :key="`${set.code}_${rarity.name}`" top lazy>
            <v-layout row nowrap slot="activator">
              <SetSymbol class="setSymbol ml-2" :set="set.code" :rarity="rarity.name"/>
              <v-progress-linear class="ml-2" :color="rarity.color" height="5"
                :value="set.unique[rarity.name] / set.all[rarity.name] * 100"/>
              <span class="summaryValue">{{getSummaryUniquePercent(set, rarity.name)}}%</span>
            </v-layout>
            <v-layout column>
              <span>Unique cards: {{set.unique[rarity.name]}} / {{set.all[rarity.name]}}</span>
              <span>Playset: {{set.owned[rarity.name]}} / {{set.all[rarity.name] * 4}}</span>
            </v-layout>
          </v-tooltip>
        </v-card>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import SetSymbol from '@/components/mtg/SetSymbol'
import WildcardsCost from '@/components/mtg/WildcardsCost'

export default {
  name: 'PublicDeck',
  components: {
    SetSymbol, WildcardsCost
  },
  created () {
    this.requestUserCollectionSummary()
    this.requestUserWildcards()
  },
  data () {
    return {
      userCollectionSummary: [],
      userWildcards: {},
      rarities: [
        { name: 'common', color: 'grey' },
        { name: 'uncommon', color: 'blue-grey' },
        { name: 'rare', color: 'amber' },
        { name: 'mythic', color: 'deep-orange' }
      ]
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
    requestUserWildcards: function () {
      this.$api.getUserExtras(this.deckAlias)
        .then(res => {
          if (res.data === '') {
            this.userWildcards = {}
            return
          }
          this.userWildcards = {
            'mythic': res.data['wcMythic'],
            'rare': res.data['wcRare'],
            'uncommon': res.data['wcUncommon'],
            'common': res.data['wcCommon']
          }
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
</style>
