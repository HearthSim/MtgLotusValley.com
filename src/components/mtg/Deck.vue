<template>
  <div>
    <div class='deck'>
      <span class='body-2'>{{ name }}</span>
      <table>
        <DeckGroup v-if='lands.length > 0'         :groupSize="landsQtd"         groupName="Lands" />
        <DeckCard  v-if='lands.length > 0'         v-for='card in lands'          :key='`M${card.id}`'
          :card='card' :userCollection="userCollection" :largeName="largeName"/>
        <DeckGroup v-if='creatures.length > 0'     :groupSize="creaturesQtd"     groupName="Creatures" />
        <DeckCard  v-if='creatures.length > 0'     v-for='card in creatures'      :key='`M${card.id}`'
          :card='card' :userCollection="userCollection" :largeName="largeName"/>
        <DeckGroup v-if='spells.length > 0'        :groupSize="spellsQtd"        groupName="Spells" />
        <DeckCard  v-if='spells.length > 0'        v-for='card in spells'         :key='`M${card.id}`'
          :card='card' :userCollection="userCollection" :largeName="largeName"/>
        <DeckGroup v-if='enchantments.length > 0'  :groupSize="enchantmentsQtd"  groupName="Enchantments" />
        <DeckCard  v-if='enchantments.length > 0'  v-for='card in enchantments'   :key='`M${card.id}`'
          :card='card' :userCollection="userCollection" :largeName="largeName"/>
        <DeckGroup v-if='artifacts.length > 0'     :groupSize="artifactsQtd"     groupName="Artifacts" />
        <DeckCard  v-if='artifacts.length > 0'     v-for='card in artifacts'      :key='`M${card.id}`'
          :card='card' :userCollection="userCollection" :largeName="largeName"/>
        <DeckGroup v-if='planeswalkers.length > 0' :groupSize="planeswalkersQtd" groupName="Planeswalkers" />
        <DeckCard  v-if='planeswalkers.length > 0' v-for='card in planeswalkers'  :key='`M${card.id}`'
          :card='card' :userCollection="userCollection" :largeName="largeName"/>
        <DeckGroup v-if='cardsGrouped.length > 0 && sideCards.length > 0' :groupSize="sideboardQtd" 
          groupName="Sideboard" marginTop />
        <DeckCard  v-if='sideCards.length > 0'     v-for='card in sideCards'      :key='`S${card.id}`'
          :card='card' :userCollection="userCollectionWithoutMainDeck" :largeName="largeName"/>
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
      required: false
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
    userCollectionWithoutMainDeck: {
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
      if (this.cards === undefined) {
        return []
      }
      return this.groupCards(this.cards, true)
    },
    sideCards: function () {
      if (this.sideboard === undefined) {
        return []
      }
      return this.groupCards(this.sideboard, false)
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
    groupCards: function (cards, mainDeck) {
      const cardsArray = []
      Object.keys(cards).forEach(mtgaId => {
        const card = cards[mtgaId]
        card['id'] = mtgaId
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
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
