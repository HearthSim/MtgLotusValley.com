<template>
  <div id="canvas-container">
    <canvas id="colorDistribution-chart"/>
  </div>
</template>

<script>
import Chart from 'chart.js'
import Utils from '@/scripts/utils'

export default {
  props: {
    cards: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      chart: undefined,
      colorsData: [],
      colorsLabels: [],
      colorsHexValue: [],
      colorsHexHoverValue: []
    }
  },
  mounted () {
    const ctx = document.getElementById('colorDistribution-chart')
    ctx.height = 250
    this.chart = new Chart(ctx, { // eslint-disable-line no-new
      type: 'pie',
      data: {
        labels: this.colorsLabels,
        datasets: [
          {
            data: this.colorsData,
            backgroundColor: this.colorsHexValue,
            borderColor: this.colorsHexValue,
            borderWidth: 1,
            hoverBackgroundColor: this.colorsHexHoverValue
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
          text: 'Color Distribution',
          display: true
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              const index = tooltipItem.index
              const qtd = data.datasets[0].data[index]
              return `${qtd} Cards`
            }
          }
        }
      }
    })
  },
  methods: {
    cardsByColors: function () {
      const data = {}
      Object.keys(this.cards).forEach(mtgaId => {
        const card = this.cards[mtgaId]
        const isLand = card.type.includes('Land') && !card.type.includes('Creature')
        if (!isLand) {
          const colors = card.colors.length === 0 ? 'c' : card.colors.length === 1 ? card.colors[0].toLowerCase() : 'm'
          if (data[colors] === undefined) {
            data[colors] = card.qtd
          } else {
            data[colors] += card.qtd
          }
        }
      })
      const dataColors = Object.keys(data)
      dataColors.sort()
      const orderedData = {}
      let c = 0
      let m = 0
      dataColors.forEach(colorCode => {
        if (colorCode === 'c') {
          c = data[colorCode]
        } else if (colorCode === 'm') {
          m = data[colorCode]
        } else {
          orderedData[colorCode] = data[colorCode]
        }
      })
      if (m > 0) {
        orderedData['m'] = m
      }
      if (c > 0) {
        orderedData['c'] = c
      }
      return orderedData
    }
  },
  watch: {
    cards: function () {
      const cardsByColors = this.cardsByColors()
      Utils.clear(this.colorsData)
      Utils.clear(this.colorsLabels)
      Utils.clear(this.colorsHexValue)
      Utils.clear(this.colorsHexHoverValue)
      const cardsColors = Object.keys(cardsByColors)
      this.colorsData.push(...cardsColors.map(color => cardsByColors[color]))
      this.colorsLabels.push(...cardsColors.map(color => {
        const colorObj = Utils.colors.find(colorObj => colorObj.code === color)
        return colorObj.name
      }))
      this.colorsHexValue.push(...cardsColors.map(color => {
        const colorObj = Utils.colors.find(colorObj => colorObj.code === color)
        return colorObj.hexValue
      }))
      this.colorsHexHoverValue.push(...cardsColors.map(color => {
        const colorObj = Utils.colors.find(colorObj => colorObj.code === color)
        return colorObj.hexHoverValue
      }))
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
