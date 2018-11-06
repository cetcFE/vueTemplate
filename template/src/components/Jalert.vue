<script>
export default {
  template: '<div/>',
  data () {
    return {
      status: false
    }
  },
  mounted () {
    this.$bus.$on('alert', this.init)
  },
  methods: {
    init (o) {
      if (this.status) return
      this.status = true
      let self = this
      this.$alert(o.text, o.title ? o.title : '提示', {
        confirmButtonText: '确定',
        callback: () => {
          self.status = false
          if (o.callback) o.callback()
        }
      })
    }
  }
}
</script>
