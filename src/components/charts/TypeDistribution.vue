<template>
  <div id="canvas-container">
    <canvas id="typeDistribution-chart"/>
  </div>
</template>

<script>
import Chart from 'chart.js'
import DeckUtils from '@/scripts/deckutils'

export default {
  props: {
    cards: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      colors: {
        'Lands': {hexValue: '#795548', hexHoverValue: '#8D6E63'},
        'Creatures': {hexValue: '#4CAF50', hexHoverValue: '#66BB6A'},
        'Spells': {hexValue: '#00BCD4', hexHoverValue: '#26C6DA'},
        'Enchantments': {hexValue: '#2196F3', hexHoverValue: '#42A5F5'},
        'Artifacts': {hexValue: '#9E9E9E', hexHoverValue: '#BDBDBD'},
        'Planeswalkers': {hexValue: '#FFC107', hexHoverValue: '#FFCA28'}
      }
    }
  },
  computed: {
    cardsByType: function () {
      let data = {}
      const cardsByType = DeckUtils.groupCardsByType(this.cards)
      Object.keys(cardsByType).forEach(type => {
        data[type] = cardsByType[type].length
      })
      return data
    },
    typeData: function () {
      const data = []
      this.typeLabels.forEach(type => {
        data.push(this.cardsByType[type])
      })
      return data
    },
    typeLabels: function () {
      return Object.keys(this.cardsByType).filter(type => this.cardsByType[type] > 0)
    },
    typeHexValue: function () {
      return this.typeLabels.map(type => this.colors[type].hexValue)
    },
    typeHexHoverValue: function () {
      return this.typeLabels.map(type => this.colors[type].hexHoverValue)
    }
  },
  watch: {
    cards: function () {
      const ctx = document.getElementById('typeDistribution-chart')
      ctx.height = 250
      new Chart(ctx, { // eslint-disable-line no-new
        type: 'pie',
        data: {
          labels: this.typeLabels,
          datasets: [
            {
              data: this.typeData,
              backgroundColor: this.typeHexValue,
              borderColor: this.typeHexValue,
              borderWidth: 1,
              hoverBackgroundColor: this.typeHexHoverValue
            }
          ]
        },
        options: {
          responsive: false,
          maintainAspectRatio: true,
          legend: {
            display: true
          },
          title: {
            text: 'Type Distribution',
            display: true
          }
        }
      })
    }
  }
}
</script>

<style>
  #canvas-container {
    width: 90%;
    margin-left: auto;
    margin-right: auto;
  }
  #canvas-container canvas {
    width: 100%;
    height: 100%;
  }
</style>
