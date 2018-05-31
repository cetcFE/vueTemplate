<template>
  <div class="col-12" v-loading="loading">
    <div class="panel panelstyle">
      <div class="panel-heading border-warning">
        <div class="panel-title">今日新增占比情况</div>
      </div>
      <div class="panel-body">
        <div class="chart" id="index_chart1" style=" min-height:200px; height:200px;"></div>
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
  created () {
    this.init()
  },
  mixins: [
    charts
  ],
  methods: {
    init () {
      var self = this
      this.loading = true
      this.$http.get({ api: 'I_NEW_PROPORTION', params: {} }).then(data => {
        self.loading = false
        self.trend = self.chartFormat(data)
        self.drawPie(self.trend, {el: 'index_chart1'})
      }, (res) => {
        self.loading = false
        self.$store.commit('setJalertText', {text: res})
      })
    },
    chartFormat (data) {
      let obj = {series: [], xAxis: [], yAxis: []}
      Array.prototype.slice.apply(data.series).map(o => {
        o.value = o.data
      })
      obj.series.push({
        name: '数量',
        type: 'pie',
        radius: '70%',
        center: ['50%', '50%'],
        data: data.series
      })
      obj.legend = {
        show: false,
        orient: 'vertical',
        x: 'right',
        data: data.legend
      }
      obj.color = ['#324890', '#058fcd', '#305d7e', '#f2a428']
      return obj
    }
  }
}
</script>
