export default {
  state: {
    token: ''
  },
  mutations: {
    setToken (state, t) {
      window.sessionStorage.setItem('token', t)
      state.token = t
    },
    deleteToken (state) {
      window.sessionStorage.clear()
      state.token = ''
    }
  },
  actions: {
  },
  getters: {
    getToken: state => {
      if (state.token === '') {
        state.token = window.sessionStorage.getItem('token') ? window.sessionStorage.getItem('token') : ''
      }
      return state.token
    }
  }
}
