<template>
  <div>
    <div>
      <span v-for="(mana, index) in manaSymbols" :key="cardid + mana + index">
        <i v-bind:class="'ms ms-' + mana + ' ms-cost ms-shadow'"></i>
      </span>
    </div>
  </div>
</template>

<script>

export default {
  computed: {
    manaSymbols: function () {
      if (this.cost === undefined) {
        return {}
      }
      const manaCost = this.cost.substring(1, this.cost.length - 1)
      return manaCost.toLowerCase().split('}{')
    }
  },
  props: {
    cardid: {
      required: true
    },
    cost: {
      required: true
    }
  },
  methods: {}
}
</script>

<style>
span {
  font-size: .8em;
}
.ms-cost {
  margin-bottom: 0.4em;
}
</style>
