<script>
export default {
  template: '<div/>',
  created () {
    this.init()
  },
  methods: {
    init () {
      let token = this.$store.getters.getToken
      let newtoken = this.$route.params.token
      if (!token && !newtoken) {
        window.location.href = window.config.LOGIN_PAGE
      }
      if (newtoken) {
        this.$store.commit('setToken', newtoken)
      }
      this.$router.push('/index')
    }
  }
}
</script>
