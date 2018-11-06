<script>
export default {
  template: '<div/>',
  mounted() {
    this.$bus.$on('confirm', this.init)
  },
  methods: {
    init (o) {
      let self = this
      this.$confirm(o.text, o.title ? o.title : '提醒', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((res) => {
        if (o.callback) o.callback()
      }).catch(() => {
      })
    }
  }
}
</script>
