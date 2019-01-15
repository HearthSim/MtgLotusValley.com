<template>
  <v-layout class="mb-3" column>
    <div class="mt-2_5 ml-2_5 mr-2_5">
      <v-layout class="header header-bg" row nowrap>
        <span class="newsTitle headline white--text font-weight-bold">MTGA January update!</span>
        <span class="date headline white--text font-weight-bold">
          {{ new Date('2019-01-14 00:00').toLocaleString().split(' ')[0].replace(',', '') }}
        </span>
      </v-layout>
    </div>
    <div class="box mt-0 pl-2 pr-2">
      <v-layout class="mainContainer boxContent mt-5 pl-4 pr-4" row nowrap>
        <v-layout class="text-xs-left pb-3" column wrap>
          <span class="title">Economy updates</span>
          <span class="body-1 mt-2">
            This first 2019 update arrives with a must have feature, duplicate protection! It will work by replacing a
            5th rare/mythic card from a pack or ICR for another one from same rarity and set that you have less than four
            copies. If you have all rare copies of a set and would receive a rare card from that set, you will receive
            20 gems instead. The same is value for mythic cards, but the total gems received in this case will be 40 gems.
          </span>
          <span class="body-1 mt-2">
            The Wildcard tracker and Wildcard pack drop rates will not be changing, and opening a booster pack still
            contributes towards the tracker (even when you receive Gems). Uncommons and Commons will still contribute
            to your Vault progress, and the rewards from opening a Vault are unchanged. Also daily Quests and Weekly Win rewards will also remain the same.
          </span>
          <a class="ta-center mt-3" href="static/images/WCGem.jpg" target="_blank">
            <img src="static/images/WCGem.jpg" style="heigth: 100%;"/>
          </a>
          <span class="title mt-3">Ranked Constructed Best-of-Three</span>
          <span class="body-1 mt-2">
            Together with Preseason 2 will start a Ranked Constructed Bo3 event, but no much info is available until end of month.
          </span>
          <span class="title mt-3">Ravnica Allegiance</span>
          <span class="body-1 mt-2">
            Starting this Thursday, january 17h, Ravnica Allegiance will be available on Magic Arena adding 273 new cards
            and the last five Guilds, Azorius, Simic, Gruul, Rakdos, and Orzhov. 
          </span>
          <span class="title mt-3">New Events</span>
          <ul class="mt-2">
            <li><span class="subheading">January 17th: Ravnica Allegiance Sealed</span><br/></li>
            <li><span class="subheading mt-3">January 18th: Ravnica Allegiance Traditional Draft</span><br/></li>
            <li><span class="subheading mt-3">January 25th: Ravnica Allegiance Constructed Block</span><br/></li>
            <li><span class="subheading mt-3">February 1th: Ravnica Allegiance Ranked Draft</span><br/></li>
          </ul>
          
          <vue-disqus class="mt-5" shortname="mtglotusvalley"/>

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
  created () {
    this.$scrollToTop()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .header-bg {
    background-image: url('~@/assets/pages-headers/ArchwayAngel.jpg');
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
