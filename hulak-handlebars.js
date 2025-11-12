import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

function hulakHandlebars(options = {}) {
  const partialDirectory = options.partialDirectory || resolve(process.cwd(), 'src/html/')
  const fileRegex = /\.html$/

  const paramRegex = /([a-zA-Z0-9_-]+)=(['"])(.*?)\2|([a-zA-Z0-9_-]+)=([a-zA-Z0-9_-]+)/g

  function processPartials(content, parentParams = {}) {
    const partialRegex = /\{\{>\s*([^\s}]+)\s*([\s\S]*?)\}\}/g

    return content.replace(partialRegex, (match, partialPath, paramsString) => {
      const fullPartialPath = resolve(partialDirectory, partialPath + '.html')

      if (existsSync(fullPartialPath)) {
        try {
          let partialContent = readFileSync(fullPartialPath, 'utf-8')

          let params = { ...parentParams }
          let paramMatch
          const localParamRegex = new RegExp(paramRegex.source, paramRegex.flags)

          while ((paramMatch = localParamRegex.exec(paramsString)) !== null) {
            if (paramMatch[1]) {
              params[paramMatch[1]] = paramMatch[3]
            } else if (paramMatch[4]) {
              const targetKey = paramMatch[4]
              const sourceKey = paramMatch[5]
              if (parentParams.hasOwnProperty(sourceKey)) {
                params[targetKey] = parentParams[sourceKey]
              }
            }
          }

          partialContent = processPartials(partialContent, params)

          Object.keys(params).forEach(key => {
            const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g')
            partialContent = partialContent.replace(regex, params[key])
          })

          return partialContent
        } catch (error) {
          console.warn(`Error processing partial ${fullPartialPath}: ${error.message}`)
          return match
        }
      }

      console.warn(`Partial file not found: ${fullPartialPath}`)
      return match
    })
  }

  return {
    name: 'hulak-plugin-handlebars-import',

    transform(code, id) {
      if (fileRegex.test(id) && id.includes(partialDirectory)) {
        let fileContent = readFileSync(id, 'utf-8')
        fileContent = processPartials(fileContent, {})

        const templateFunction = `
export default function(props = {}) {
  let template = ${JSON.stringify(fileContent)};
  
  let maxIterations = 10;
  let iteration = 0;
  
  while (iteration < maxIterations && template.indexOf('{{#if') !== -1) {
    iteration++;
    
    template = template.replace(/\\{\\{#if\\s+([^}]+?)\\}\\}(.*?)\\{\\{else\\s*\\}\\}(.*?)\\{\\{\\/if\\s*\\}\\}/g, (match, condition, ifBlock, elseBlock) => {
      const key = condition.trim();
      return props[key] ? ifBlock : elseBlock;
    });

    template = template.replace(/\\{\\{#if\\s+([^}]+?)\\}\\}(.*?)\\{\\{\\/if\\s*\\}\\}/g, (match, condition, block) => {
      const key = condition.trim();
      return props[key] ? block : '';
    });

    template = template.replace(/\\{\\{#if\\s*\\((eq\\s+([^\\s]+)\\s+"([^"]+)"\\s*)\\)\\}\\}([\\s\\S]*?)\\{\\{else\\s*\\}\\}([\\s\\S]*?)\\{\\{\\/if\\s*\\}\\}/g, (match, fullCond, propKey, expectedVal, ifBlock, elseBlock) => {
      return (props[propKey] === expectedVal) ? ifBlock : elseBlock;
    });

    template = template.replace(/\\{\\{#if\\s*\\((eq\\s+([^\\s]+)\\s+"([^"]+)"\\s*)\\)\\}\\}([\\s\\S]*?)\\{\\{\\/if\\s*\\}\\}/g, (match, fullCond, propKey, expectedVal, block) => {
      return (props[propKey] === expectedVal) ? block : '';
    });
  }

  Object.keys(props).forEach(key => {
    const regex = new RegExp(\`\\\\{\\\\{\\\\s*\${key}\\\\s*\\\\}\\\\}\`, 'g');
    template = template.replace(regex, props[key] || '');
  });

  template = template.replace(/\\{\\{[^}]+?\\}\\}/g, '');

  return template;
}
        `.trim()

        return {
          code: templateFunction,
          map: null,
        }
      }
      return null
    },
  }
}

export default hulakHandlebars