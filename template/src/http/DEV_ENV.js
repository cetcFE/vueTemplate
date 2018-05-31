let DEV_ENV = 0
// let host = window.location.hostname
let port = window.location.port
if (port === '3185') {
  DEV_ENV = 1
}

export default DEV_ENV
