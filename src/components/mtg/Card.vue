<template>
  <div class="cardContainer">
    <div v-if="!asText" :class="`cardAsImage ${getScaleClass()} ${clickable ? 'pointer' : ''}`"
      @click="openInNewTab(cardLink())">
      <img :class="`cardBorder ${qtd === 0 ? 'grayscale' : ''}`" :alt="name"
        v-lazy="imageUrl" width="100%" ref="cardImage"/>
      <img v-if="imageUrlTransformed !== undefined" :class="`cardTransformed cardBorder ${qtd === 0 ? 'grayscale' : ''}`"
        :alt="name" v-lazy="imageUrlTransformed" width="100%" ref="cardImageTransformed"/>
      <v-card class="cardQtd elevation-2" v-if="qtd > 1">
        {{ qtd }}
      </v-card>
    </div>
    <v-tooltip v-if="asText" :class="`textNoWrap ${largeName ? 'textNameLarge' : 'textNameNormal'}`" left lazy>
      <a class='body-1' target="_blank" :href="cardLink()" slot="activator">
        {{ name }}
      </a>
      <img class="cardBorder" v-lazy="imageUrl" alt="Loading..." width="250px" />
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
    imageUrlTransformed: {
      type: String,
      required: false
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
    largeName: {
      type: Boolean,
      required: false,
      default: false
    },
    scaleOnHover: {
      type: Boolean,
      default: true,
      required: false
    },
    highScaleOnHover: {
      type: Boolean,
      default: false,
      required: false
    },
    clickable: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  watch: {
    imageUrl: function (value) {
      this.$refs.cardImage.setAttribute('src', value)
    },
    imageUrlTransformed: function (value) {
      this.$refs.cardImageTransformed.setAttribute('src', value)
    }
  },
  methods: {
    cardLink: function () {
      if (this.multiverseid === 0) {
        return `http://gatherer.wizards.com/Pages/Search/Default.aspx?name=+[${this.name}]`
      }
      return `http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=${this.multiverseid}`
    },
    getScaleClass: function () {
      if (!this.scaleOnHover) {
        return ''
      }
      return this.highScaleOnHover ? 'highHoverScale' : 'defaultHoverScale'
    },
    openInNewTab: function (url) {
      if (this.clickable) {
        var win = window.open(url, '_blank')
        win.focus()
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  a {
    position: relative;
    color: #337ab7;
    text-decoration: none;
  }
  .pointer {
    cursor: pointer;
  }
  .cardBorder {
    padding: 4px;
    border-radius: 8px;
    background-color: #14130e;
  }
  .cardTransformed {
    display:none;
    position:absolute;
    top:0;
    right:-100%;
  }
  .grayscale {
    -webkit-filter: grayscale(100%); /* Safari 6.0 - 9.0 */
    filter: grayscale(100%);
  }
  .cardAsImage {
    z-index: 999;
  }
  .cardAsImage:hover {
    position: relative;
    z-index: 9999;
  }
  .cardAsImage:hover .cardTransformed {
    display: block;
  }
  .defaultHoverScale {
    transform: scale(1);
    transition-duration: .5s;
  }
  .defaultHoverScale:hover {
    transform: scale(1.3);
    transition-duration: .5s;
  }
  .highHoverScale {
    transform: scale(1);
    transition-duration: .5s;
  }
  .highHoverScale:hover {
    transform: scale(1.7);
    transition-duration: .5s;
  }
  .textNameNormal {
    max-width: 160px;
  }
  .textNameLarge {
    max-width: 200px;
  }
  .cardQtd {
    position: absolute;
    bottom: 0;
    border: 2px double darkgray;
	  border-radius: 6px;
    font-size: 11pt;
    padding-left: 5px;
    padding-right: 5px;
    background: lightgray;
    transform: translateX(-5px);
    width: fit-content;
  }
</style>
