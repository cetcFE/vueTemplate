<template>
  <div class="col-6" v-loading="loading">
    <div class="panel panelstyle">
      <div class="panel-heading border-warning">
        <div class="panel-title">情报数量统计</div>
      </div>
      <div class="panel-body">
        <div class="chart" id="index_chart2" style=" height:220px; min-height:220px; "></div>
      </div>
    </div>
  </div>
</template>

<script>
import charts from '@/mixins/charts'
export default {
  data () {
    return {
      loading: false
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
      this.$http.get({ api: 'I_INFOMATION_QUANTITY', params: {} }).then(data => {
        self.loading = false
        self.trend = self.chartFormat(data)
        self.drawLine(self.trend, {el: 'index_chart2'})
      }, (res) => {
        self.loading = false
        self.$store.commit('setJalertText', {text: res})
      })
    },
    chartFormat (data) {
      let obj = {series: [], xAxis: [], yAxis: []}
      Array.prototype.slice.apply(data.series).map(o => {
        obj.series.push({
          name: o.name,
          type: 'line',
          stack: '总量',
          areaStyle: {normal: {}},
          data: o.data
        })
      })
      obj.xAxis.push({
        type: 'category',
        boundaryGap: false,
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
      obj.yAxis.push({
        type: 'value',
        splitLine: {
          show: true,
          lineStyle: {
            color: ['#666'],
            width: 1,
            type: 'dashed'
          }
        }
      })
      obj.legend = {
        data: data.legend,
        textStyle: {
          color: '#eee',
          fontSize: 12
        }
      }
      obj.color = ['#324890', '#058fcd', '#305d7e', '#293861']
      return obj
    }
  }
}
</script>
