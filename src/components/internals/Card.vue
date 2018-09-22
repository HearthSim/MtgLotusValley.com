<template>
  <div>
    <v-tooltip left lazy color="white">
      <img v-if="!asText" :src="cardImageUrl()" :alt="name" width="100%" slot="activator"/>
      <a v-if="asText" class='body-1' target="_blank" :href="cardLink()" slot="activator">
        {{ name }}
      </a>
      <img :src="cardImageUrl()" alt="Loading..."/>
    </v-tooltip>
  </div>
</template>

<script>

export default {
  props: {
    name: {
      type: String,
      required: true
    },
    multiverseid: {
      type: Number,
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
      return 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=' + this.multiverseid + '&type=card'
    },
    cardLink: function () {
      return 'http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=' + this.multiverseid
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
