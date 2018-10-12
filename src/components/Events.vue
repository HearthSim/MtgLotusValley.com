<template>
  <v-layout id="events" row wrap>
    <v-flex v-for="(event, index) in currentEvents" :key="index">
      <v-card class="mt-1 ml-1 mr-1 mb-1">
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
          <v-flex sm7>
            <div>
              <span class="caption">{{ event.format }}</span>
            </div>
          </v-flex>
          <v-flex sm5>
            <div class="eventCost" v-if="event.entry.gems !== undefined">
              <img :src="require('@/assets/gems.png')"/>
              <span class="caption">{{ event.entry.gems }}</span>
            </div>
          </v-flex>
        </v-layout>
        <!-- Line 3 -->
        <v-layout class="line line3" row nowrap>
          <v-flex sm7>
            <div>
              <span class="caption">{{ event.remainginTime }}</span>
            </div>
          </v-flex>
          <v-flex sm5>
            <div class="eventCost" v-if="event.entry.gold !== undefined">
              <img :src="require('@/assets/coins.png')"/>
              <span class="caption">{{ event.entry.gold }}</span>
            </div>
          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
const DateDiff = require('date-diff')

export default {
  mounted () {
    this.getEvents()
  },
  data () {
    return {
      currentEvents: []
    }
  },
  methods: {
    getEvents: function () {
      this.$api.getEvents()
        .then(res => {
          const events = res.data
          events.forEach(event => {
            event.remainginTime = this.getRemainingTime(event.ends)
            setInterval(() => {
              if (new Date(event.ends) >= new Date()) {
                event.remainginTime = this.getRemainingTime(event.ends)
              }
            }, 1000)
          })
          this.currentEvents = events
        })
        .catch(error => {
          this.isLoading = false
          console.log(error)
        })
    },
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
  #events .v-card {
    height: 80px;
    width: 200px;
    display: inline-block;
  }
  #event {
    height: 80px;
    width: 200px;
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
</style>