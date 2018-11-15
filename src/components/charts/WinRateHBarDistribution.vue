<template>
  <div id="canvas-container">
    <canvas :id="`${id}winRateHBarDistribution-chart`"/>
  </div>
</template>

<script>
import Chart from 'chart.js'

const barColors = [
  '#FFB74D',
  '#FF8A65'
]

const barColorsHover = [
  '#FFC75D',
  '#FF9A75'
]

export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    id: {
      type: String,
      required: false,
      default: ''
    },
    title: {
      type: String,
      required: false,
      default: 'WinRate'
    }
  },
  data () {
    return {
      rawData: []
    }
  },
  computed: {
    graphData: function () {
      const data = []
      Object.keys(this.data).forEach(color => {
        const colorData = this.data[color]
        data.push(this.id.includes('Wins') ? colorData.wins : colorData.losses)
        this.rawData.push(colorData)
      })
      return data
    },
    graphLabels: function () {
      const data = []
      Object.keys(this.data).forEach(color => {
        data.push(`${color.substring(0, 1).toUpperCase()}${color.substring(1)}`)
      })
      return data
    },
    graphColors: function () {
      const colors = []
      while (colors.length < Object.keys(this.data).length) {
        barColors.forEach(color => {
          colors.push(color)
        })
      }
      return colors
    },
    graphColorsHover: function () {
      const colorsHover = []
      while (colorsHover.length < Object.keys(this.data).length) {
        barColorsHover.forEach(color => {
          colorsHover.push(color)
        })
      }
      return colorsHover
    }
  },
  watch: {
    data: function () {
      const ctx = document.getElementById(`${this.id}winRateHBarDistribution-chart`)
      ctx.height = 60 + this.graphLabels.length * 20
      new Chart(ctx, { // eslint-disable-line no-new
        type: 'horizontalBar',
        data: {
          labels: this.graphLabels,
          datasets: [
            {
              data: this.graphData,
              rawData: this.rawData,
              backgroundColor: this.graphColors,
              borderColor: this.graphColors,
              borderWidth: 1,
              hoverBackgroundColor: this.graphColorsHover
            }
          ]
        },
        options: {
          responsive: false,
          maintainAspectRatio: true,
          legend: {
            display: false
          },
          title: {
            text: this.title,
            display: true
          },
          tooltips: {
            callbacks: {
              label: function (tooltipItem, data) {
                const index = tooltipItem.index
                const rawData = data.datasets[0].rawData[index]
                return `Wins: ${rawData.wins} Loses: ${rawData.losses} WinRate: ${rawData.winrate}%`
              }
            }
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
