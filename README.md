# 🚀 Inertia IntelliSense

![Inertia IntelliSense Logo](https://raw.githubusercontent.com/inertiajs/inertia/master/.github/LOGO.png)

**Supercharge your Inertia.js development experience in VS Code**

[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/jaush-m.inertia-intellisense?color=374151&label=VS%20Code%20Marketplace&labelColor=000&logo=visual-studio-code&logoColor=0098FF&style=for-the-badge)](https://marketplace.visualstudio.com/items?itemName=jaush-m.inertia-intellisense)
[![Open VSX Registry](https://img.shields.io/visual-studio-marketplace/v/jaush-m.inertia-intellisense?color=374151&label=Open%20VSX%20Registry&labelColor=000&logo=data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB2aWV3Qm94PSI0LjYgNSA5Ni4yIDEyMi43IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxwYXRoIGQ9Ik0zMCA0NC4yTDUyLjYgNUg3LjN6TTQuNiA4OC41aDQ1LjNMMjcuMiA0OS40em01MSAwbDIyLjYgMzkuMiAyMi42LTM5LjJ6IiBmaWxsPSIjYzE2MGVmIi8+CiAgPHBhdGggZD0iTTUyLjYgNUwzMCA0NC4yaDQ1LjJ6TTI3LjIgNDkuNGwyMi43IDM5LjEgMjIuNi0zOS4xem01MSAwTDU1LjYgODguNWg0NS4yeiIgZmlsbD0iI2E2MGVlNSIvPgo8L3N2Zz4=&logoColor=0098FF&style=for-the-badge)](https://open-vsx.org/extension/jaush-m/inertia)

## ✨ Features

<table>
  <tr>
    <td width="50%">
      <h3 align="center">📌 Intelligent Hyperlinks</h3>
      <p align="center">
        Jump directly to component files with clickable links<br>
        <em>No more manual searches through directories!</em>
      </p>
    </td>
    <td width="50%">
      <h3 align="center">⚡ Smart Autocompletion</h3>
      <p align="center">
        Domain-aware component suggestions as you type<br>
        <em>Complete the right component name every time</em>
      </p>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3 align="center">🧩 Domain Support</h3>
      <p align="center">
        Navigate modular architectures with ease<br>
        <em>Perfect for domain-driven design approaches</em>
      </p>
    </td>
    <td width="50%">
      <h3 align="center">🔧 Highly Configurable</h3>
      <p align="center">
        Adapt to any project structure or convention<br>
        <em>Works with your preferred setup</em>
      </p>
    </td>
  </tr>
</table>

## 📦 Installation

```bash
# Via VS Code UI
# Search for "Inertia IntelliSense" in Extensions view

# Or via command line
code --install-extension jaush-m.inertia-intellisense
```

## 🛠️ Configuration

### Component Groups

Defines how the extension should locate and identify your Inertia components.

```jsonc
"inertia.componentGroups": [
  {
    "glob": "resources/js/domains/*/pages/**/*.tsx",  // Where to find components
    "domainDir": "domains",                          // Domain directory identifier
    "pagesDir": "pages"                              // Pages subdirectory
  }
]
```

### Directory Structure Example

```
resources/js/
├── domains/
│   ├── admin/
│   │   └── pages/
│   │       ├── dashboard.tsx    // [admin]::dashboard
│   │       └── users.tsx        // [admin]::users
│   ├── user/
│   │   └── pages/
│   │       ├── profile.tsx      // [user]::profile
│   │       └── settings.tsx     // [user]::settings
│   └── main/
│   │   └── pages/
│   │       └── welcome.tsx      // welcome or [main]::welcome
│
```

### ⚙️ Additional Settings

| ⚙️ Setting | 📝 Purpose | 🔧 Default |
|------------|------------|------------|
| `inertia.defaultDomain` | Domain to use when not specified explicitly | `"main"` |
| `inertia.domainSeparator` | The separator between domain and component path<br>***Must match your Inertia setup*** | `"::"` |
| `inertia.domainDelimiters` | Array of delimiters used to wrap domain names in component strings | `[{start: "[", end: "]"}]` |
| `inertia.pathSeparators` | Symbols that separate path segments within components | `["."]` |
| `inertia.defaultExtension` | File extension for new components<br>*Adapt for React (.tsx), Vue (.vue), etc.* | `".tsx"` |

## 🔍 Usage Examples

### In PHP Files

```php
// Clickable link + autocompletion for:
return Inertia::render('[Admin]::Dashboard', [
    'stats' => $dashboardStats,
]);
```

### React Setup with Domains

```tsx
import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";

createInertiaApp({
  // This pattern works with the default configuration
  resolve: (name) =>
    resolvePageComponent(
      name,
      import.meta.glob("../domains/*/pages/**/*.tsx", { eager: false })
    ),
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />);
  },
});
```

## 🔄 Component Resolution Examples

| Component Name       | Resolves To                                      |
| -------------------- | ------------------------------------------------ |
| `[admin]::dashboard` | `resources/js/domains/admin/pages/dashboard.tsx` |
| `[user]::profile`    | `resources/js/domains/user/pages/profile.tsx`    |
| `welcome`            | `resources/js/domains/main/pages/welcome.tsx`    |

## License

Released under the [MIT License](./LICENSE.md).

---

<div align="center">
  <p>
    <a href="https://github.com/jaush-m/inertia-intellisense">GitHub Repository</a> •
    <a href="https://github.com/jaush-m/inertia-intellisense/issues">Report Issue</a> •
    <a href="https://inertiajs.com/">Inertia.js</a>
  </p>
</div>
