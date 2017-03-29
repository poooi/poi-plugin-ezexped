const { dbg } = window

const dbgHandler = dbg.extra('pluginEZExped')

const assert = function () {
  if (!dbgHandler.isEnabled())
    dbgHandler.enable()
  
  return dbgHandler.assert.apply(this, arguments)
}

const log = function () {
  if (!dbgHandler.isEnabled())
    dbgHandler.enable()
  
  return dbgHandler.log.apply(this, arguments)
}

export {
  assert,
  log,
}
