<template>
  <v-card id="decks">
    <div id="deck" v-for="deck in currentDecks" :key="deck.id"
      :class="`mt-1 ml-1 mr-1 mb-1 cover-${deck.colors}`">
      <strong class="white--text">{{ deck.name }}</strong>
      <div id="mana">
        <img v-for="color in deck.colors.split('')" :key="color"
          :src="require(`@/assets/mana/${color}.png`)"/>
      </div>
    </div>
  </v-card>
</template>

<script>
export default {
  name: 'PublicDecks',
  mounted () {
    this.getDecks()
  },
  data () {
    return {
      currentPage: 1,
      currentDecks: {},
      covers: {
        'b': require('@/assets/decks/b.jpg'),
        'bg': require('@/assets/decks/bg.jpg'),
        'br': require('@/assets/decks/br.jpg'),
        'brg': require('@/assets/decks/brg.jpg'),
        'c': require('@/assets/decks/c.jpg'),
        'default': require('@/assets/decks/default.jpg'),
        'g': require('@/assets/decks/g.jpg'),
        'gu': require('@/assets/decks/gu.jpg'),
        'gw': require('@/assets/decks/gw.jpg'),
        'gwu': require('@/assets/decks/gwu.jpg'),
        'm': require('@/assets/decks/m.jpg'),
        'r': require('@/assets/decks/r.jpg'),
        'rg': require('@/assets/decks/rg.jpg'),
        'rgw': require('@/assets/decks/rgw.jpg'),
        'rw': require('@/assets/decks/rw.jpg'),
        'u': require('@/assets/decks/u.jpg'),
        'ub': require('@/assets/decks/ub.jpg'),
        'ubr': require('@/assets/decks/ubr.jpg'),
        'ur': require('@/assets/decks/ur.jpg'),
        'w': require('@/assets/decks/w.jpg'),
        'wb': require('@/assets/decks/wb.jpg'),
        'wu': require('@/assets/decks/wu.jpg'),
        'wub': require('@/assets/decks/wub.jpg')
      }
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
    display: flex;
  }
  #deck {
    height: 50px;
    width: 200px;
  }
  #mana img {
    height: 20px;
    width: 20px;
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