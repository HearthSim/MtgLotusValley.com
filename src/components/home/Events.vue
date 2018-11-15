<template>
  <v-layout class="events" row wrap>
    <v-flex v-if="upcomingEvents.length > 0" xs12 class="text-xs-left body-1">
      <span class="ml-2">Current</span>
    </v-flex>
    <v-flex v-if="upcomingEvents.length > 0" xs12 class="text-xs-left">
      <v-divider class="ml-2"/>
    </v-flex>
    <v-flex class="mt-2" v-for="event in currentEvents" :key="event.id">
      <Event class="mt-1 ml-1 mr-1 mb-1" :event="event"/>
    </v-flex>
    <v-flex v-if="upcomingEvents.length > 0" xs12 class="mt-3 text-xs-left body-1">
      <span class="ml-2">Upcoming</span>
    </v-flex>
    <v-flex v-if="upcomingEvents.length > 0" xs12 class="text-xs-left">
      <v-divider class="ml-2"/>
    </v-flex>
    <v-flex class="mt-2" v-for="event in upcomingEvents" :key="event.id">
      <Event class="mt-1 ml-1 mr-1 mb-1" :event="event"/>
    </v-flex>
  </v-layout>
</template>

<script>
import Event from '@/components/home/Event'

export default {
  components: {
    Event
  },
  mounted () {
    this.getEvents()
  },
  data () {
    return {
      currentEvents: [],
      upcomingEvents: []
    }
  },
  methods: {
    getEvents: function () {
      this.$api.getEvents()
        .then(res => {
          this.currentEvents = res.data.filter(event => {
            const starts = new Date(event.starts)
            const ends = new Date(event.ends)
            return starts <= new Date() && ends >= new Date()
          })
          this.upcomingEvents = res.data.filter(event => {
            const starts = new Date(event.starts)
            return starts > new Date()
          })
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
  @media (max-width: 1919px) {
    .events {
      max-width: 250px;
    }
  }
  @media (min-width: 1920px) {
    .events {
      max-width: 450px;
    }
  }
  .v-divider {
    width: 100px;
  }
</style>
