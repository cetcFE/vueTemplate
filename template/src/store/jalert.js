export default {
  state: {
    jalert: false,
    jalert_title: '提示',
    jalert_text: '',
    jalert_callback: function () {}
  },
  mutations: {
    setJalertText (state, o) {
      if (state.jalert) return false
      state.jalert_title = o.title ? o.title : state.jalert_title
      state.jalert_text = o.text ? o.text : ''
      state.jalert_callback = o.callback || function () {}
      state.jalert = true
    },
    hideJaler (state) {
      state.jalert = false
    }
  },
  actions: {
  }
}
