<template>
  <div class="ml-2 mr-2 textNoSelect">
    <div class="pt-1 pl-2 pr-2 pb-1">
      <div class="text-xs-left body-1 font-weight-bold">
        <span>Rarity</span>
      </div>
      <v-layout row nowrap class="text-xs-left mt-0">
        <v-tooltip v-for="rarity in rarities" :key="rarity.code" top open-delay=500>
          <i :class="`mr-1 ss ss-2x ss-parl3 ss-${rarity.name.toLowerCase()}
            ${!activeRarities.includes(rarity.code) ? ' grayscale' : ''}`"
            @click="rarityClick(rarity.code)" slot="activator"/>
          {{ rarity.name }}
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
    expand: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      activeRarities: [],
      rarities: Utils.rarities
    }
  },
  mounted () {
    this.activeRarities = this.value.split(',')
  },
  methods: {
    rarityClick (name) {
      this.toogleItem(this.activeRarities, name)
      this.$emit('input', this.activeRarities.sort().join())
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
      this.activeRarities = value.split(',')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  i {
    border-bottom: 1px orange solid;
    border-radius: 8px;
    padding: 4px;
  }
  i:hover {
    background: lightgray;
  }
  .grayscale {
    -webkit-filter: grayscale(100%); /* Safari 6.0 - 9.0 */
    filter: grayscale(100%);
  }
</style>
