<template>
  <v-layout row>
    <div class="btArrowContainer textNoselect">
      <div v-if="overflowAlways || overflow" class="btArrow" v-on:click="scrollLeft()">
        <v-icon>keyboard_arrow_left</v-icon>
      </div>
    </div>
    <v-flex class="scroll ml-1 mr-1" ref="scrollView">
      <slot/>
    </v-flex>
    <div class="btArrowContainer textNoselect">
      <div v-if="overflowAlways || overflow" class="btArrow" v-on:click="scrollRight()">
        <v-icon>keyboard_arrow_right</v-icon>
      </div>
    </div>
  </v-layout>
</template>

<script>

export default {
  props: {
    step: {
      type: Number,
      required: false,
      default: 200
    },
    overflowAlways: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data () {
    return {
      overflow: false,
      observer: new MutationObserver(function (mutations) {
        this.updateOverflow()
      }.bind(this))
    }
  },
  mounted () {
    this.observer.observe(this.$refs.scrollView,
      { attributes: true, childList: true, characterData: true, subtree: true }
    )
  },
  beforeDestroy: function () {
    this.observer.disconnect()
  },
  methods: {
    scrollLeft: function () {
      this.$refs.scrollView.scrollBy({
        left: this.step * -1,
        behavior: 'smooth'
      })
    },
    scrollRight: function () {
      this.$refs.scrollView.scrollBy({
        left: this.step,
        behavior: 'smooth'
      })
    },
    updateOverflow: function () {
      const scrollView = this.$refs.scrollView
      const hasMoreContent = scrollView.scrollWidth > scrollView.clientWidth
      this.overflow = hasMoreContent && scrollView.scrollWidth > 0
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .btArrowContainer {
    width: 1.25em;
  }
  .btArrow {
    height: 100%;
    display: flex;
    justify-content: center;
  }
  .btArrow:hover {
    background-color: #DDDDDDAA;
  }
  .scroll {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    -ms-overflow-style: -ms-autohiding-scrollbar;
  }
  .scroll::-webkit-scrollbar {
    display: none;
  }
</style>
