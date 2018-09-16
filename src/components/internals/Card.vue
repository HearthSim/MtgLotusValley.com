<template>
  <v-tooltip right>
    <a slot="activator" target="_blank" 
       :href="'http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=' + card.multiverseid">
      {{ card.name }}
    </a>
    <img :src="'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=' + card.multiverseid + '&type=card'" 
      alt="Loading..."/>
  </v-tooltip>
</template>

<script>

export default {
  props: {
    card: {
      type: Object,
      required: true
    }
  },
  methods: {}
}
</script>

<style>
a {
  color: #337ab7;
  font-family: Helvetica, Arial, sans-serif;
  font-size: 14px;
  text-decoration: none;
}
</style>
