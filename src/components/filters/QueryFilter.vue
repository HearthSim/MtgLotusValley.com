<template>
  <div class="pt-1 pb-1">
    <div class="text-xs-left body-1 font-weight-bold">
      <span>{{title}}</span>
    </div>
    <v-text-field class="field mt-0 pt-2" label="Search" v-model="searchQuery"
      @keyup.native.enter="applyQuery()"
      flat single-line hide-details clearable />
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
      default: 'Search'
    }
  },
  data () {
    return {
      searchQuery: ''
    }
  },
  mounted () {
    this.searchQuery = this.value
  },
  methods: {
    applyQuery () {
      console.log('enter')
      this.$emit('onQuery')
    }
  },
  watch: {
    value: function (value) {
      this.searchQuery = value
    },
    searchQuery: function (value) {
      this.$emit('input', value)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
