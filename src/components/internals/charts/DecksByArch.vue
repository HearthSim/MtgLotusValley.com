<template>
  <canvas id="decksByArch-chart"/>
</template>

<script>
import { axios } from "../../../main";
import Chart from 'chart.js';

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
  data () {
    return {
    }
  },
  mounted() {
    axios.get('/stats/decksByArch?dateMin=' + this.dateMin + '&dateMax=' + this.dateMax)
      .then(res => {
        this.createGraph(this.archLabels(res.data), this.archValues(res.data))
      })
      .catch(error => {
        console.log(error)
      })
  },
  methods: {
    archLabels: function(data) {
      const keys = Object.keys(data)
      var index = keys.indexOf('');
      if (index > -1) {
        keys.splice(index, 1);
      }
      keys.sort()
      return keys
    },
    archValues: function(data) {
      const values = []
      this.archLabels(data).forEach(arch => {
        values.push(data[arch])
      });
      return values
    },
    createGraph: function(labels, data) {
      const ctx = document.getElementById('decksByArch-chart');
      const myChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Decks samples',
              data: data,
              backgroundColor: [ 'rgba(71, 183,132,.5)' ],
              borderColor: [ '#47b784' ],
              borderWidth: 0
            }
          ]
        },
        options: {
          responsive: true,
          lineTension: 1,
          scales: {
            xAxes: [{
              stacked: true,
              ticks: {
                beginAtZero: true,
                padding: 25,
              }
            }]
          }
        }
      });
    }
  }
}

</script>