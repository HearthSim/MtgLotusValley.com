<template>
  <v-layout class="mb-3" column>
    <div class="mt-2_5 ml-2_5 mr-2_5">
      <v-layout class="header header-bg" row nowrap>
        <span class="newsTitle headline white--text font-weight-bold">Exploring MTG Lotus Valley Decks</span>
        <span class="date headline white--text font-weight-bold">
          {{ new Date('2018-12-16 00:00').toLocaleString().split(' ')[0].replace(',', '') }}
        </span>
      </v-layout>
    </div>
    <div class="box mt-0 pl-2 pr-2">
      <v-layout class="mainContainer boxContent mt-5 pl-4 pr-4" row nowrap>
        <v-layout class="text-xs-left pb-3" column wrap>
          <span class="title">Decks</span>
          <span class="body-1 mt-2">
            Mtg Lotus Valley allow you have private and public decks, and although they have many things in common, each one also has it's own details.
          </span>
          <span class="subheading font-weight-bold mt-3">Private and Public deck features</span>
          <ul class="mt-2">
            <li><span class="subheading">Deck cards and sideboard group by type</span><br/></li>
            <li><span class="subheading mt-3">Mana curve with creatures and non-creatures number</span><br/></li>
            <li><span class="subheading mt-3">Button to Export deck to arena</span><br/></li>
            <li><span class="subheading mt-3">Button to Export deck in a more readable text</span><br/></li>
            <li><span class="subheading mt-3">Total build cost in wildcards</span><br/></li>
            <li><span class="subheading mt-3">Status page with type, color and mana distribition graphs</span><br/></li>
            <li><span class="subheading mt-3">Updates page with what comes in and out to deck</span><br/></li>
            <li><span class="subheading mt-3">Visual mode that show all cards images</span><br/></li>
            <li><span class="subheading mt-3">Play Test to allow simulate mulligan, draw and plays</span><br/></li>
          </ul>

          <span class="subheading font-weight-bold mt-3">Private Deck</span>
          <span class="body-1 mt-2">Private deck has some deck performance informations like, deck win rate, wins and losses by colors and decks archetypes. Also the Matches session show all matches played with this deck.</span>
          <span class="body-1 mt-2">The publish button allow you to create a public version of this deck, so anyone will be able to see it.</span>
          <a class="ta-center mt-3" href="static/images/user_deck.jpg" target="_blank">
            <img src="static/images/user_deck.jpg" style="width: 80%;"/>
          </a>

          <span class="subheading font-weight-bold mt-3">Public decks list</span>
          <span class="body-1 mt-2">The public decks page allow you to see the most recent publish decks and already know how many cards you have of that deck! It also provide the following filters for easily find decks:</span>
          <ul class="mt-2">
            <li><span class="subheading">Deck name</span><br/></li>
            <li><span class="subheading mt-3">Deck archetype</span><br/></li>
            <li><span class="subheading mt-3">Deck colors</span><br/></li>
            <li><span class="subheading mt-3">Deck format, constructed or limited</span><br/></li>
            <li><span class="subheading mt-3">Deck with a specific card</span><br/></li>
          </ul>
          <a class="ta-center mt-3" href="static/images/public_decks.jpg" target="_blank">
            <img src="static/images/public_decks.jpg" style="width: 80%;"/>
          </a>

          <span class="subheading font-weight-bold mt-3">Public deck</span>
          <span class="body-1 mt-2">Public deck has two main differentials:</span>
          <ul class="mt-2">
            <li><span class="subheading">Allow the owner to create a guide using markdown text</span><br/></li>
            <li><span class="subheading mt-3">Show the cards you are missing, your the deck total build cost in wildcards.</span><br/></li>
          </ul>
          <a class="ta-center mt-3" href="static/images/public_deck.jpg" target="_blank">
            <img src="static/images/public_deck.jpg" style="width: 80%;"/>
          </a>
          <v-layout class="mt-5" row nowrap>
            <v-spacer/>
            <span class="subheading">Keep stay on Mtg Lotus Valley and Lotus Tracker updates</span>
            <v-spacer/>
          </v-layout>
        </v-layout>
      </v-layout>
    </div>
  </v-layout>
</template>

<script>

import VueMarkdown from 'vue-markdown'

export default {
  name: 'LotusTracker',
  components: {
    VueMarkdown
  },
  data () {
    return {
      lotusTrackerWindows: 'https://github.com/edipo2s/LotusTracker/releases/download/v1.0.0/Lotus.Tracker.1.0.2.exe'
    }
  },
  created () {
    this.$scrollToTop()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .header-bg {
    background-image: url('~@/assets/pages-headers/Healers-Hawk.jpg');
    height: 250px !important;
    position: relative;
  }
  @media (max-width: 767px) {
    .date {
      position: absolute;
      left: calc(100% - 145px);
      top: calc(20px);
    } 
  }
  @media (min-width: 768px) {
    .date {
      position: absolute;
      left: calc(100% - 145px);
      top: calc(100% - 40px);
    } 
  }
  .newsTitle {
    position: absolute;
    left: 16px;
    top: calc(100% - 40px);
  }
</style>
