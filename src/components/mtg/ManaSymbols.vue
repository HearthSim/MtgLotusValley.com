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
      if (this.cost === undefined || this.cost === '') {
        return {}
      }
      const manaCost = this.cost.substring(1, this.cost.length - 1)
      return manaCost.toLowerCase().replace(new RegExp('/', 'g'), '').split('}{')
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
  transform: translateY(-3px);
}
</style>
