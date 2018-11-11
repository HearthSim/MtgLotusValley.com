<template>
  <div>
    <a class="cardContainer" v-for='(card, index) in cardsPile' v-bind:key='index'
       target="_blank" :href="cardLink(card.multiverseid, card.name)">
      <Card class="card" :name='card.name' :imageUrl='card.imageUrl' :imageUrlTransformed='card.imageUrlTransformed'
        :multiverseid='card.multiverseid' :qtd="-1" :scaleOnHover="false" />
    </a>
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
    }
  },
  methods: {
    cardLink: function (multiverseid, name) {
      if (multiverseid === 0) {
        return `http://gatherer.wizards.com/Pages/Search/Default.aspx?name=+[${name}]`
      }
      return `http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=${multiverseid}`
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
    margin-top: -129%;
  }
</style>
