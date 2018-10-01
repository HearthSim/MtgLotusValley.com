<template>
  <div>
    <v-tooltip left lazy color="white">
      <a v-if="!asText" target="_blank" :href="cardLink()" slot="activator">
        <div id="card">
          <img :src="imageUrl" :class="qtd === 0 ? 'grayscale' : ''" :alt="name" width="100%"/>
          <v-card id="cardQtd" class="elevation-2" v-if="qtd > 0">
            {{ qtd }}
          </v-card>
        </div>
      </a>
      <a v-if="asText" class='body-1' target="_blank" :href="cardLink()" slot="activator">
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
    font-size: 11px;
    padding-left: 5px;
    padding-right: 5px;
    position: absolute;
    background: lightgray;
    left: -5px;
    bottom: 0px;
    width: fit-content;
  }
</style>
