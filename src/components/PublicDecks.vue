<template>
  <v-card id="decks">
    <router-link v-for="deck in currentDecks" :key="deck.alias" :to="`/decks/${deck.alias}`">
      <div class="deck">
        <div :class="`mt-1 ml-1 mr-1 mb-1 cover cover-${deck.colors}`">
          <!-- Line 1 -->
          <v-flex class="line line1" sm12>
            <strong class="white--text">{{ deck.name }}</strong>
          </v-flex>
          <!-- Line 2 -->
          <v-flex class="line line2" sm12>
            <div id="mana">
            <img v-for="color in deck.colors.split('')" :key="color"
              :src="require(`@/assets/mana/${color}.png`)"/>
            </div>
          </v-flex>
        </div>
      </div>
    </router-link>
  </v-card>
</template>

<script>
export default {
  mounted () {
    this.getDecks()
  },
  data () {
    return {
      currentPage: 1,
      currentDecks: {}
    }
  },
  methods: {
    getDecks: function () {
      const pageSize = 5
      this.$api.getPublicDecks(this.currentPage, pageSize)
        .then(res => {
          this.currentDecks = res.data
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
  #decks {
    height: 80px;
    display: inline-flex;
    overflow-x: auto;
    overflow-y: hidden;
  }
  .deck {
    height: 75px;
    width: 200px;
    float: left;
    overflow-y: hidden;
  }
  .deck:hover {
    transform: scale(1.05);
  }
  .cover {
    background-size: cover;
    background-position: center;
    height: 70px;
    border-radius: 5px;
  }
  #mana {
    margin-left: 10px;
  }
  #mana img {
    height: 20px;
    width: 20px;
  }
  .line {
    text-align: start;
  }
  .line1 strong {
    margin-top: 5px;
    margin-left: 10px;
  }
  .line2 {
    margin-top: 4px;
  }
  .cover-b { background-image: url('~@/assets/decks/b.jpg') }
  .cover-bg { background-image: url('~@/assets/decks/bg.jpg') }
  .cover-br { background-image: url('~@/assets/decks/br.jpg') }
  .cover-brg { background-image: url('~@/assets/decks/brg.jpg') }
  .cover-c { background-image: url('~@/assets/decks/c.jpg') }
  .cover-default { background-image: url('~@/assets/decks/default.jpg') }
  .cover-g { background-image: url('~@/assets/decks/g.jpg') }
  .cover-gu { background-image: url('~@/assets/decks/gu.jpg') }
  .cover-gw { background-image: url('~@/assets/decks/gw.jpg') }
  .cover-gwu { background-image: url('~@/assets/decks/gwu.jpg') }
  .cover-m { background-image: url('~@/assets/decks/m.jpg') }
  .cover-r { background-image: url('~@/assets/decks/r.jpg') }
  .cover-rg { background-image: url('~@/assets/decks/rg.jpg') }
  .cover-rgw { background-image: url('~@/assets/decks/rgw.jpg') }
  .cover-rw { background-image: url('~@/assets/decks/rw.jpg') }
  .cover-u { background-image: url('~@/assets/decks/u.jpg') }
  .cover-ub { background-image: url('~@/assets/decks/ub.jpg') }
  .cover-ubr { background-image: url('~@/assets/decks/ubr.jpg') }
  .cover-ur { background-image: url('~@/assets/decks/ur.jpg') }
  .cover-w { background-image: url('~@/assets/decks/w.jpg') }
  .cover-wb { background-image: url('~@/assets/decks/wb.jpg') }
  .cover-wu { background-image: url('~@/assets/decks/wu.jpg') }
  .cover-wub { background-image: url('~@/assets/decks/wub.jpg') }
</style>