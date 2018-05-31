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
  }
}

export default lib
