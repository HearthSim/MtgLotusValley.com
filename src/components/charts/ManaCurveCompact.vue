<template>
  <div id="container" class="pl-1 pr-1">
    <ul>
      <v-tooltip v-for="manaCurve in manaCurveArray" :key="manaCurve.cmc" top lazy>
        <li class="manaBar" slot="activator">
          <span :style="getBarHeightStyle(manaCurve.value)"/>
        </li>
        Cost {{ manaCurve.cmc }}: {{ manaCurve.value }} cards.
      </v-tooltip>
    </ul>
  </div>
</template>

<script>

export default {
  props: {
    manaCurve: {
      type: Object,
      required: true
    }
  },
  computed: {
    manaCurveArray: function () {
      const data = []
      Object.keys(this.manaCurve.total).forEach(cmc => {
        data.push({
          'cmc': cmc,
          'value': this.manaCurve.total[cmc]
        })
      })
      return data
    },
    highestCmc: function () {
      let data = 0
      Object.keys(this.manaCurve.total).forEach(cmc => {
        if (this.manaCurve.total[cmc] > data) {
          data = this.manaCurve.total[cmc]
        }
      })
      return data
    }
  },
  methods: {
    getBarHeightStyle: function (cmc) {
      const percent = cmc * 100 / this.highestCmc
      return `height: ${percent}%`
    }
  }
}
</script>

<style scoped>
  #container {
    min-width: 50px;
  }
  #container ul {
    padding-left: 0px;
  }
  #container li {
    height: 20px;
    width: 4px;
    float: left;
    list-style: none;
    margin-left: 1px;
    position: relative;
    background: linear-gradient(to bottom,rgba(255,255,255,0.05),rgba(255,255,255,0.2) 75%,rgba(255,255,255,0.5) 100%);
  }
  #container li span {
    display: block;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #FF8A65;
    overflow: hidden;
    max-height: 100%;
  }
</style>
