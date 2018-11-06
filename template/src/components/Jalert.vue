<script>
export default {
  template: '<div/>',
  mounted() {
    this.$bus.$on('alert', this.init)
  },
  methods: {
    init (o) {
      let self = this
      this.$alert(o.text, o.title ? o.title : '提示', {
        confirmButtonText: '确定',
        callback: () => {
          if (o.callback) o.callback()
        }
      })
    }
  }
}
</script>
