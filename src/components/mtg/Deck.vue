<template>
  <div>
    <div class='deck'>
      <span class='body-2'>{{ name }}</span>
      <table>
        <tr class="text-xs-center">
          <td colspan="6">
            Main Deck ({{mainDeckQtd}})
          </td>
        </tr>
        <DeckGroup v-if='lands.length > 0'         :groupSize="landsQtd"         groupName="Lands" />
        <DeckCard  v-if='lands.length > 0'         v-for='card in lands'          :key='`M${card.id}`'
          :card='card' :largeName="largeName"/>
        <DeckGroup v-if='creatures.length > 0'     :groupSize="creaturesQtd"     groupName="Creatures" />
        <DeckCard  v-if='creatures.length > 0'     v-for='card in creatures'      :key='`M${card.id}`'
          :card='card' :largeName="largeName"/>
        <DeckGroup v-if='spells.length > 0'        :groupSize="spellsQtd"        groupName="Spells" />
        <DeckCard  v-if='spells.length > 0'        v-for='card in spells'         :key='`M${card.id}`'
          :card='card' :largeName="largeName"/>
        <DeckGroup v-if='enchantments.length > 0'  :groupSize="enchantmentsQtd"  groupName="Enchantments" />
        <DeckCard  v-if='enchantments.length > 0'  v-for='card in enchantments'   :key='`M${card.id}`'
          :card='card' :largeName="largeName"/>
        <DeckGroup v-if='artifacts.length > 0'     :groupSize="artifactsQtd"     groupName="Artifacts" />
        <DeckCard  v-if='artifacts.length > 0'     v-for='card in artifacts'      :key='`M${card.id}`'
          :card='card' :largeName="largeName"/>
        <DeckGroup v-if='planeswalkers.length > 0' :groupSize="planeswalkersQtd" groupName="Planeswalkers" />
        <DeckCard  v-if='planeswalkers.length > 0' v-for='card in planeswalkers'  :key='`M${card.id}`'
          :card='card' :largeName="largeName"/>
        <tr v-if='cardsGrouped.length > 0 && sideboardQtd > 0' class="text-xs-center">
          <td class="pt-3" colspan="4">
            Sideboard ({{sideboardQtd}})
          </td>
        </tr>
        <DeckCard  v-if='sideboardQtd > 0' v-for='card in sideboardCards' :key='`S${card.id}`'
          :card='card' :largeName="largeName"/>
      </table>
    </div>
  </div>
</template>

<script>
import DeckCard from '@/components/mtg/DeckCard'
import DeckGroup from '@/components/mtg/DeckGroup'
import DeckUtils from '@/scripts/deckutils'

export default {
  components: {
    DeckCard, DeckGroup, DeckUtils
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
    largeName: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      cardsGrouped: [],
      lands: [],
      creatures: [],
      spells: [],
      enchantments: [],
      artifacts: [],
      planeswalkers: [],
      landsQtd: 0,
      creaturesQtd: 0,
      spellsQtd: 0,
      enchantmentsQtd: 0,
      artifactsQtd: 0,
      planeswalkersQtd: 0,
      mainDeckQtd: 0,
      sideboardCards: [],
      sideboardQtd: 0
    }
  },
  mounted () {
    this.updateDeckCards()
    this.updateSideboardCards()
  },
  methods: {
    groupCards: function (cards) {
      const cardsArray = []
      Object.keys(cards).forEach(mtgaId => {
        const card = cards[mtgaId]
        card['id'] = mtgaId
        card['itemType'] = 'card'
        cardsArray.push(card)
      })
      DeckUtils.sortByCmc(cardsArray)
      return cardsArray
    },
    updateDeckCards: function () {
      this.cardsGrouped = []
      if (this.cards !== undefined) {
        this.cardsGrouped = this.groupCards(this.cards)
      }
      this.lands = this.cardsGrouped.filter(card => {
        return card.type.includes('Land') && !card.type.includes('Creature')
      })
      this.creatures = this.cardsGrouped.filter(card => card.type.includes('Creature'))
      this.spells = this.cardsGrouped.filter(card => {
        return card.type.includes('Instant') || card.type.includes('Sorcery')
      })
      this.enchantments = this.cardsGrouped.filter(card => {
        return card.type.includes('Enchantment') && !card.type.includes('Creature')
      })
      this.artifacts = this.cardsGrouped.filter(card => {
        return card.type.includes('Artifact') &&
          !card.type.includes('Creature') &&
          !card.type.includes('Land') &&
          !card.type.includes('Enchantment')
      })
      this.planeswalkers = this.cardsGrouped.filter(card => card.type.includes('Planeswalker'))

      this.landsQtd = DeckUtils.getGroupCardsQtd(this.lands)
      this.creaturesQtd = DeckUtils.getGroupCardsQtd(this.creatures)
      this.spellsQtd = DeckUtils.getGroupCardsQtd(this.spells)
      this.enchantmentsQtd = DeckUtils.getGroupCardsQtd(this.enchantments)
      this.artifactsQtd = DeckUtils.getGroupCardsQtd(this.artifacts)
      this.planeswalkersQtd = DeckUtils.getGroupCardsQtd(this.planeswalkers)
      this.mainDeckQtd = this.landsQtd + this.creaturesQtd + this.spellsQtd +
        this.enchantmentsQtd + this.artifactsQtd + this.planeswalkersQtd
    },
    updateSideboardCards: function () {
      if (this.sideboard !== undefined) {
        this.sideboardCards = this.groupCards(this.sideboard)
      }
      this.sideboardQtd = DeckUtils.getGroupCardsQtd(this.sideboardCards)
    }
  },
  watch: {
    cards: function () {
      this.lands = []
      this.creatures = []
      this.spells = []
      this.enchantments = []
      this.artifacts = []
      this.planeswalkers = []
      this.$nextTick(() => {
        this.updateDeckCards()
      })
    },
    sideboard: function () {
      this.sideboardCards = []
      this.$nextTick(() => {
        this.updateSideboardCards()
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .deck {
    font-size: 11pt;
    /* overflow-x: auto; breaks two column */
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
