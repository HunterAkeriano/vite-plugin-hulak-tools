import { readFileSync, existsSync } from 'fs'
import { resolve, sep } from 'path'

export default function hulakHandlebars(options = {}) {
  let root = process.cwd()
  const partialDirectory = options.partialDirectory
      ? resolve(process.cwd(), options.partialDirectory)
      : resolve(process.cwd(), 'src/html')
  const PREFIX = '\0hulak:'
  const SUFFIX = '.hulak'
  const norm = p => p.split(sep).join('/')
  const stripQ = s => s.replace(/[?#].*$/, '')
  const inDir = p => norm(p).startsWith(norm(partialDirectory) + '/')
  const paramRegex = /([a-zA-Z0-9_-]+)=(['"])(.*?)\2|([a-zA-Z0-9_-]+)=([a-zA-Z0-9_-]+)/g

  function toAbs(id, importer) {
    const clean = stripQ(id)
    if (clean.startsWith('/')) return resolve(root, '.' + clean)
    if (/^[a-zA-Z]:/.test(clean)) return clean
    const base = importer ? resolve(importer, '..') : root
    return resolve(base, clean)
  }

  function processPartials(content, parentParams = {}) {
    const partialRegex = /\{\{>\s*([^\s}]+)\s*([\s\S]*?)\}\}/g
    return content.replace(partialRegex, (match, partialPath, paramsString) => {
      const fullPartialPath = resolve(partialDirectory, partialPath + '.html')
      if (existsSync(fullPartialPath)) {
        let partialContent = readFileSync(fullPartialPath, 'utf-8')
        let params = { ...parentParams }
        let m,
            r = new RegExp(paramRegex.source, paramRegex.flags)
        while ((m = r.exec(paramsString)) !== null) {
          if (m[1]) params[m[1]] = m[3]
          else if (m[4]) {
            const t = m[4],
                s = m[5]
            if (Object.prototype.hasOwnProperty.call(parentParams, s)) params[t] = parentParams[s]
          }
        }
        partialContent = processPartials(partialContent, params)
        Object.keys(params).forEach(k => {
          const re = new RegExp(`\\{\\{\\s*${k}\\s*\\}\\}`, 'g')
          partialContent = partialContent.replace(re, params[k])
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
      root = cfg.root || root
    },

    resolveId(id, importer) {
      const clean = stripQ(id)
      if (!clean.endsWith('.html')) return null
      const abs = toAbs(clean, importer)
      if (!inDir(abs)) return null
      const q = id.includes('?') ? id.slice(id.indexOf('?')) : ''
      return PREFIX + abs.replace(/\.html$/, SUFFIX) + q
    },

    load(id) {
      if (!id.startsWith(PREFIX)) return null
      const real = stripQ(id.slice(PREFIX.length)).replace(new RegExp(SUFFIX + '$'), '.html')
      let fileContent = readFileSync(real, 'utf-8')
      fileContent = processPartials(fileContent, {})
      const base64 = Buffer.from(fileContent, 'utf-8').toString('base64')

      const code = `
export default function(initialProps = {}) {
  const decode = (b64) => {
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
  const sourceTemplate = decode('${base64}');
  let currentProps = { ...initialProps };
  const LB = String.fromCharCode(123), RB = String.fromCharCode(125), L2 = LB + LB, R2 = RB + RB;

  function createHtml(props) {
    let template = sourceTemplate, maxIterations = 10, iteration = 0;
    while (iteration < maxIterations && template.indexOf(L2 + '#if') !== -1) {
      iteration++;
      template = template.replace(new RegExp(\`\${L2}#if\\\\s+([^}]+?)\${R2}(.*?)\${L2}else\\\\s*\${R2}(.*?)\${L2}\\\\/if\\\\s*\${R2}\`, 'g'), (m, c, a, b) => (props[c.trim()] ? a : b));
      template = template.replace(new RegExp(\`\${L2}#if\\\\s+([^}]+?)\${R2}(.*?)\${L2}\\\\/if\\\\s*\${R2}\`, 'g'), (m, c, a) => (props[c.trim()] ? a : ''));
      template = template.replace(new RegExp(\`\${L2}#if\\\\s*\\\\((eq\\\\s+([^\\\\s]+)\\\\s+"([^"]+)"\\\\s*)\\\\)\${R2}([\\\\s\\\\S]*?)\${L2}else\\\\s*\${R2}([\\\\s\\\\S]*?)\${L2}\\\\/if\\\\s*\${R2}\`, 'g'), (m, _f, k, v, a, b) => (props[k] === v ? a : b));
      template = template.replace(new RegExp(\`\${L2}#if\\\\s*\\\\((eq\\\\s+([^\\\\s]+)\\\\s+"([^"]+)"\\\\s*)\\\\)\${R2}([\\\\s\\\\S]*?)\${L2}\\\\/if\\\\s*\${R2}\`, 'g'), (m, _f, k, v, a) => (props[k] === v ? a : ''));
    }
    Object.keys(props).forEach(k => { const re = new RegExp(\`\${L2}\\\\s*\${k}\\\\s*\${R2}\`, 'g'); template = template.replace(re, props[k] ?? '') });
    template = template.replace(/\\s[a-zA-Z0-9_-]+=['"]\\s*['"]/g, '');
    template = template.replace(new RegExp(\`\${L2}[^}]+?\${R2}\`, 'g'), '');
    return template;
  }

  function renderElement(props) {
    const html = createHtml(props), d = document.createElement('div');
    d.innerHTML = html.trim();
    return d.firstElementChild;
  }

  let rootElement = renderElement(currentProps);
  const methods = {};
  function update(newProps) {
    currentProps = { ...currentProps, ...newProps };
    if (rootElement.parentElement) {
      const p = rootElement.parentElement, n = renderElement(currentProps);
      Object.keys(methods).forEach(k => n[k] = methods[k]);
      p.replaceChild(n, rootElement);
      rootElement = n;
      return n;
    } else {
      const n = renderElement(currentProps);
      Object.keys(methods).forEach(k => n[k] = methods[k]);
      rootElement = n;
      return n;
    }
  }
  methods.update = update;
  methods.toString = () => rootElement?.outerHTML ?? '';
  methods.render = (t) => { if (t && t.appendChild) t.appendChild(rootElement); return rootElement };
  Object.keys(methods).forEach(k => rootElement[k] = methods[k]);
  return rootElement;
}
`.trim()

      return { code, map: null }
    },
  }
}
