# Cozy Viewer

Cozy-Viewer provides a component to show files in a viewer.

## Installation

- You must `import 'cozy-viewer/dist/stylesheet.css'` somewhere in your app
- You must have [WebviewIntent Provider](https://github.com/cozy/cozy-libs/blob/b1ad6f5933b463878f641d9fbb63eddd4c45b0d0/packages/cozy-intent/src/view/components/WebviewIntentProvider.tsx#L89)
- You must have [CozySharing Provider](https://github.com/cozy/cozy-libs/tree/master/packages/cozy-sharing)
- In order to download and display the files, it will need a `cozy-client` instance in the React context.
- To have the panels, the app need to have [cozy-harvest-lib](https://github.com/cozy/cozy-libs/tree/master/packages/cozy-harvest-lib) installed
- See peer dependencies to be sure to not miss anything

## Usage

`import Viewer from 'cozy-viewer'`

## Props

- **files** : `<array>` – One or more `io.cozy.files` to display
- **currentIndex** : `<number>` – Index of the file to show
- **currentURL** : `<string>` – Optionnal URL of the file
- **className** : `<string>` – CSS classes
- **showNavigation** : `<boolean>` – Whether to show left and right arrows to navigate between files
- **renderFallbackExtraContent** : `<function>` – A render prop that is called when a file can't be displayed
- **disablePanel** : `<boolean>` – Show/Hide the panel containing more information about the file only on Desktop
- **disableFooter** : `<boolean>` – Show/Hide the panel containing more information about the file only on Phone & Tablet devices
- **disableModal** : `<boolean>` – To avoid wrapping the Viewer with a Modal component (wrapper of Viewer)
- **onChangeRequest** : `<function>` - Called with (nextFile, nextIndex) when the user requests to navigate to another file
- **onCloseRequest** : `<function>` - Called when the user wants to leave the Viewer
- **isPublic**: `<boolean>` - Whether the viewer is used in a public page or not
- **componentsProps** : `<object>` – Props passed to components with the same name
  - **modalProps** : `<object>` – Props passed to Modal component
  - **OnlyOfficeViewer** : `<object>` – Used to open an Only Office file
    - **isEnabled** : `<boolean>` – Whether Only Office is enabled on the server
    - **opener** : `<function>` – To open the Only Office file
  - **toolbarProps** : `<object>` – Toolbar properties
    - **toolbarRef** : `<object>` – React reference of the toolbar node
    - **showToolbar** : `<boolean>` – Whether to show the toolbar or not. Note that the built-in close button is in the toolbar
    - **showClose** : `<boolean>` – Whether to show close button in toolbar
    - **showFilePath** : `<boolean>` – Whether to show file path below his name
