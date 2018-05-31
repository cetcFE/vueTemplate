<template>
  <div class="col-8" v-loading="loading">
        <div class="col-12">
          <div class="panel panelstyle">
            <div class="panel-heading">
              <div class="panel-title">互联网实时情报</div>
            </div>
            <div class="panel-body" style=" height:515px;">
              <dl class="scrollcate">
                <dd>标题</dd>
                <dd>来源</dd>
                <dd>时间</dd>
                <dd>类型</dd>
              </dl>
              <div id="scroll" v-marquee="marquee">
                <div>
                  <a v-for="i in item" :key="i.id" :href="i.url" target="_blank"><span v-html="i.from"></span><span>[{{i.date}}]</span><span v-html="i.type"></span>{{i.title}}</a>
                </div>
              </div>
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
      marquee: false,
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
      this.$http.get({ api: 'I_NEWS', params: {} }).then(data => {
        self.loading = false
        self.item = data
        self.$nextTick(() => {
          self.marquee = true
        })
      }, (res) => {
        self.loading = false
        self.$store.commit('setJalertText', {text: res})
      })
    }
  }
}
</script>
