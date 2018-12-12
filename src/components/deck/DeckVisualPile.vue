<template>
  <div>
    <a v-if="!clickable" class="cardContainer" v-for='(card, index) in cardsPile'
      v-bind:key='index' target="_blank" :href="cardLink(card.multiverseid, card.name)">
      <Card class="card" :name='card.name' :imageUrl='card.imageUrl'
        :imageUrlTransformed='card.imageUrlTransformed' :multiverseid='card.multiverseid'
        :qtd="getCardQtd(card)" qtdPosition="top" :scaleOnHover="false" />
    </a>
    <div v-if="clickable" class="cardContainer" v-for='(card, index) in cardsPile'
      v-bind:key='index' @click="cardClick(index)">
      <Card class="card" :name='card.name' :imageUrl='card.imageUrl'
        :imageUrlTransformed='card.imageUrlTransformed' :multiverseid='card.multiverseid'
        :qtd="getCardQtd(card)" qtdPosition="top" :scaleOnHover="false" :clickable="true" />
    </div>
  </div>
</template>

<script>
import Card from '@/components/mtg/Card'

export default {
  components: {
    Card
  },
  props: {
    cardsPile: {
      type: Array,
      required: true
    },
    clickable: {
      type: Boolean,
      required: false,
      default: false
    },
    showQtd: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  methods: {
    cardLink: function (multiverseid, name) {
      if (multiverseid === 0) {
        return `http://gatherer.wizards.com/Pages/Search/Default.aspx?name=+[${name}]`
      }
      return `http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=${multiverseid}`
    },
    cardClick: function (index) {
      this.$emit('click', this.cardsPile[index])
    },
    getCardQtd: function (card) {
      if (this.showQtd) {
        return card.qtd
      } else {
        return card.basicLandQtd ? card.basicLandQtd : -1
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .cardContainer {
    display: inline-block;
    position: relative;
  }
  .cardContainer .card {
    pointer-events: none;
    display: block;
    position: relative;
  }
  .cardContainer:hover .card {
    z-index: 9999;
  }
  .cardContainer:not(:first-child) {
    margin-top: -128%;
  }
</style>
