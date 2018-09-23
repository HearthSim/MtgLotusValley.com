<template>
  <div>
    <v-tooltip left lazy color="white">
      <a v-if="!asText" target="_blank" :href="cardLink()" slot="activator">
        <div id="card">
          <img :src="cardImageUrl()" :class="qtd === 0 ? 'grayscale' : ''" :alt="name" width="100%"/>
          <div id="cardQtd" v-if="qtd > 0">
            {{ qtd }}
          </div>
        </div>
      </a>
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
    },
    qtd: {
      type: Number,
      default: 0,
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
  .grayscale {
    -webkit-filter: grayscale(100%); /* Safari 6.0 - 9.0 */
    filter: grayscale(100%);
  }
  #cardQtd {
    border: 2px double darkgray;
	  border-radius: 6px;
    background-color : lightgray;
    font-size: 11px;
    padding-left: 6px;
    padding-right: 6px;
    position: absolute;
    left: -5px;
    bottom: 0px;
    width: fit-content;
  }
</style>
