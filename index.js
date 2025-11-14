import hulakHandlebars from './hulak-handlebars.js'

/**
 * @typedef {'javascript' | 'typescript' | 'js' | 'ts'} HulakMode
 *
 * @typedef {object} HulakPluginConfig
 * @property {HulakMode} [mode='javascript'] - Output mode: 'javascript'/'js' or 'typescript'/'ts'
 * @property {boolean} [enableHandlebars=false]
 * @property {object} [handlebarsOptions={}]
 * @property {string} [handlebarsOptions.partialDirectory]
 */

/**
 * Normalize mode string to 'javascript' or 'typescript'
 * @param {HulakMode} [mode='javascript']
 * @returns {'javascript' | 'typescript'}
 */
function normalizeMode(mode = 'javascript') {
  const normalized = mode.toLowerCase()
  if (normalized === 'ts' || normalized === 'typescript') {
    return 'typescript'
  }
  return 'javascript'
}

/**
 * Combined function for Hulak Vite plugins, now only handling Handlebars.
 *
 * @param {HulakPluginConfig} [config={}] - Plugin configuration object.
 * @returns {import('vite').Plugin[]} An array containing the Handlebars plugin if enabled, otherwise an empty array.
 */
function hulakPlugins(config = {}) {
  const {
    mode = 'javascript',
    enableHandlebars = false,
    handlebarsOptions = {},
  } = config

  const normalizedMode = normalizeMode(mode)
  const plugins = []

  const pluginConfig = { mode: normalizedMode }

  if (enableHandlebars) {
    plugins.push(hulakHandlebars({ ...handlebarsOptions, ...pluginConfig }))
  }

  return plugins
}

export { hulakPlugins }

export default hulakPlugins