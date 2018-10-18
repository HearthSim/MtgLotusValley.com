<template>
  <v-card id="decks">
    <v-layout row>
      <v-flex>
        <div class="btArrow" v-on:click="scrollLeft()">
          <v-icon>keyboard_arrow_left</v-icon>
        </div>
      </v-flex>
      <v-flex class="scroll" ref="scrollView">
        <router-link v-for="deck in currentDecks" :key="deck.alias" :to="`/decks/${deck.alias}`">
          <div class="deck">
            <div :class="`mt-1 ml-1 mr-1 mb-1 cover cover-${deck.colors}`">
              <!-- Line 1 -->
              <v-layout class="line line1" row nowrap>
                <v-flex>
                  <div class="mt-2">
                    <span>
                      <strong class="white--text">{{ deck.name }}</strong>
                    </span>
                  </div>
                </v-flex>
                <v-spacer/>
                <v-flex>
                  <div id="mana" class="mt-2">
                    <img v-for="color in deck.colors.split('')" :key="color"
                      :src="require(`@/assets/mana/${color}.png`)"/>
                  </div>
                </v-flex>
              </v-layout>
              <!-- Line 2 -->
              <v-layout class="line line2" row nowrap>
                <v-flex>
                  <WildcardsCost class="mt-1 mr-2" :cost="deck.wildcardCost" :small="true"/>
                </v-flex>
                <v-spacer/>
                <v-flex>
                  <ManaCurveCompact class="manaCurve mt-1" :manaCurve="deck.manaCurve"/>
                </v-flex>
              </v-layout>
            </div>
          </div>
        </router-link>
        <router-link v-if="decksLoaded" :to="'/decks'">
          <div class="deck">
            <div :class="`mt-1 ml-1 mr-1 mb-1 cover cover-default`">
              <v-layout class="line showMore" row nowrap>
                <div>
                  <strong class="white--text">More Decks</strong>
                </div>
              </v-layout>
            </div>
          </div>
        </router-link>
      </v-flex>
      <v-flex>
        <div class="btArrow" v-on:click="scrollRight()">
          <v-icon>keyboard_arrow_right</v-icon>
        </div>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
import ManaCurveCompact from '@/components/ManaCurveCompact'
import WildcardsCost from '@/components/mtg/WildcardsCost'

export default {
  components: {
    ManaCurveCompact, WildcardsCost
  },
  mounted () {
    this.getDecks()
  },
  data () {
    return {
      currentPage: 1,
      currentDecks: {},
      decksLoaded: false
    }
  },
  methods: {
    getDecks: function () {
      const pageSize = 10
      this.$api.getPublicDecks(this.currentPage, pageSize)
        .then(res => {
          this.currentDecks = res.data
          this.decksLoaded = true
        })
        .catch(error => {
          this.isLoading = false
          console.log(error)
        })
    },
    scrollLeft: function () {
      this.$refs.scrollView.scrollBy({
        left: -200,
        behavior: 'smooth'
      })
    },
    scrollRight: function () {
      this.$refs.scrollView.scrollBy({
        left: 200,
        behavior: 'smooth'
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #decks {
    height: 80px;
    width: 100%;
    display: inline-flex;
    overflow-x: hidden;
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
  .showMore {
    height: 100%;
    align-items: center;
  }
  .showMore > div {
    width: 100%;
    text-align: center;
  }
  .btArrow {
    height: 100px;
  }
  .btArrow:hover {
    background-color: #DDDDDDAA;
  }
  .btArrow > i {
    transform: translateY(30px);
  }
  .scroll {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    -ms-overflow-style: -ms-autohiding-scrollbar;
  }
  .scroll::-webkit-scrollbar {
    display: none; 
  }
  .scroll > a {
    flex: 0 0 auto; 
  }
  .cover {
    background-size: cover;
    background-position: center;
    height: 70px;
    border-radius: 5px;
    overflow: hidden;
  }
  #mana {
    margin-right: 8px;
    white-space: nowrap;
    float: right;
  }
  #mana img {
    height: 20px;
    width: 20px;
  }
  .manaCurve {
    float: right;
    margin-right: 4px;
  }
  .line {
    text-align: start;
  }
  .line1 {
    height: 35px;
  }
  .line1 span {
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 120px;
    display: block;
    overflow: hidden;
  }
  .line1 strong {
    margin-top: 5px;
    margin-left: 10px;
    font-size: 12pt;
  }
  .line2 {
    margin-top: 4px;
    height: 35px;
  }
  .line #wildcards {
    color: white;
  } 
  .cover-bg { background-image: url('~@/assets/decks/bg.jpg') }
  .cover-br { background-image: url('~@/assets/decks/br.jpg') }
  .cover-brg { background-image: url('~@/assets/decks/brg.jpg') }
  .cover-c { background-image: url('~@/assets/decks/c.jpg') }
  .cover-default { background-image: url('~@/assets/decks/default.jpg') }
  .cover-g { background-image: url('~@/assets/decks/g.jpg') }
  .cover-m { background-image: url('~@/assets/decks/m.jpg') }
  .cover-r { background-image: url('~@/assets/decks/r.jpg') }
  .cover-rg { background-image: url('~@/assets/decks/rg.jpg') }
  .cover-u { background-image: url('~@/assets/decks/u.jpg') }
  .cover-ub { background-image: url('~@/assets/decks/ub.jpg') }
  .cover-ubg { background-image: url('~@/assets/decks/ubg.jpg') }
  .cover-ubr { background-image: url('~@/assets/decks/ubr.jpg') }
  .cover-ug { background-image: url('~@/assets/decks/ug.jpg') }
  .cover-ur { background-image: url('~@/assets/decks/ur.jpg') }
  .cover-urg { background-image: url('~@/assets/decks/urg.jpg') }
  .cover-w { background-image: url('~@/assets/decks/w.jpg') }
  .cover-wb { background-image: url('~@/assets/decks/wb.jpg') }
  .cover-wbg { background-image: url('~@/assets/decks/wbg.jpg') }
  .cover-wbr { background-image: url('~@/assets/decks/wbr.jpg') }
  .cover-wg { background-image: url('~@/assets/decks/wg.jpg') }
  .cover-wr { background-image: url('~@/assets/decks/wr.jpg') }
  .cover-wrg { background-image: url('~@/assets/decks/wrg.jpg') }
  .cover-wu { background-image: url('~@/assets/decks/wu.jpg') }
  .cover-wub { background-image: url('~@/assets/decks/wub.jpg') }
  .cover-wug { background-image: url('~@/assets/decks/wug.jpg') }
  .cover-wur { background-image: url('~@/assets/decks/wur.jpg') }
</style>