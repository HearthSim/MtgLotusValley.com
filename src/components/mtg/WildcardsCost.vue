<template>
  <div class="wildcards">
    <div v-for="wcCost in wcCosts" :key="wcCost.rarity">
      <span :class="`text-xs-right ${medium ? 'textSizeMedium' : small ? 'textSizeSmall' : 'textSizeNormal mr-1 ml-2'}`">
        {{ wcCost.qtd }}
      </span>
      <v-tooltip bottom>
        <img :class="medium ? 'imgSizeMedium' : small ? 'imgSizeSmall' : 'imgSizeNormal'" slot="activator"
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
    medium: {
      type: Boolean,
      required: false,
      default: false
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
          'qtd': value[rarity] ? value[rarity] : 0
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
  .wildcards {
    display: flex;
    align-items: right;
    justify-content: center;
  }
  .wildcards > div {
    display: contents;
  }
  .textSizeNormal {
    font-size: 14pt;
    margin-left: 5px;
    margin-right: 4px;
    min-width: 24px;
    transform: translateY(4px);
  }
  .textSizeMedium {
    font-size: 11pt;
    margin-left: 4px;
    margin-right: 3px;
    min-width: 19px;
    transform: translateY(3px);
  }
  .textSizeSmall {
    font-size: 9pt;
    margin-left: 4px;
    margin-right: 2px;
    min-width: 18px;
    transform: translateY(2px);
  }
  .imgSizeNormal {
    width: 22px;
  }
  .imgSizeMedium {
    width: 16px;
  }
  .imgSizeSmall {
    width: 14px;
  }
</style>
