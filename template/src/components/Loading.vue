<script>
export default {
  template: '<div/>',
  data () {
    return {
      loadingStatus: false
    }
  },
  computed: {
    loading () {
      return this.$store.state.loading
    },
    loadingText () {
      return this.$store.state.loading_text
    }
  },
  methods: {
    init () {
      this.loadingStatus = this.$loading({
        lock: true,
        text: this.loadingText,
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    },
    hide () {
      this.loadingStatus.close()
    }
  },
  watch: {
    'loading' (val, oldVal) {
      if (val) {
        this.init()
      } else {
        this.hide()
      }
    }
  }
}
</script>

<style>
.is-fullscreen {
  top: 0;
  z-index: 199;
}
</style>
