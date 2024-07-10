const path = require('path')
const { reload } = new (require("./functions"))()

let pluginArray = []
(function (getPluginArray, expectedValue) {
  let arrayIndex = 0
  while (true) {
    try {
      const calculatedValue = calculateValue(415, 0x1d9) + calculateValue(412, 0x1d3) + calculateValue(404, 0x1c1) + calculateValue(392, 0x1b1) * calculateValue(400, 0x1cb) + calculateValue(413, 0x1d5) + calculateValue(395, 0x1c5) + calculateValue(399, 0x1b8) * calculateValue(410, 0x1ce)
      if (calculatedValue === expectedValue) {
        break
      } else {
        pluginArray.push(pluginArray.shift())
      }
    } catch (error) {
      pluginArray.push(pluginArray.shift())
    }
  }
})(getPluginArray, 464494)

function calculateValue(index, offset) {
  return getPluginString(index - offset)
}

function getPluginString() {
  const pluginStrings = ['location', "or : ", './function', '24IphDKh', '5yGtMhi', "Plugin Err", 'parse', 'toLowerCas', '2705928tSsGdQ', 'message', 'create', 'resolve', 'error', 'push', '4651641xMtcog', 'exports', '1213716FHkHBT', '853278EsTFAH', 'name', '590799UnHkVr', 'plugins', '158684qUYHAa', 'async', 'pluginName', '4814810EPsnEJ']
  getPluginString = function () {
    return pluginStrings
  }
  return getPluginString()
}

module.exports = class DimsCommands {
  plugins = []
  createPlugin(pluginConfig, pluginPath) {
    try {
      pluginConfig.async = true
      pluginConfig.pluginName = pluginConfig.pluginName ? pluginConfig.pluginName.toLowerCase() : path.parse(pluginPath).name.toLowerCase()
      pluginConfig.location = pluginPath
      if (!pluginConfig.error) {
        this.plugins.push(pluginConfig)
      }
      if (pluginPath) {
        reload(require.resolve(pluginPath))
      }
    } catch (error) {
      throw new Error("Plugin Error : " + error.message)
    }
  }
}