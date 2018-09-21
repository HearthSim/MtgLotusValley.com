<template>
    <v-layout row align-center>
      <v-flex hidden-xs-only sm3>
      </v-flex>
      <v-flex           xs12 sm9>
        <div class='mt-5'>
          <span class='title'>Collection</span>
        </div>
      </v-flex>
    </v-layout>
</template>

<script>
import Card from './internals/Card'

export default {
  name: 'UserCollection',
  components: {
    Card
  },
  created () {
    this.getUserCollection()
  },
  data () {
    return {
      userCollection: {},
      cardsPageData: {},
      cardsPageIndex: 1
    }
  },
  methods: {
    getUserCollection: function () {
      this.$api.getUserCollection()
      .then(res => {
        this.userCollection = res.data
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
