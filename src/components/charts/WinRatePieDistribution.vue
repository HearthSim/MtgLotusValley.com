<template>
  <div id="canvas-container">
    <canvas :id="`${id}winRatePieDistribution-chart`"/>
  </div>
</template>

<script>
import Chart from 'chart.js'
import Utils from '@/scripts/utils'

export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    id: {
      type: String,
      required: false
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
    colorsData: function () {
      const data = []
      Object.keys(this.data).forEach(color => {
        const colorData = this.data[color]
        data.push(this.id.includes('Wins') ? colorData.wins : colorData.losses)
        this.rawData.push(colorData)
      })
      return data
    },
    colorsLabels: function () {
      const data = []
      Object.keys(this.data).forEach(color => {
        data.push(`${color.substring(0, 1).toUpperCase()}${color.substring(1)}`)
      })
      return data
    },
    colorsHexValue: function () {
      const data = []
      Object.keys(this.data).forEach(color => {
        const colorObj = Utils.colors.find(colorObj => colorObj.desc.toLowerCase() === color)
        data.push(colorObj.hexValue)
      })
      return data
    },
    colorsHexHoverValue: function () {
      const data = []
      Object.keys(this.data).forEach(color => {
        const colorObj = Utils.colors.find(colorObj => colorObj.desc.toLowerCase() === color)
        data.push(colorObj.hexHoverValue)
      })
      return data
    }
  },
  watch: {
    data: function () {
      const ctx = document.getElementById(`${this.id}winRatePieDistribution-chart`)
      ctx.height = 250
      new Chart(ctx, { // eslint-disable-line no-new
        type: 'pie',
        data: {
          labels: this.colorsLabels,
          datasets: [
            {
              data: this.colorsData,
              rawData: this.rawData,
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
