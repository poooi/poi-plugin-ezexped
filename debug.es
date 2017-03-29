const { dbg } = window

// set this to false on production
const debug = true

const dbgHandler = dbg.extra('pluginEZExped')

const assert = function () {
  if (!debug) return

  if (!dbgHandler.isEnabled())
    dbgHandler.enable()
  
  return dbgHandler.assert.apply(this, arguments)
}

const log = function () {
  if (!debug) return

  if (!dbgHandler.isEnabled())
    dbgHandler.enable()
  
  return dbgHandler.log.apply(this, arguments)
}

export {
  assert,
  log,
}
