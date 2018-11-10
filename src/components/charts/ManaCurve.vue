<template>
  <div id="canvas-container">
    <canvas id="manaCurve-chart"/>
  </div>
</template>

<script>
import Chart from 'chart.js'

export default {
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
    manaCurveCreaturesData: function () {
      const data = []
      Object.keys(this.manaCurve.total).forEach(mana => {
        data.push(this.manaCurve.creatures[mana])
      })
      return data
    },
    manaCurveSpellsData: function () {
      const data = []
      Object.keys(this.manaCurve.total).forEach(mana => {
        data.push(this.manaCurve.spells[mana])
      })
      return data
    },
    manaCurveTotalData: function () {
      const data = []
      Object.keys(this.manaCurve.total).forEach(mana => {
        data.push(this.manaCurve.total[mana])
      })
      return data
    },
    maxYAxes: function () {
      return this.manaCurveTotalData.reduce(function (a, b) {
        return Math.max(a, b)
      })
    }
  },
  watch: {
    manaCurve: function () {
      const labels = Object.keys(this.manaCurve.total)
      const ctx = document.getElementById('manaCurve-chart')
      new Chart(ctx, { // eslint-disable-line no-new
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              data: this.manaCurveCreaturesData,
              backgroundColor: '#00BBEE',
              hoverBackgroundColor: '#00CCFF'
            },
            {
              data: this.manaCurveSpellsData,
              backgroundColor: '#FF8A65',
              hoverBackgroundColor: '#FF8A85'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            xAxes: [{
              ticks: {
                beginAtZero: true
              },
              gridLines: {
                display: false
              },
              stacked: true
            }],
            yAxes: [{
              ticks: {
                display: false,
                max: this.maxYAxes
              },
              gridLines: {
                display: false
              },
              stacked: true
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
                const textOne = tooltipItem[0].datasetIndex === 0 ? 'Creature' : 'NonCreature'
                const textMany = tooltipItem[0].datasetIndex === 0 ? 'Creatures' : 'NonCreatures'
                const cardQtd = tooltipItem[0].yLabel
                return cardQtd === 1 ? `${cardQtd} ${textOne}` : `${cardQtd} ${textMany}`
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
