<template>
  <div class="ml-2 mr-2 textNoSelect">
    <div class="pt-1 pl-2 pr-2 pb-1">
      <div class="text-xs-left body-1 font-weight-bold">
        <span>Colors</span>
      </div>
      <v-layout row nowrap class="text-xs-left mt-1">
        <v-tooltip v-for="color in colors" :key="color.code" top open-delay=500>
          <img :class="!activeColors.includes(color.code) ? 'grayscale' : ''" slot="activator"
            :src="require(`@/assets/mana/${color.code}.png`)" @click="colorClick(color.code)"/>
          {{ color.name }}
        </v-tooltip>
      </v-layout>
    </div>
  </div>
</template>

<script>
import Utils from '@/scripts/utils'

export default {
  props: {
    value: {
      type: String
    },
    simple: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      activeColors: [],
      colors: this.simple ? Utils.colors.filter(c => c.code !== 'c' && c.code !== 'm') : Utils.colors
    }
  },
  mounted () {
    this.activeColors = this.value.split(',')
  },
  methods: {
    colorClick (name) {
      this.toogleItem(this.activeColors, name)
      this.$emit('input', this.activeColors.sort().join())
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
      this.activeColors = value.split(',')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  img {
    border-bottom: 1px orange solid;
    border-radius: 8px;
    height: 36px;
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
