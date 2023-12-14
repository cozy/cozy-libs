/**
 * Returns reference rules from ocrAttributes with their side
 * @param {object} ocrAttributes
 * @returns {object[]} reference rules
 */
export const makeReferenceRulesByOcrAttributes = ocrAttributes => {
  return Object.keys(ocrAttributes)
    .filter(attr => /(front|back)/.test(attr))
    .flatMap(
      side =>
        ocrAttributes[side].referenceRules?.map(ref => ({
          ...ref,
          side
        })) || []
    )
}
