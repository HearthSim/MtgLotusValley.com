<template>
  <div id="canvas-container">
    <canvas class="m-auto" :id="`decksGuildsDistribution${id}-chart`"/>
  </div>
</template>

<script>
import Chart from 'chart.js'
import Utils from '@/scripts/utils'

const guildsColors = [
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

const guildsColorsHover = [
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
    colors: {
      type: Object,
      required: true
    },
    title: {
      type: Boolean,
      required: false,
      default: true
    },
    id: {
      type: Number,
      required: false,
      default: 0
    }
  },
  computed: {
    guildsData: function () {
      const data = []
      Object.keys(this.colors).forEach(colors => {
        data.push(this.colors[colors])
      })
      return data
    },
    guildsLabels: function () {
      const data = []
      Object.keys(this.colors).forEach(colors => {
        const guildObj = Utils.guilds.find(guild => guild.colors === colors || guild.colorsOrdered === colors)
        data.push(guildObj.name)
        if (guildObj === undefined) {
          console.log(colors)
        }
      })
      return data
    }
  },
  watch: {
    colors: function () {
      const ctx = document.getElementById(`decksGuildsDistribution${this.id}-chart`)
      ctx.height = 350
      ctx.width = 250
      new Chart(ctx, { // eslint-disable-line no-new
        type: 'pie',
        data: {
          labels: this.guildsLabels,
          datasets: [
            {
              data: this.guildsData,
              backgroundColor: guildsColors,
              borderColor: guildsColors,
              borderWidth: 1,
              hoverBackgroundColor: guildsColorsHover
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
            text: 'Guilds Distribution (Last 7 days)',
            display: this.title
          },
          tooltips: {
            callbacks: {
              label: function (tooltipItem, data) {
                const qtd = data.datasets[0].data[tooltipItem.index]
                const guild = data.labels[tooltipItem.index]
                return `${qtd}% ${guild}`
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
  #canvas-container canvas {
    width: 100%;
    height: 100%;
  }
</style>
