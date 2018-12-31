<template>
  <div class="canvas-container">
    <canvas :id="`manaCurve-chart${id}`"/>
  </div>
</template>

<script>
import Chart from 'chart.js'
import Utils from '@/scripts/utils'

export default {
  props: {
    manaCurve: {
      type: Object,
      required: true,
      default: {}
    },
    id: {
      type: Number,
      required: false,
      default: 0
    },
    height: {
      type: Number,
      required: false,
      default: 0
    },
    width: {
      type: Number,
      required: false,
      default: 0
    },
    showTitle: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data () {
    return {
      chart: undefined,
      manaCurveLabels: [],
      manaCurveCreaturesData: [],
      manaCurveNonCreaturesData: [],
      manaCurveTotalData: []
    }
  },
  mounted () {
    const ctx = document.getElementById(`manaCurve-chart${this.id}`)
    if (this.height > 0) {
      ctx.height = this.height
    }
    if (this.width > 0) {
      ctx.width = this.width
    }
    this.chart = new Chart(ctx, { // eslint-disable-line no-new
      type: 'bar',
      data: {
        labels: this.manaCurveLabels,
        datasets: [
          {
            data: this.manaCurveCreaturesData,
            backgroundColor: '#00BBEE',
            hoverBackgroundColor: '#00CCFF'
          },
          {
            data: this.manaCurveNonCreaturesData,
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
              beginAtZero: true,
              fontColor: '#FFFFFF',
              maxRotation: 0,
              minRotation: 0
            },
            gridLines: {
              display: false
            },
            stacked: true
          }],
          yAxes: [{
            ticks: {
              display: false
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
  },
  watch: {
    manaCurve: function () {
      const manaLabels = Object.keys(this.manaCurve.total)
      Utils.clear(this.manaCurveLabels)
      Utils.clear(this.manaCurveCreaturesData)
      Utils.clear(this.manaCurveNonCreaturesData)
      Utils.clear(this.manaCurveTotalData)
      this.manaCurveLabels.push(...manaLabels)
      this.manaCurveCreaturesData.push(...manaLabels.map(mana => this.manaCurve.creatures[mana]))
      this.manaCurveNonCreaturesData.push(...manaLabels.map(mana => this.manaCurve.nonCreatures[mana]))
      this.manaCurveTotalData.push(...manaLabels.map(mana => this.manaCurve.total[mana]))
      const maxYAxes = this.manaCurveTotalData.reduce((a, b) => Math.max(a, b))
      this.chart.options.scales.yAxes[0].ticks.max = maxYAxes
      this.chart.update()
    }
  }
}
</script>

<style scoped>
  .canvas-container {
    max-width: 300px;
    margin: auto;
  }
</style>
