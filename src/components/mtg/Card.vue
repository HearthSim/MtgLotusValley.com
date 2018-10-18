<template>
  <div>
    <div v-if="!asText" :class="`${highScaleOnHover ? 'highHoverScale' : 'defaultHoverScale'}`">
      <a target="_blank" :href="cardLink()">
        <img :class="`cardBorder ${qtd === 0 ? 'grayscale' : ''}`" :alt="name"
          v-lazy="imageUrl" width="100%"/>
        <v-card class="cardQtd elevation-2" v-if="qtd > 0">
          {{ qtd }}
        </v-card>
      </a>
    </div>
    <v-tooltip v-if="asText" :class="`textName ${largeName ? 'textNameLarge' : 'textNameNormal'}`" left lazy>
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  a {
    color: #337ab7;
    text-decoration: none;
  }
  .cardBorder {
    padding: 4px;
    border-radius: 8px;
    background-color: #14130e;
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
  .textName {
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-flex;/* block; */
    overflow: hidden;
  }
  .textNameNormal {
    max-width: 140px;
  }
  .textNameLarge {
    max-width: 200px;
  }
  .cardQtd {
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
