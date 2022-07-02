The `papersDefinitions.json` file is the configuration file that controls part of the display and all the creation of a paper.

Let's see how it is built:

*Properties surrounded by `[]` are optional.*

- `papersDefinitions`: {object[]} Contains all possible paper definitions.

  - `label`: {string} Equal a label of [qualification](https://github.com/cozy/cozy-client/blob/master/packages/cozy-client/src/assets/qualifications.json).
  - `icon`: {string} Name of the [icon](https://docs.cozy.io/cozy-ui/react/#!/Icon/11) to use in the suggestion display (placeholder).
  - `[placeholderIndex]`: {number} Presence and position in suggestion (without filter).
  - `[featureDate]`: {string} Date to be highlighted, when several date steps are present.
  - *`[filenameModel]`: {string[]} Allows to structure the final name of the paper.*
    - *The accepted values are:*
      - *`label`: Reference to the qualification label.*
      - *`featureDate`: Reference to the highlighted date.*
      - *`contactName`: Reference to the names of contacts referenced on the paper.*
      - *`name`: Value of the attribute present in the [`information`](#information-field-attributes) step.*
  - `maxDisplay`: {number} Specifies the number of this type of paper to be displayed once created.
  - `connectorCriteria`: {object} Allows to propose the installation of a connector before the steps of creation of a paper.
    - `[name]`: {string} Name of the connector.
    - `[category]`: {string} Connector category.
  - [`acquisitionSteps`](#steps-of-the-acquisitionsteps-property): {object[]} Contains the steps of the creation process.
    - [`scan`](#step-scan) {object} Step to select a file (image/pdf).
    - [`[information]`](#step-information) {object} Step to get more informations about this file.
    - [`owner`](step-owner) {object} Step to select one or more contacts linked to this file.

___

## Steps of the `acquisitionSteps` property:

- ### Step `scan`:
  - `stepIndex`: {number} Position of the step.
  - `model`: {string} Model used for the step (`scan`).
  - `[multipage]`: {boolean} Allows to add as many files as the user wants.
  - `illustration`: {string} Name of the illustration used on the step (with extension).
  - `text`: {string} Translation key for the text of the step.

<br>

- ### Step `information`:
  - `stepIndex`: {number} Position of the step.
  - `model`: {string} Model used for the step (`information`).
  - `illustration`: {string} Name of the illustration used on the step (with extension).
  - `text`: {string} Translation key for the text of the step.
  - `attributes`: {object} Type of fields.
    - [`text|number`](#information-field-attributes) : {object} Fields used to fill in more information about the paper.
    - [`date`](#information-field-attributes): {object} Fields used to enter a date (reference, expiration date, etc).

<br>

- ### Step `owner`:
  - `stepIndex`: {number} Position of the step.
  - `model`: {string} Model used for the step (`owner`).
  - `text`: {string} Translation key for the text of the step.
  - `[multiple]`: {boolean} Allows you to add multiple contacts.

___

## Information field attributes:

- Properties of the object to define a field of type `text|number`:
  - `name`: {string} Used for `filenameModel` attributes
  - `inputLabel`: {string} Translation key for the label
  - `[type]`: {`text`|`number`} Type of field (if no mask)
  - `[required]`: {boolean} Make the field mandatory
  - `[minLength]`: {number} Requires a minimum number of characters
  - `[maxLength]`: {number} Requires a maximum number of characters
  - `[mask]`: {string} Formats and forces a type
  - `[placeholderMask]`: {string} Choice of placeholder for the mask (default `_`)

<br>

- Properties of the object to define a field of type `date`:
  - `name`: {string} Used for `featureDate` attribute
  - `inputLabel`: {boolean} Translation key for the label
  - `[type]`: {`date`} Type of field
