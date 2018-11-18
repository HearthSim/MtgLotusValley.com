<template>
  <div class="pl-2 pr-2">
    <v-layout row nowrap>
      <div class="pt-1 pb-1">
        <div class="text-xs-left body-1 font-weight-bold">
          <span>Contains Cards</span>
        </div>
        <v-text-field class="field mt-0" label="Card Name" 
          v-model="cardName" @keyup.native.enter="addCard()"
          flat single-line hide-details clearable />
      </div>
      <div class="text-xs-center">
        <v-chip v-for="(name, index) in cards" :key="index" 
          close @input="remCard(name)">
          {{ name }}
        </v-chip>
      </div>
    </v-layout>
  </div>
</template>

<script>
import Utils from '@/scripts/utils'

export default {
  props: {
    value: {
      type: String
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
      if (this.cardName === '') {
        return
      }
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
  .field {
    width: 180px;
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
