<template>
  <v-layout class="mb-3" column>
    <div class="mt-2_5 ml-2_5 mr-2_5">
      <v-layout class="header header-bg" row nowrap>
        <span class="newsTitle headline white--text font-weight-bold">Announcing MTG Lotus Valley!</span>
        <span class="date headline white--text font-weight-bold">
          {{ new Date('2018-12-14 00:00').toLocaleString().split(' ')[0].replace(',', '') }}
        </span>
      </v-layout>
    </div>
    <div class="box mt-0 pl-2 pr-2">
      <v-layout class="mainContainer boxContent mt-5 pl-4 pr-4" row nowrap>
        <v-layout class="text-xs-left pb-3" column wrap>
          <span class="title">About</span>
          <span class="body-1 mt-2">
            Mtg Lotus Valley is a place where you can check the current and future events in Magic Arena, take a look at some info about current meta, search for decks lists and build your own deck list too.
            But the real power of this website is on the synchronisation of game data provided by <a href="/lotustracker">Lotus Tracker</a>.
          </span>
          <span class="title mt-4">Lotus Tracker data synchronisation</span>
          <span class="body-1 mt-2">
            With Lotus Tracker installed on your PC, you will be able to check directly on Mtg Lotus Valley:
          </span>

          <span class="subheading font-weight-bold mt-3">Player data and matches</span>
          <span class="body-1 mt-2">Gold, gems, wildcards and Vault progress and History of your played matches with Win Rate by events</span>
          <a class="ta-center" href="static/images/user_summary.jpg" target="_blank">
            <img class="mt-2" src="static/images/user_summary.jpg" style="width: 80%;"/>
          </a>

          <span class="subheading font-weight-bold mt-3">Your Collection</span>
          <span class="body-1 mt-2">Check how many copies you have of a specific card</span>
          <a class="ta-center" href="static/images/user_collection.jpg" target="_blank">
            <img class="mt-2" src="static/images/user_collection.jpg" style="width: 80%;"/>
          </a>

          <span class="subheading font-weight-bold mt-3">Events results</span>
          <span class="body-1 mt-2">Event runs history with deck used and result</span>
          <a class="ta-center" href="static/images/user_events.jpg" target="_blank">
            <img class="mt-2" src="static/images/user_events.jpg" style="width: 80%;"/>
          </a>

          <span class="title mt-4">Meta</span>
          <span class="body-1 mt-2">
            In <a href="/meta">meta</a>'s page, you can check some info like the mostly used cards in the last day or last week.
            You can also check some graphs of mostly used colors, guilds or deck archetypes!
          </span>
          <a class="ta-center" href="static/images/meta.jpg" target="_blank">
            <img class="mt-2" src="static/images/meta.jpg" style="width: 80%;"/>
          </a>
          
          <span class="title mt-4">Decks</span>
          <span class="body-1 mt-2">
            Lear more about decks <a href="/mtglv_decks">here</a>
          </span>
          <v-layout class="mt-5" row nowrap>
            <v-spacer/>
            <span class="subheading">And more coming! Keep stay on Mtg Lotus Valley and Lotus Tracker updates</span>
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
  // Usage with context the component
  metaInfo: {
    meta: [
      { property: 'og:title', content: 'Announcing MTG Lotus Valley!' },
      { property: 'og:image', content: require('@/assets/pages-headers/EmmaraSoulOfTheAccord.jpg') }
    ]
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
    background-image: url('~@/assets/pages-headers/EmmaraSoulOfTheAccord.jpg');
    height: 250px !important;
    position: relative;
  }
  .date {
    position: absolute;
    left: calc(100% - 145px);
    top: calc(100% - 40px);
  }
  .newsTitle {
    position: absolute;
    left: 16px;
    top: calc(100% - 40px);
  }
</style>
