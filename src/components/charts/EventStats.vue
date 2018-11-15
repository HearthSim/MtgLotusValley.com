<template>
  <div id="canvas-container">
    <canvas :id="`${id}EventStats-chart`"/>
  </div>
</template>

<script>
import Chart from 'chart.js'

export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    id: {
      type: String,
      required: false
    }
  },
  data () {
    return {
      title: '',
      statsLabels: ['Wins', 'Losses'],
      colorsHexValue: ['#4CAF50', '#F44336'],
      colorsHexHoverValue: ['#66BB6A', '#EF5350']
    }
  },
  computed: {
    statsData: function () {
      const data = []
      data.push(this.data.wins)
      data.push(this.data.losses)
      const total = this.data.wins + this.data.losses
      const percent = this.data.wins / total * 100
      const winRate = parseFloat(percent.toFixed(1))
      let name = this.id.replace('Constructed', ' Constructed')
      this.title = [name, `${winRate}% WinRate of ${total} games`]
      return data
    }
  },
  mounted () {
    const ctx = document.getElementById(`${this.id}EventStats-chart`)
    ctx.height = 250
    new Chart(ctx, { // eslint-disable-line no-new
      type: 'pie',
      data: {
        labels: this.statsLabels,
        datasets: [
          {
            data: this.statsData,
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
        }
      }
    })
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
