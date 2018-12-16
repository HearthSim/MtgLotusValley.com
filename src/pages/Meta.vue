<template>
  <v-layout class="mb-3" column>
    <v-tabs class="box" color="transparent">
      <v-tab v-for="tab in tabs" :key="tab.title">{{tab.title}}</v-tab>
      <v-tab-item v-for="(tab, index) in tabs" :key="tab.title">
        <MetaData :index="index" :startsDate="tab.startsDate" :endsDate="tab.endsDate"/>
      </v-tab-item>
    </v-tabs>
  </v-layout>
</template>

<script>
import MetaData from '@/components/MetaData'

export default {
  name: 'Meta',
  components: {
    MetaData
  },
  data () {
    return {
      tabs: [
        {
          title: 'Yesterday',
          startsDate: this.getDaysAgo(1),
          endsDate: this.getDaysAgo(1)
        },
        {
          title: 'Last 7 days',
          startsDate: this.getDaysAgo(8),
          endsDate: this.getDaysAgo(1)
        },
        {
          title: 'Last 30 days',
          startsDate: this.getDaysAgo(31),
          endsDate: this.getDaysAgo(1)
        }
      ]
    }
  },
  methods: {
    getMonthFirstDay: function () {
      const date = new Date()
      const month = date.getUTCMonth() + (date.getUTCDate() === 1 ? 0 : 1)
      return date.getUTCFullYear() + '-' + `0${month}`.slice(-2) + '-01'
    },
    getDaysAgo: function (days) {
      const date = new Date()
      date.setDate(date.getDate() - days)
      return date.getUTCFullYear() + '-' +
          (`0${date.getUTCMonth() + 1}`).slice(-2) + '-' +
          (`0${date.getUTCDate()}`).slice(-2)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
