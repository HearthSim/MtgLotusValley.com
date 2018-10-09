<template>
  <div>
    <i v-bind:title="setTitle" v-bind:class="'ss ss-' + setLowerCase + ' ss-' + rarityLowerCase"></i>
  </div>
</template>

<script>
import Utils from '@/scripts/utils'

export default {
  computed: {
    rarityLowerCase: function () {
      return this.rarity.toLowerCase()
    },
    setLowerCase: function () {
      return this.set === 'DAR' ? 'dom' : this.set.toLowerCase()
    },
    setTitle: function () {
      const setCode = this.set
      let setHint = setCode
      Utils.sets.forEach(set => {
        if (set.code === setCode) {
          setHint = set.name
        }
      })
      return setHint
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
  transform: translateY(-3px);
}
</style>
