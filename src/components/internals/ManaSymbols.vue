<template>
  <div>
    <span v-for="(mana, index) in manaSymbols" :key="cardid + mana + index">
      <!-- {{mana}} -->
      <i v-bind:class="'ms ms-' + mana + ' ms-cost ms-shadow'"></i>
    </span>
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
.ms-cost {
  font-size: .8em;
}
</style>
