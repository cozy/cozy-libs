The `Viewer` component can be used to display the content of various file types.

Once rendered, the `Viewer` will take up all the available space in it's container (using `position: absolute`).

The `Viewer` can display an **information panel** to show additional information about the current file (e.g. whether a file is certified).

### ⚠️ Requirement

- You must have [WebviewIntent Provider](https://github.com/cozy/cozy-libs/blob/b1ad6f5933b463878f641d9fbb63eddd4c45b0d0/packages/cozy-intent/src/view/components/WebviewIntentProvider.tsx#L89) & [CozySharing Provider](https://github.com/cozy/cozy-libs/tree/master/packages/cozy-sharing)
- In order to download and display the files, it will need a `cozy-client` instance in the React context.

### Props

- **files** : `<array>` – One or more `io.cozy.files` to display
- **currentIndex** : `<number>` – Index of the file to show
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

### Demo

```jsx
import cx from 'classnames'
import { makeStyles } from 'cozy-ui/transpiled/react/styles'
import Variants from 'cozy-ui/docs/components/Variants'
import Card from 'cozy-ui/transpiled/react/Card'
import Checkbox from 'cozy-ui/transpiled/react/Checkbox'
import Viewer, { ToolbarButtons, FooterActionButtons, ForwardOrDownloadButton } from 'cozy-ui/transpiled/react/Viewer'
import Stack from 'cozy-ui/transpiled/react/Stack'
import Paper from 'cozy-ui/transpiled/react/Paper'
import Typography from 'cozy-ui/transpiled/react/Typography'
import { Media, Img, Bd } from 'cozy-ui/transpiled/react/deprecated/Media'
import Icon from 'cozy-ui/transpiled/react/Icon'
import CarbonCopyIcon from 'cozy-ui/transpiled/react/Icons/CarbonCopy'
// The DemoProvider inserts a fake cozy-client in the React context.
import DemoProvider from './providers/DemoProvider'
import Button from 'cozy-ui/transpiled/react/Buttons'
import DownloadIcon from 'cozy-ui/transpiled/react/Icons/Download'
import ShareIcon from 'cozy-ui/transpiled/react/Icons/Share'
import getPanelBlocks, { panelBlocksSpecs } from 'cozy-ui/transpiled/react/Viewer/Panel/getPanelBlocks'
import Sprite from 'cozy-ui/transpiled/react/Icon/Sprite'
import IconButton from 'cozy-ui/transpiled/react/IconButton'

// We provide a collection of (fake) io.cozy.files to be rendered
const files = [
  {
    _id: 'audio',
    class: 'audio',
    type: 'file',
    name: 'Sample.mp3',
    mime: 'audio/mp3',
    dir_id: 'parent_folder'
  },
  {
    _id: 'slide',
    class: 'slide',
    type: 'file',
    name: 'Slide.pptx',
    mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    dir_id: 'parent_folder'
  },
  {
    _id: 'pdf',
    class: 'pdf',
    type: 'file',
    name: 'My vehicle registration.pdf',
    mime: 'application/pdf',
    bills: { data: [{ amount: '500' }] },
    metadata: {
      carbonCopy: true,
      AObtentionDate: null,
      BObtentionDate: "2022-02-09T09:05:38.000Z",
      CObtentionDate: null,
      DObtentionDate: null,
      datetime: "2022-09-23T07:50:22.000Z",
      datetimeLabel: "BObtentionDate",
      expirationDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      noticePeriod: "90",
      number: "",
      page: "front",
      qualification: {
        label: "driver_license",
        purpose: "attestation",
        sourceCategory: "gov",
        sourceSubCategory: "transport",
        subjects: ["permit", "driving"]
      }
    },
    dir_id: 'parent_folder'
  },
  {
    _id: 'text',
    class: 'text',
    type: 'file',
    name: 'LoremipsumdolorsitametconsecteturadipiscingelitSednonrisusSuspendisselectustortordignissimsitametadipiscingnecultriciesseddolorCraselementumultricesdiamMaecenasligulamassavariusasempercongueeuismodnonmiProinporttitororcinecnonummymolestieenimesteleifendminonfermentumdiamnislsitameteratDuissemperDuisarcumassascelerisquevitaeconsequatinpretiumaenimPellentesquecongueUtinrisusvolutpatliberopharetratemporCrasvestibulumbibendumauguePraesentegestasleoinpedePraesentblanditodioeuenimPellentesquesedduiutaugueblanditsodalesVestibulumanteipsumprimisinfaucibusorciluctusetultricesposuerecubiliaCuraeAliquamnibhMaurisacmaurissedpedepellentesquefermentumMaecenasadipiscingantenondiamsodaleshendrerit.txt',
    mime: 'text/plain',
    metadata: {
      datetime: "2022-01-01T12:00:00.000Z",
      datetimeLabel: "datetime",
      qualification: {
        label: 'tax_notice'
      }
    }
  },
  {
    _id: 'image',
    class: 'image',
    type: 'file',
    name: 'Demo.jpg',
    mime: 'image/jpg',
    metadata: {
      carbonCopy: true,
      electronicSafe: true,
      referencedDate: new Date(Date.now() - 357 * 24 * 60 * 60 * 1000).toISOString(),
      datetimeLabel: "referencedDate",
      qualification: {
        label: 'personal_sporting_licence'
      }
    }
  },
  {
    _id: 'none',
    class: 'unknown',
    type: 'file',
    name: 'Unsupported file type',
    mime: '???/???'
  },
  {
    _id: 'none',
    class: 'unknown',
    type: 'file',
    name: 'Unsupported file type',
    mime: '???/???',
    metadata: {
      carbonCopy: true,
      AObtentionDate: null,
      BObtentionDate: "2022-02-09T09:05:38.000Z",
      CObtentionDate: null,
      DObtentionDate: null,
      datetime: "2022-09-23T07:50:22.000Z",
      datetimeLabel: "BObtentionDate",
      number: "",
      page: "front",
      qualification: {
        label: "driver_license",
        purpose: "attestation",
        sourceCategory: "gov",
        sourceSubCategory: "transport",
        subjects: ["permit", "driving"]
      }
    }
  }
]

const ShareButtonFake = () => {
  return (
    <Button
      label="Share"
      className="u-w-100 u-ml-0 u-mr-0"
      variant="secondary"
      startIcon={<Icon icon={ShareIcon} />}
      onClick={() => {
        return alert("This is a demo, there's no actual Cozy to share the file from ¯\\_(ツ)_/¯")
      }}
    />
  )
}

// The host app will usually need a small wrapper to display the Viewer. This is a very small example of such a wrapper that handles opening, closing, and navigating between files.
initialState = {
  viewerOpened: isTesting(),
  currentIndex: 0,
  showToolbarCloseButton: true,
  showToolbarWithPath: false
}

const initialVariants = [
  { navigation: true, toolbar: true, onlyOfficeEnabled: true, disableModal: false, isPublic: false }
]

const toggleViewer = () => setState({ viewerOpened: !state.viewerOpened })
const handleToggleToolbarClose = () => setState({ showToolbarCloseButton: !state.showToolbarCloseButton })
const handleToggleToolbarWithPath = () => setState({ showToolbarWithPath: !state.showToolbarWithPath })
const onFileChange = (file, nextIndex) => setState({ currentIndex: nextIndex })

;

<DemoProvider>
  <Variants initialVariants={initialVariants}>{
      variant => (
        <>
          {variant.toolbar && (
            <Card className="u-mb-1">
              <div className="u-dib u-mr-1">Toolbar props :</div>
              <Checkbox
                className="u-dib"
                label="Close"
                checked={state.showToolbarCloseButton}
                onChange={handleToggleToolbarClose}
              />
              <Checkbox
                className="u-dib"
                label="Show path"
                checked={state.showToolbarWithPath}
                onChange={handleToggleToolbarWithPath}
              />
            </Card>
          )}
          <Button label="Open viewer" variant="ghost" size="small" onClick={toggleViewer} />
          {state.viewerOpened && (
            <Viewer
              files={files}
              isPublic={variant.isPublic}
              currentIndex={state.currentIndex}
              disableModal={variant.disableModal}
              showNavigation={variant.navigation}
              onCloseRequest={toggleViewer}
              onChangeRequest={onFileChange}
              componentsProps={{
                OnlyOfficeViewer: {
                  isEnabled: variant.onlyOfficeEnabled,
                  opener: () => alert('This is a demo, no Only Office opener here')
                },
                toolbarProps:{
                  showToolbar: variant.toolbar,
                  showClose: state.showToolbarCloseButton,
                  showFilePath: state.showToolbarWithPath
                }
              }}
            >
              <ToolbarButtons>
                <IconButton
                  className="u-white"
                  aria-label="Share"
                  onClick={() => alert("Click Share toolbar button")}
                >
                  <Icon icon={ShareIcon} />
                </IconButton>
                <IconButton
                  className="u-white"
                  aria-label="Carbon Copy"
                  onClick={() => alert("Click CarbonCopy toolbar button")}
                >
                  <Icon icon={CarbonCopyIcon} />
                </IconButton>
              </ToolbarButtons>
              <FooterActionButtons>
                <ShareButtonFake />
                <ForwardOrDownloadButton />
              </FooterActionButtons>
            </Viewer>
          )}
        </>
      )
    }
  </Variants>
  <Sprite />
</DemoProvider>
```

### Using a worker for pdfjs

The PDF viewer relies on [react-pdf](https://github.com/wojtekmaj/react-pdf), which needs the pdf.js worker to be configured by your application, once, before a PDF is shown:

```js static
import { pdfjs } from 'react-pdf'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/legacy/build/pdf.worker.min.mjs',
  import.meta.url
).toString()
```

With Webpack 5 or Rspack, also add this configuration:

```js static
resolve: {
  alias: {
    'react-pdf$': 'react-pdf/dist/esm/index.js',
    'pdfjs-dist$': 'pdfjs-dist/legacy/build/pdf.mjs'
  }
},
module: {
  rules: [
    { test: /react-pdf[\\/]dist[\\/]esm[\\/]index\.js$/, sideEffects: true }
  ]
}
```

- react-pdf resets `workerSrc` to `'pdf.worker.mjs'` when it loads. cozy-viewer requires its CommonJS build while your app imports the ESM one: the `react-pdf$` alias keeps a single build, so it cannot load again after your setup.
- react-pdf declares no side effects, so the bundler may skip its index when you import `pdfjs` and run it later. The `sideEffects` rule runs it first.
- The `legacy` build of pdf.js supports browsers without `Promise.withResolvers` (iOS and Safari before 17.4), in the main thread and in the worker.

The worker is emitted as an asset. If the viewer is used on a public page, make sure it is written to a folder served by the stack without authentication (for example with `output.assetModuleFilename: 'static/resource/[hash][ext][query]'`).

### Only works with React

The `Viewer` can be used only in a `React` Application. You can't use it with `Preact`.
