# Hulak Plugins

A collection of powerful Vite plugins designed to enhance your development workflow with loader page blocking, **reactive Handlebars template processing**, and **flexible multi-page routing** capabilities.

**Keywords:** vite, vite-plugin, handlebars, html-templates, template-engine, partials, html-imports, vite-handlebars, static-templates, build-tools, frontend-tools, component-templates, html-partials, vite-tooling, handlebars-templates, template-loader, html-modules, javascript-templates, vite-html, handlebars-integration, reactive-components, routing, multi-page, dynamic-routes

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
                    '/user/:id': 'pages/user.html'
                },
                staticParams: {
                    '/user/:id': [
                        { id: '1' },
                        { id: '2' },
                        { id: '3' }
                    ]
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
**Flexible multi-page routing with dynamic parameters and custom HTML transformation!**

Create powerful multi-page applications with static and dynamic routes. Perfect for landing pages, portfolios, documentation sites, and any project requiring multiple HTML pages with clean URLs.

`hulakRouter` provides:
- 🛣️ **Static routes** - Map URLs to HTML files (`'/about': 'pages/about.html'`)
- 🎯 **Dynamic routes** - Use URL parameters (`'/user/:id': 'pages/user.html'`)
- 🏗️ **Static generation** - Pre-render dynamic routes at build time with `staticParams`
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
          '/products/:id': 'pages/product.html'
        }
      }
    })
  ]
})
```

Now you get:
- ✅ **MPA with Handlebars** via `vite-plugin-handlebars`
- ✅ **Reactive JS components** via `hulakHandlebars`
- ✅ **Flexible routing** via `hulakRouter`
- ✅ **Best of all worlds!**

## ⚙️ Configuration Options

### Main Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enableLoaderPage` | `boolean` | `false` | Enable the loader page blocking plugin |
| `enableHandlebars` | `boolean` | `false` | Enable Handlebars template processing for JS imports |
| `enableRouter` | `boolean` | `false` | Enable multi-page routing with dynamic parameters |
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
| `staticParams` | `object` | `{}` | Parameters for static generation of dynamic routes |
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

### Dynamic Routes with Parameters

Create routes with URL parameters:

```javascript
routerOptions: {
  routes: {
    '/user/:id': 'pages/user.html',
    '/blog/:slug': 'pages/blog-post.html',
    '/products/:category/:id': 'pages/product.html'
  },
  staticParams: {
    '/user/:id': [
      { id: 'john' },
      { id: 'jane' },
      { id: 'admin' }
    ],
    '/blog/:slug': [
      { slug: 'getting-started' },
      { slug: 'advanced-tips' }
    ],
    '/products/:category/:id': [
      { category: 'electronics', id: 'laptop-01' },
      { category: 'electronics', id: 'phone-02' },
      { category: 'books', id: 'novel-01' }
    ]
  }
}
```

**Development:** Navigate to `http://localhost:5173/user/john`  
**Build:** Generates:
- `dist/user/john/index.html`
- `dist/user/jane/index.html`
- `dist/user/admin/index.html`

### Custom HTML Transformation

Inject dynamic data into your HTML:

```javascript
routerOptions: {
  routes: {
    '/user/:id': 'pages/user.html'
  },
  staticParams: {
    '/user/:id': [
      { id: 'john' },
      { id: 'jane' }
    ]
  },
  transformHtml: async (html, { url, filePath, params }) => {
    // Example: Inject user data
    const userData = await fetchUserData(params.id)
    
    return html
      .replace('{{USER_NAME}}', userData.name)
      .replace('{{USER_EMAIL}}', userData.email)
      .replace('{{USER_BIO}}', userData.bio)
  }
}
```

```html
<!-- pages/user.html -->
<!DOCTYPE html>
<html>
<head>
  <title>User Profile</title>
</head>
<body>
  <h1>{{USER_NAME}}</h1>
  <p>Email: {{USER_EMAIL}}</p>
  <p>Bio: {{USER_BIO}}</p>
</body>
</html>
```

### Real-World Router Examples

#### Example 1: Documentation Site

```javascript
routerOptions: {
  routes: {
    '/': 'index.html',
    '/docs/:section': 'pages/docs.html',
    '/api/:endpoint': 'pages/api.html'
  },
  staticParams: {
    '/docs/:section': [
      { section: 'getting-started' },
      { section: 'installation' },
      { section: 'configuration' },
      { section: 'deployment' }
    ],
    '/api/:endpoint': [
      { endpoint: 'authentication' },
      { endpoint: 'users' },
      { endpoint: 'posts' }
    ]
  },
  transformHtml: (html, { params }) => {
    // Load markdown content based on section
    const content = loadMarkdown(params.section)
    return html.replace('{{CONTENT}}', content)
  }
}
```

#### Example 2: Portfolio Site

```javascript
routerOptions: {
  routes: {
    '/': 'index.html',
    '/projects/:slug': 'pages/project.html',
    '/blog/:year/:month/:slug': 'pages/blog-post.html'
  },
  staticParams: {
    '/projects/:slug': [
      { slug: 'ecommerce-platform' },
      { slug: 'mobile-app' },
      { slug: 'web-dashboard' }
    ],
    '/blog/:year/:month/:slug': [
      { year: '2024', month: '01', slug: 'new-year-goals' },
      { year: '2024', month: '02', slug: 'web-performance' }
    ]
  },
  transformHtml: async (html, { params, url }) => {
    if (url.startsWith('/projects/')) {
      const project = await loadProject(params.slug)
      return html
        .replace('{{PROJECT_TITLE}}', project.title)
        .replace('{{PROJECT_DESCRIPTION}}', project.description)
        .replace('{{PROJECT_IMAGES}}', generateImageGallery(project.images))
    }
    return html
  }
}
```

#### Example 3: E-commerce Product Pages

```javascript
routerOptions: {
  routes: {
    '/': 'index.html',
    '/category/:category': 'pages/category.html',
    '/product/:id': 'pages/product.html'
  },
  staticParams: {
    '/category/:category': [
      { category: 'electronics' },
      { category: 'clothing' },
      { category: 'books' }
    ],
    '/product/:id': generateProductIds() // ['prod-001', 'prod-002', ...]
  },
  transformHtml: async (html, { params, url }) => {
    if (url.startsWith('/product/')) {
      const product = await fetchProduct(params.id)
      
      return html
        .replace('{{PRODUCT_NAME}}', product.name)
        .replace('{{PRODUCT_PRICE}}', product.price)
        .replace('{{PRODUCT_IMAGE}}', product.image)
        .replace('{{PRODUCT_DESCRIPTION}}', product.description)
        .replace('{{META_TITLE}}', `${product.name} - Buy Now`)
        .replace('{{META_DESCRIPTION}}', product.shortDescription)
    }
    
    return html
  }
}

function generateProductIds() {
  // Fetch from database or API
  return products.map(p => ({ id: p.id }))
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

**✅ Dynamic Routes**
```javascript
routes: {
  '/user/:id': 'pages/user.html'
}
// → http://localhost:5173/user/123
// Access params in transformHtml
```

**✅ Nested Parameters**
```javascript
routes: {
  '/blog/:year/:month/:slug': 'pages/post.html'
}
// → http://localhost:5173/blog/2024/01/my-post
```

**✅ Static Generation**
```javascript
staticParams: {
  '/user/:id': [
    { id: '1' },
    { id: '2' }
  ]
}
// Generates:
// - dist/user/1/index.html
// - dist/user/2/index.html
```

**✅ HTML Transformation**
```javascript
transformHtml: (html, { url, params }) => {
  return html.replace('{{DYNAMIC}}', params.id)
}
```

**✅ Clean URLs**
```
/about      → dist/about/index.html
/user/123   → dist/user/123/index.html
```

### Router Benefits

- ✅ **SEO Friendly** - Clean URLs without file extensions
- ✅ **Static Generation** - Pre-render dynamic routes at build time
- ✅ **Dev Server Support** - Works perfectly in development
- ✅ **Flexible Routing** - Static and dynamic routes
- ✅ **HTML Transformation** - Inject data before rendering
- ✅ **Type Safe** - Full TypeScript support
- ✅ **Build Optimization** - Proper folder structure generation
- ✅ **Parameter Inheritance** - Access URL params in transformHtml

### Importing HTML Templates into JavaScript

*(Same Handlebars documentation as before...)*

[Rest of the Handlebars documentation remains the same]

## 🎯 Features

- ✨ **Simple API** - Easy-to-use configuration with sensible defaults
- 🔧 **Modular** - Enable only the plugins you need
- 🎨 **Handlebars-like Syntax** - Full template processing with partials and conditionals
- 🔄 **Reactive Components** - Update props and automatically re-render
- 🎯 **DOM Element Methods** - `.render()`, `.update()`, `.toString()`
- 🛣️ **Flexible Routing** - Static and dynamic routes with parameters
- 🏗️ **Static Generation** - Pre-render pages at build time
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
        staticParams?: Record<string, Array<Record<string, string>>>
        transformHtml?: (
            html: string,
            context: {
                url: string
                filePath: string
                params: Record<string, string>
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