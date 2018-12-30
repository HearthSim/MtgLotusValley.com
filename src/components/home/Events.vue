<template>
  <v-layout class="events" row wrap>
    <v-flex sm12 md6 :class="$vuetify.breakpoint.smAndDown ? 'mr-2_5' : 'pr-1'">
      <v-layout class="box mr-0" row wrap>
        <v-flex xs12 class="boxHeader">Current Events</v-flex>
        <v-layout class="boxContent" row wrap>
          <ScrollDiv class="scrollDiv" :step="210" multiline>
            <v-flex v-for="event in currentEvents" :key="event.id">
              <Event class="mt-1 ml-1 mr-1 mb-1" :event="event"/>
            </v-flex>
          </ScrollDiv>
        </v-layout>
      </v-layout>
    </v-flex>
    <v-flex sm12 md6 :class="$vuetify.breakpoint.smAndDown ? 'ml-2_5' : 'pl-1'">
      <v-layout class="box ml-0" row wrap>
        <v-flex xs12 class="boxHeader">Upcoming Events</v-flex>
        <v-layout class="boxContent" row wrap>
          <ScrollDiv class="scrollDiv" :step="210" multiline>
            <v-flex v-for="event in upcomingEvents" :key="event.id">
              <Event class="mt-1 ml-1 mr-1 mb-1" :event="event"/>
            </v-flex>
          </ScrollDiv>
        </v-layout>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import Event from '@/components/home/Event'
import ScrollDiv from '@/components/ScrollDiv'

export default {
  components: {
    Event, ScrollDiv
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
  .scrollDiv {
    height: 180px;
  }
</style>
