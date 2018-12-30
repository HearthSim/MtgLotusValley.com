<template>
  <div id="canvas-container">
    <canvas :id="`mana${type}Distribution-chart`"/>
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
    },
    type: {
      type: String,
      required: true,
      default: 'symbol'
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
    const ctx = document.getElementById(`mana${this.type}Distribution-chart`)
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
            hoverBackgroundColor: this.colorsHexHoverValue,
            labelText: this.type === 'symbol' ? 'Symbols' : 'Lands'
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
          text: `Mana ${this.type === 'symbol' ? 'Symbols' : 'Sources'} Distribution`,
          display: true
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              const index = tooltipItem.index
              const qtd = data.datasets[0].data[index]
              const text = data.datasets[0].labelText
              return `${qtd} ${text}`
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
        if (this.type === 'source' && isLand) {
          if (card.colorIdentity === undefined) {
            console.log(card)
          } else {
            card.colorIdentity.forEach(code => {
              if (data[code.toLowerCase()] === undefined) {
                data[code.toLowerCase()] = card.qtd
              } else {
                data[code.toLowerCase()] += card.qtd
              }
            })
          }
        }
        if (this.type === 'symbol' && !isLand) {
          const manaCost = card.manaCost.toLowerCase()
          Utils.colors.forEach(color => {
            const colorSymbols = (manaCost.match(new RegExp(color.code, 'g')) || []).length
            if (colorSymbols > 0) {
              if (data[color.code] === undefined) {
                data[color.code] = colorSymbols * card.qtd
              } else {
                data[color.code] += colorSymbols * card.qtd
              }
            }
          })
        }
      })
      const dataColors = Object.keys(data)
      dataColors.sort()
      const orderedData = {}
      dataColors.forEach(colorCode => {
        orderedData[colorCode] = data[colorCode]
      })
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
