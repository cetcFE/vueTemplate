let curline = {
  inserted (el, binding) {
    el.addEventListener('mouseenter', e => {
      let from = binding.value.curl
      let to = el
      a.stopAnimat()
      a.animat(from, to, 300)
    }, false)
    el.addEventListener('mouseleave', e => {
      let from = binding.value.curl
      let to = a.origin
      a.stopAnimat()
      a.animat(from, to, 300)
    }, false)
    el.addEventListener('click', e => {
      a.stopAnimat()
      let from = binding.value.curl
      let to = el
      a.origin = {offsetLeft: to.offsetLeft, offsetWidth: to.offsetWidth}
      a.animat(from, to, 300)
    }, false)
    if (el.outerHTML.indexOf(binding.value.curl.nowMenu.name) > -1) {
      setTimeout(o => {
        el.click()
      }, 100)
    }
    // if (binding.value.curl.nowMenu.path === '/data-platform-upload' && el.outerHTML.indexOf('数据平台对接') > -1) {
    //   setTimeout(o => {
    //     el.click()
    //   }, 100)
    // }
  }
}

let A = () => {
  this.timer = null
  this.origin = null
}
A.prototype = {
  animat: (from, to, time) => {
    let step, step2
    let fps = Number((time / 16.7).toFixed(2))
    step = (a.lstep === 0 || !a.lstep) ? a.getStep(from.left, to.offsetLeft, fps) : a.lstep
    step2 = (a.wstep === 0 || !a.wstep) ? a.getStep(from.width, to.offsetWidth, fps) : a.wstep
    a.doAnimat(step, step2, fps, from, to)
  },
  doAnimat: (step, step2, fps, from, to) => {
    a.then = a.then > 0 ? a.then : Date.now()
    a.timer = requestAnimationFrame(() => {
      a.doAnimat(step, step2, fps, from, to)
    })
    let now = Date.now()
    let delta = now - a.then
    if (delta < 10) return
    a.then = now
    a.count = a.count ? (a.count + 1) : 1
    if (a.count > fps) {
      from.left = Math.floor(to.offsetLeft)
      from.width = Math.floor(to.offsetWidth)
      a.stopAnimat()
      return
    }
    if (from.left > to.offsetLeft) {
      from.left = Number(from.left) - step
    } else {
      from.left = Number(from.left) + step
    }
    if (from.width > to.offsetWidth) {
      from.width = Number(from.width) - step2
    } else {
      from.width = Number(from.width) + step2
    }
  },
  getStep: (s, e, fps) => {
    let abs
    if (s > e) {
      abs = Math.floor(s - e)
    } else {
      abs = Math.floor(e - s)
    }
    let step = Number((abs / fps).toFixed(2))
    return step
  },
  stopAnimat: () => {
    cancelAnimationFrame(a.timer)
    a.lstep = 0
    a.wstep = 0
    a.count = 0
    a.then = 0
  }
}
let a = new A()

export default curline
