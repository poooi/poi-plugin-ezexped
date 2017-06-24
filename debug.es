const { dbg } = window

// set this to false on production
const debug = true

const dbgHandler = dbg.extra('pluginEZExped')

function assert(...args) {
  if (!debug) return

  if (!dbgHandler.isEnabled())
    dbgHandler.enable()

  return dbgHandler.assert.call(this, args)
}

function log(...args) {
  if (!debug) return

  if (!dbgHandler.isEnabled())
    dbgHandler.enable()

  return dbgHandler.log.call(this, args)
}

export {
  assert,
  log,
}
