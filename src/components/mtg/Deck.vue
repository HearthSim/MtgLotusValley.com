<template>
  <div>
    <div class='deck'>
      <span class='body-2'>{{ name }}</span>
      <table>
        <DeckGroup v-if='lands.length > 0'         v-bind:groupSize="landsQtd"           groupName="Lands" />
        <DeckCard  v-if='lands.length > 0'         v-for='card in lands'         v-bind:key='card.id' v-bind:card='card' :ref="card.id" largeName/>
        <DeckGroup v-if='creatures.length > 0'     v-bind:groupSize="creaturesQtd"       groupName="Creatures" />
        <DeckCard  v-if='creatures.length > 0'     v-for='card in creatures'     v-bind:key='card.id' v-bind:card='card' :ref="card.id" largeName/>
        <DeckGroup v-if='spells.length > 0'        v-bind:groupSize="spellsQtd"          groupName="Spells" />
        <DeckCard  v-if='spells.length > 0'        v-for='card in spells'        v-bind:key='card.id' v-bind:card='card' :ref="card.id" largeName/>
        <DeckGroup v-if='enchantments.length > 0'  v-bind:groupSize="enchantmentsQtd"    groupName="Enchantments" />
        <DeckCard  v-if='enchantments.length > 0'  v-for='card in enchantments'  v-bind:key='card.id' v-bind:card='card' :ref="card.id" largeName/>
        <DeckGroup v-if='artifacts.length > 0'     v-bind:groupSize="artifactsQtd"       groupName="Artifacts" />
        <DeckCard  v-if='artifacts.length > 0'     v-for='card in artifacts'     v-bind:key='card.id' v-bind:card='card' :ref="card.id" largeName/>
        <DeckGroup v-if='planeswalkers.length > 0' v-bind:groupSize="planeswalkersQtd"   groupName="Planeswalkers" />
        <DeckCard  v-if='planeswalkers.length > 0' v-for='card in planeswalkers' v-bind:key='card.id' v-bind:card='card' :ref="card.id" largeName/>
        <DeckGroup v-if='sideCards.length > 0'     v-bind:groupSize="sideboardQtd"       groupName="Sideboard" />
        <DeckCard  v-if='sideCards.length > 0'     v-for='card in sideCards'     v-bind:key='card.id' v-bind:card='card' :ref="card.id" largeName/>
      </table>
    </div>
  </div>
</template>

<script>
import DeckCard from '@/components/mtg/DeckCard'
import DeckGroup from '@/components/mtg/DeckGroup'

export default {
  components: {
    DeckCard, DeckGroup
  },
  props: {
    cards: {
      type: Object,
      required: true
    },
    sideboard: {
      type: Object,
      required: false
    },
    name: {
      type: String,
      required: false
    },
    userCollection: {
      type: Object,
      required: false
    },
    largeName: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    cardsGrouped: function () {
      return this.groupCards(this.cards)
    },
    sideCards: function () {
      return this.groupCards(this.sideboard)
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
    },
    landsQtd: function () {
      return this.lands.map(card => card.qtd).reduce((acc, value) => acc + value)
    },
    creaturesQtd: function () {
      return this.creatures.map(card => card.qtd).reduce((acc, value) => acc + value)
    },
    spellsQtd: function () {
      return this.spells.map(card => card.qtd).reduce((acc, value) => acc + value)
    },
    enchantmentsQtd: function () {
      return this.enchantments.map(card => card.qtd).reduce((acc, value) => acc + value)
    },
    artifactsQtd: function () {
      return this.artifacts.map(card => card.qtd).reduce((acc, value) => acc + value)
    },
    planeswalkersQtd: function () {
      return this.planeswalkers.map(card => card.qtd).reduce((acc, value) => acc + value)
    },
    sideboardQtd: function () {
      return this.sideCards.map(card => card.qtd).reduce((acc, value) => acc + value)
    }
  },
  methods: {
    groupCards: function (cards) {
      const cardsArray = []
      Object.keys(cards).forEach(cardId => {
        const card = cards[cardId]
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
    }
  },
  watch: {
    userCollection: function (value) {
      Object.keys(this.cards).forEach(cardId => {
        const cardComponent = this.$refs[cardId]
        if (cardComponent !== undefined && cardComponent.length > 0) {
          const owned = value[cardId] !== undefined ? value[cardId] : 0
          cardComponent[0].updateMissingValue(owned)
        } else {
          console.log(`Card component not found for ${cardId}`)
        }
      })
    }
  }
}
</script>

<style>
.deck {
  overflow-x: auto;
  font-size: 11pt;
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
