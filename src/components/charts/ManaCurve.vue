<template>
  <div id="canvas-container">
    <canvas id="manaCurve-chart"/>
  </div>
</template>

<script>
import Chart from 'chart.js'

export default {
  name: 'ManaCurve',
  props: {
    manaCurve: {
      type: Object,
      required: true
    },
    showTitle: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  computed: {
    manaCurveData: function () {
      const data = []
      Object.keys(this.manaCurve).forEach(mana => {
        data.push(this.manaCurve[mana])
      })
      return data
    },
    maxYAxes: function () {
      return this.manaCurveData.reduce(function (a, b) {
        return Math.max(a, b)
      }) + 2
    }
  },
  watch: {
    manaCurve: function () {
      const labels = Object.keys(this.manaCurve)
      const ctx = document.getElementById('manaCurve-chart')
      new Chart(ctx, { // eslint-disable-line no-new
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              data: this.manaCurveData,
              backgroundColor: '#1976D2',
              borderColor: '#1976D2',
              borderWidth: 1,
              hoverBackgroundColor: '#2196F3'
            }
          ]
        },
        options: {
          responsive: false,
          maintainAspectRatio: true,
          scales: {
            xAxes: [{
              ticks: {
                beginAtZero: true
              },
              gridLines: {
                display: false
              }
            }],
            yAxes: [{
              ticks: {
                display: false,
                max: this.maxYAxes
              },
              gridLines: {
                display: false
              }
            }]
          },
          legend: {
            display: false
          },
          title: {
            display: this.showTitle,
            text: 'Mana Curve'
          },
          tooltips: {
            callbacks: {
              title: function (tooltipItem, data) {
                const cardQtd = tooltipItem[0].yLabel
                return cardQtd === 1 ? `${cardQtd} card` : `${cardQtd} cards`
              },
              label: function (tooltipItem, data) {
                return ``
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
</style>
