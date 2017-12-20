const savePState = pStateData => {
  const { config } = window
  config.set('plugin.poi-plugin-ezexped.data', pStateData)
}

export { savePState }
