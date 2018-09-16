<template>
  <div class="deck">
    <h1>{{ name }}</h1>
    <table>
      <tr v-for="card in cards" v-bind:key="card.id">
        <td id="card_qtd">
          {{ card.qtd }}
        </td>
        <td id="card_name">
          <Card :card="card"/>
        <td>
        <td id="card_cost">
          <ManaSymbols :cardid="card.id" :cost="card.manaCost"/>
        </td>
        <td id="card_set">
          <SetSymbol :set="card.set" :rarity="card.rarity"/>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import Card from './Card'
import ManaSymbols from './ManaSymbols'
import SetSymbol from './SetSymbol'

export default {
  components: {
    Card, ManaSymbols, SetSymbol
  },
  props: {
    cards: {
      type: Object,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  methods: {}
}
</script>

<style>
.deck {
  overflow-x: auto;
  font-size: 14px;
}
table {
  text-align: right;
  table-layout: fixed;
  border-spacing: 0;
}
table td {
  padding: 0;
}
table #card_qtd {
  padding-right: 4px;
}
table #card_name {
  text-align: left;
}
table #card_cost {
  padding-right: 8px;
}
table #card_set {
  text-align: center;
}
</style>
