<template>
  <ScrollDiv class="scrollDiv" :step="220" multiline>
    <router-link v-for="deck in currentDecks" :key="deck.alias" :to="`/decks/${deck.alias}`">
      <div class="deck mt-1 ml-2 mr-1 mb-2">
        <div :class="`cover cover-${deck.colors}`">
          <!-- Line 1 -->
          <v-layout class="line line1 pt-2" row nowrap>
            <v-flex>
              <div>
                <span>
                  <strong class="white--text">{{ deck.name }}</strong>
                </span>
              </div>
            </v-flex>
            <v-spacer/>
            <v-flex>
              <div id="mana" class="mr-1">
                <img v-for="color in deck.colors.split('')" :key="color"
                  :src="require(`@/assets/mana/${color}.png`)"/>
              </div>
            </v-flex>
          </v-layout>
          <!-- Line 2 -->
          <v-layout class="line line2" row nowrap>
            <v-flex>
              <WildcardsCost class="mt-1 ml-1 white--text" :cost="deck.wildcardCost" :small="true"/>
            </v-flex>
            <v-spacer/>
            <v-flex>
              <ManaCurveCompact class="manaCurve" :manaCurve="deck.manaCurve"/>
            </v-flex>
          </v-layout>
        </div>
      </div>
    </router-link>
    <router-link v-if="decksLoaded" :to="'/decks'">
      <div class="deck">
        <div :class="`mt-2 ml-1 mr-1 mb-1 cover cover-default`">
          <v-layout class="line showMore" row nowrap>
            <div>
              <strong class="white--text">More Decks</strong>
            </div>
          </v-layout>
        </div>
      </div>
    </router-link>
  </ScrollDiv>
</template>

<script>
import ScrollDiv from '@/components/ScrollDiv'
import ManaCurveCompact from '@/components/charts/ManaCurveCompact'
import WildcardsCost from '@/components/mtg/WildcardsCost'

export default {
  components: {
    ScrollDiv, ManaCurveCompact, WildcardsCost
  },
  mounted () {
    this.getDecks()
  },
  data () {
    return {
      currentDecks: {},
      decksLoaded: false
    }
  },
  methods: {
    getDecks: function () {
      this.$api.getPublicDecks(1, 15)
        .then(res => {
          this.currentDecks = res.data
          this.decksLoaded = true
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
  .scrollDiv {
    height: 175px;
  }
  .deck {
    height: 75px;
    width: 210px;
    float: left;
    transform: scale(1);
    transition-duration: .5s;
  }
  .deck:hover {
    transform: scale(1.07);
    transition-duration: .5s;
  }
  .showMore {
    height: 100%;
    align-items: center;
  }
  .showMore > div {
    width: 100%;
    text-align: center;
  }
  .scroll > a {
    flex: 0 0 auto; 
  }
  #mana {
    white-space: nowrap;
    float: right;
  }
  #mana img {
    height: 20px;
    width: 20px;
  }
  .manaCurve {
    float: right;
    margin-top: 2px;
    margin-right: 2px;
  }
  .line {
    text-align: start;
    height: 50%;
  }
  .line #wildcards {
    color: white;
  }
  .line1 span {
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 130px;
    display: block;
    overflow: hidden;
  }
  .line1 strong {
    margin-top: 5px;
    margin-left: 10px;
    font-size: 12pt;
  }
  .line2 {
    margin-top: 6px;
  }
</style>