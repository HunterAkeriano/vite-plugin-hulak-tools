import { readFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'

function hulakHandlebars(options = {}) {
  const partialDirectory = options.partialDirectory || resolve(process.cwd(), 'src/html/')
  const fileRegex = /\.html$/

  function processPartials(content, currentDir) {
    const partialRegex = /\{\{>\s*([^\s}]+)\s*\}\}/g

    return content.replace(partialRegex, (match, partialPath) => {
      const fullPartialPath = resolve(partialDirectory, partialPath + '.html')

      if (existsSync(fullPartialPath)) {
        try {
          const partialContent = readFileSync(fullPartialPath, 'utf-8')
          return processPartials(partialContent, dirname(fullPartialPath))
        } catch (error) {
          console.warn(`Partial do not exist: ${fullPartialPath}`)
          return match
        }
      }

      console.warn(`Partial do not exist: ${fullPartialPath}`)
      return match
    })
  }

  return {
    name: 'hulak-plugin-handlebars-import',

    transform(code, id) {
      if (fileRegex.test(id) && id.includes(partialDirectory)) {
        let fileContent = readFileSync(id, 'utf-8')

        fileContent = processPartials(fileContent, dirname(id))

        const templateFunction = `
export default function(props = {}) {
  let template = ${JSON.stringify(fileContent)};
  
  Object.keys(props).forEach(key => {
    const regex = new RegExp(\`\\\{\\\{$\{key\}\\\}\\\}\`, 'g');
    template = template.replace(regex, props[key] || '');
  });

  template = template.replace(/\\\{\\\{#if\\s+([^}]+)\\\}\\\}(.*?)\\\{\\\{else\\\}\\\}(.*?)\\\{\\\{\\/if\\\}\\\}/gs, (match, condition, ifBlock, elseBlock) => {
    const conditionKey = condition.trim();
    return props[conditionKey] ? ifBlock : elseBlock;
  });

  template = template.replace(/\\\{\\\{#if\\s+([^}]+)\\\}\\\}(.*?)\\\{\\\{\\/if\\\}\\\}/gs, (match, condition, block) => {
    const conditionKey = condition.trim();
    return props[conditionKey] ? block : '';
  });

  template = template.replace(/\\\{\\\{([^#/>][^}]*?)\\\}\\\}/g, '');

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
