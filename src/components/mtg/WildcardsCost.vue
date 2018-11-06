<template>
  <div id="wildcards">
    <div v-for="wcCost in wcCosts" :key="wcCost.rarity">
      <span :class="small ? 'textSizeSmall' : 'textSizeNormal'">{{ wcCost.qtd }} </span>
      <v-tooltip bottom>
        <img :class="small ? 'imgSizeSmall' : 'imgSizeNormal'" slot="activator"
          :src="require(`@/assets/wildcards/${wcCost.rarity}.png`)"/>
        {{`${captalize(wcCost.rarity)} wildcard`}}
      </v-tooltip>
    </div>
  </div>
</template>

<script>
import Utils from '@/scripts/utils'

export default {
  props: {
    cost: {
      type: Object,
      required: true
    },
    small: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      wcCosts: []
    }
  },
  mounted () {
    if (this.cost !== undefined) {
      this.setCost(this.cost)
    }
  },
  methods: {
    setCost: function (value) {
      this.wcCosts.splice(0, this.wcCosts.length)
      Object.keys(value).forEach(rarity => {
        this.wcCosts.push({
          'rarity': rarity,
          'qtd': value[rarity]
        })
      })
    },
    captalize (value) {
      return Utils.captalize(value)
    }
  },
  watch: {
    cost: function (value) {
      this.setCost(value)
    }
  }
}
</script>

<style>
  #wildcards {
    display: flex;
    align-items: right;
    justify-content: space-between;
  }
  #wildcards > div {
    display: contents;
  }
  .textSizeNormal {
    font-size: 14pt;
    margin-left: 5px;
    margin-right: 4px;
  }
  .textSizeSmall {
    font-size: 9pt;
    margin-left: 4px;
    margin-right: 2px;
  }
  .imgSizeNormal {
    width: 22px;
  }
  .imgSizeSmall {
    width: 14px;
  }
</style>
