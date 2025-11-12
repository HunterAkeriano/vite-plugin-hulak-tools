import { readFileSync, existsSync } from 'fs'
import { resolve, sep } from 'path'

export default function hulakHandlebars(options = {}) {
  let projectRoot = process.cwd()
  const partialsDir = options.partialDirectory
      ? resolve(process.cwd(), options.partialDirectory)
      : resolve(process.cwd(), 'src/html')
  const VIRTUAL_PREFIX = '\0hulak:'
  const VIRTUAL_SUFFIX = '.hulak'
  const normalizePath = p => p.split(sep).join('/')
  const stripQuery = s => s.replace(/[?#].*$/, '')
  const isInPartialsDir = p => normalizePath(p).startsWith(normalizePath(partialsDir) + '/')
  const paramPattern = /([a-zA-Z0-9_-]+)=(['"])(.*?)\2|([a-zA-Z0-9_-]+)=([a-zA-Z0-9_-]+)/g

  function toAbsolute(importId, importer) {
    const clean = stripQuery(importId)
    if (clean.startsWith('/')) return resolve(projectRoot, '.' + clean)
    if (/^[a-zA-Z]:/.test(clean)) return clean
    const baseDir = importer ? resolve(importer, '..') : projectRoot
    return resolve(baseDir, clean)
  }

  function expandPartials(html, parentParams = {}) {
    const partialIncludePattern = /\{\{>\s*([^\s}]+)\s*([\s\S]*?)\}\}/g
    return html.replace(partialIncludePattern, (match, partialPath, paramsString) => {
      const partialFile = resolve(partialsDir, partialPath + '.html')
      if (existsSync(partialFile)) {
        let partialContent = readFileSync(partialFile, 'utf-8')
        let mergedParams = { ...parentParams }
        let execMatch, localParamPattern = new RegExp(paramPattern.source, paramPattern.flags)
        while ((execMatch = localParamPattern.exec(paramsString)) !== null) {
          if (execMatch[1]) mergedParams[execMatch[1]] = execMatch[3]
          else if (execMatch[4]) {
            const targetKey = execMatch[4]
            const sourceKey = execMatch[5]
            if (Object.prototype.hasOwnProperty.call(parentParams, sourceKey)) mergedParams[targetKey] = parentParams[sourceKey]
          }
        }
        partialContent = expandPartials(partialContent, mergedParams)
        Object.keys(mergedParams).forEach(key => {
          const keyPattern = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g')
          partialContent = partialContent.replace(keyPattern, mergedParams[key])
        })
        return partialContent
      }
      return match
    })
  }

  return {
    name: 'hulak-plugin-handlebars-import',
    enforce: 'pre',
    configResolved(cfg) {
      projectRoot = cfg.root || projectRoot
    },

    resolveId(id, importer) {
      const clean = stripQuery(id)
      if (!clean.endsWith('.html')) return null
      const abs = toAbsolute(clean, importer)
      if (!isInPartialsDir(abs)) return null
      const query = id.includes('?') ? id.slice(id.indexOf('?')) : ''
      return VIRTUAL_PREFIX + abs.replace(/\.html$/, VIRTUAL_SUFFIX) + query
    },

    load(id) {
      if (!id.startsWith(VIRTUAL_PREFIX)) return null
      const realPath = stripQuery(id.slice(VIRTUAL_PREFIX.length)).replace(new RegExp(VIRTUAL_SUFFIX + '$'), '.html')
      let sourceHtml = readFileSync(realPath, 'utf-8')
      sourceHtml = expandPartials(sourceHtml, {})
      const base64 = Buffer.from(sourceHtml, 'utf-8').toString('base64')

      const code = `
export default function(initialProps = {}) {
  const decodeBase64Utf8 = (b64) => {
    if (typeof atob === 'function' && typeof TextDecoder !== 'undefined') {
      const bin = atob(b64);
      const bytes = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
      return new TextDecoder('utf-8').decode(bytes);
    }
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(b64, 'base64').toString('utf-8');
    }
    const bin = atob(b64);
    try { return decodeURIComponent(escape(bin)); } catch (e) { return bin; }
  };
  const sourceTemplate = decodeBase64Utf8('${base64}');
  let currentProps = { ...initialProps };
  const LBRACE = String.fromCharCode(123), RBRACE = String.fromCharCode(125), OPEN = LBRACE + LBRACE, CLOSE = RBRACE + RBRACE;

  function createHtml(props) {
    let template = sourceTemplate, maxIterations = 10, iteration = 0;
    while (iteration < maxIterations && template.indexOf(OPEN + '#if') !== -1) {
      iteration++;
      template = template.replace(new RegExp(\`\${OPEN}#if\\\\s+([^}]+?)\${CLOSE}(.*?)\${OPEN}else\\\\s*\${CLOSE}(.*?)\${OPEN}\\\\/if\\\\s*\${CLOSE}\`, 'g'), (m, cond, ifBlock, elseBlock) => (props[cond.trim()] ? ifBlock : elseBlock));
      template = template.replace(new RegExp(\`\${OPEN}#if\\\\s+([^}]+?)\${CLOSE}(.*?)\${OPEN}\\\\/if\\\\s*\${CLOSE}\`, 'g'), (m, cond, block) => (props[cond.trim()] ? block : ''));
      template = template.replace(new RegExp(\`\${OPEN}#if\\\\s*\\\\((eq\\\\s+([^\\\\s]+)\\\\s+"([^"]+)"\\\\s*)\\\\)\${CLOSE}([\\\\s\\\\S]*?)\${OPEN}else\\\\s*\${CLOSE}([\\\\s\\\\S]*?)\${OPEN}\\\\/if\\\\s*\${CLOSE}\`, 'g'), (m, _f, key, expected, ifBlock, elseBlock) => (props[key] === expected ? ifBlock : elseBlock));
      template = template.replace(new RegExp(\`\${OPEN}#if\\\\s*\\\\((eq\\\\s+([^\\\\s]+)\\\\s+"([^"]+)"\\\\s*)\\\\)\${CLOSE}([\\\\s\\\\S]*?)\${OPEN}\\\\/if\\\\s*\${CLOSE}\`, 'g'), (m, _f, key, expected, block) => (props[key] === expected ? block : ''));
    }
    Object.keys(props).forEach(key => { const keyRe = new RegExp(\`\${OPEN}\\\\s*\${key}\\\\s*\${CLOSE}\`, 'g'); template = template.replace(keyRe, props[key] ?? '') });
    template = template.replace(/\\s[a-zA-Z0-9_-]+=['"]\\s*['"]/g, '');
    template = template.replace(new RegExp(\`\${OPEN}[^}]+?\${CLOSE}\`, 'g'), '');
    return template;
  }

  function renderElement(props) {
    const html = createHtml(props), container = document.createElement('div');
    container.innerHTML = html.trim();
    return container.firstElementChild;
  }

  let rootElement = renderElement(currentProps);
  const api = {};
  function update(newProps) {
    currentProps = { ...currentProps, ...newProps };
    if (rootElement.parentElement) {
      const parent = rootElement.parentElement, next = renderElement(currentProps);
      Object.keys(api).forEach(name => next[name] = api[name]);
      parent.replaceChild(next, rootElement);
      rootElement = next;
      return next;
    } else {
      const next = renderElement(currentProps);
      Object.keys(api).forEach(name => next[name] = api[name]);
      rootElement = next;
      return next;
    }
  }
  api.update = update;
  api.toString = () => rootElement?.outerHTML ?? '';
  api.render = (target) => { if (target && target.appendChild) target.appendChild(rootElement); return rootElement };
  Object.keys(api).forEach(name => rootElement[name] = api[name]);
  return rootElement;
}
`.trim()

      return { code, map: null }
    },
  }
}
