<template>
  <div class="cardContainer">
    <a class="card" v-for='(card, index) in cardsPile' v-bind:key='index' target="_blank" 
      :href="cardLink(card.multiverseid, card.name)">
      <img :class="`cardBorder cardImage ${card.isMissing ? 'grayscale' : ''}`"
        v-lazy="card.imageUrl" alt="Loading..." />
    </a>
  </div>
</template>

<script>
export default {
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
  .card {
    display: inline-block;
    position: relative;
  }
  .card .cardImage {
    pointer-events: none;
    display: block;
    position: relative;
    max-width: 100%;
    width: 250px;
  }
  .card:hover img {
    z-index: 9999;
  }
  .card:not(:first-child) {
    margin-top: -129%;
  }
  .cardBorder {
    padding: 4px;
    border-radius: 12px;
    background-color: #14130e;
  }
  .grayscale {
    -webkit-filter: grayscale(100%); /* Safari 6.0 - 9.0 */
    filter: grayscale(100%);
  }
</style>
