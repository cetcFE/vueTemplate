<script>
export default {
  template: '<div/>',
  data () {
    return {
      status: false
    }
  },
  mounted () {
    this.$bus.$on('confirm', this.init)
  },
  methods: {
    init (o) {
      if (this.status) return
      this.status = true
      let self = this
      this.$confirm(o.text, o.title ? o.title : '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(res => {
        self.status = false
        if (o.callback) o.callback()
      }).catch(() => {
        self.status = false
      })
    }
  }
}
</script>
