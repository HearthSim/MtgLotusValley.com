<template>
  <div class="ml-2 mr-2 textNoSelect">
    <v-card :class="`pt-2 pl-2 pr-2 pb-2 ${expand ? 'd-block' : ''}`">
      <div class="text-xs-left body-1">
        <span class="label pl-1">Rarity</span>
      </div>
      <div class="text-xs-center mt-1">
        <v-tooltip v-for="rarity in rarities" :key="rarity.code" top open-delay=500>
          <i v-bind:title="setTitle" :class="`ss ss-2x ss-parl3 ss-${rarity.name.toLowerCase()}
            ${!activeRarities.includes(rarity.code) ? ' grayscale' : ''}`"
            @click="rarityClick(rarity.code)" slot="activator"/>
          {{ rarity.name }}
        </v-tooltip>
      </div>
    </v-card>
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
  .label {
  }
  .v-card {
    border: solid 1px lightgray;
    border-radius: 8px;
    align-items: baseline;
    display: inline-block;
  }
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
