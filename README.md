# Hulak Plugins

A collection of powerful Vite plugins designed to enhance your development workflow with loader page blocking and Handlebars template processing capabilities.

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
import { hulakPlugins } from 'hulak-plugins'

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
Solves the problem of template inclusion in JavaScript projects. By default, Vite doesn't support importing HTML templates directly into your JS/TS files. This plugin enables seamless integration of HTML templates with Handlebars-like syntax, supporting partials, conditionals, and variable substitution - all without external dependencies!

## ⚙️ Configuration Options

### Main Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `enableLoaderPage` | `boolean` | `false` | Enable the loader page blocking plugin |
| `enableHandlebars` | `boolean` | `false` | Enable Handlebars template processing |
| `handlebarsOptions` | `object` | `{}` | Configuration options for Handlebars plugin |

### Handlebars Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `partialDirectory` | `string` | `'src/html/'` | Path to the directory containing HTML partials |

## 📖 Usage Examples

### Enable Only Loader Page

```javascript
import { hulakPlugins } from 'hulak-plugins'

export default {
  plugins: [
    hulakPlugins({
      enableLoaderPage: true
    })
  ]
}
```

### Working with HTML Templates

#### The Problem
In standard Vite projects, you cannot directly import and use HTML templates with dynamic content:

```javascript
// ❌ This won't work without the plugin
import template from './template.html'
const html = template({ name: 'John' })
```

You're forced to either:
- Use string concatenation (messy and error-prone)
- Install heavy template libraries (adds unnecessary dependencies)
- Work with JSX (requires React/Vue setup)

#### The Solution
With `hulakHandlebars` plugin, you can import HTML files as template functions with full support for variables, conditionals, and partials - **no external dependencies needed**!

**Step 1:** Enable the plugin in your Vite config

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import { hulakPlugins } from 'hulak-plugins'

export default defineConfig({
  plugins: [
    hulakPlugins({
      enableHandlebars: true,
      handlebarsOptions: {
        partialDirectory: './src/html/partials'
      }
    })
  ]
})
```

**Step 2:** Create your HTML templates with Handlebars-like syntax

```html
<!-- src/html/user-card.html -->
<div class="user-card">
  <h2>{{name}}</h2>
  <p class="email">{{email}}</p>
  
  {{#if isPremium}}
    <span class="badge">Premium User</span>
  {{else}}
    <span class="badge">Free User</span>
  {{/if}}
  
  {{> user-avatar}}
</div>
```

```html
<!-- src/html/partials/user-avatar.html -->
<div class="avatar">
  <img src="{{avatar}}" alt="{{name}}'s avatar">
  {{#if isOnline}}
    <span class="status online">●</span>
  {{/if}}
</div>
```

**Step 3:** Import and use in your JavaScript

```javascript
// src/app.js
import userCardTemplate from './html/user-card.html'

const userData = {
  name: 'John Doe',
  email: 'john@example.com',
  avatar: '/images/john.jpg',
  isPremium: true,
  isOnline: true
}

// Template is now a function that accepts props
const html = userCardTemplate(userData)

// Insert into DOM
document.getElementById('app').innerHTML = html
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

**✅ Partials (Reusable Components)**
```html
{{> header}}
{{> navigation}}
{{> footer}}
```

#### Real-World Example: Product Catalog

```html
<!-- src/html/product-list.html -->
<div class="products-container">
  <h1>{{pageTitle}}</h1>
  
  {{#if hasDiscount}}
    <div class="promo-banner">
      🎉 Special Sale - {{discountPercent}}% OFF!
    </div>
  {{/if}}
  
  <div class="products-grid">
    {{> product-card}}
  </div>
</div>
```

```html
<!-- src/html/partials/product-card.html -->
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
import productListTemplate from './html/product-list.html'

const catalogData = {
  pageTitle: 'Summer Collection 2024',
  hasDiscount: true,
  discountPercent: 25,
  productName: 'Cool T-Shirt',
  description: 'Comfortable cotton t-shirt',
  image: '/products/tshirt.jpg',
  onSale: true,
  originalPrice: 50,
  salePrice: 37.50,
  productId: 'prod_123'
}

document.querySelector('.catalog').innerHTML = productListTemplate(catalogData)
```

#### Dynamic Lists Example

```html
<!-- src/html/notifications.html -->
<div class="notifications">
  <h2>Notifications ({{count}})</h2>
  
  {{#if hasNotifications}}
    {{> notification-item}}
  {{else}}
    <p class="empty">No new notifications</p>
  {{/if}}
</div>
```

```javascript
// Rendering multiple items
import notificationTemplate from './html/notifications.html'

const notifications = [
  { message: 'New comment on your post', time: '2m ago' },
  { message: 'User liked your photo', time: '5m ago' }
]

const notificationsHTML = notifications.map(notif => 
  notificationTemplate({
    hasNotifications: true,
    count: notifications.length,
    ...notif
  })
).join('')

document.querySelector('.notifications-list').innerHTML = notificationsHTML
```

#### Benefits
- ✅ **Zero Dependencies** - No Handlebars library needed, pure Vite plugin
- ✅ **Direct Imports** - Import `.html` files just like any other module
- ✅ **Partials Support** - Reuse HTML components across your project
- ✅ **Conditionals** - Built-in `{{#if}}` logic with `{{else}}` support
- ✅ **Variables** - Simple `{{variable}}` syntax for dynamic content
- ✅ **Hot Reload** - Templates update automatically during development
- ✅ **Build Optimization** - Templates are compiled at build time for better performance
- ✅ **Type Safe** - Works perfectly with TypeScript
- ✅ **Lightweight** - Minimal runtime overhead

### Enable Both Plugins

```javascript
import { hulakPlugins } from 'hulak-plugins'

export default {
    plugins: [
        hulakPlugins({
            enableLoaderPage: true,
            enableHandlebars: true,
            handlebarsOptions: {
                partialDirectory: './src/partials'
            }
        })
    ]
}
```

### Use Individual Plugins

You can also import and use plugins individually:

```javascript
import hulakLoaderPage from 'hulak-plugins/hulak-loader-page'
import hulakHandlebars from 'hulak-plugins/hulak-handlebars'

export default {
    plugins: [
        hulakLoaderPage(),
        hulakHandlebars({
            partialDirectory: './src/partials'
        })
    ]
}
```

## 🎯 Features

- ✨ **Simple API** - Easy-to-use configuration with sensible defaults
- 🔧 **Modular** - Enable only the plugins you need
- 🎨 **Handlebars Support** - Full Handlebars template processing with partials
- ⚡ **Vite Optimized** - Built specifically for Vite projects
- 📦 **Zero Config** - Works out of the box with minimal setup

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