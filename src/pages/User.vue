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
    <v-flex hidden-sm-and-down    md3 lg2 xl3>

      <div class="pl-2 pr-2">
        <WildcardsCost class="mt-4 m-auto" :cost="userWildcards"/>
      </div>

    </v-flex>
    <!-- Center -->
    <v-flex class="center"                 xs12 sm8 md6 lg7 xl6>

    </v-flex>
    <!-- Right -->
    <v-flex class="rSide mb-3"   hidden-xs-only sm4 md3 lg3 xl3>
      
    </v-flex>
  </v-layout>
</template>

<script>
import WildcardsCost from '@/components/mtg/WildcardsCost'

export default {
  name: 'PublicDeck',
  components: {
    WildcardsCost
  },
  created () {
    this.requestUserCollectionSummary()
    this.requestUserWildcards()
  },
  data () {
    return {
      userCollectionSummary: {},
      userWildcards: {}
    }
  },
  methods: {
    requestUserCollectionSummary: function () {
      this.$api.getUserCollection(true)
        .then(res => {
          this.userCollectionSummary = res.data
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
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
