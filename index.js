import hulakLoaderPage from './hulak-loader-page.js'
import hulakHandlebars from './hulak-handlebars.js'
import hulakRouter from './hulak-router.js'

/**
 * @typedef {object} HulakPluginConfig
 * @property {boolean} [enableLoaderPage=false]
 * @property {boolean} [enableHandlebars=false]
 * @property {object} [handlebarsOptions={}]
 * @property {string} [handlebarsOptions.partialDirectory]
 * @property {boolean} [enableRouter=false]
 * @property {object} [routerOptions={}]
 */

/**
 * Combined function for Hulak Vite plugins.
 *
 * @param {HulakPluginConfig} [config={}] - Plugin configuration object.
 * @returns {import('vite').Plugin[]} An array of active Vite plugins based on the provided configuration.
 */
function hulakPlugins(config = {}) {
  const {
    enableLoaderPage = false,
    enableHandlebars = false,
    handlebarsOptions = {},
    enableRouter = false,
    routerOptions = {}
  } = config

  const plugins = []

  if (enableLoaderPage) {
    plugins.push(hulakLoaderPage())
  }

  if (enableHandlebars) {
    plugins.push(hulakHandlebars(handlebarsOptions))
  }

  if (enableRouter) {
    plugins.push(hulakRouter(routerOptions))
  }

  return plugins
}

export { hulakPlugins }