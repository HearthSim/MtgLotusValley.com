<template>
  <tr>
    <td>
      <i v-bind:class="'ms ms-' + groupSymbol + ' ms-shadow'"></i>
    </td>
    <td class="body-2" id="group_name">
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

<style>
table #group_name {
  text-align: left;
  padding-top: 0.4em;
}
</style>
