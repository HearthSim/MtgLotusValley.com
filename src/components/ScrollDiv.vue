<template>
  <v-layout row>
    <div class="btArrowContainer textNoSelect">
      <div v-if="overflowAlways || overflow" class="btArrow" @click="scrollLeft()">
        <v-icon>keyboard_arrow_left</v-icon>
      </div>
    </div>
    <v-flex :class="`scroll ${multiline ? 'multiline' : ''}`" ref="scrollView">
      <slot/>
    </v-flex>
    <div class="btArrowContainer textNoSelect">
      <div v-if="overflowAlways || overflow" class="btArrow" @click="scrollRight()">
        <v-icon>keyboard_arrow_right</v-icon>
      </div>
    </div>
  </v-layout>
</template>

<script>

export default {
  props: {
    multiline: {
      type: Boolean,
      required: false,
      default: false
    },
    step: {
      type: Number,
      required: false,
      default: 200
    },
    overflowAlways: {
      type: Boolean,
      required: false,
      default: false
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
      try {
        this.$refs.scrollView.scrollBy({
          left: this.step * -1,
          behavior: 'smooth'
        })
      } catch (e) {
        this.smoothScrollHorizontal(this.$refs.scrollView, this.step * -1)
      }
    },
    scrollRight: function () {
      try {
        this.$refs.scrollView.scrollBy({
          left: this.step,
          behavior: 'smooth'
        })
      } catch (e) {
        this.smoothScrollHorizontal(this.$refs.scrollView, this.step)
      }
    },
    updateOverflow: function () {
      const scrollView = this.$refs.scrollView
      const hasMoreContent = scrollView.scrollWidth > scrollView.clientWidth
      this.overflow = hasMoreContent && scrollView.scrollWidth > 0
    },
    smoothScrollHorizontal: function (view, x) {
      setTimeout(() => {
        const acc = Math.floor(Math.abs(x) / 100) + 1
        view.scrollLeft += x > 0 ? acc : acc * -1
        if (x > 0 && x - acc <= 0) {
          return
        }
        if (x < 0 && x + acc >= 0) {
          return
        }
        this.smoothScrollHorizontal(view, x > 0 ? x - acc : x + acc)
      }, 1)
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
    background-color: rgba(220, 220, 220, 170);
  }
  .scroll {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    -ms-overflow-style: none;
    overflow: -moz-scrollbars-none;
  }
  .scroll::-webkit-scrollbar {
    display: none;
    width: 0 !important;
  }
  .multiline {
    flex-direction: column;
    flex-wrap: wrap;
  }
</style>
