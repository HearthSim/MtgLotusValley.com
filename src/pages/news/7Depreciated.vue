<template>
  <v-layout class="mb-3" column>
    <div class="mt-2_5 ml-2_5 mr-2_5">
      <v-layout class="header header-bg" row nowrap>
        <span class="newsTitleShadow headline black--text font-weight-bold">Lotus Tracker being discontinued on July, 2020.</span>
        <span class="newsTitle headline white--text font-weight-bold">Lotus Tracker being discontinued on July, 2020.</span>
        <span class="date headline white--text font-weight-bold">
          {{ new Date('2020-06-30 00:00').toLocaleString().split(' ')[0].replace(',', '') }}
        </span>
      </v-layout>
    </div>
    <div class="box mt-0 pl-2 pr-2">
      <v-layout class="mainContainer boxContent mt-5 pl-4 pr-4" row nowrap>
        <v-layout class="text-xs-left pb-3" column wrap>
          <span class="body-1 mt-3">
            To all Lotus Tracker users,
          </span>
          <span class="body-1 mt-2">
            We've stopped active development of the Lotus Tracker application and MTG Lotus Valley website, both of which are being discontinued on July, 2020.
          </span>
          <span class="body-1 mt-2">
			I have been working with the <a href="https://untapped.gg" target="_blank">Untapped.gg</a> team for several months now to develop the best tools for MTG Arena, including the Untapped.gg Companion, which includes deck tracking functionalities, card ratings for limited formats, detailed personal statistics and much more.
          </span>
          <span class="body-1 mt-2">
			We would like to thank you for your support during the past 18 months and we cordially invite you to try the Untapped.gg Companion.            
          </span>
          <span class="body-1 mt-2">
          	Download <a href="https://companion.untapped.gg/releases/Untapped.gg+Companion+Stable+Installer.exe" target="_blank">Untapped.gg Companion</a>
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
    background-image: url('~@/assets/pages-headers/HealersHawk.jpg');
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
