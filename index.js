import hulakLoaderPage from './hulak-loader-page.js'
import hulakHandlebars from './hulak-handlebars.js'

/**
 * @typedef {object} HulakPluginConfig
 * @property {boolean} [enableLoaderPage=true] - Enables the loader page plugin (`hulakLoaderPage`), which blocks the page until it's fully loaded.
 * @property {boolean} [enableHandlebars=true] - Enables the Handlebars processing plugin (`hulakHandlebars`).
 * @property {object} [handlebarsOptions={}] - Configuration options for the Handlebars plugin.
 * @property {string} [handlebarsOptions.partialDirectory] - Directory path containing Handlebars partials.
 */

/**
 * Combined function for Hulak Vite plugins.
 * Allows enabling or disabling individual plugins and configuring their behavior via options.
 *
 * @param {HulakPluginConfig} [config={}] - Plugin configuration object.
 * @returns {import('vite').Plugin[]} An array of active Vite plugins based on the provided configuration.
 */
function hulakPlugins(config = {}) {
  const { enableLoaderPage = false, enableHandlebars = false, handlebarsOptions = {} } = config

  const plugins = []

  if (enableLoaderPage) {
    plugins.push(hulakLoaderPage())
  }

  if (enableHandlebars) {
    plugins.push(hulakHandlebars(handlebarsOptions))
  }

  return plugins
}

export { hulakPlugins }
