<template>
  <div id="wildcards">
    <div v-for="wcCost in wcCosts" :key="wcCost.rarity">
      <span>{{ wcCost.qtd }} </span>
      <img :src="require(`@/assets/wildcards/${wcCost.rarity}.png`)"/>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    cost: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      wcCosts: []
    }
  },
  watch: {
    cost: function (value) {
      Object.keys(value).forEach(rarity => {
        this.wcCosts.push({
          'rarity': rarity,
          'qtd': value[rarity]
        })
      })
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
    font-size: 22px;
  }
  #wildcards span {
    margin-left: 5px;
    margin-right: 5px;
  }
  #wildcards img {
    width: 22px;
  }
</style>
