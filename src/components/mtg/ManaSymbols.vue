<template>
  <v-layout class="manaSymbol" row nowrap>
    <span v-for="(mana, index) in manaSymbolsLeft" :key="cardid + mana + index">
      <i v-bind:class="'ms ms-' + mana + ' ms-cost ms-shadow'"></i>
    </span>
    <span v-if="showSplitMana && manaSymbolsRight.length > 0">//</span>
    <span v-if="showSplitMana && manaSymbolsRight.length > 0"
      v-for="(mana, index) in manaSymbolsRight" :key="cardid + mana + index">
      <i v-bind:class="'ms ms-' + mana + ' ms-cost ms-shadow'"></i>
    </span>
  </v-layout>
</template>

<script>

export default {
  computed: {
    manaSymbolsLeft: function () {
      if (this.cost === undefined || this.cost === '') {
        return {}
      }
      let manaCost = this.cost
      if (manaCost.includes('//')) {
        manaCost = this.cost.split(' // ')[0]
      }
      manaCost = manaCost.substring(1, manaCost.length - 1)
      return manaCost.toLowerCase().replace(new RegExp('/', 'g'), '').split('}{')
    },
    manaSymbolsRight: function () {
      if (this.cost === undefined || !this.cost.includes('//') || this.cost === '') {
        return {}
      }
      let manaCost = this.cost.split(' // ')[1]
      manaCost = manaCost.substring(1, manaCost.length - 1)
      return manaCost.toLowerCase().replace(new RegExp('/', 'g'), '').split('}{')
    }
  },
  props: {
    cardid: {
      required: true
    },
    cost: {
      required: true
    },
    showSplitMana: {
      required: false,
      default: false
    }
  },
  methods: {}
}
</script>

<style>
.manaSymbol {
  justify-content: flex-end;
}
.manaSymbol span i {
  font-size: .8em;
}
.ms-cost {
  transform: translateY(-3px);
}
</style>
