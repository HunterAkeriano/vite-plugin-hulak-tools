function hulakLoaderPage() {
  const REGEX_IMPORTS = /^import\s+.*$/gm

  const REGEX_ENTRY_FILE = /\/(?!node_modules).*?\.(js)$/i

  let isMainEntryProcessed = false

  const UNBLOCK_CODE_FINALLY = `
    document.documentElement.style.visibility = 'visible';
    document.documentElement.style.opacity = '1';
    document.documentElement.style.overflow = 'auto'; 
    const cssGuard = document.getElementById('vite-css-guard');
    if (cssGuard) cssGuard.remove();
  `

  const BLOCK_BROWSER_SPINNER_HACK_TAG = `
    <script id="vite-spinner-guard" type="text/javascript">
      window.__viteLoadGuardSpinnerResolve;
      window.__viteLoadGuardSpinnerPromise = new Promise(resolve => {
        window.__viteLoadGuardSpinnerResolve = resolve;
      });

      (async function() {
        await window.__viteLoadGuardSpinnerPromise;
        const selfScript = document.getElementById('vite-spinner-guard');
        if (selfScript) selfScript.remove();
      })();
    </script>
  `

  const RESOLVE_SPINNER_HACK = `
    if (window.__viteLoadGuardSpinnerResolve) {
      window.__viteLoadGuardSpinnerResolve();
    }
  `

  return {
    name: 'hulak-loader-page',
    enforce: 'pre',

    transformIndexHtml(html, ctx) {
      if (!ctx.server) return html

      isMainEntryProcessed = false

      const blockingStyles = `
        <style id="vite-css-guard">
          html { 
            visibility: hidden !important; 
            opacity: 0 !important; 
            overflow: hidden !important; 
          }
        </style>
      `

      return html
          .replace(/<head>/i, `<head>${blockingStyles}`)
          .replace(/<\/body>/i, `${BLOCK_BROWSER_SPINNER_HACK_TAG}</body>`)
    },

    transform(code, id) {
      if (
          REGEX_ENTRY_FILE.test(id) &&
          !id.includes('node_modules') &&
          !id.includes('.vite/deps') &&
          !isMainEntryProcessed
      ) {
        isMainEntryProcessed = true
        if (/^\s*export\s+/m.test(code)) return code

        const imports = []
        const body = code
            .replace(REGEX_IMPORTS, match => {
              imports.push(match)
              return ''
            })
            .trim()

        const importsString = imports.join('\n')

        const PRE_HOOK = `
          let loadGuardResolve;
          const loadGuardPromise = new Promise(resolve => loadGuardResolve = resolve);
          const originalAddEventListener = document.addEventListener;

          document.addEventListener = function(type, listener, ...rest) {
            if (type === 'DOMContentLoaded') {
              const wrappedListener = async (event) => {
                try {
                  await listener(event);
                } catch (e) {
                  console.error('DOMContentLoaded listener error:', e);
                } finally {
                  loadGuardResolve();
                }
              };
              originalAddEventListener.call(this, type, wrappedListener, ...rest);
            } else {
              originalAddEventListener.call(this, type, listener, ...rest);
            }
          };
        `

        const WRAPPER_START = `
          (async function() {
            try {
              ${body}
              await loadGuardPromise;
              ${RESOLVE_SPINNER_HACK}
        `
        const WRAPPER_END = `
            } catch (error) {
              console.error('Module execution error (Page unlocked):', error);
              ${RESOLVE_SPINNER_HACK}
              ${UNBLOCK_CODE_FINALLY}
            } finally {
              ${UNBLOCK_CODE_FINALLY}
            }
          })();
        `

        return `${importsString}\n${PRE_HOOK}\n${WRAPPER_START}${WRAPPER_END}`
      }
      return code
    },
  }
}

export default hulakLoaderPage
