# Hulak Plugins

A collection of powerful Vite plugins designed to enhance your development workflow with loader page blocking and Handlebars template processing capabilities.

## 📦 Installation

```bash
npm install hulak-plugins --save-dev
# or
yarn add hulak-plugins -D
# or
pnpm add hulak-plugins -D
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
Processes Handlebars templates with support for partials and custom configurations.

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
| `partialDirectory` | `string` | - | Path to the directory containing Handlebars partials |

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

### Enable Only Handlebars

```javascript
import { hulakPlugins } from 'hulak-plugins'

export default {
  plugins: [
    hulakPlugins({
      enableHandlebars: true,
      handlebarsOptions: {
        partialDirectory: './src/templates/partials'
      }
    })
  ]
}
```

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
