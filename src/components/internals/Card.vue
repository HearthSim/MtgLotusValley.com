<template>
  <div>
    <img v-if="!asText" :src="cardImageUrl()" :alt="card.name"/>
    <v-tooltip v-if="asText" left lazy color="white">
      <a class='body-1' slot="activator" target="_blank" :href="cardLink()">
        {{ card.name }}
      </a>
      <img :src="cardImageUrl()" alt="Loading..."/>
    </v-tooltip>
  </div>
</template>

<script>

export default {
  props: {
    card: {
      type: Object,
      required: true
    },
    asText: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  methods: {
    cardImageUrl: function () {
      return 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=' + this.card.multiverseid + '&type=card'
    },
    cardLink: function () {
      return 'http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=' + this.card.multiverseid
    }
  }
}
</script>

<style>
a {
  color: #337ab7;
  text-decoration: none;
}
</style>
