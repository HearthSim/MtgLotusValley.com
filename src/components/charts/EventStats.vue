<template>
  <div id="canvas-container">
    <canvas :id="`${id}EventSummary-chart`"/>
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
      required: false,
      default: ''
    }
  },
  data () {
    return {
      chart: undefined,
      SummaryLabels: ['Wins', 'Losses'],
      colorsHexValue: ['#4CAF50', '#F44336'],
      colorsHexHoverValue: ['#66BB6A', '#EF5350']
    }
  },
  mounted () {
    const canvas = document.getElementById(`${this.id}EventSummary-chart`)
    canvas.height = 250
    this.chart = new Chart(canvas, { // eslint-disable-line no-new
      type: 'pie',
      data: {
        labels: this.SummaryLabels,
        datasets: [
          {
            data: this.getSummaryData(),
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
          text: this.getSummaryTitle(),
          display: true
        }
      }
    })
  },
  watch: {
    data: function () {
      this.chart.data.datasets[0].data = this.getSummaryData()
      this.chart.options.title.text = this.getSummaryTitle()
      this.chart.update()
    }
  },
  methods: {
    getSummaryData: function () {
      const data = []
      data.push(this.data.wins)
      data.push(this.data.losses)
      return data
    },
    getSummaryTitle: function () {
      const total = this.data.wins + this.data.losses
      const percent = this.data.wins / total * 100
      const winRate = parseFloat(percent.toFixed(1))
      return [this.data.name, `${winRate}% WinRate of ${total} games`]
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
