# Hulak Handlebars Plugin

**The missing bridge between static HTML templates and reactive JavaScript components!**

A powerful Vite plugin that enables you to **import HTML templates directly into your JavaScript** as reactive, DOM-ready components. Write clean HTML with Handlebars syntax, import it like a module, and get fully functional DOM elements with built-in reactivity.

**Keywords:** vite, vite-plugin, handlebars, html-templates, template-engine, partials, html-imports, vite-handlebars, static-templates, build-tools, frontend-tools, component-templates, html-partials, reactive-components, javascript-templates, vite-html, handlebars-integration

**Version:** 3.0.0

---

## ✨ Why Hulak?

While `vite-plugin-handlebars` is excellent for multi-page applications with server-side rendering, it doesn't allow you to **import HTML templates into JavaScript** for client-side use.

**Hulak solves this:**

- 🎯 **Import HTML as JavaScript components** - Use templates client-side
- 🔄 **Reactive updates** - Update component state and automatically re-render
- 🎨 **DOM element methods** - Direct `.render()`, `.update()`, and `.toString()` methods
- 🤝 **Works alongside vite-plugin-handlebars** - Use both together seamlessly
- 📦 **Zero runtime dependencies** - No Handlebars library needed in production
- ⚡ **Compile-time processing** - All template logic resolved at build time
- 🔧 **Full Handlebars syntax** - Partials, conditionals, loops, nested parameters
- 🎭 **TypeScript support** - Full type definitions included

---

## 📦 Installation

```bash
npm install vite-plugin-hulak-tools --save-dev
# or
yarn add vite-plugin-hulak-tools -D
# or
pnpm add vite-plugin-hulak-tools -D
```

---

## 🚀 Quick Start

### Basic Configuration

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import { hulakPlugins } from 'vite-plugin-hulak-tools'

export default defineConfig({
  plugins: [
    hulakPlugins({
      enableHandlebars: true,
      handlebarsOptions: {
        partialDirectory: './src/components'
      }
    })
  ]
})
```

### Your First Component

**Create a template:**
```html
<!-- src/components/greeting.html -->
<div class="greeting">
  <h1>{{title}}</h1>
  <p>{{message}}</p>
</div>
```

**Import and use in JavaScript:**
```javascript
import Greeting from './components/greeting.html'

// Create component with props
const greeting = Greeting({ 
  title: 'Hello World!',
  message: 'Welcome to Hulak Handlebars!'
})

// Render to page
document.body.appendChild(greeting)

// Update reactively
greeting.update({ 
  title: 'Updated!',
  message: 'Component re-rendered automatically'
})
```

---

## ⚙️ Configuration Options

### Plugin Configuration

```typescript
interface HulakPluginConfig {
  mode?: 'javascript' | 'typescript' | 'js' | 'ts'  // Default: 'javascript'
  enableHandlebars?: boolean                        // Default: false
  handlebarsOptions?: {
    partialDirectory?: string                       // Default: undefined
  }
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `mode` | `string` | `'javascript'` | Output mode: `'javascript'`/`'js'` or `'typescript'`/`'ts'` |
| `enableHandlebars` | `boolean` | `false` | Enable the Handlebars plugin |
| `handlebarsOptions.partialDirectory` | `string` | `undefined` | Path to directory containing HTML partials |

### TypeScript Mode

Enable TypeScript output for better type checking:

```javascript
hulakPlugins({
  mode: 'typescript', // or 'ts'
  enableHandlebars: true,
  handlebarsOptions: {
    partialDirectory: './src/components'
  }
})
```

---

## 📖 Template Syntax

### Variables

```html
<!-- components/user-card.html -->
<div class="user-card">
  <h2>{{name}}</h2>
  <p>{{email}}</p>
  <span>{{role}}</span>
</div>
```

```javascript
import UserCard from './components/user-card.html'

const card = UserCard({
  name: 'John Doe',
  email: 'john@example.com',
  role: 'Developer'
})
```

### Conditionals

```html
<!-- components/status-badge.html -->
<div class="badge">
  {{#if isActive}}
    <span class="status active">Active</span>
  {{else}}
    <span class="status inactive">Inactive</span>
  {{/if}}
  
  {{#unless verified}}
    <span class="warning">Not Verified</span>
  {{/unless}}
</div>
```

```javascript
import StatusBadge from './components/status-badge.html'

const badge = StatusBadge({
  isActive: true,
  verified: false
})
```

### Loops

```html
<!-- components/product-list.html -->
<ul class="products">
  {{#each items}}
    <li class="product">
      <h3>{{this.name}}</h3>
      <p>${{this.price}}</p>
    </li>
  {{/each}}
</ul>
```

```javascript
import ProductList from './components/product-list.html'

const list = ProductList({
  items: [
    { name: 'Laptop', price: 999 },
    { name: 'Mouse', price: 29 },
    { name: 'Keyboard', price: 79 }
  ]
})
```

---

## 🧩 Using Partials

Partials allow you to create reusable sub-components.

### Directory Structure

```
src/
  components/
    button.html          ← Partial
    icon.html           ← Partial
    card.html           ← Uses partials
    user-profile.html   ← Main component
```

### Creating Partials

**button.html:**
```html
<button class="btn {{class}}">
  {{text}}
</button>
```

**icon.html:**
```html
<i class="icon icon-{{name}}"></i>
```

### Using Partials

```html
<!-- components/user-profile.html -->
<div class="profile">
  <div class="header">
    {{> icon name="user"}}
    <h2>{{username}}</h2>
  </div>
  
  <p>{{bio}}</p>
  
  <div class="actions">
    {{> button class="primary" text="Follow"}}
    {{> button class="secondary" text="Message"}}
  </div>
</div>
```

**JavaScript usage:**
```javascript
import UserProfile from './components/user-profile.html'

const profile = UserProfile({
  username: 'johndoe',
  bio: 'Full-stack developer'
})

document.body.appendChild(profile)
```

### Nested Partials with Parameters

```html
<!-- components/card.html -->
<div class="card">
  {{> card-header title=cardTitle subtitle=cardSubtitle}}
  
  <div class="content">
    {{content}}
  </div>
  
  {{> card-footer author=authorName date=publishDate}}
</div>
```

```html
<!-- components/card-header.html -->
<div class="card-header">
  <h3>{{title}}</h3>
  {{#if subtitle}}
    <p class="subtitle">{{subtitle}}</p>
  {{/if}}
</div>
```

```javascript
import Card from './components/card.html'

const card = Card({
  cardTitle: 'Article Title',
  cardSubtitle: 'A brief introduction',
  content: 'Main article content...',
  authorName: 'Jane Smith',
  publishDate: '2024-01-15'
})
```

---

## 🔄 Reactive Updates

Every imported component is a DOM element with reactive update capabilities.

### Basic Update

```javascript
import Counter from './components/counter.html'

const counter = Counter({ count: 0 })
document.body.appendChild(counter)

// Update props - component re-renders automatically
setInterval(() => {
  const currentCount = parseInt(counter.textContent.match(/\d+/)[0])
  counter.update({ count: currentCount + 1 })
}, 1000)
```

### Real-time Data Updates

```javascript
import Dashboard from './components/dashboard.html'

const dashboard = Dashboard({
  userName: 'John',
  stats: []
})

document.body.appendChild(dashboard)

// Fetch and update data
async function updateStats() {
  const data = await fetch('/api/stats').then(r => r.json())
  dashboard.update({
    userName: data.userName,
    stats: data.stats
  })
}

setInterval(updateStats, 5000) // Update every 5 seconds
```

---

## 🎨 DOM Element Methods

Every imported component has these built-in methods:

### `.render(target)`

Render component into a specific container:

```javascript
import Header from './components/header.html'

const header = Header({ title: 'My Site' })
header.render(document.getElementById('header-container'))
```

### `.update(newProps)`

Update component props and re-render:

```javascript
import StatusCard from './components/status-card.html'

const card = StatusCard({ status: 'pending' })
document.body.appendChild(card)

// Update after action
setTimeout(() => {
  card.update({ status: 'completed' })
}, 2000)
```

### `.toString()`

Get HTML as string:

```javascript
import Template from './components/template.html'

const component = Template({ data: 'value' })
const html = component.toString()

console.log(html) // <div>...</div>

// Use for server-side rendering or logging
```

### Standard DOM Methods

Components are real DOM elements, so all standard methods work:

```javascript
import Button from './components/button.html'

const btn = Button({ text: 'Click me' })

// Add classes
btn.classList.add('active', 'highlight')

// Add event listeners
btn.addEventListener('click', () => {
  console.log('Button clicked!')
})

// Query selectors
const icon = btn.querySelector('.icon')

// Modify styles
btn.style.backgroundColor = '#007bff'

// And more...
document.body.appendChild(btn)
```

---

## 💡 Real-World Examples

### Example 1: Dynamic Product Card

**Template:**
```html
<!-- components/product-card.html -->
<div class="product-card">
  <img src="{{image}}" alt="{{name}}">
  <div class="details">
    <h3>{{name}}</h3>
    <p class="description">{{description}}</p>
    <div class="price-section">
      <span class="price">${{price}}</span>
      {{#if onSale}}
        <span class="badge sale">{{discount}}% OFF</span>
      {{/if}}
    </div>
  </div>
  {{> button text="Add to Cart" class="primary"}}
</div>
```

**JavaScript:**
```javascript
import ProductCard from './components/product-card.html'

// Fetch products from API
const products = await fetch('/api/products').then(r => r.json())

// Create cards
const container = document.querySelector('.products-grid')
products.forEach(product => {
  const card = ProductCard(product)
  
  // Add click handler
  card.querySelector('button').addEventListener('click', () => {
    addToCart(product.id)
  })
  
  container.appendChild(card)
})
```

### Example 2: Interactive Form

**Template:**
```html
<!-- components/contact-form.html -->
<form class="contact-form">
  <h2>{{formTitle}}</h2>
  <p class="subtitle">{{formSubtitle}}</p>
  
  {{#each fields}}
    <div class="form-group">
      <label for="{{this.name}}">
        {{this.label}}
        {{#if this.required}}
          <span class="required">*</span>
        {{/if}}
      </label>
      <input 
        type="{{this.type}}" 
        id="{{this.name}}"
        name="{{this.name}}"
        placeholder="{{this.placeholder}}"
        {{#if this.required}}required{{/if}}
      >
    </div>
  {{/each}}
  
  {{> button text=submitText class="primary submit"}}
</form>
```

**JavaScript:**
```javascript
import ContactForm from './components/contact-form.html'

const form = ContactForm({
  formTitle: 'Get in Touch',
  formSubtitle: 'We\'d love to hear from you',
  submitText: 'Send Message',
  fields: [
    { 
      label: 'Name', 
      type: 'text', 
      name: 'name', 
      placeholder: 'Your name',
      required: true 
    },
    { 
      label: 'Email', 
      type: 'email', 
      name: 'email', 
      placeholder: 'your@email.com',
      required: true 
    },
    { 
      label: 'Message', 
      type: 'textarea', 
      name: 'message', 
      placeholder: 'Your message'
    }
  ]
})

// Handle submission
form.addEventListener('submit', async (e) => {
  e.preventDefault()
  const formData = new FormData(form)
  const data = Object.fromEntries(formData)
  
  await fetch('/api/contact', {
    method: 'POST',
    body: JSON.stringify(data)
  })
  
  // Update form with success message
  form.update({
    formTitle: 'Thank You!',
    formSubtitle: 'We\'ll get back to you soon.',
    fields: [],
    submitText: 'Close'
  })
})

document.body.appendChild(form)
```

### Example 3: Real-time Dashboard

**Template:**
```html
<!-- components/dashboard.html -->
<div class="dashboard">
  <header>
    <h1>Welcome, {{userName}}!</h1>
    <p class="timestamp">Last updated: {{lastUpdate}}</p>
  </header>
  
  <div class="stats-grid">
    {{#each stats}}
      {{> stat-card 
        label=this.label 
        value=this.value 
        change=this.change
        icon=this.icon
      }}
    {{/each}}
  </div>
  
  <div class="recent-activity">
    <h2>Recent Activity</h2>
    <ul class="activity-list">
      {{#each activities}}
        <li class="activity-item {{this.type}}">
          <span class="time">{{this.time}}</span>
          <span class="action">{{this.action}}</span>
        </li>
      {{/each}}
    </ul>
  </div>
</div>
```

**JavaScript:**
```javascript
import Dashboard from './components/dashboard.html'

// Initial render
const dashboard = Dashboard({
  userName: 'Loading...',
  lastUpdate: new Date().toLocaleTimeString(),
  stats: [],
  activities: []
})

document.body.appendChild(dashboard)

// Fetch and update data
async function refreshDashboard() {
  const data = await fetch('/api/dashboard').then(r => r.json())
  
  dashboard.update({
    userName: data.userName,
    lastUpdate: new Date().toLocaleTimeString(),
    stats: [
      { label: 'Revenue', value: data.revenue, change: '+12%', icon: '💰' },
      { label: 'Users', value: data.users, change: '+5%', icon: '👥' },
      { label: 'Orders', value: data.orders, change: '-2%', icon: '📦' }
    ],
    activities: data.recentActivities
  })
}

// Refresh every 10 seconds
setInterval(refreshDashboard, 10000)
refreshDashboard() // Initial load
```

### Example 4: Todo List with State Management

**Template:**
```html
<!-- components/todo-list.html -->
<div class="todo-app">
  <h1>{{title}}</h1>
  
  <div class="todo-input">
    <input type="text" id="new-todo" placeholder="Add a new task...">
    {{> button text="Add" class="primary add-btn"}}
  </div>
  
  <div class="todo-stats">
    <span>Total: {{totalCount}}</span>
    <span>Active: {{activeCount}}</span>
    <span>Completed: {{completedCount}}</span>
  </div>
  
  <ul class="todo-items">
    {{#each todos}}
      <li class="todo-item {{#if this.completed}}completed{{/if}}">
        <input type="checkbox" {{#if this.completed}}checked{{/if}}>
        <span>{{this.text}}</span>
        <button class="delete">×</button>
      </li>
    {{/each}}
  </ul>
</div>
```

**JavaScript:**
```javascript
import TodoList from './components/todo-list.html'

// State
let todos = []

// Render function
function renderTodos() {
  const activeCount = todos.filter(t => !t.completed).length
  const completedCount = todos.filter(t => t.completed).length
  
  todoList.update({
    title: 'My Tasks',
    todos: todos,
    totalCount: todos.length,
    activeCount: activeCount,
    completedCount: completedCount
  })
}

// Create component
const todoList = TodoList({
  title: 'My Tasks',
  todos: [],
  totalCount: 0,
  activeCount: 0,
  completedCount: 0
})

// Event handlers
todoList.querySelector('.add-btn').addEventListener('click', () => {
  const input = todoList.querySelector('#new-todo')
  if (input.value.trim()) {
    todos.push({
      id: Date.now(),
      text: input.value.trim(),
      completed: false
    })
    input.value = ''
    renderTodos()
  }
})

todoList.addEventListener('change', (e) => {
  if (e.target.type === 'checkbox') {
    const index = [...e.target.closest('ul').children].indexOf(e.target.closest('li'))
    todos[index].completed = e.target.checked
    renderTodos()
  }
})

todoList.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete')) {
    const index = [...e.target.closest('ul').children].indexOf(e.target.closest('li'))
    todos.splice(index, 1)
    renderTodos()
  }
})

document.body.appendChild(todoList)
```

---

## 🤝 Working with vite-plugin-handlebars

Hulak works perfectly alongside `vite-plugin-handlebars` for the best of both worlds:

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import handlebars from 'vite-plugin-handlebars'
import { hulakPlugins } from 'vite-plugin-hulak-tools'

export default defineConfig({
  plugins: [
    // For multi-page static generation
    handlebars({
      partialDirectory: resolve(__dirname, './src/partials'),
    }),
    
    // For importing templates into JS
    hulakPlugins({
      enableHandlebars: true,
      handlebarsOptions: {
        partialDirectory: './src/components'
      }
    })
  ]
})
```

**You get:**
- ✅ **Static HTML pages** via `vite-plugin-handlebars`
- ✅ **Reactive JS components** via `hulakPlugins`
- ✅ **Perfect integration** - Use both in the same project

---

## 🎯 Key Features

- ✨ **Import HTML as JavaScript** - No more template strings in code
- 🔄 **Reactive updates** - Update props and automatically re-render
- 🎨 **DOM element methods** - `.render()`, `.update()`, `.toString()`
- 🧩 **Partials support** - Reusable sub-components with parameters
- 🔧 **Full Handlebars syntax** - Conditionals, loops, variables
- 📦 **Zero runtime** - No Handlebars library in production bundle
- ⚡ **Compile-time processing** - All logic resolved during build
- 🎭 **TypeScript support** - Full type definitions included
- 🤝 **Works with vite-plugin-handlebars** - Perfect companion
- 🚀 **Production ready** - Optimized builds with minimal overhead

---

## 🎓 Best Practices

### 1. Organize by Feature

```
src/
  components/
    common/
      button.html
      icon.html
      badge.html
    forms/
      input.html
      select.html
      textarea.html
    cards/
      product-card.html
      user-card.html
      stat-card.html
```

### 2. Use Descriptive Prop Names

```javascript
// Good ✅
ProductCard({ 
  productName: 'Laptop', 
  productPrice: 999,
  productImage: '/laptop.jpg'
})

// Avoid ❌
ProductCard({ 
  n: 'Laptop', 
  p: 999,
  i: '/laptop.jpg'
})
```

### 3. Keep Templates Focused

```html
<!-- Good ✅ - Single responsibility -->
<!-- button.html -->
<button class="btn {{class}}">
  {{text}}
</button>

<!-- Avoid ❌ - Too complex -->
<!-- mega-component.html -->
<div>
  <!-- 100+ lines of mixed logic -->
</div>
```

### 4. Leverage Partials

```html
<!-- Good ✅ - Reusable components -->
<div class="page">
  {{> header}}
  {{> navigation}}
  {{> content}}
  {{> footer}}
</div>

<!-- Avoid ❌ - Duplicated code -->
<div class="page">
  <header>...</header> <!-- Repeated in every page -->
  <nav>...</nav>
  <main>...</main>
  <footer>...</footer>
</div>
```

### 5. Use Semantic Naming

```html
<!-- Good ✅ -->
<div class="user-profile">
  <h2 class="user-profile__name">{{name}}</h2>
  <p class="user-profile__bio">{{bio}}</p>
</div>

<!-- Avoid ❌ -->
<div class="up">
  <h2 class="n">{{name}}</h2>
  <p class="b">{{bio}}</p>
</div>
```

---

## 🛠️ TypeScript Support

Full TypeScript definitions are included:

```typescript
interface HulakPluginConfig {
  mode?: 'javascript' | 'typescript' | 'js' | 'ts'
  enableHandlebars?: boolean
  handlebarsOptions?: {
    partialDirectory?: string
  }
}

interface ReactiveComponent extends HTMLElement {
  update(newProps: Record<string, any>): HTMLElement
  render(target: HTMLElement): HTMLElement
  toString(): string
}
```

**Usage in TypeScript:**

```typescript
import { hulakPlugins } from 'vite-plugin-hulak-tools'
import type { HulakPluginConfig } from 'vite-plugin-hulak-tools'

const config: HulakPluginConfig = {
  mode: 'typescript',
  enableHandlebars: true,
  handlebarsOptions: {
    partialDirectory: './src/components'
  }
}

export default defineConfig({
  plugins: [hulakPlugins(config)]
})
```

---

## 🐛 Troubleshooting

### Components Not Updating

Make sure you're calling `.update()` with a new object:

```javascript
// ❌ Wrong - mutating object
const props = { count: 0 }
component.update(props)
props.count = 1 // Won't trigger update

// ✅ Correct - new object
component.update({ count: 1 })
```

### Partials Not Found

Ensure `partialDirectory` points to the correct path:

```javascript
hulakPlugins({
  enableHandlebars: true,
  handlebarsOptions: {
    partialDirectory: './src/components' // Relative to project root
  }
})
```

### TypeScript Errors on Import

Add `.html` to your TypeScript config:

```json
// tsconfig.json
{
  "compilerOptions": {
    "types": ["vite/client"],
    "moduleResolution": "bundler"
  }
}
```

Or create a declaration file:

```typescript
// src/types/html.d.ts
declare module '*.html' {
  const component: (props: any) => HTMLElement & {
    update(newProps: any): HTMLElement
    render(target: HTMLElement): HTMLElement
    toString(): string
  }
  export default component
}
```

---

## 📋 Migration Guide

### From Version 2.x to 3.0

Version 3.0 focuses exclusively on Handlebars functionality. Router and LoaderPage plugins have been removed.

**Before (v2.x):**
```javascript
hulakPlugins({
  enableLoaderPage: true,    // ❌ Removed
  enableRouter: true,         // ❌ Removed
  enableHandlebars: true,
  handlebarsOptions: { ... },
  routerOptions: { ... }      // ❌ Removed
})
```

**After (v3.0):**
```javascript
hulakPlugins({
  mode: 'javascript',         // ✅ New option
  enableHandlebars: true,
  handlebarsOptions: { ... }
})
```

**Changes:**
- ✅ Added `mode` option for JavaScript/TypeScript output
- ❌ Removed `enableLoaderPage` option
- ❌ Removed `enableRouter` option
- ❌ Removed `routerOptions` configuration
- ✅ Simplified API focused on core functionality

---

## 📄 License

MIT

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📧 Support

If you have questions or need help:

- 📖 [Documentation](https://github.com/your-repo)
- 🐛 [Issue Tracker](https://github.com/your-repo/issues)
- 💬 [Discussions](https://github.com/your-repo/discussions)

---

## 🌟 Show Your Support

If this plugin helped you, please give it a ⭐️ on GitHub!

---

Made with ❤️ for the Vite community