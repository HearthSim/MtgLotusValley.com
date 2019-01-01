<template>
  <div id="canvas-container">
    <canvas ref="decksByArchchart"/>
  </div>
</template>

<script>
import Chart from 'chart.js'

const barColors = [
  '#EF5350',
  '#C2185B',
  '#AB47BC',
  '#512DA8',
  '#5C6BC0',
  '#42A5F5',
  '#29B6F6',
  '#26A69A',
  '#66BB6A',
  '#D4E157',
  '#FFEE58',
  '#FFA726',
  '#8D6E63',
  '#BDBDBD',
  '#0097A7',
  '#689F38',
  '#FFA000',
  '#E64A19',
  '#455A64',
  '#7B1FA2'
]

const barColorsHover = [
  '#E57373',
  '#D81B60',
  '#BA68C8',
  '#5E35B1',
  '#7986CB',
  '#64B5F6',
  '#4FC3F7',
  '#4DB6AC',
  '#81C784',
  '#DCE775',
  '#FFF176',
  '#FFB74D',
  '#A1887F',
  '#E0E0E0',
  '#00ACC1',
  '#7CB342',
  '#FFB300',
  '#F4511E',
  '#546E7A',
  '#8E24AA'
]

export default {
  props: {
    data: {
      type: Array,
      required: true
    },
    labels: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      required: false,
      default: ''
    }
  },
  data () {
    return {
      chart: undefined
    }
  },
  mounted () {
    const ctx = this.$refs.decksByArchchart
    ctx.height = 60 + this.labels.length * 15
    this.chart = new Chart(ctx, { // eslint-disable-line no-new
      type: 'horizontalBar',
      data: {
        labels: this.labels,
        datasets: [
          {
            data: this.data,
            backgroundColor: barColors,
            borderColor: barColors,
            borderWidth: 1,
            hoverBackgroundColor: barColorsHover
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          xAxes: [{
            stacked: false,
            ticks: {
              beginAtZero: true
            }
          }],
          yAxes: [{
            barPercentage: 0.7
          }]
        },
        legend: {
          display: false
        },
        title: {
          display: true,
          text: this.title
        }
      }
    })
  },
  watch: {
    data: function () {
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
</style>
