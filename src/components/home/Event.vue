<template>
  <v-card class="event mt-1 mb-1">
    <!-- Line 1 -->
    <v-layout class="line line1" row nowrap>
      <v-flex sm12>
        <div class="mt-1 mb-1 white--text">
          <span class="caption">{{ event.name }}</span>
        </div>
      </v-flex>
    </v-layout>
    <!-- Line 2 -->
    <v-layout class="line line2 mt-1" row nowrap>
      <v-flex sm8>
        <div>
          <span class="subcaption">{{ event.format }}</span>
        </div>
      </v-flex>
      <v-flex sm4>
        <div class="eventCost" v-if="event.entry.gems !== undefined">
          <img :src="require('@/assets/gems.png')"/>
          <span class="caption">{{ event.entry.gems }}</span>
        </div>
      </v-flex>
    </v-layout>
    <!-- Line 3 -->
    <v-layout class="line line3" row nowrap>
      <v-flex sm8>
        <div>
          <span class="caption">{{ remainingTime }}</span>
        </div>
      </v-flex>
      <v-flex sm4>
        <div class="eventCost" v-if="event.entry.gold !== undefined">
          <img :src="require('@/assets/coins.png')"/>
          <span class="caption">{{ event.entry.gold }}</span>
        </div>
      </v-flex>
    </v-layout>
  </v-card>
</template>

<script>
const DateDiff = require('date-diff')

export default {
  props: {
    event: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      remainingTime: ''
    }
  },
  created () {
    const starts = new Date(this.event.starts)
    const dateReference = starts > new Date() ? this.event.starts : this.event.ends
    this.remainingTime = this.getRemainingTime(dateReference)
    setInterval(() => {
      if (new Date(dateReference) >= new Date()) {
        this.remainingTime = this.getRemainingTime(dateReference)
      }
    }, 1000)
  },
  methods: {
    getRemainingTime: function (ends) {
      const endsDate = new Date(ends)
      const now = new Date()
      const diff = new DateDiff(endsDate, now)
      const diffDays = Math.trunc(diff.days())
      const diffHours = Math.trunc(diff.hours() % 24)
      const diffMinutes = Math.trunc(diff.minutes() % 60).toString().padStart(2, '0')
      const diffSeconds = Math.trunc(diff.seconds() % 60).toString().padStart(2, '0')
      return `${diffDays} days, ${diffHours}:${diffMinutes}:${diffSeconds}`
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .event {
    height: 80px;
    display: inline-block;
  }
  @media (min-width: 1024px) {
    .event {
      width: 205px;
      margin-left: 4px !important;
      margin-right: 4px !important;
    }
  }
  @media (min-width: 1280px) {
    .event {
      width: 210px;
      margin-left: 8px !important;
      margin-right: 8px !important;
    }
  }
  .eventCost img {
    height: 16px;
    width: 16px;
    transform: translateY(4px);
  }
  .eventCost span {
    min-width: 4ch;
  }
  .line1 {
    background-color: darkorange;
  }
  .subcaption {
    font-size: 11px!important;
  }
</style>
