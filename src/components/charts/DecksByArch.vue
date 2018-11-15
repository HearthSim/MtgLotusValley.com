<template>
  <div id="canvas-container">
    <canvas ref="decksByArchchart"/>
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
    },
    eventType: {
      type: String,
      required: false
    },
    title: {
      type: String,
      required: false,
      default: 'Deck by Archetype'
    }
  },
  mounted () {
    this.$api.getDecksByArch(this.dateMin, this.dateMax, this.eventType)
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
      const ctx = this.$refs.decksByArchchart
      ctx.height = 60 + labels.length * 20
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
            text: this.title
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
