<template>
  <div id="canvas-container">
    <canvas id="decksByArch-chart"/>
  </div>
</template>

<script>
import Chart from 'chart.js'

const barColors = [
  '#FFB74D',
  '#FF8A65'
]

export default {
  props: {
    dateMin: {
      type: String,
      required: true
    },
    dateMax: {
      type: String,
      required: true
    }
  },
  mounted () {
    this.$api.getDecksByArch(this.dateMin, this.dateMax)
      .then(res => {
        const colors = []
        while (colors.length < Object.keys(res.data).length) {
          barColors.forEach(color => {
            colors.push(color)
          })
        }
        this.createGraph(this.archLabels(res.data), this.archValues(res.data), colors)
      })
      .catch(error => {
        console.log(error)
      })
  },
  methods: {
    archLabels: function (data) {
      const keys = Object.keys(data)
      var index = keys.indexOf('')
      if (index > -1) {
        keys.splice(index, 1)
      }
      index = keys.indexOf('Unknown')
      if (index > -1) {
        keys.splice(index, 1)
      }
      keys.sort()
      return keys
    },
    archValues: function (data) {
      const values = []
      this.archLabels(data).forEach(arch => {
        values.push(data[arch])
      })
      return values
    },
    createGraph: function (labels, data, barColors) {
      const ctx = document.getElementById('decksByArch-chart')
      ctx.height = labels.length * 25
      new Chart(ctx, { // eslint-disable-line no-new
        type: 'horizontalBar',
        data: {
          labels: labels,
          datasets: [
            {
              data: data,
              backgroundColor: barColors,
              borderColor: barColors,
              borderWidth: 1
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
            text: 'Deck by Archetype'
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
