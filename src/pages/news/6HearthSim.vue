<template>
  <v-layout class="mb-3" column>
    <div class="mt-2_5 ml-2_5 mr-2_5">
      <v-layout class="header header-bg" row nowrap>
        <span class="newsTitleShadow headline black--text font-weight-bold">Lotus Valley is joining forces with HearthSim!</span>
        <span class="newsTitle headline white--text font-weight-bold">Lotus Valley is joining forces with HearthSim!</span>
        <span class="date headline white--text font-weight-bold">
          {{ new Date('2019-05-02 00:00').toLocaleString().split(' ')[0].replace(',', '') }}
        </span>
      </v-layout>
    </div>
    <div class="box mt-0 pl-2 pr-2">
      <v-layout class="mainContainer boxContent mt-5 pl-4 pr-4" row nowrap>
        <v-layout class="text-xs-left pb-3" column wrap>
          <span class="title">About me</span>
          <span class="body-1 mt-3">
            As the developer of this project, I, Édipo da Silva Souza, am really excited to announce that I have joined
            HearthSim as a software engineer and we are joining forces to build the best tools for MTG Arena!
          </span>
          <span class="body-1 mt-2">
            HearthSim is the company behind HSReplay.net and HDT (Hearthstone Deck Tracker) as well, the best tool and the 
            <a href="https://twitter.com/HSReplayNet/status/1100184406843711489" target="_blank">most popular website</a>
            about Hearthstone. They have recently started a new project for MTGArena called Untapped.gg, a really nice deck
            tracker and statistics collector that looks very promising and it's evolving fast! It will be very rewarding
            and challenging to be part of the team to help everything happen. You can learn more about it on
            <a href="https://untapped.gg" target="_blank">Untapped.gg</a>
          </span>
          <span class="title mt-4">About this project</span>
          <span class="body-1 mt-3">
            Lotus Tracker will continue to be updated and maintained for the time being. Eventually I hope you all will
            migrate over to Untapped.gg so that I can continue to build great tools for you, but I will only ask that you
            make this change when Untapped.gg has the same features as Lotus Tracker, so the users will feel comfortable
            with the migration.
          </span>
          <span class="body-1 mt-2">
            Since Lotus Tracker was just a project that I started by hobby, it's really amazing that now I can continue
            to do that in a more professional way, dedicating more time and focusing on doing my best to build an amazing
            project for MTG Arena like Hearthstone has with HSReplay.net.
          </span>
          
          <vue-disqus class="mt-5" shortname="mtglotusvalley"/>

        </v-layout>
      </v-layout>
    </div>
  </v-layout>
</template>

<script>

import VueMarkdown from 'vue-markdown'

export default {
  name: 'HearthSim',
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
    background-image: url('~@/assets/pages-headers/SparkDouble.jpg');
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
  .newsTitleShadow {
    position: absolute;
    left: 15px;
    top: calc(100% - 39px);
  }
</style>
