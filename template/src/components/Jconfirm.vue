<script>
export default {
  template: '<div/>',
  computed: {
    jconfirm () {
      return this.$store.state.jconfirm
    },
    jconfirmTitle () {
      return this.$store.state.jconfirm_title
    },
    jconfirmText () {
      return this.$store.state.jconfirm_text
    },
    jconfirmCallback () {
      return this.$store.state.jconfirm_callback
    }
  },
  methods: {
    init () {
      let self = this
      this.$confirm(this.jconfirmText, this.jconfirmTitle, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.$store.commit('hideJconfirm')
        self.jconfirmCallback()
      }).catch(() => {
      })
    }
  },
  watch: {
    'jconfirm' (val, oldVal) {
      if (val) {
        this.init()
      }
    }
  }
}
</script>
