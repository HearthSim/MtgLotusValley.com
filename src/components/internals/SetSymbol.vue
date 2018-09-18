<template>
  <div>
    <i v-bind:title="set" v-bind:class="'ss ss-' + setLowerCase + ' ss-' + rarityLowerCase"></i>
  </div>
</template>

<script>

export default {
  computed: {
    rarityLowerCase: function () {
      return this.rarity.toLowerCase()
    },
    setLowerCase: function () {
      return this.set.toLowerCase()
    }
  },
  props: {
    set: {
      type: String,
      required: true
    },
    rarity: {
      type: String,
      required: true
    }
  },
  methods: {}
}
</script>

<style>
.ss {
  margin-bottom: 0.2em;
}
</style>
