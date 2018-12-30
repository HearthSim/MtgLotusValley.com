<template>
  <div id="canvas-container">
    <canvas id="typeDistribution-chart"/>
  </div>
</template>

<script>
import Chart from 'chart.js'
import DeckUtils from '@/scripts/deckutils'
import Utils from '@/scripts/utils'

export default {
  props: {
    cards: {
      type: Object,
      required: true,
      default: {}
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
      },
      chart: undefined,
      typeData: [],
      typeLabels: [],
      typeHexValue: [],
      typeHexHoverValue: []
    }
  },
  mounted () {
    const ctx = document.getElementById('typeDistribution-chart')
    ctx.height = 250
    this.chart = new Chart(ctx, { // eslint-disable-line no-new
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
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              const index = tooltipItem.index
              const qtd = data.datasets[0].data[index]
              const text = data.labels[index]
              return `${qtd} ${text}`
            }
          }
        }
      }
    })
  },
  watch: {
    cards: function () {
      const cardsByType = DeckUtils.groupCardsByType(this.cards)
      const cardsByTypeQtd = {}
      Object.keys(cardsByType).forEach(type => {
        const cardsQtd = cardsByType[type].map(card => card.qtd)
        cardsByTypeQtd[type] = cardsQtd.length > 0 ? cardsQtd.reduce((acc, value) => acc + value) : 0
      })
      Utils.clear(this.typeLabels)
      Utils.clear(this.typeData)
      Utils.clear(this.typeHexValue)
      Utils.clear(this.typeHexHoverValue)
      this.typeLabels.push(...Object.keys(cardsByTypeQtd).filter(type => cardsByTypeQtd[type] > 0))
      this.typeData.push(...this.typeLabels.map(type => cardsByTypeQtd[type]))
      this.typeHexValue.push(...this.typeLabels.map(type => this.colors[type].hexValue))
      this.typeHexHoverValue.push(...this.typeLabels.map(type => this.colors[type].hexHoverValue))
      this.chart.update()
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
