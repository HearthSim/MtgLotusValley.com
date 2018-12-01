<template>
  <div class="cardContainer">
    <div v-if="!asText" :class="`cardAsImage ${getScaleClass()} ${clickable ? '' : 'pointer'}`"
      @click="onClick(cardLink())">
      <img :class="`cardBorder ${qtd === 0 ? 'grayscale' : ''}`" :alt="name"
        v-lazy="imageUrl" width="100%" ref="cardImage"/>
      <img v-if="imageUrlTransformed !== undefined" :class="`cardTransformed cardBorder ${qtd === 0 ? 'grayscale' : ''}`"
        :alt="name" v-lazy="imageUrlTransformed" width="100%" ref="cardImageTransformed"/>
      <v-card v-if="qtd > 1" dark
        :class="`cardQtd ${qtdPosition === 'top' ? 'cardQtdOnTop' : 'cardQtdOnBottom'} elevation-2`">
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
    qtdPosition: {
      type: String,
      required: false,
      default: 'bottom'
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
      default: false
    },
    clickableKey: {
      required: false
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
    onClick: function (url) {
      if (this.clickable) {
        this.$emit('click', this.clickableKey)
      } else {
        this.openInNewTab(url)
      }
    },
    openInNewTab: function (url) {
      var win = window.open(url, '_blank')
      win.focus()
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
    display: none;
    position: absolute;
    top: 0;
    right: -100%;
  }
  .grayscale {
    -webkit-filter: grayscale(100%); /* Safari 6.0 - 9.0 */
    filter: grayscale(100%);
  }
  .cardAsImage {
    z-index: 99;
    position: relative;
  }
  .cardAsImage:hover {
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
    max-width: 140px;
  }
  .textNameLarge {
    max-width: 180px;
  }
  .cardQtd {
    position: absolute;
    border: 2px double darkgray;
	  border-radius: 6px;
    padding-left: 4px;
    padding-right: 4px;
    background: black;
    width: fit-content;
  }
  .cardQtdOnBottom {
    bottom: 0;
    transform: translateX(-5px);
    font-size: 11pt;
  }
  .cardQtdOnTop {
    top: 0;
    transform: translateX(-16px);
    font-size: 9.5pt;
  }
</style>
