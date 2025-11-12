# Hulak Plugins

A collection of powerful Vite plugins designed to enhance your development workflow with loader page blocking and Handlebars template processing capabilities.

**Keywords:** vite, vite-plugin, handlebars, html-templates, template-engine, partials, html-imports, vite-handlebars, static-templates, build-tools, frontend-tools, component-templates, html-partials, vite-tooling, handlebars-templates, template-loader, html-modules, javascript-templates, vite-html, handlebars-integration

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
            handlebarsOptions: {
                partialDirectory: './src/partials'
            }
        })
    ]
})
```

## 🔌 Available Plugins

### 1. **hulakLoaderPage**
Provides page loading blocking functionality during the build process.

### 2. **hulakHandlebars**
**The missing bridge between `vite-plugin-handlebars` and JavaScript!**

While `vite-plugin-handlebars` is excellent for building multi-page applications with server-side Handlebars rendering, it doesn't allow you to **import HTML templates directly into your JavaScript** for client-side use.

`hulakHandlebars` solves this by enabling you to:
- 🎯 **Import HTML as JavaScript functions** - Use your Handlebars templates client-side
- 🔄 **Work alongside vite-plugin-handlebars** - Use both together seamlessly
- 📦 **Zero runtime dependencies** - No Handlebars library needed in production bundle
- ⚡ **Compile-time processing** - All template logic resolved at build time
- 🔧 **Full Handlebars syntax** - Partials, conditionals, variables, nested parameters

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
      handlebarsOptions: {
        // For importing templates into JS
        partialDirectory: './src/html/components'
      }
    })
  ]
})
```

Now you get:
- ✅ **MPA with Handlebars** via `vite-plugin-handlebars`
- ✅ **Dynamic JS templates** via `hulakHandlebars`
- ✅ **Best of both worlds!**

## ⚙️ Configuration Options

### Main Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enableLoaderPage` | `boolean` | `false` | Enable the loader page blocking plugin |
| `enableHandlebars` | `boolean` | `false` | Enable Handlebars template processing for JS imports |
| `handlebarsOptions` | `object` | `{}` | Configuration options for Handlebars plugin |

### Handlebars Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `partialDirectory` | `string` | `'src/html/'` | Path to the directory containing HTML partials |

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

### Importing HTML Templates into JavaScript

#### The Problem
`vite-plugin-handlebars` is great for server-side HTML generation, but you cannot use those templates in JavaScript:

```javascript
// ❌ This won't work with vite-plugin-handlebars alone
import template from './template.html'
const html = template({ name: 'John' })
document.body.innerHTML = html
```

Without `hulakHandlebars`, you're forced to:
- Duplicate your templates (HTML for pages, strings for JS)
- Use string concatenation (messy and error-prone)
- Install additional template libraries (bloats your bundle)

#### The Solution
With `hulakHandlebars` plugin, you can **import your Handlebars HTML files directly into JavaScript** as template functions!

**Step 1:** Enable the plugin in your Vite config

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import handlebars from 'vite-plugin-handlebars'
import { hulakPlugins } from 'vite-plugin-hulak-tools'

export default defineConfig({
  plugins: [
    // Your existing vite-plugin-handlebars setup
    handlebars({
      partialDirectory: './src/partials',
    }),
    
    // Add hulakHandlebars to enable JS imports
    hulakPlugins({
      enableHandlebars: true,
      handlebarsOptions: {
        partialDirectory: './src/html/components'
      }
    })
  ]
})
```

**Step 2:** Create your HTML templates with Handlebars syntax

```html
<!-- src/html/components/user-card.html -->
<div class="user-card">
  <h2>{{name}}</h2>
  <p class="email">{{email}}</p>
  
  {{#if isPremium}}
    <span class="badge">Premium User</span>
  {{else}}
    <span class="badge">Free User</span>
  {{/if}}
  
  {{> user-avatar avatar=avatar isOnline=isOnline}}
</div>
```

```html
<!-- src/html/components/user-avatar.html -->
<div class="avatar">
  <img src="{{avatar}}" alt="Avatar">
  {{#if isOnline}}
    <span class="status online">●</span>
  {{/if}}
</div>
```

**Step 3:** Import and use in your JavaScript

```javascript
// src/app.js
import userCardTemplate from './html/components/user-card.html'

const userData = {
  name: 'John Doe',
  email: 'john@example.com',
  avatar: '/images/john.jpg',
  isPremium: true,
  isOnline: true
}

// Template is now a function that accepts props
const html = userCardTemplate(userData)

// Use it anywhere in your JS!
document.getElementById('app').innerHTML = html

// Update dynamically
button.addEventListener('click', () => {
  const newHtml = userCardTemplate({ ...userData, isPremium: false })
  element.innerHTML = newHtml
})
```

#### Supported Features

**✅ Variable Substitution**
```html
<h1>{{title}}</h1>
<p>{{description}}</p>
```

**✅ Conditional Rendering (with else)**
```html
{{#if isLoggedIn}}
  <button>Logout</button>
{{else}}
  <button>Login</button>
{{/if}}
```

**✅ Conditional Rendering (without else)**
```html
{{#if showNotification}}
  <div class="notification">You have new messages</div>
{{/if}}
```

**✅ Equality Helper**
```html
<button type="{{#if (eq type "submit")}}submit{{else}}button{{/if}}">
  Click me
</button>
```

**✅ Partials (Reusable Components)**
```html
{{> header}}
{{> navigation menuItems=items}}
{{> footer year=currentYear}}
```

**✅ Nested Partials with Parameter Inheritance**
```html
<!-- parent.html -->
{{> child-component title="Hello" description=parentDescription}}

<!-- child-component.html -->
<div>
  <h1>{{title}}</h1>
  {{> grandchild-component description=description}}
</div>

<!-- grandchild-component.html -->
<p>{{description}}</p>
```

#### Real-World Example: Dynamic Product Catalog

```html
<!-- src/html/components/product-list.html -->
<div class="products-container">
  <h1>{{pageTitle}}</h1>
  
  {{#if hasDiscount}}
    <div class="promo-banner">
      🎉 Special Sale - {{discountPercent}}% OFF!
    </div>
  {{/if}}
  
  <div class="products-grid">
    {{> product-card 
       productName=name 
       image=thumbnail 
       price=currentPrice
       onSale=isOnSale}}
  </div>
</div>
```

```html
<!-- src/html/components/product-card.html -->
<article class="product-card">
  <img src="{{image}}" alt="{{productName}}">
  <h3>{{productName}}</h3>
  <p class="description">{{description}}</p>
  
  {{#if onSale}}
    <div class="price">
      <span class="old-price">${{originalPrice}}</span>
      <span class="sale-price">${{salePrice}}</span>
    </div>
  {{else}}
    <div class="price">${{price}}</div>
  {{/if}}
  
  <button data-id="{{productId}}">Add to Cart</button>
</article>
```

```javascript
// src/pages/catalog.js
import productListTemplate from './html/components/product-list.html'

// Fetch products from API
const products = await fetch('/api/products').then(r => r.json())

// Render each product using the imported template
const productsHTML = products.map(product => 
  productListTemplate({
    pageTitle: 'Summer Collection 2024',
    hasDiscount: true,
    discountPercent: 25,
    name: product.name,
    description: product.description,
    thumbnail: product.image,
    isOnSale: product.onSale,
    originalPrice: product.regularPrice,
    currentPrice: product.salePrice,
    productId: product.id
  })
).join('')

document.querySelector('.catalog').innerHTML = productsHTML
```

#### Dynamic Component Updates

```javascript
// src/components/notification-manager.js
import notificationTemplate from './html/components/notification.html'

class NotificationManager {
  constructor() {
    this.container = document.querySelector('.notifications')
  }
  
  add(notification) {
    const html = notificationTemplate({
      message: notification.message,
      type: notification.type,
      timestamp: notification.time
    })
    
    this.container.insertAdjacentHTML('beforeend', html)
  }
  
  clear() {
    this.container.innerHTML = notificationTemplate({
      message: 'No notifications',
      type: 'empty'
    })
  }
}

// Use it anywhere
const manager = new NotificationManager()
manager.add({ message: 'New comment!', type: 'info', time: 'now' })
```

#### Benefits
- ✅ **Integrates with vite-plugin-handlebars** - Use both plugins together
- ✅ **Zero Runtime Dependencies** - No Handlebars library in production bundle
- ✅ **Direct Imports** - Import `.html` files just like any other module
- ✅ **Partials Support** - Reuse HTML components with parameter passing
- ✅ **Nested Partials** - Full parameter inheritance support
- ✅ **Conditionals** - Built-in `{{#if}}` logic with `{{else}}` support
- ✅ **Variables** - Simple `{{variable}}` syntax for dynamic content
- ✅ **Helper Functions** - `(eq)` helper for equality checks
- ✅ **Hot Reload** - Templates update automatically during development
- ✅ **Build Optimization** - Templates compiled at build time
- ✅ **Type Safe** - Works perfectly with TypeScript
- ✅ **Lightweight** - ~2KB runtime overhead

### Use Case: Combining Both Plugins

**Scenario:** You have a multi-page site built with `vite-plugin-handlebars`, but need dynamic client-side components.

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import handlebars from 'vite-plugin-handlebars'
import { hulakPlugins } from 'vite-plugin-hulak-tools'

export default defineConfig({
  plugins: [
    // Static HTML pages with Handlebars
    handlebars({
      partialDirectory: './src/partials',
      context: {
        title: 'My Site',
        year: 2024
      }
    }),
    
    // Dynamic JS components
    hulakPlugins({
      enableHandlebars: true,
      handlebarsOptions: {
        partialDirectory: './src/components'
      }
    })
  ]
})
```

Now you can:
```html
<!-- index.html - Static page rendered by vite-plugin-handlebars -->
<!DOCTYPE html>
<html>
<head>
  <title>{{title}}</title>
</head>
<body>
  {{> header}}
  
  <div id="dynamic-content">
    <!-- This will be filled by JavaScript -->
  </div>
  
  {{> footer}}
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

```javascript
// src/main.js - Dynamic content using hulakHandlebars
import productCard from './components/product-card.html'

fetch('/api/products')
  .then(r => r.json())
  .then(products => {
    const html = products.map(p => productCard(p)).join('')
    document.getElementById('dynamic-content').innerHTML = html
  })
```

### Enable Both Plugins

```javascript
import { hulakPlugins } from 'vite-plugin-hulak-tools'

export default {
    plugins: [
        hulakPlugins({
            enableLoaderPage: true,
            enableHandlebars: true,
            handlebarsOptions: {
                partialDirectory: './src/components'
            }
        })
    ]
}
```

### Use Individual Plugins

You can also import and use plugins individually:

```javascript
import hulakLoaderPage from 'vite-plugin-hulak-tools/hulak-loader-page'
import hulakHandlebars from 'vite-plugin-hulak-tools/hulak-handlebars'

export default {
    plugins: [
        hulakLoaderPage(),
        hulakHandlebars({
            partialDirectory: './src/components'
        })
    ]
}
```

## 🎯 Features

- ✨ **Simple API** - Easy-to-use configuration with sensible defaults
- 🔧 **Modular** - Enable only the plugins you need
- 🎨 **Handlebars-like Syntax** - Full template processing with partials and conditionals
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
    handlebarsOptions?: {
        partialDirectory?: string
    }
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