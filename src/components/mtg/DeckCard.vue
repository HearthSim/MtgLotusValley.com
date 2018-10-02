<template>
  <tr>
    <td id='card_qtd'>
      {{ card.qtd }}
    </td>
    <td id='card_name'>
      <Card :name='card.name' :imageUrl='card.imageUrl' :multiverseid='card.multiverseid' asText/>
    <td>
    <td id='card_cost'>
      <ManaSymbols :cardid='card.id' :cost='card.manaCost'/>
    </td>
    <td id='card_set'>
      <SetSymbol :set='card.set' :rarity='card.rarity'/>
    </td>
  </tr>
</template>

<script>
import Card from './Card'
import ManaSymbols from './ManaSymbols'
import SetSymbol from './SetSymbol'

export default {
  components: {
    Card,
    ManaSymbols,
    SetSymbol
  },
  props: {
    card: {
      type: Object,
      required: true
    }
  },
}
</script>

<style>
table #card_qtd {
  padding-right: 4px;
}
table #card_name {
  text-align: left;
  padding-right: 8px;
}
table #card_cost {
  padding-right: 8px;
}
table #card_set {
  text-align: center;
  padding-right: 8px;
}
</style>
