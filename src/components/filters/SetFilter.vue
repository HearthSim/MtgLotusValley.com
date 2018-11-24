<template>
  <div class="ml-2 mr-2 textNoSelect">
    <div class="pt-1 pl-2 pr-2 pb-1">
      <div class="text-xs-left body-1 font-weight-bold">
        <span>Sets</span>
      </div>
      <v-layout row wrap class="text-xs-left mt-1">
        <v-tooltip v-for="(set) in sets" :key="set.code" top open-delay=1000>
          <img :class="!activeSets.includes(set.code) ? 'grayscale' : ''" slot="activator"
            :src="require(`@/assets/sets/icons/${set.code}.png`)" @click="setClick(set.code)"/>
          {{ set.name }}
        </v-tooltip>
      </v-layout>
    </div>
  </div>
</template>

<script>
import Utils from '@/scripts/utils'

export default {
  props: [
    'value'
  ],
  data () {
    return {
      activeSets: [],
      sets: Utils.sets
    }
  },
  mounted () {
    this.activeSets = this.value.split(',')
  },
  methods: {
    setClick (code) {
      this.toogleItem(this.activeSets, code)
      this.$emit('input', this.activeSets.sort().join())
    },
    toogleItem (array, item) {
      if (array.includes(item)) {
        array.splice(array.indexOf(item), 1)
      } else {
        array.push(item)
      }
    }
  },
  watch: {
    value: function (value) {
      this.activeSets = value.split(',')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .v-card {
    border: solid 1px lightgray;
    border-radius: 8px;
    align-items: baseline;
    display: inline-block;
  }
  img {
    border-radius: 8px;
    height: 34px;
    padding: 4px;
  }
  img:hover {
    background: lightgray;
  }
  .grayscale {
    -webkit-filter: grayscale(100%); /* Safari 6.0 - 9.0 */
    filter: grayscale(100%);
  }
</style>
