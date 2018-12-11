<template>
  <v-layout class='deckVisual' row wrap>
    <v-flex xl12>
      <span class='body-2'>{{ name }}</span>
    </v-flex>
    <v-flex xl12 class="types">
      <DeckGroup align="center" v-if='lands.length > 0'
        :groupSize="lands.length"         groupName="Lands" />
      <DeckGroup align="center" v-if='creatures.length > 0'
        :groupSize="creatures.length"     groupName="Creatures" />
      <DeckGroup align="center" v-if='spells.length > 0'
        :groupSize="spells.length"        groupName="Spells" />
      <DeckGroup align="center" v-if='enchantments.length > 0'
        :groupSize="enchantments.length"  groupName="Enchantments" />
      <DeckGroup align="center" v-if='artifacts.length > 0'
        :groupSize="artifacts.length"     groupName="Artifacts" />
      <DeckGroup align="center" v-if='planeswalkers.length > 0'
        :groupSize="planeswalkers.length" groupName="Planeswalkers" />
    </v-flex>
    <v-flex xl12 class="pileContainer mt-2">
      <DeckVisualPile class="pile" v-for='(pile, pileIndex) in allCards'
        :key='`main_pile${pileIndex}`' :cardsPile="pile"/>
    </v-flex>
    <v-flex xl12 class="types mt-2 mb-2" v-if='allCards.length > 0 && allSideboard.length > 0'>
      <DeckGroup align="center" :groupSize="allSideboard.length" groupName="Sideboard" />
    </v-flex>
    <v-flex xl12 class="pileContainer" v-if='allSideboard.length > 0'>
      <DeckVisualPile class="pile" v-for='(pile, pileIndex) in allSideboard'
        :key='`side_pile${pileIndex}`' :cardsPile="pile"/>
    </v-flex>
  </v-layout>
</template>

<script>
import DeckGroup from '@/components/mtg/DeckGroup'
import DeckVisualPile from '@/components/deck/DeckVisualPile'
import DeckUtils from '@/scripts/deckutils'

export default {
  components: {
    DeckGroup, DeckVisualPile, DeckUtils
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
    }
  },
  data () {
    return {
      allCards: [],
      allSideboard: []
    }
  },
  computed: {
    cardsGrouped: function () {
      if (this.cards === undefined) {
        return []
      }
      return this.groupCards(this.cards, true)
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
  mounted: function () {
    const columns = 4
    const cards = []
    if (this.cards !== undefined) {
      let data = []
      data = data.concat(this.lands)
      data = data.concat(this.creatures)
      data = data.concat(this.spells)
      data = data.concat(this.enchantments)
      data = data.concat(this.artifacts)
      data = data.concat(this.planeswalkers)
      let pileSize = data.length / columns
      if (pileSize % 1 > 0) {
        pileSize = Math.trunc(pileSize) + 1
      }
      for (let i = 0; i < columns; i++) {
        const index = i * pileSize
        cards.push(data.slice(index, index + pileSize))
      }
    }
    this.allCards = cards
    this.updateUserCollection()

    const sideboard = []
    if (this.sideboard !== undefined) {
      const data = this.groupCards(this.sideboard, false)
      let pileSize = data.length / columns
      if (pileSize % 1 > 0) {
        pileSize = Math.trunc(pileSize) + 1
      }
      for (let i = 0; i < columns; i++) {
        const index = i * pileSize
        sideboard.push(data.slice(index, index + pileSize))
      }
    }
    this.allSideboard = sideboard
    this.updateUserCollectionWithoutMainDeck()
  },
  methods: {
    cardLink: function (multiverseid, name) {
      if (multiverseid === 0) {
        return `http://gatherer.wizards.com/Pages/Search/Default.aspx?name=+[${name}]`
      }
      return `http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=${multiverseid}`
    },
    groupCards: function (cards, mainDeck) {
      const cardsArray = []
      Object.keys(cards).forEach(mtgaId => {
        const card = cards[mtgaId]
        card['id'] = mtgaId
        card['itemType'] = 'card'
        if (card.type.includes('Basic Land')) {
          card['isMissing'] = false
          card['basicLandQtd'] = card.qtd
          cardsArray.push(card)
        } else {
          card['isMissing'] = this.$isUserLogged()
          for (let i = 0; i < card.qtd; i++) {
            cardsArray.push(card)
          }
        }
      })
      DeckUtils.sortByCmc(cardsArray)
      return cardsArray
    },
    updateMissingCards: function (piles, mainDeck, userCollection) {
      const data = {}
      Object.assign(data, userCollection)
      const pilesUpdated = []
      piles.forEach(cards => {
        const cardsUpdated = []
        cards.forEach(card => {
          const cardUpdated = {}
          Object.assign(cardUpdated, card)
          if (!card.type.includes('Basic Land')) {
            const owned = data[card.id] !== undefined ? data[card.id] : 0
            cardUpdated['isMissing'] = owned === 0
            if (owned > 0) {
              data[card.id] -= 1
            }
          }
          cardsUpdated.push(cardUpdated)
        })
        pilesUpdated.push(cardsUpdated)
      })
      if (mainDeck) {
        this.allCards = pilesUpdated
      } else {
        this.allSideboard = pilesUpdated
      }
      return data
    },
    updateUserCollection: function () {
      const remainingCollection = this.updateMissingCards(this.allCards, true, this.userCollection)
      this.updateMissingCards(this.allSideboard, false, remainingCollection)
    },
    updateUserCollectionWithoutMainDeck: function () {
      this.updateMissingCards(this.allSideboard, false, this.userCollectionWithoutMainDeck)
    }
  },
  watch: {
    userCollection: function (value) {
      this.updateUserCollection()
    },
    userCollectionWithoutMainDeck: function (value) {
      this.updateUserCollectionWithoutMainDeck()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .deckVisual {
    width: 100%;
  }
  .types {
    display: flex;
    width: 100%;
  }
  .pileContainer {
    font-size: 11pt;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
  }
  .pile {
    padding: 2px;
    flex: 1;
    max-width: 250px;
  }
</style>
