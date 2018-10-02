<template>
  <div>
    <div class='deck mt-2'>
      <span class='body-2'>{{ name }}</span>
      <table>
        <DeckGroup v-if='lands.length > 0'         v-bind:groupSize="lands.length"           groupName="Lands" />
        <DeckCard  v-if='lands.length > 0'         v-for='card in lands'         v-bind:key='card.id' v-bind:card='card' :ref="card.id"/>
        <DeckGroup v-if='creatures.length > 0'     v-bind:groupSize="creatures.length"       groupName="Creatures" />
        <DeckCard  v-if='creatures.length > 0'     v-for='card in creatures'     v-bind:key='card.id' v-bind:card='card' :ref="card.id"/>
        <DeckGroup v-if='spells.length > 0'        v-bind:groupSize="spells.length"          groupName="Spells" />
        <DeckCard  v-if='spells.length > 0'        v-for='card in spells'        v-bind:key='card.id' v-bind:card='card' :ref="card.id"/>
        <DeckGroup v-if='enchantments.length > 0'  v-bind:groupSize="enchantments.length"    groupName="Enchantments" />
        <DeckCard  v-if='enchantments.length > 0'  v-for='card in enchantments'  v-bind:key='card.id' v-bind:card='card' :ref="card.id"/>
        <DeckGroup v-if='artifacts.length > 0'     v-bind:groupSize="artifacts.length"       groupName="Artifacts" />
        <DeckCard  v-if='artifacts.length > 0'     v-for='card in artifacts'     v-bind:key='card.id' v-bind:card='card' :ref="card.id"/>
        <DeckGroup v-if='planeswalkers.length > 0' v-bind:groupSize="planeswalkers.length"   groupName="Planeswalkers" />
        <DeckCard  v-if='planeswalkers.length > 0' v-for='card in planeswalkers' v-bind:key='card.id' v-bind:card='card' :ref="card.id"/>
      </table>
    </div>
  </div>
</template>

<script>
import DeckCard from './DeckCard'
import DeckGroup from './DeckGroup'

export default {
  components: {
    DeckCard, DeckGroup
  },
  props: {
    cards: {
      type: Object,
      required: true
    },
    name: {
      type: String,
      required: true
    },
  },
  computed: {
    cardsGrouped: function () {
      const cardsArray = []
      Object.keys(this.cards).forEach(cardId => {
        const card = this.cards[cardId]
        card['id'] = cardId
        card['itemType'] = 'card'
        cardsArray.push(card)
      })
      cardsArray.sort(function (card1, card2) {
        if (card1.cmc !== card2.cmc) {
          return card1.cmc - card2.cmc
        }
        if (card1.name > card2.name) {
          return 1
        } else {
          return -1
        }
      })
      return cardsArray
    },
    lands: function () {
      return this.cardsGrouped.filter(card => {
        return card.type.includes('Land') && !card.type.includes('Creature')
      })
    },
    creatures: function () {
      return this.cardsGrouped.filter(card => card.type.includes('Creature'))
    },
    spells: function () {
      return this.cardsGrouped.filter(card => {
        return card.type.includes('Instant') || card.type.includes('Sorcery')
      })
    },
    enchantments: function () {
      return this.cardsGrouped.filter(card => {
        return card.type.includes('Enchantment') && !card.type.includes('Creature')
      })
    },
    artifacts: function () {
      return this.cardsGrouped.filter(card => {
        return card.type.includes('Artifact') &&
          !card.type.includes('Creature') &&
          !card.type.includes('Land') &&
          !card.type.includes('Enchantment')
      })
    },
    planeswalkers: function () {
      return this.cardsGrouped.filter(card => card.type.includes('Planeswalker'))
    }
  },
}
</script>

<style>
.deck {
  overflow-x: auto;
  font-size: 14px;
}
table {
  margin: auto;
  text-align: right;
  table-layout: fixed;
  border-spacing: 0;
}
table td {
  padding: 0;
}
</style>
