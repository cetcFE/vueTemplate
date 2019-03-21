let lib = {
  isEmptyObject (o) {
    for (let i in o) {
      return false
    }
    return true
  },
  isEqual (obj, obj2) {
    let status = true
    if (this.isEmptyObject(obj)) {
      if (this.isEmptyObject(obj2)) {
        return true
      } else {
        return false
      }
    } else {
      if (this.isEmptyObject(obj2)) {
        return false
      }
    }
    for (let i in obj) {
      if (obj[i] !== obj2[i]) {
        status = false
        return
      }
    }
    return status
  },
  toThousands (num) {
    return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
  },
  isInArray (arr, target) {
    let hash = false
    arr.map((o) => {
      if (o === target) hash = true
    })
    return hash
  },
  getUrlKey (name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href))[1].replace(/\+/g, '%20')) || null
  },
  tip (x, y, name) {
    let el = document.querySelector('#tipDialog')
    if (!el) {
      let div = document.createElement('div')
      div.id = 'tipDialog'
      div.style = 'position:fixed;left:0;top:0;float:left;z-index:10;'
      div.innerHTML = `
        <div class='tiptext' id='tiptext' style='position:absolute;z-index:2;left:0;top:0;float:left;max-width:400px;height:auto;color:#fff;padding:5px; background:#000; opacity: 0.8; font-size:12px;border-radius:3px;word-break:keep-all;'></div>
      `
      document.body.append(div)
      el = document.querySelector('#tipDialog')
    }
    el.style.left = (x + 20) + 'px'
    el.style.top = y + 'px'
    el.querySelector('#tiptext').innerHTML = name
    if (window.setCapture) {
      window.setCapture()
      // 设置事件
      window.onmousemove = function (ev) {
        this.mouseMove(ev || event)
      }
    } else {
      window.addEventListener('mousemove', this.mouseMove, false)
    }
  },
  hideTip () {
    if (window.setCapture) {
      window.releaseCapture()
      // 设置事件
      window.onmousemove = null
    } else {
      window.removeEventListener('mousemove', this.mouseMove)
    }
    let el = document.querySelector('#tipDialog')
    if (el) el.parentNode.removeChild(el)
  },
  mouseMove (event) {
    let x = event.pageX
    let y = event.pageY
    // 拖拽元素随鼠标移动
    let el = document.querySelector('#tipDialog')
    el.style.left = (x + 20) + 'px'
    el.style.top = y - document.documentElement.scrollTop + 'px'
  },
  set (key, obj) {
    window.sessionStorage.setItem(key, JSON.stringify(obj))
  },
  get (key) {
    return window.sessionStorage.getItem(key) ? JSON.parse(window.sessionStorage.getItem(key)) : null
  },
  remove (key) {
    window.sessionStorage.removeItem(key)
  },
  serializeArray (frm) {
    let res = [] // 存放结果的数组
    let current = null // 当前循环内的表单控件
    let k // select遍历索引
    let optionLen // select遍历索引
    let option // select循环体内option
    let optionValue // select的value
    let checkboxObj = {}
    let form = frm // 用form变量拿到当前的表单，易于辨识
    for (let i = 0, len = form.elements.length; i < len; i++) {
      current = form.elements[i]
      // disabled表示字段禁用，需要区分与readonly的区别
      if (current.disabled) continue
      switch (current.type) {
        // 可忽略控件处理
        case 'file': // 文件输入类型
        case 'submit': // 提交按钮
        case 'button': // 一般按钮
        case 'image': // 图像形式的提交按钮
        case 'reset': // 重置按钮
        case undefined: // 未定义
          break
          // select控件
        case 'select-one':
        case 'select-multiple':
          if (current.name && current.name.length) {
            for (k = 0, optionLen = current.options.length; k < optionLen; k++) {
              option = current.options[k]
              optionValue = ''
              if (option.selected) {
                if (option.hasAttribute) {
                  optionValue = option.hasAttribute('value') ? option.value : option.text
                } else {
                  // 低版本IE需要使用特性 的specified属性，检测是否已规定某个属性
                  optionValue = option.attributes('value').specified ? option.value : option.text
                }
                res.push({
                  name: current.name,
                  value: optionValue
                })
              }
            }
          }
          break
        case 'radio':
          if (current.checked) {
            res.push({
              name: current.name,
              value: current.value
            })
          }
          break
        case 'checkbox':
          if (current.checked) {
            let checkboxName = current.name
            if (!checkboxObj[checkboxName]) checkboxObj[checkboxName] = []
            checkboxObj[checkboxName].push(current.value)
          }
          break
        default:
          // 一般表单控件处理
          if (current.name && current.name.length) {
            res.push({
              name: current.name,
              value: current.value
            })
          }
      }
    }
    if (JSON.stringify(checkboxObj) !== '{}') {
      for (let i in checkboxObj) {
        res.push({
          name: i,
          value: checkboxObj[i]
        })
      }
    }
    return res
  },
  serialize (frm) {
    return this.serializeArray(frm).join('&')
  },
  getFormJson (frm) {
    let o = {}
    let node = document.querySelector(frm)
    let a = this.serializeArray(node)
    a.forEach(function (x) {
      if (o[x.name] !== undefined) {
        if (!o[x.name].push) {
          o[x.name] = [o[x.name]]
        }
        o[x.name].push(x.value || '')
      } else {
        o[x.name] = x.value || ''
      }
    })
    return o
  },
  debounce (fn, wait) {
    var timeout = null
    return function () {
      if (timeout !== null) clearTimeout(timeout)
      timeout = setTimeout(fn, wait)
    }
  },
  throttle (func, delay) {
    let prev = Date.now()
    return function () {
      let context = this
      let args = arguments
      let now = Date.now()
      if (now - prev >= delay) {
        func.apply(context, args)
        prev = Date.now()
      }
    }
  }
}

export default lib
