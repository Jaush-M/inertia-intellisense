# Visual Studio Code extension for Inertia.js

[![](https://img.shields.io/visual-studio-marketplace/v/jaush-m.inertia-intellisense?color=374151&label=Visual%20Studio%20Marketplace&labelColor=000&logo=visual-studio-code&logoColor=0098FF)](https://marketplace.visualstudio.com/items?itemName=jaush-m.inertia-intellisense)
[![](https://img.shields.io/visual-studio-marketplace/v/jaush-m.inertia-intellisense?color=374151&label=Open%20VSX%20Registry&labelColor=000&logo=data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB2aWV3Qm94PSI0LjYgNSA5Ni4yIDEyMi43IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxwYXRoIGQ9Ik0zMCA0NC4yTDUyLjYgNUg3LjN6TTQuNiA4OC41aDQ1LjNMMjcuMiA0OS40em01MSAwbDIyLjYgMzkuMiAyMi42LTM5LjJ6IiBmaWxsPSIjYzE2MGVmIi8+CiAgPHBhdGggZD0iTTUyLjYgNUwzMCA0NC4yaDQ1LjJ6TTI3LjIgNDkuNGwyMi43IDM5LjEgMjIuNi0zOS4xem01MSAwTDU1LjYgODguNWg0NS4yeiIgZmlsbD0iI2E2MGVlNSIvPgo8L3N2Zz4=&logoColor=0098FF)](https://open-vsx.org/extension/jaush-m/inertia)

This extension brings Inertia.js support to Visual Studio Code.

## Features

- Hyperlinks
- Autocompletion

## Configuration

### `inertia.pages`

The `inertia.pages` setting must be a glob pattern that matches the components
that should appear in the auto-completion dialog. This pattern is resolved
relative to your workspace's root folder.

The extension also uses this pattern to determine the root folder of your
components, which in turn is used to generate the hyperlinks to your page
components.

Here a some common patterns for different project types:

| Project type    | Pattern                       |
| --------------- | ----------------------------- |
| Laravel + React | `resources/js/pages/**/*.tsx` |
| Laravel + Vue   | `resources/js/pages/**/*.vue` |

### `inertia.pathSeparators`

Inertia.js commonly uses a forward slash when it comes to component names
because it naturally follows the filesystem structure, but while the components
will eventually have to be resolved to a filesystem path, nothing prevents you
from using different path separators inside the inertia methods.

#### Component resolution

This setting allows you to define a list of path separators that the extension
should handle when resolving components paths on click, and during
autocompletion. This setting only affects how the extension, and you will have
to change the way component resolution works in your Inertia.js application in
order to replaces those characters by a forward slash `/`.

Here's an example snippet that handles components paths written with
dot-notation.

```js
import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: (name) =>
    resolvePageComponent(
      name,
      import.meta.glob("../domains/*/pages/**/*.tsx", { eager: false })
    ),
  setup({ el, App, props }) {
    const root = createRoot(el);

    root.render(<App {...props} />);
  },
  progress: {
    color: "#4B5563",
  },
});
```

#### Autocompletion

During autocompletion, the first separator will be used when rendering the list
of components, so you should put your preferred path separator first.

### `inertia.defaultExtension`

When the extension generates hyperlinks to components that do not yet exist on
the filesystem, it cannot guess which file extension to use because the glob
pattern declared in `inertia.pages` may contain multiple file extensions. The
extension uses this setting to creates hyperlinks with the correct file
extension.

| Project type | Pattern |
| ------------ | ------- |
| React        | `.tsx`  |
| Vue          | `.vue`  |

# License

This VS Code extension is open source software released under the
[MIT License](./LICENSE.md).
