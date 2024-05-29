# Attributes of the `papersDefinitions`:

*Properties surrounded by `[]` are optional.*

- `papersDefinitions`: {object\[]} Contains all possible paper definitions.

  - `label`: {string} Equal a label of [qualification](https://github.com/cozy/cozy-client/blob/master/packages/cozy-client/src/assets/qualifications.json).
  - `icon`: {string} Name of the [icon](https://docs.cozy.io/cozy-ui/react/#!/Icon/11) to use in the suggestion display (placeholder).
  - `[placeholderIndex]`: {number} Presence and position in suggestion (without filter), see [here](./placeholderIndex) for more information.
  - `[featureDate]`: {string} Date to be highlighted, when several date steps are present.
  - *`[filenameModel]`: {string\[]} Allows to build the final name of the paper.*
    - *The accepted values are:*
      - *`label`: Reference to the qualification label.*
      - *`featureDate`: Reference to the highlighted date.*
      - *`contactName`: Reference to the names of contacts referenced on the paper.*
      - *`name`: Value of the attribute present in the [`information`](#information-field-attributes) step.*
      - *`labelGivenByUser`: Value of the attribute present in the [`information`](#information-field-attributes) step.*
  - `maxDisplay`: {number} Specifies the number of this type of paper to be displayed once created.
  - `[konnectorCriteria]`: {object} Allows to propose the installation of a konnector before the steps of creation of a paper.
    - - *Only one of the following properties is accepted:*
      - `name`: {string} Name of the konnector.
      - `category`: {string} Konnector category.
      - `qualificationLabel`: {string} Label of the konnector qualification
  - [`acquisitionSteps`](#steps-of-the-acquisitionsteps-property): {object\[]} Contains the steps of the creation process.
    - [`scan`](#step-scan) {object} Step to select a file (image/pdf).
    - [`[information]`](#step-information) {object} Step to get more informations about this file.
    - [`contact`](#step-contact) {object} Step to select one or more contacts linked to this file.
    - [`note`](#step-note) {object} Step to add / edit a note.
  - `[ocrAttributes]`: {object\[]} Contains all the parameters necessary for the OCR process.

***

## The `ocrAttributes` property:

This is an array containing information for OCR attributes detection. For instance, recognize a passport number,
an expiration date, etc.

Each version of a paper is an element in the `ocrAttributes` attribute. When there are several versions, each entry must have a `version` attribute.

Some papers have 2 sides: front and back. Each side is a dedicated object in the OCR definition.
The `front` and `back` entries have exactly the same structure and attributes.

- `version`: {string} Version of the paper (e.g. "2020.01").
- `ìllustration`: {string} Illustration of the choice of format displayed to the user.
- `versionLabel`: {string} Translation key for the name of the format displayed to the user.
  - `label`: {string} The discriminating label.
  - `side`: {string} Side where the label is.
- `front|back`: {object} All the front panel parameters allowing you to find the information to use.
  - `referenceRules`: {object\[]} Rules that allow you to define the version of a paper.
    - `regex`: {string} Regex that will be tested to deduce the paper version. (e.g. "^\[A-Z]")
    - `[flag]`: {string} Regex flag (e.g. "/gi")
  - `attributesRegex`: {Array<object>} Used to find attributes based on regex rules
  - `attributesBoxes`: {Array<object>} Used to find attributes based on bouding box coordinates

## Steps of the `acquisitionSteps` property:

- ### Step `scan`:
  - `model`: {string} Model used for the step (`scan`).
  - `[tooltip]`: {boolean} Allows to display a tooltip to help the user.
  - `[multipage]`: {boolean} Allows to add as many files as the user wants.
  - `illustration`: {string} Name of the illustration used on the step (with extension).
  - `text`: {string} Translation key for the text of the step.
  - `[isDisplayed]`: {`ocr`|`all`} Determine if the step should be shown.

<br>

- ### Step `information`:
  - `model`: {string} Model used for the step (`information`).
  - `illustration`: {string|boolean} Name of the illustration used on the step (with extension). If false, no illustration will be displayed even the fallback
  - `[illustrationSize]`: {`small`|`medium`|`large`}(`4rem`|`6rem`|`8rem`) Size of the illustration (default `medium`)
  - `text`: {string} Translation key for the text of the step.
  - `doctype`: {string} Doctype to store the attributes value. Use `io.cozy.files` by default.
  - `attributes`: {object} Type of fields.
    - [`text|number`](#information-field-attributes) : {object} Fields used to fill in more information about the paper.
    - [`date`](#information-field-attributes): {object} Fields used to enter a date (reference, expiration date, etc).
    - [`radio`](#information-field-attributes): {object} Fields used to enter a radio list.
    - [`contact`](#information-field-attributes): {object} Fields used to select a contact.
    - `country`: {string} Displays a list of nationalities with search fields.
  - `[isDisplayed]`: {`ocr`|`all`} Determine if the step should be shown.

<br>

- ### Step `contact`:
  - `model`: {string} Model used for the step (`contact`).
  - `text`: {string} Translation key for the text of the step.
  - `[multiple]`: {boolean} Allows you to add multiple contacts.
  - `[isDisplayed]`: {`ocr`|`all`} Determine if the step should be shown.

<br>

- ### Step `note`:
  - `model`: {string} Model used for the step (`note`)
  - `[isDisplayed]`: {`ocr`|`all`} Determine if the step should be shown.

***

## Manage the display of informations

The `isDisplayed` property manages the display of steps. Its different values display the step according to the context:

- `ocr` displayes the step when OCR is activated
- `undefined` always shows the step
- `all` displayes the step in any case

## Information field attributes:

- Properties of the object to define a field of type `text|number`:
  - `name`: {string} Used for `filenameModel` attributes
  - `inputLabel`: {string} Translation key for the label
  - `[editText]`: {string} Translation used as title in edition modal. The step text is used by default.
  - `[type]`: {`text`|`number`|`contact`} Type of field (if no mask)
  - `[defaultValue]`: {string|number} Default field value
  - `[adornment]`: {`start`|`end`} Add a text as a prefix or suffix
    - `[start]`: {string} Add a text as a prefix
    - `[end]`: {string} Add a text as a suffix
  - `[required]`: {boolean} Make the field mandatory
  - `[minLength]`: {number} Requires a minimum number of characters
  - `[maxLength]`: {number} Requires a maximum number of characters
  - `[mask]`: {string} Formats and forces a type (see [here](https://github.com/sanniassin/react-input-mask#properties) for more details)
    - Varation with the `mask` attribute:
      - `[required]`: {boolean} Make all Mask mandatory (**high priority**)
      - `[minLength]`: {number} Requires a minimum number of characters
      - `[maxLength]`: {number} Ignored, always the length of the Mask
  - `[placeholderMask]`: {string} Choice of placeholder for the mask (default `ˍ`)

<br>

- Properties of the object to define a field of type `date`:
  - `name`: {string} Used for `featureDate` attribute
  - `inputLabel`: {boolean} Translation key for the label
  - `[type]`: {`date`} Type of field

<br>

- Properties of the object to define a field of type `radio`:
  - `options`: {string\[]} Option values

## List of compatible paper with OCR :

- `bank_details`
- `national_id_card` with `country: "fr"`
- `driver_license` with `country: "fr"`
- `residence_permit`
- `passport`
