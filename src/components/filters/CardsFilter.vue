<template>
  <div class="ml-2 mr-2">
    <v-card :class="`pt-2 pl-2 pr-2 pb-2 ${expand ? 'd-block' : ''}`">
      <div class="text-xs-left body-1">
        <span class="label pl-1">Contains Cards</span>
      </div>
      <div class="text-xs-center">
        <v-text-field class="mt-1 ml-2 mr-2 mb-2" label="Card Name" 
          v-model="cardName" @keyup.native.enter="addCard()"
          flat single-line hide-details clearable />
        <div>
          <v-chip class="mt-1" v-for="(name, index) in cards" :key="index" 
            close @input="remCard(name)">
            {{ name }}
          </v-chip>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
import Utils from '@/scripts/utils'

export default {
  props: {
    value: {
      type: String
    },
    expand: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      cards: [],
      cardName: ''
    }
  },
  mounted () {
    if (this.value.length > 0) {
      this.cards = this.value.split(';')
    }
  },
  methods: {
    addCard () {
      this.cards.push(this.cardName)
      this.updateValue()
      this.cardName = ''
    },
    remCard (name) {
      Utils.remove(this.cards, name)
      this.updateValue()
    },
    updateValue () {
      if (this.cards.length === 0) {
        this.$emit('input', '')
      } else if (this.cards.length === 1) {
        this.$emit('input', this.cards[0])
      } else {
        this.$emit('input', this.cards.sort().join(';'))
      }
    }
  },
  watch: {
    value: function (value) {
      if (this.value.length > 0) {
        this.cards = value.split(';')
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .v-card {
    border: solid 1px lightgray;
    border-radius: 8px;
    align-items: baseline;
    display: inline-block;
  }
  img {
    border-radius: 8px;
    height: 36px;
    padding: 4px;
  }
  img:hover {
    background: lightgray;
  }
  .grayscale {
    -webkit-filter: grayscale(100%); /* Safari 6.0 - 9.0 */
    filter: grayscale(100%);
  }
</style>
