const saveConfig = configData => {
  const { config } = window
  config.set('plugin.poi-plugin-ezexped.data', configData)
}

export { saveConfig }
