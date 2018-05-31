<template>
  <div class="col-6" v-loading="loading">
    <div class="panel panelstyle">
      <div class="panel-heading border-warning">
        <div class="panel-title">数据传输情况</div>
      </div>
      <div class="panel-body" style=" height:250px; overflow:hidden">
        <div class="chart" id="index_chart3" style=" height:250px; min-height:220px; "></div>
      </div>
    </div>
  </div>
</template>

<script>
import charts from '@/mixins/charts'
export default {
  data () {
    return {
      loading: false,
      item: [],
      trend: null
    }
  },
  mixins: [
    charts
  ],
  created () {
    this.init()
  },
  methods: {
    init () {
      var self = this
      this.loading = true
      this.$http.get({ api: 'I_DATA_TRANSMISSION', params: {} }).then(data => {
        self.loading = false
        self.trend = self.chartFormat(data)
        self.drawBar(self.trend, {el: 'index_chart3'})
      }, (res) => {
        self.loading = false
        self.$store.commit('setJalertText', {text: res})
      })
    },
    chartFormat (data) {
      let obj = {series: [], xAxis: [], yAxis: []}
      Array.prototype.slice.apply(data.series).map(o => {
        o.type = 'bar'
        obj.series.push(o)
      })
      obj.xAxis.push({
        type: 'category',
        data: data.category,
        splitLine: {
          show: true,
          lineStyle: {
            color: ['#666'],
            width: 1,
            type: 'dashed'
          }
        }
      })
      obj.yAxis = [
        {
          type: 'value',
          splitLine: {
            show: true,
            lineStyle: {
              color: ['#666'],
              width: 1,
              type: 'dashed'
            }
          }
        }
      ]
      obj.legend = {
        data: data.legend,
        textStyle: {
          color: '#eee',
          fontSize: 12
        }
      }
      obj.color = ['#324890', '#058fcd', '#305d7e', '#f2a428']
      return obj
    }
  }
}
</script>
