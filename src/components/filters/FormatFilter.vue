<template>
  <div class="pt-1 pb-1">
    <div class="text-xs-left body-1 font-weight-bold">
      <span>{{title}}</span>
    </div>
    <v-select :items="formats" v-model="deckFormat" @change="applyQuery" solo/>
  </div>
</template>

<script>

export default {
  props: {
    value: {
      type: String
    },
    title: {
      type: String,
      required: false,
      default: 'Format'
    }
  },
  data () {
    return {
      deckFormat: 'Constructed',
      formats: ['Constructed', 'Limited', 'All Formats']
    }
  },
  mounted () {
    this.deckFormat = this.value
  },
  methods: {
    applyQuery () {
      this.$emit('input', this.deckFormat)
    }
  },
  watch: {
    value: function (value) {
      this.deckFormat = value
    },
    deckFormat: function (value) {
      this.$emit('input', value)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
