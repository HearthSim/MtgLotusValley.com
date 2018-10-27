<template>
  <div id="filters" class="ml-2 mr-2">
    <v-card class="pt-2 pl-2 pr-2 pb-2">
      <v-tooltip v-for="(set) in sets" :key="set.code" top open-delay=1000>
        <img class="set" :class="!activeSets.includes(set.code) ? 'grayscale' : ''" slot="activator"
          :src="require(`@/assets/sets/${set.code}.png`)" @click="setClick(set.code)"/>
        {{ set.name }}
      </v-tooltip>
    </v-card>
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
  watch: {
    value: function (value) {
      this.activeSets = value.split(',')
    }
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #filters {
    display: inline-block;
  }
  .v-card {
    border: solid 1px lightgray;
    border-radius: 8px;
    height: 48px;
    align-items: baseline;
    display: inline-block;
  }
  img {
    padding: 3px;
    height: 100%;
    vertical-align: sub;
  }
  img:hover {
    background: lightgray;
  }
  .grayscale {
    -webkit-filter: grayscale(100%); /* Safari 6.0 - 9.0 */
    filter: grayscale(100%);
  }
</style>
