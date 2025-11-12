# Hulak Plugins

A collection of powerful Vite plugins designed to enhance your development workflow with loader page blocking and **reactive Handlebars template processing** capabilities.

**Keywords:** vite, vite-plugin, handlebars, html-templates, template-engine, partials, html-imports, vite-handlebars, static-templates, build-tools, frontend-tools, component-templates, html-partials, vite-tooling, handlebars-templates, template-loader, html-modules, javascript-templates, vite-html, handlebars-integration, reactive-components

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
- ✅ **Reactive JS components** via `hulakHandlebars`
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
With `hulakHandlebars` plugin, you can **import your Handlebars HTML files directly into JavaScript** as reactive component functions!

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
    <span class="badge premium">Premium User</span>
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

// Create a component with initial props
const userCard = userCardTemplate({
  name: 'John Doe',
  email: 'john@example.com',
  avatar: '/images/john.jpg',
  isPremium: true,
  isOnline: true
})

// Render it to the DOM
userCard.render(document.getElementById('app'))

// Update the component reactively
setTimeout(() => {
  userCard.update({ 
    isPremium: false,
    isOnline: false 
  })
}, 3000)

// Or get HTML as string
console.log(userCard.toString())
```

## 🔥 Reactive Component API

Each imported template returns a **reactive DOM element** with built-in methods:

### Component Methods

#### `.render(target)`
Appends the component to a target element.

```javascript
import button from './button.html'

const btn = button({ label: 'Click Me', disabled: false })
btn.render(document.body)
```

#### `.update(newProps)`
Updates the component with new props and automatically re-renders in place.

```javascript
import counter from './counter.html'

const counterEl = counter({ count: 0 })
counterEl.render(document.getElementById('app'))

// Update reactively
setInterval(() => {
  const currentCount = parseInt(counterEl.textContent)
  counterEl.update({ count: currentCount + 1 })
}, 1000)
```

#### `.toString()`
Returns the current HTML as a string.

```javascript
import card from './card.html'

const cardEl = card({ title: 'Hello', description: 'World' })
const htmlString = cardEl.toString()
console.log(htmlString) // <div class="card">...</div>
```

### Real-World Examples

#### Example 1: Interactive Counter

```html
<!-- src/html/components/counter.html -->
<div class="counter">
  <h3>Count: {{count}}</h3>
  <button class="increment">+</button>
  <button class="decrement">-</button>
</div>
```

```javascript
// src/app.js
import counterTemplate from './html/components/counter.html'

const counter = counterTemplate({ count: 0 })
counter.render(document.getElementById('app'))

// Add event listeners that update the component
counter.querySelector('.increment').addEventListener('click', () => {
  const current = parseInt(counter.querySelector('h3').textContent.split(': ')[1])
  counter.update({ count: current + 1 })
})

counter.querySelector('.decrement').addEventListener('click', () => {
  const current = parseInt(counter.querySelector('h3').textContent.split(': ')[1])
  counter.update({ count: current - 1 })
})
```

#### Example 2: Dynamic Status Card

```html
<!-- src/html/components/status-card.html -->
<div class="status-card {{status}}">
  <div class="icon">
    {{#if (eq status "online")}}
      ✓
    {{else}}
      ✗
    {{/if}}
  </div>
  <h3>{{username}}</h3>
  <p>Status: {{status}}</p>
  {{#if lastSeen}}
    <small>Last seen: {{lastSeen}}</small>
  {{/if}}
</div>
```

```javascript
// src/status-manager.js
import statusCard from './html/components/status-card.html'

class StatusManager {
  constructor(container) {
    this.card = statusCard({
      username: 'Guest',
      status: 'offline',
      lastSeen: null
    })
    
    this.card.render(container)
  }
  
  setOnline(username) {
    this.card.update({
      username: username,
      status: 'online',
      lastSeen: null
    })
  }
  
  setOffline(lastSeen) {
    this.card.update({
      status: 'offline',
      lastSeen: lastSeen
    })
  }
}

// Usage
const manager = new StatusManager(document.getElementById('status'))
manager.setOnline('John Doe')

setTimeout(() => {
  manager.setOffline('2 minutes ago')
}, 5000)
```

#### Example 3: Todo List with Dynamic Updates

```html
<!-- src/html/components/todo-item.html -->
<li class="todo-item {{#if completed}}completed{{/if}}">
  <input type="checkbox" {{#if completed}}checked{{/if}}>
  <span class="text">{{text}}</span>
  <button class="delete">×</button>
</li>
```

```javascript
// src/todo-app.js
import todoItemTemplate from './html/components/todo-item.html'

class TodoList {
  constructor(container) {
    this.container = container
    this.todos = new Map()
  }
  
  addTodo(id, text) {
    const todoEl = todoItemTemplate({ 
      text: text, 
      completed: false 
    })
    
    // Store reference
    this.todos.set(id, todoEl)
    
    // Attach event listeners
    todoEl.querySelector('input').addEventListener('change', (e) => {
      todoEl.update({ completed: e.target.checked })
    })
    
    todoEl.querySelector('.delete').addEventListener('click', () => {
      todoEl.remove()
      this.todos.delete(id)
    })
    
    // Render to container
    todoEl.render(this.container)
  }
  
  toggleTodo(id) {
    const todo = this.todos.get(id)
    const isCompleted = todo.querySelector('input').checked
    todo.update({ completed: !isCompleted })
  }
}

// Usage
const todoList = new TodoList(document.getElementById('todos'))
todoList.addTodo(1, 'Buy groceries')
todoList.addTodo(2, 'Write code')
todoList.addTodo(3, 'Read documentation')
```

#### Example 4: Notification System

```html
<!-- src/html/components/notification.html -->
<div class="notification {{type}}">
  <span class="icon">
    {{#if (eq type "success")}}✓{{/if}}
    {{#if (eq type "error")}}✗{{/if}}
    {{#if (eq type "info")}}ℹ{{/if}}
  </span>
  <div class="content">
    <h4>{{title}}</h4>
    <p>{{message}}</p>
  </div>
  <button class="close">×</button>
</div>
```

```javascript
// src/notification-manager.js
import notificationTemplate from './html/components/notification.html'

class NotificationManager {
  constructor() {
    this.container = document.getElementById('notifications')
    this.notifications = []
  }
  
  show(type, title, message, duration = 5000) {
    const notification = notificationTemplate({
      type: type,
      title: title,
      message: message
    })
    
    // Auto-dismiss
    setTimeout(() => {
      notification.remove()
      this.notifications = this.notifications.filter(n => n !== notification)
    }, duration)
    
    // Manual close
    notification.querySelector('.close').addEventListener('click', () => {
      notification.remove()
      this.notifications = this.notifications.filter(n => n !== notification)
    })
    
    notification.render(this.container)
    this.notifications.push(notification)
    
    return notification
  }
  
  success(title, message) {
    return this.show('success', title, message)
  }
  
  error(title, message) {
    return this.show('error', title, message)
  }
  
  info(title, message) {
    return this.show('info', title, message)
  }
}

// Usage
const notifications = new NotificationManager()

notifications.success('Saved!', 'Your changes have been saved')
notifications.error('Error', 'Failed to load data')
notifications.info('Update', 'New version available')
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
<button class="{{#if (eq type "primary")}}btn-primary{{else}}btn-default{{/if}}">
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

**✅ Reactive Updates**
```javascript
const component = template({ name: 'John' })
component.update({ name: 'Jane' }) // Automatically re-renders
```

#### Benefits
- ✅ **Integrates with vite-plugin-handlebars** - Use both plugins together
- ✅ **Reactive Components** - Update props and auto re-render
- ✅ **DOM Element Methods** - Direct `.render()`, `.update()`, `.toString()`
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

**Scenario:** You have a multi-page site built with `vite-plugin-handlebars`, but need dynamic reactive client-side components.

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
    
    // Reactive JS components
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
    <!-- This will be filled by reactive JavaScript components -->
  </div>
  
  {{> footer}}
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

```javascript
// src/main.js - Reactive components using hulakHandlebars
import productCard from './components/product-card.html'

fetch('/api/products')
  .then(r => r.json())
  .then(products => {
    const container = document.getElementById('dynamic-content')
    
    products.forEach(product => {
      const card = productCard(product)
      card.render(container)
      
      // Add interactivity
      card.querySelector('button').addEventListener('click', () => {
        card.update({ inCart: true })
      })
    })
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
- 🔄 **Reactive Components** - Update props and automatically re-render
- 🎯 **DOM Element Methods** - `.render()`, `.update()`, `.toString()`
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