<template>
  <tr>
    <td :class="marginTop ? 'pt-3' : ''">
      <i v-bind:class="'ms ms-' + groupSymbol + ' ms-shadow'"></i>
    </td>
    <td :class="`caption group_name ${marginTop ? 'pt-3' : ''}`">
      &nbsp;{{groupName}} ({{groupSize}})
    </td>
  </tr>
</template>

<script>

export default {
  props: {
    groupName: {
      type: String,
      required: true
    },
    groupSize: {
      type: Number,
      required: true
    },
    marginTop: {
      type: Boolean,
      required: false
    }
  },
  computed: {
    groupSymbol: function () {
      if (this.groupName === 'Lands') return 'land'
      if (this.groupName === 'Creatures') return 'creature'
      if (this.groupName === 'Spells') return 'sorcery'
      if (this.groupName === 'Enchantments') return 'enchantment'
      if (this.groupName === 'Artifacts') return 'artifact'
      if (this.groupName === 'Planeswalkers') return 'planeswalker'
      if (this.groupName === 'Sideboard') return 'multiple'
      return ''
    }
  },
  methods: {}
}
</script>

<style scoped>
  .group_name {
    text-align: left;
    padding-top: 0.4em;
  }
</style>
