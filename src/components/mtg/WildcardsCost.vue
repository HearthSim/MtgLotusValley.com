<template>
  <div id="wildcards">
    <div v-for="wcCost in wcCosts" :key="wcCost.rarity">
      <span :class="small ? 'textSizeSmall' : 'textSizeNormal'">{{ wcCost.qtd }} </span>
      <img :class="small ? 'imgSizeSmall' : 'imgSizeNormal'" :src="require(`@/assets/wildcards/${wcCost.rarity}.png`)"/>
    </div>
  </div>
</template>

<script>

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
    align-items: center;
    justify-content: center;
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
