<template>
  <div id="canvas-container">
    <canvas class="m-auto" :id="`decksColorDistribution${id}-chart`"/>
  </div>
</template>

<script>
import Chart from 'chart.js'
import Utils from '@/scripts/utils'

export default {
  props: {
    colors: {
      type: Object,
      required: true
    },
    title: {
      type: String,
      required: false,
      default: 'Color Distribution'
    },
    showTitle: {
      type: Boolean,
      required: false,
      default: true
    },
    id: {
      type: Number,
      required: false,
      default: 0
    },
    height: {
      type: Number,
      required: false,
      default: 250
    }
  },
  data () {
    return {
      chart: undefined,
      colorsLabels: [],
      colorsData: [],
      colorsHexValue: [],
      colorsHexHoverValue: []
    }
  },
  mounted () {
    const ctx = document.getElementById(`decksColorDistribution${this.id}-chart`)
    ctx.height = this.height
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
          text: this.title,
          display: this.showTitle
        },
        tooltips: {
          callbacks: {
            label: function (tooltipItem, data) {
              return data.datasets[0].data[tooltipItem.index] + '%'
            }
          }
        }
      }
    })
  },
  watch: {
    colors: function () {
      Utils.clear(this.colorsData)
      Utils.clear(this.colorsLabels)
      Utils.clear(this.colorsHexValue)
      Utils.clear(this.colorsHexHoverValue)
      const cardsColors = Object.keys(this.colors)
      this.colorsData.push(...cardsColors.map(color => this.colors[color]))
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
