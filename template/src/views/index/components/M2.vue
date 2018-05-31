<template>
  <div class="col-12" v-loading="loading">
    <div class="panel panelstyle">
      <div class="panel-heading border-warning">
        <div class="panel-title">告警列表</div>
      </div>
      <div class="panel-body">
        <div class="alerm">
          <ul>
            <li v-for="i in item" :key="i.id" v-html="i.title"></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      item: []
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      var self = this
      this.loading = true
      this.$http.get({ api: 'I_WARNING', params: {} }).then(data => {
        self.loading = false
        self.item = data
      }, (res) => {
        self.loading = false
        self.$store.commit('setJalertText', {text: res})
      })
    }
  }
}
</script>

<style>
.alerm {
  height: 190px;
  overflow: hidden;
}
</style>
