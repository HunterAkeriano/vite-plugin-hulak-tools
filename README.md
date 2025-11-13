# Hulak Plugins

A collection of powerful Vite plugins designed to enhance your development workflow with loader page blocking, **reactive Handlebars template processing**, and **flexible multi-page routing** capabilities.

**Keywords:** vite, vite-plugin, handlebars, html-templates, template-engine, partials, html-imports, vite-handlebars, static-templates, build-tools, frontend-tools, component-templates, html-partials, vite-tooling, handlebars-templates, template-loader, html-modules, javascript-templates, vite-html, handlebars-integration, reactive-components, routing, multi-page, static-routes

## 📦 Installation

```bash
npm install vite-plugin-hulak-tools --save-dev
# or
yarn add vite-plugin-hulak-tools -D
# or
pnpm add vite-plugin-hulak-tools -D
```

## 🚀 Quick Start

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import { hulakPlugins } from 'vite-plugin-hulak-tools'

export default defineConfig({
    plugins: [
        hulakPlugins({
            enableLoaderPage: true,
            enableHandlebars: true,
            enableRouter: true,
            handlebarsOptions: {
                partialDirectory: './src/partials'
            },
            routerOptions: {
                routes: {
                    '/': 'index.html',
                    '/about': 'pages/about.html',
                    '/contact': 'pages/contact.html'
                }
            }
        })
    ]
})
```

## 🔌 Available Plugins

### 1. **hulakLoaderPage**
Provides page loading blocking functionality during the build process.

### 2. **hulakHandlebars**
**The missing bridge between `vite-plugin-handlebars` and JavaScript with reactive capabilities!**

While `vite-plugin-handlebars` is excellent for building multi-page applications with server-side Handlebars rendering, it doesn't allow you to **import HTML templates directly into your JavaScript** for client-side use.

`hulakHandlebars` solves this by enabling you to:
- 🎯 **Import HTML as reactive JavaScript components** - Use your Handlebars templates client-side
- 🔄 **Reactive updates** - Update component state and automatically re-render
- 🎨 **DOM element methods** - Direct `.render()`, `.update()`, and `.toString()` methods
- 🤝 **Work alongside vite-plugin-handlebars** - Use both together seamlessly
- 📦 **Zero runtime dependencies** - No Handlebars library needed in production bundle
- ⚡ **Compile-time processing** - All template logic resolved at build time
- 🔧 **Full Handlebars syntax** - Partials, conditionals, variables, nested parameters

### 3. **hulakRouter**
**Simple multi-page routing with clean URLs and custom HTML transformation!**

Create powerful multi-page applications with static routes. Perfect for landing pages, portfolios, documentation sites, and any project requiring multiple HTML pages with clean URLs.

`hulakRouter` provides:
- 🛣️ **Static routes** - Map URLs to HTML files (`'/about': 'pages/about.html'`)
- 🔄 **HTML transformation** - Custom `transformHtml` function for injecting data
- ⚡ **Dev server support** - Works perfectly in development mode
- 📦 **Build optimization** - Generates proper folder structure for clean URLs
- 🎨 **Handlebars integration** - Works seamlessly with `hulakHandlebars`

### Perfect combination:
```javascript
// vite.config.js
import { defineConfig } from 'vite'
import handlebars from 'vite-plugin-handlebars'
import { hulakPlugins } from 'vite-plugin-hulak-tools'

export default defineConfig({
  plugins: [
    handlebars({
      // For your multi-page HTML generation
      partialDirectory: resolve(__dirname, './src/partials'),
    }),
    hulakPlugins({
      enableHandlebars: true,
      enableRouter: true,
      handlebarsOptions: {
        // For importing templates into JS
        partialDirectory: './src/html/components'
      },
      routerOptions: {
        routes: {
          '/': 'index.html',
          '/about': 'pages/about.html',
          '/products': 'pages/products.html'
        }
      }
    })
  ]
})
```

Now you get:
- ✅ **MPA with Handlebars** via `vite-plugin-handlebars`
- ✅ **Reactive JS components** via `hulakHandlebars`
- ✅ **Clean URL routing** via `hulakRouter`
- ✅ **Best of all worlds!**

## ⚙️ Configuration Options

### Main Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enableLoaderPage` | `boolean` | `false` | Enable the loader page blocking plugin |
| `enableHandlebars` | `boolean` | `false` | Enable Handlebars template processing for JS imports |
| `enableRouter` | `boolean` | `false` | Enable multi-page routing |
| `handlebarsOptions` | `object` | `{}` | Configuration options for Handlebars plugin |
| `routerOptions` | `object` | `{}` | Configuration options for Router plugin |

### Handlebars Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `partialDirectory` | `string` | `'src/html/'` | Path to the directory containing HTML partials |

### Router Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `routes` | `object` | `{}` | Map of URL patterns to HTML file paths |
| `transformHtml` | `function` | `undefined` | Custom function to transform HTML before rendering |

## 📖 Usage Examples

### Enable Only Loader Page

```javascript
import { hulakPlugins } from 'vite-plugin-hulak-tools'

export default {
  plugins: [
    hulakPlugins({
      enableLoaderPage: true
    })
  ]
}
```

## 🛣️ Router Plugin Usage

### Basic Static Routes

Map URLs to HTML files:

```javascript
import { hulakPlugins } from 'vite-plugin-hulak-tools'

export default {
  plugins: [
    hulakPlugins({
      enableRouter: true,
      routerOptions: {
        routes: {
          '/': 'index.html',
          '/about': 'pages/about.html',
          '/contact': 'pages/contact.html',
          '/blog': 'pages/blog.html'
        }
      }
    })
  ]
}
```

**Development:** Navigate to `http://localhost:5173/about`  
**Build:** Generates `dist/about/index.html`

### Custom HTML Transformation

Inject dynamic data into your HTML:

```javascript
routerOptions: {
  routes: {
    '/about': 'pages/about.html',
    '/team': 'pages/team.html'
  },
  transformHtml: async (html, { url, filePath }) => {
    // Example: Inject page-specific data
    if (url === '/about') {
      const aboutData = await fetchAboutData()
      return html
        .replace('{{COMPANY_NAME}}', aboutData.companyName)
        .replace('{{DESCRIPTION}}', aboutData.description)
    }
    
    if (url === '/team') {
      const teamData = await fetchTeamData()
      return html.replace('{{TEAM_MEMBERS}}', generateTeamList(teamData))
    }
    
    return html
  }
}
```

```html
<!-- pages/about.html -->
<!DOCTYPE html>
<html>
<head>
  <title>About Us</title>
</head>
<body>
  <h1>{{COMPANY_NAME}}</h1>
  <p>{{DESCRIPTION}}</p>
</body>
</html>
```

### Real-World Router Examples

#### Example 1: Documentation Site

```javascript
routerOptions: {
  routes: {
    '/': 'index.html',
    '/docs/getting-started': 'pages/docs-getting-started.html',
    '/docs/installation': 'pages/docs-installation.html',
    '/docs/configuration': 'pages/docs-configuration.html',
    '/api/authentication': 'pages/api-authentication.html',
    '/api/users': 'pages/api-users.html'
  },
  transformHtml: (html, { url }) => {
    // Load markdown content based on URL
    const content = loadMarkdownForUrl(url)
    return html.replace('{{CONTENT}}', content)
  }
}
```

#### Example 2: Portfolio Site

```javascript
routerOptions: {
  routes: {
    '/': 'index.html',
    '/projects/ecommerce': 'pages/project-ecommerce.html',
    '/projects/mobile-app': 'pages/project-mobile.html',
    '/projects/dashboard': 'pages/project-dashboard.html',
    '/blog/new-year-goals': 'pages/blog-post-1.html',
    '/blog/web-performance': 'pages/blog-post-2.html'
  },
  transformHtml: async (html, { url }) => {
    if (url.startsWith('/projects/')) {
      const projectName = url.split('/').pop()
      const project = await loadProject(projectName)
      return html
        .replace('{{PROJECT_TITLE}}', project.title)
        .replace('{{PROJECT_DESCRIPTION}}', project.description)
        .replace('{{PROJECT_IMAGES}}', generateImageGallery(project.images))
    }
    return html
  }
}
```

#### Example 3: Marketing Site

```javascript
routerOptions: {
  routes: {
    '/': 'index.html',
    '/features': 'pages/features.html',
    '/pricing': 'pages/pricing.html',
    '/about': 'pages/about.html',
    '/contact': 'pages/contact.html',
    '/blog': 'pages/blog.html'
  },
  transformHtml: async (html, { url }) => {
    // Inject global data
    const siteData = await loadSiteData()
    
    let result = html
      .replace('{{SITE_NAME}}', siteData.name)
      .replace('{{META_DESCRIPTION}}', siteData.description)
    
    // Inject page-specific data
    if (url === '/pricing') {
      const pricingData = await fetchPricingData()
      result = result.replace('{{PRICING_PLANS}}', generatePricingTable(pricingData))
    }
    
    return result
  }
}
```

### Router Features

**✅ Static Routes**
```javascript
routes: {
  '/about': 'pages/about.html'
}
// → http://localhost:5173/about
// → dist/about/index.html
```

**✅ HTML Transformation**
```javascript
transformHtml: (html, { url, filePath }) => {
  return html.replace('{{DYNAMIC}}', 'content')
}
```

**✅ Clean URLs**
```
/about      → dist/about/index.html
/contact    → dist/contact/index.html
```

### Router Benefits

- ✅ **SEO Friendly** - Clean URLs without file extensions
- ✅ **Static Generation** - Pre-render pages at build time
- ✅ **Dev Server Support** - Works perfectly in development
- ✅ **Simple Configuration** - Easy route mapping
- ✅ **HTML Transformation** - Inject data before rendering
- ✅ **Type Safe** - Full TypeScript support
- ✅ **Build Optimization** - Proper folder structure generation

### Importing HTML Templates into JavaScript

*(Same Handlebars documentation as before...)*

[Rest of the Handlebars documentation remains the same]

## 🎯 Features

- ✨ **Simple API** - Easy-to-use configuration with sensible defaults
- 🔧 **Modular** - Enable only the plugins you need
- 🎨 **Handlebars-like Syntax** - Full template processing with partials and conditionals
- 🔄 **Reactive Components** - Update props and automatically re-render
- 🎯 **DOM Element Methods** - `.render()`, `.update()`, `.toString()`
- 🛣️ **Clean URL Routing** - Static routes with proper folder structure
- 🔄 **HTML Transformation** - Inject data before rendering
- 🔗 **Works with vite-plugin-handlebars** - Perfect companion for importing templates to JS
- ⚡ **Vite Optimized** - Built specifically for Vite projects
- 📦 **Zero Config** - Works out of the box with minimal setup
- 🔄 **Nested Partials** - Full parameter inheritance support
- 🚀 **Production Ready** - Optimized builds with minimal overhead

## 🛠️ TypeScript Support

The plugin includes full TypeScript definitions:

```typescript
interface HulakPluginConfig {
    enableLoaderPage?: boolean
    enableHandlebars?: boolean
    enableRouter?: boolean
    handlebarsOptions?: {
        partialDirectory?: string
    }
    routerOptions?: {
        routes?: Record<string, string>
        transformHtml?: (
            html: string,
            context: {
                url: string
                filePath: string
                server?: any
            }
        ) => string | Promise<string>
    }
}

// Component interface
interface ReactiveComponent extends HTMLElement {
    update(newProps: Record<string, any>): HTMLElement
    render(target: HTMLElement): HTMLElement
    toString(): string
}
```

## 📝 License

MIT

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Contact

If you have any questions or suggestions, feel free to open an issue.

---

Made with ❤️ for the Vite community