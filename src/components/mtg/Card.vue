<template>
  <div id="card" :class="`${highScaleOnHover ? 'highHoverScale' : 'defaultHoverScale'}`">
    <a v-if="!asText" target="_blank" :href="cardLink()" slot="activator">
      <img :class="`${qtd === 0 ? 'grayscale' : ''}`"
         :src="imageUrl" :alt="name" width="100%"/>
      <v-card id="cardQtd" class="elevation-2" v-if="qtd > 0">
        {{ qtd }}
      </v-card>
    </a>
    <v-tooltip v-if="asText" left lazy color="white">
      <a class='body-1' target="_blank" :href="cardLink()" slot="activator">
        {{ name }}
      </a>
      <img :src="imageUrl" alt="Loading..." width="250px"/>
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
    imageUrl: {
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
    },
    highScaleOnHover: {
      type: Boolean,
      default: false,
      required: false
    }
  },
  methods: {
    cardLink: function () {
      if (this.multiverseid === 0) {
        return `http://gatherer.wizards.com/Pages/Search/Default.aspx?name=+[${this.name}]`
      }
      return `http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=${this.multiverseid}`
    }
  }
}
</script>

<style>
  #card a {
    color: #337ab7;
    text-decoration: none;
  }
  .grayscale {
    -webkit-filter: grayscale(100%); /* Safari 6.0 - 9.0 */
    filter: grayscale(100%);
  }
  .defaultHoverScale:hover {
    transform: scale(1.2);
    transition-duration: .5s;
  }
  .highHoverScale:hover {
    transform: scale(1.7);
    transition-duration: .5s;
  }
  #cardQtd {
    border: 2px double darkgray;
	  border-radius: 6px;
    font-size: 11pt;
    padding-left: 5px;
    padding-right: 5px;
    background: lightgray;
    transform: translateX(-5px) translateY(-25px);
    width: fit-content;
  }
</style>
