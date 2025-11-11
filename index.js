import hulakLoaderPage from './hulak-loader-page.js'
import hulakHandlebars from './hulak-handlebars.js'

/**
 * @typedef {object} HulakPluginConfig
 * @property {boolean} [enableLoaderPage=true] - Включить плагин для блокировки загрузки страницы (hulakLoaderPage).
 * @property {boolean} [enableHandlebars=true] - Включить плагин для обработки Handlebars (hulakHandlebars).
 * @property {object} [handlebarsOptions={}] - Опции для hulakHandlebars.
 * @property {string} [handlebarsOptions.partialDirectory] - Директория для партиалов Handlebars.
 */

/**
 * Объединенная функция для Vite-плагинов Hulak.
 * @param {HulakPluginConfig} [config={}] - Конфигурация для включения/выключения плагинов и их настроек.
 * @returns {import('vite').Plugin[]} Массив активных плагинов Vite.
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
