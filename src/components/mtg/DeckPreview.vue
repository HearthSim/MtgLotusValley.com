<template>
  <v-layout id='deckPreview' row wrap>
    <v-flex xl12>
      <span class='body-2'>{{ name }}</span>
    </v-flex>
    <v-flex xl12 class="types">
      <DeckGroup align="center" v-if='lands.length > 0'         v-bind:groupSize="lands.length"           groupName="Lands" />
      <DeckGroup align="center" v-if='creatures.length > 0'     v-bind:groupSize="creatures.length"       groupName="Creatures" />
      <DeckGroup align="center" v-if='spells.length > 0'        v-bind:groupSize="spells.length"          groupName="Spells" />
      <DeckGroup align="center" v-if='enchantments.length > 0'  v-bind:groupSize="enchantments.length"    groupName="Enchantments" />
      <DeckGroup align="center" v-if='artifacts.length > 0'     v-bind:groupSize="artifacts.length"       groupName="Artifacts" />
      <DeckGroup align="center" v-if='planeswalkers.length > 0' v-bind:groupSize="planeswalkers.length"   groupName="Planeswalkers" />
    </v-flex>
    <v-flex xl12 class="cardsContainer mt-3">
      <div class="cards" v-for='(cardsPile, pileIndex) in allCards' v-bind:key='`pile${pileIndex}`'>
        <a class="card" v-for='card in cardsPile' v-bind:key='card.ref' target="_blank" 
          :href="cardLink(card.multiverseid, card.name)">
          <img class="cardBorder cardImage" v-lazy="card.imageUrl" alt="Loading..." :ref="card.ref" />
          <!-- <img class="wildcard" :src="require(`@/assets/wildcards/${card.rarity}.png`)"/> -->
        </a>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
import DeckGroup from '@/components/mtg/DeckGroup'

export default {
  components: {
    DeckGroup
  },
  props: {
    cards: {
      type: Object,
      required: true
    },
    name: {
      type: String,
      required: false
    },
    userCollection: {
      type: Object,
      required: false
    }
  },
  methods: {
    cardLink: function (multiverseid, name) {
      if (multiverseid === 0) {
        return `http://gatherer.wizards.com/Pages/Search/Default.aspx?name=+[${name}]`
      }
      return `http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=${multiverseid}`
    }
  },
  computed: {
    cardsGrouped: function () {
      const cardsArray = []
      Object.keys(this.cards).forEach(mtgaId => {
        const card = this.cards[mtgaId]
        card['mtgaId'] = mtgaId
        card['itemType'] = 'card'
        for (let i = 0; i < card.qtd; i++) {
          card['ref'] = `card_${mtgaId}_${i + 1}`
          cardsArray.push(card)
        }
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
    },
    allCards: function () {
      let data = []
      data = data.concat(this.lands)
      data = data.concat(this.creatures)
      data = data.concat(this.spells)
      data = data.concat(this.enchantments)
      data = data.concat(this.artifacts)
      data = data.concat(this.planeswalkers)
      const columns = 4
      const pileSize = data.length / columns
      let cards = []
      for (let i = 0; i < columns; i++) {
        const index = i * pileSize
        cards.push(data.slice(index, index + pileSize))
      }
      return cards
    }
  },
  watch: {
    userCollection: function (value) {
      Object.keys(this.cards).forEach(mtgaId => {
        const card = this.cards[mtgaId]
        for (let qtdIndex = 1; qtdIndex <= card.qtd; qtdIndex++) {
          const cardComponent = this.$refs[`card_${mtgaId}_${qtdIndex}`]
          if (cardComponent !== undefined && cardComponent.length > 0) {
            const owned = value[mtgaId] !== undefined ? value[mtgaId] : 0
            if (qtdIndex > owned) {
              cardComponent[0].className += ' grayscale'
            }
          } else {
            console.log(`Card component not found for ${mtgaId}-${qtdIndex}: ${cardComponent}`)
          }
        }
      })
    }
  }
}
</script>

<style>
  #deckPreview {
    width: 100%;
  }
  #deckPreview .types {
    display: flex;
    width: 100%;
  }
  #deckPreview tr {
    width: 100%;
  }
  #deckPreview .cardsContainer{
    font-size: 11pt;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
  }
  #deckPreview .cards {
    padding: 2px;
    flex: 1;
    max-width: 250px;
  }
  #deckPreview .card {
    display: inline-block;
    position: relative;
  }
  #deckPreview .card .cardImage {
    pointer-events: none;
    display: block;
    position: relative;
    max-width: 100%;
    width: 250px;
  }
  #deckPreview .card:hover img {
    z-index: 9999;
  }
  #deckPreview .card:not(:first-child) {
    margin-top: -129%;
  }
  #deckPreview .wildcard {
    position: absolute;
    top: 0;
    right: 0;
    height: 28px;
    margin-right: -3px;
    margin-top: -3px;
  }
  .cardBorder {
    padding: 4px;
    border-radius: 12px;
    background-color: #14130e;
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
  .grayscale {
    -webkit-filter: grayscale(100%); /* Safari 6.0 - 9.0 */
    filter: grayscale(100%);
  }
</style>
