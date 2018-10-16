<template>
  <tr>
    <td id='card_qtd'>
      {{ card.qtd }}
    </td>
    <td id='card_name'>
      <Card :name='card.name' :imageUrl='card.imageUrl' :multiverseid='card.multiverseid' asText largeName/>
    <td>
    <td id='card_cost'>
      <ManaSymbols :cardid='card.id' :cost='card.manaCost'/>
    </td>
    <td id='card_set'>
      <SetSymbol :set='card.set' :rarity='card.rarity'/>
    </td>
    <td id='card_missing' v-if="missingQtd > 0" :title="`You need ${missingQtd} ${card.rarity} wildcards`">
      <div class="red--text">
        {{ missingQtd }}
        <img :src="require(`@/assets/wildcards/${card.rarity}.png`)"/>
      </div>
    </td>
  </tr>
</template>

<script>
import Card from '@/components/mtg/Card'
import ManaSymbols from '@/components/mtg/ManaSymbols'
import SetSymbol from '@/components/mtg/SetSymbol'

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
    },
    largeName: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      missingQtd: 0
    }
  },
  methods: {
    updateMissingValue: function (owned) {
      if (!this.card.type.includes('Basic Land')) {
        this.missingQtd = this.card.qtd - owned
      }
    }
  }
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
  padding-right: 12px;
}
table #card_missing div {
  text-align: center;
}
table #card_missing img {
  width: 12px;
  transform: translateY(20%);
}
</style>
