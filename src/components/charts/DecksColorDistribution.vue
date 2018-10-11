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
    colors: {
      type: Object,
      required: true
    }
  },
  computed: {
    colorsData: function () {
      const data = []
      Object.keys(this.colors).forEach(color => {
        data.push(this.colors[color])
      })
      return data
    },
    colorsLabels: function () {
      const data = []
      Object.keys(this.colors).forEach(color => {
        const colorObj = Utils.colors.find(colorObj => colorObj.code === color)
        data.push(colorObj.desc)
      })
      return data
    },
    colorsHexValue: function () {
      const data = []
      Object.keys(this.colors).forEach(color => {
        const colorObj = Utils.colors.find(colorObj => colorObj.code === color)
        if (colorObj !== undefined) {
          data.push(colorObj.hexValue)
        } else {
          data.push('#FFC107')
        }
      })
      return data
    },
    colorsHexHoverValue: function () {
      const data = []
      Object.keys(this.colors).forEach(color => {
        const colorObj = Utils.colors.find(colorObj => colorObj.code === color)
        if (colorObj !== undefined) {
          data.push(colorObj.hexHoverValue)
        } else {
          data.push('#FFCA28')
        }
      })
      return data
    }
  },
  watch: {
    colors: function () {
      const ctx = document.getElementById('colorDistribution-chart')
      ctx.height = 250
      new Chart(ctx, { // eslint-disable-line no-new
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
            text: 'Color Distribution (Last 7 days)',
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
