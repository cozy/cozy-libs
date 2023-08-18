# How to add a new paper:

- First, get familiar with [papersDefinitions](./papersDefinitions) doc to be sure to understand correctly how it is built, and how to construct your new paper.

- If you need to create or modify a qualification label, it must be done before on [cozy-client](https://github.com/cozy/cozy-client/blob/master/packages/cozy-client/src/assets/qualifications.json).

- All non-optional properties must be filled in.

- For the `illustration` property in [`acquisitionsteps property`](./papersDefinitions#steps-of-the-acquisitionsteps-property), you must import it and add it to the `images` variable of the [`CompositeHeaderImage`](https://github.com/cozy/cozy-libs/blob/master/packages/cozy-mespapiers-lib/src/components/CompositeHeader/CompositeHeaderImage.jsx#L34) component.

- If adding a `placeholderIndex`, complete this [documentation](https://github.com/cozy/cozy-libs/blob/master/packages/cozy-mespapiers-lib/doc/placeholderIndex.md) accordingly.

- The `Steps` take place in the order defined in the [`acquisitionsteps property`](./papersDefinitions#steps-of-the-acquisitionsteps-property).
