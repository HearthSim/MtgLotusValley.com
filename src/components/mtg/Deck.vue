<template>
  <div>
    <div class='deck'>
      <v-layout class="header" column wrap>
        <v-tooltip bottom>
          <v-icon class="export" @click="exportDeckToArena()" slot="activator">code</v-icon>
          <span>Export deck to Magic Arena</span>
        </v-tooltip>
        <router-link v-if="link === true" :to="deckLink">
          <span class='body-2 font-weight-bold'>{{ name }}</span>
        </router-link>
        <span v-if="link === undefined" class='body-2 font-weight-bold'>{{ name }}</span>
        <span v-if="details !== undefined" class='caption font-weight-bold'>{{ details }}</span>
      </v-layout>
      <table class="mt-2">
        <tr class="text-xs-center">
          <td colspan="6">
            <span class='body-1'>Main Deck ({{mainDeckQtd}})</span>
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
            <span class='body-1'>Sideboard ({{sideboardQtd}})</span>
          </td>
        </tr>
        <DeckCard  v-if='sideboardQtd > 0' v-for='card in sideboardCards' :key='`S${card.id}`'
          :card='card' :largeName="largeName"/>
      </table>
    </div>
    <v-dialog class="btExport" v-model="deckExportDialogVisible" width="350">
      <v-card>
        <v-card-text class='subheading'>Deck copied to clipboard.</v-card-text>
        <v-card-actions>
          <v-spacer/>
          <v-btn color="primary" flat @click="deckExportDialogVisible = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
    details: {
      type: String,
      required: false
    },
    largeName: {
      type: Boolean,
      required: false,
      default: false
    },
    link: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data () {
    return {
      deckLink: '',
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
      sideboardQtd: 0,
      deckExportDialogVisible: false
    }
  },
  mounted () {
    this.updateDeckCards()
    this.updateDeckLink()
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
    },
    updateDeckLink: function () {
      if (this.cards === undefined) {
        return
      }
      const cards = []
      Object.keys(this.cards).forEach(mtgaId => {
        const card = this.cards[mtgaId]
        cards.push(`${card.qtd}:${mtgaId}`)
      })
      const sideboard = []
      if (this.sideboard !== undefined) {
        Object.keys(this.sideboard).forEach(mtgaId => {
          const card = this.sideboard[mtgaId]
          sideboard.push(`${card.qtd}:${mtgaId}`)
        })
      }
      this.deckLink = `/decks/${cards.join(';')}_${sideboard.join(';')}?loader=true`
    },
    exportDeckToArena: function () {
      this.deckExportDialogVisible = true
      DeckUtils.exportDeckToArena(this.cards, this.sideboard !== undefined ? this.sideboard : {})
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
        this.updateDeckLink()
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
  .header {
    position: relative;
    height: auto;
  }
  .export {
    position: absolute;
    left: calc(100% - 24px);
  }
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
