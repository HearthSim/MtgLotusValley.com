<template>
  <v-layout class="mb-3" column>
    <div class="mt-2_5 ml-2_5 mr-2_5">
      <v-layout class="header header-bg" row nowrap>
        <span class="newsTitle headline white--text font-weight-bold">Holiday special event starts!</span>
        <span class="date headline white--text font-weight-bold">
          {{ new Date('2018-12-24 00:00').toLocaleString().split(' ')[0].replace(',', '') }}
        </span>
      </v-layout>
    </div>
    <div class="box mt-0 pl-2 pr-2">
      <v-layout class="mainContainer boxContent mt-5 pl-4 pr-4" row nowrap>
        <v-layout class="text-xs-left pb-3" column wrap>
          <span class="title">Special Holiday Event</span>
          <span class="body-1 mt-2">
            A new special pauper event starts and will be open until 2019, january 4 with it has free entry!
          </span>
          <span class="body-1 mt-2">
            The event ends with 5 wins or 2 losses and the rewards for 1-4 wins are one copy of full alt Llanowar Elves and for 5 wins you will receive one copy of promo Firemind\'s Research.
          </span>
          <a class="ta-center mt-3" href="static/images/holiday_2018.jpg" target="_blank">
            <img src="static/images/holiday_2018.jpg" style="width: 100%;"/>
          </a>
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
    background-image: url('~@/assets/pages-headers/Mountain1.jpg');
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
