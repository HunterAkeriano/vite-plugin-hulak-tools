import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

export default function hulakRouter(options = {}) {
    const routes = options.routes || {}
    const transformHtml = options.transformHtml
    const staticParams = options.staticParams || {}
    let projectRoot = process.cwd()

    function toFsPath(relativePath) {
        return resolve(projectRoot, relativePath)
    }

    function normalizeUrlPath(url) {
        const path = url.split('?')[0].split('#')[0]
        if (!path) return '/'
        if (path !== '/' && path.endsWith('/')) return path.slice(0, -1)
        return path
    }

    function matchPattern(pattern, urlPath) {
        const params = {}

        const normPattern = normalizeUrlPath(pattern)
        const normUrl = normalizeUrlPath(urlPath)

        const pSegs = normPattern.split('/')
        const uSegs = normUrl.split('/')

        if (pSegs.length !== uSegs.length) return null

        for (let i = 0; i < pSegs.length; i++) {
            const p = pSegs[i]
            const u = uSegs[i]

            if (!p) continue

            if (p.startsWith(':')) {
                const name = p.slice(1)
                params[name] = decodeURIComponent(u)
            } else if (p !== u) {
                return null
            }
        }

        return params
    }

    function fillPattern(pattern, params) {
        let path = normalizeUrlPath(pattern)
        Object.keys(params || {}).forEach(key => {
            path = path.replace(':' + key, encodeURIComponent(params[key]))
        })
        return path
    }

    function makeFileNameFromPath(path) {
        let fileName = path.replace(/^\//, '')
        if (!fileName || fileName.endsWith('/')) {
            fileName = (fileName || '') + 'index.html'
        } else if (!fileName.endsWith('.html')) {
            fileName = fileName + '/index.html'
        }
        return fileName
    }

    function matchRoute(urlPath) {
        const normUrl = normalizeUrlPath(urlPath)

        if (routes[normUrl]) {
            return { htmlPath: routes[normUrl], params: {} }
        }

        for (const [pattern, htmlPath] of Object.entries(routes)) {
            if (!pattern.includes(':')) continue
            const params = matchPattern(pattern, normUrl)
            if (params) return { htmlPath, params }
        }

        return null
    }

    async function processHtml({ url, htmlPath, server, params }) {
        const fsPath = toFsPath(htmlPath)

        if (!existsSync(fsPath)) {
            console.warn(`[hulak-router] File not found for route "${url}": ${htmlPath}`)
            return null
        }

        let html = readFileSync(fsPath, 'utf-8')

        if (typeof transformHtml === 'function') {
            html = await transformHtml(html, { url, filePath: fsPath, server, params: params || {} })
        } else if (server && typeof server.transformIndexHtml === 'function') {
            html = await server.transformIndexHtml(url, html)
        }

        return html
    }

    return {
        name: 'hulak-router',
        enforce: 'pre',

        configResolved(config) {
            projectRoot = config.root || projectRoot
        },

        configureServer(server) {
            const handler = async (req, res, next) => {
                if (!req.url) return next()
                if (req.method !== 'GET') return next()

                const accept = req.headers.accept || ''
                if (!accept.includes('text/html')) return next()

                const urlPath = normalizeUrlPath(req.url)
                const match = matchRoute(urlPath)
                if (!match) return next()

                const { htmlPath, params } = match

                const html = await processHtml({ url: urlPath, htmlPath, server, params })
                if (html == null) return next()

                res.statusCode = 200
                res.setHeader('Content-Type', 'text/html; charset=utf-8')
                res.end(html)
            }

            server.middlewares.stack.unshift({
                route: '',
                handle: (req, res, next) => {
                    Promise.resolve(handler(req, res, next)).catch(err => {
                        console.error('[hulak-router] dev handler error:', err)
                        next(err)
                    })
                },
            })
        },

        async generateBundle() {
            for (const [pattern, htmlPath] of Object.entries(routes)) {
                const fsPath = toFsPath(htmlPath)
                if (!existsSync(fsPath)) {
                    this.warn(`[hulak-router] File not found for route "${pattern}": ${htmlPath}`)
                    continue
                }

                const baseHtml = readFileSync(fsPath, 'utf-8')

                const hasParams = pattern.includes(':')
                const paramSets = hasParams ? staticParams[pattern] || [] : [{}]

                if (hasParams && paramSets.length === 0) {
                    this.warn(`[hulak-router] Dynamic route pattern "${pattern}" has no staticParams; skipping in build.`)
                    continue
                }

                for (const params of paramSets) {
                    const path = fillPattern(pattern, params)
                    let html = baseHtml

                    if (typeof transformHtml === 'function') {
                        html = await transformHtml(html, {
                            url: path,
                            filePath: fsPath,
                            server: undefined,
                            params,
                        })
                    }

                    const fileName = makeFileNameFromPath(path)

                    this.emitFile({
                        type: 'asset',
                        fileName,
                        source: html,
                    })
                }
            }
        },
    }
}
