export default {
  state: {
    jconfirm: false,
    jconfirm_title: '提醒',
    jconfirm_text: '',
    jconfirm_callback: function () {}
  },
  mutations: {
    setJconfirmText (state, o) {
      if (state.jconfirm) return false
      state.jconfirm_title = o.title ? o.title : state.jconfirm_title
      state.jconfirm_text = o.text ? o.text : ''
      state.jconfirm_callback = o.callback || function () {}
      state.jconfirm = true
    },
    hideJconfirm (state) {
      state.jconfirm = false
    }
  },
  actions: {
  }
}
