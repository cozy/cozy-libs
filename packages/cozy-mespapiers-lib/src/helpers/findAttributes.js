import parse from 'date-fns/parse'
import unionBy from 'lodash/unionBy'

import { checkCountryCode } from 'cozy-client/dist/models/countries'
import log from 'cozy-logger'
const MAX_TEXT_SHIFT_THRESHOLD = 5 // in %
const MAX_LINE_SHIFT_THRESHOLD = 5 // in px

const normalizeText = text => {
  // TODO: more normalization might be necessary
  return text
    .normalize('NFD')
    .toUpperCase()
    .replace(/\s/g, '') // remove space
    .replace(/ç/g, 'c')
    .replace(/'/g, '')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
}

/**
 * Remove all spaces from a string
 * @param {string} text - text to remove spaces from
 * @returns {string} text without spaces
 */
const removeSpaces = text => {
  return text.replace(/\s/g, '')
}

/**
 * Compute the euclidean distance between two boxes
 * @param {object} box1 - normalized box
 * @param {object} box2 - template bounding
 * @returns {number} distance between the two boxes
 */
const computeEuclideanDistance = (box1, box2) => {
  let xDist = Math.pow(box1.left - box2.left, 2)
  let yDist = Math.pow(box1.top - box2.top, 2)
  return Math.sqrt(xDist + yDist)
}

/**
 * Compute the euclidean distance between two boxes, using the ratio of the box
 * @param {object} boxBounding - bounding box
 * @param {object} templateBounding - template bounding
 * @param {object} shiftBounding - shift bounding
 * @param {object} imgSize - image size
 * @returns {number} distance between the two boxes
 */
const computeDistanceByBoxRatio = (
  boxBounding,
  templateBounding,
  shiftBounding,
  imgSize
) => {
  const normalizedBox = {
    left: (boxBounding.left - shiftBounding.left) / imgSize.width,
    top: (boxBounding.top - shiftBounding.top) / imgSize.height
  }

  return computeEuclideanDistance(normalizedBox, templateBounding)
}

/**
 * Formatting date
 * @param {object} attribute - attribute to check
 * @param {string} text - text to format
 * @returns {string} date formatted
 */
const transformDate = (attribute, text) => {
  try {
    const defaultDateFormat = 'ddMMyyyy'
    const dateFormat = attribute.dateFormat || defaultDateFormat
    const dateLength = dateFormat.length
    const newText = text.replace(/[.,-/]/g, '')
    const dateRegex = new RegExp(`\\d{${dateLength}}$`)
    const match = newText.match(dateRegex)
    if (!match) {
      return ''
    }
    const localDate = parse(match[0], dateFormat, new Date())
    // Conversion to UTC, to avoid days offset because of timezone
    const date = new Date(
      Date.UTC(
        localDate.getFullYear(),
        localDate.getMonth(),
        localDate.getDate()
      )
    )
    return date.toISOString()
  } catch (err) {
    return ''
  }
}

/**
 * Apply post text processing rules
 * @param {object} attribute - attribute to check
 * @param {string} str - text to process
 * @returns {string} text processed
 */
const postTextProcessingRules = (attribute, str) => {
  let newStr = str
  if (attribute.postTextRules) {
    for (const rule of attribute.postTextRules) {
      if (rule.regex) {
        // Default is removing
        const regExp = new RegExp(rule.regex, rule.flag)
        newStr = newStr.replace(regExp, rule.replace || '')
      }
    }
  }
  newStr = attribute.type === 'date' ? transformDate(attribute, newStr) : newStr

  return newStr
}

/**
 * Apply post processing rules
 * @param {array} attributes - attributes to process
 * @returns {array} attributes processed
 */
const postProcessing = attributes => {
  const textProcessed = attributes.map(attr => {
    return {
      ...attr,
      value: postTextProcessingRules(attr, attr.value)
    }
  })

  const groups = {}
  for (const attr of textProcessed) {
    if (attr.group) {
      if (groups[attr.group.name]) {
        groups[attr.group.name].push(attr)
      } else {
        groups[attr.group.name] = [attr]
      }
    }
  }
  const mergedGroups = []
  for (const group of Object.values(groups)) {
    const sortedGroup = group.sort((a, b) => a.group.order - b.group.order)
    const groupedText = sortedGroup.reduce((acc, attr) => acc + attr.value, '')
    mergedGroups.push({
      ...group[0],
      value: groupedText,
      name: group[0].group.name
    })
  }
  const processed = textProcessed
    .reduce((acc, curr) => {
      if (!curr.group) {
        const attribute = {
          name: curr.name,
          value: curr.value,
          ...(curr.distance && { distance: curr.distance })
        }
        acc.push(attribute)
      }
      return acc
    }, [])
    .concat(mergedGroups)
  return processed
}

/**
 * Find the bounding of the text
 * @param {object[]} OCRResult - OCR result
 * @returns {object} bounding
 */
const findTextBounds = OCRResult => {
  let { left, top } = OCRResult[0].bounding // init
  let bottom = top
  let right = left
  for (const block of OCRResult) {
    if (block.bounding.top < top) {
      top = block.bounding.top
    }
    if (block.bounding.left < left) {
      left = block.bounding.left
    }
    if (block.bounding.top + block.bounding.height > bottom) {
      bottom = block.bounding.top + block.bounding.height
    }
    if (block.bounding.left + block.bounding.width > right) {
      right = block.bounding.left + block.bounding.width
    }
  }
  return { left, top, right, bottom }
}

/**
 * Check if the document is cropped
 * @param {object} paper - OCR attributes
 * @param {object} textBounding - text bounding
 * @param {object} imgSize - image size
 * @returns {boolean} true if the document is cropped
 */
const isDocumentCropped = (paper, textBounding, imgSize) => {
  const shiftBoundingPercent = {
    left: (textBounding.left / imgSize.width) * 100,
    top: (textBounding.top / imgSize.height) * 100
  }
  const shiftAttrBoundingPercent = {
    left: (paper.textBounding.left / paper.size.width) * 100,
    top: (paper.textBounding.top / paper.size.height) * 100
  }
  const leftDiff = Math.abs(
    shiftBoundingPercent.left - shiftAttrBoundingPercent.left
  )
  const topDiff = Math.abs(
    shiftBoundingPercent.top - shiftAttrBoundingPercent.top
  )

  // This threshold is purely arbitrary and open to debate
  if (
    leftDiff < MAX_TEXT_SHIFT_THRESHOLD &&
    topDiff < MAX_TEXT_SHIFT_THRESHOLD
  ) {
    return true
  }
  return false
}

/**
 * Find attributes by box
 * @param {object[]} OCRResult - OCR result
 * @param {object} paper - OCR attributes
 * @param {object} imgSize - image size
 * @returns {object[]} attributes found
 */
const findAttributesByBox = (OCRResult, paper, imgSize) => {
  const attributesToFind = paper.attributesBoxes
    ? paper.attributesBoxes.filter(attr => !(attr.enabled === false))
    : []

  const textShiftBounding = { top: 0, left: 0 }
  const textAreaSize = { ...imgSize }

  let handleNotCentered = false
  const canHandleNotCentered = paper.textBounding ? true : false
  if (canHandleNotCentered) {
    const textBounds = findTextBounds(OCRResult)
    textAreaSize.width = textBounds.right - textBounds.left
    textAreaSize.height = textBounds.bottom - textBounds.top

    const isCropped = isDocumentCropped(paper, textBounds, imgSize)
    handleNotCentered = !isCropped
    if (handleNotCentered) {
      textShiftBounding.left = textBounds.left
      textShiftBounding.top = textBounds.top
    }
  }

  // We apply a different strategy depending on if the doc is correctly cropped or not
  // If the doc is not properly cropped, we use the text bounds to normalize the coordinates
  // However, it is not clear how useful it is, as the tests seem rather satisfying even when
  // applying the text bounds strategy on cropped docs. Furthermore, establishing a "cropped threshold"
  // is not an easy task and might result is false positive/negative...
  // Nevertheless, our intuition is the cropped strategy will achieve better results, so we prefer to
  // keep it like this to avoid potentially degrading the experience when the document is properly cropped.
  // Must that might be challenged in the future.

  const foundAttributes = []

  for (const attr of attributesToFind) {
    const normalizedAttrBouding = { left: 0, top: 0 }
    if (handleNotCentered) {
      normalizedAttrBouding.left =
        (attr.bounding.left - paper.textBounding.left) /
        (paper.textBounding.right - paper.textBounding.left)
      normalizedAttrBouding.top =
        (attr.bounding.top - paper.textBounding.top) /
        (paper.textBounding.bottom - paper.textBounding.top)
    } else {
      normalizedAttrBouding.left = attr.bounding.left / paper.size.width
      normalizedAttrBouding.top = attr.bounding.top / paper.size.height
    }

    let minDistance = 100000
    let matchingEl
    const size = handleNotCentered ? textAreaSize : imgSize

    for (const block of OCRResult) {
      for (const line of block.lines) {
        let cptLineElements = 0
        for (const el of line.elements) {
          let distance
          distance = computeDistanceByBoxRatio(
            el.bounding,
            normalizedAttrBouding,
            textShiftBounding,
            size
          )
          if (distance < minDistance) {
            matchingEl = { ...el }
            minDistance = distance
            if (attr.fullLine && line.elements.length > cptLineElements + 1) {
              // Let's try to find more text on the right
              for (let i = cptLineElements + 1; i < line.elements.length; i++) {
                const nextEl = line.elements[i]
                matchingEl.text += nextEl.text
              }
            }
          }
          cptLineElements++
        }
      }
    }
    if (matchingEl) {
      const isValid = checkValidationRules(attr, matchingEl.text)
      if (isValid) {
        foundAttributes.push({
          ...attr,
          value: matchingEl.text,
          distance: minDistance
        })
      }
    }
  }

  return foundAttributes
}

/**
 * Check if the text matches the validation rules
 * @param {object} attribute - attribute to check
 * @param {string} text - text to check
 * @returns {boolean} true if the text matches the validation rules
 */
const checkValidationRules = (attribute, text) => {
  if (!attribute.validationRules) {
    return true
  }
  if (!text) {
    return false
  }
  let isValid = true
  for (const rule of attribute.validationRules) {
    if (!isValid) {
      return isValid
    }
    if (rule.regex) {
      const regExp = new RegExp(rule.regex, rule.flag)
      isValid = regExp.test(text)
    }
  }
  return isValid
}

/**
 * Get the validation function by name
 * @param {string} name - name of the validation function
 * @returns {function} validation function
 */
const getValidationFnByName = name => {
  switch (name) {
    case 'checkCountryCode':
      return checkCountryCode
    default:
      log('error', 'Unknown validation function', 'getValidationFnByName')
      return null
  }
}

/**
 * Check if the text matches the validation rules
 * @param {object} attribute - attribute to check
 * @param {object} match - result of the regex
 */
const checkValidationRulesFn = (attribute, match) => {
  if (!attribute.validationRules) {
    return true
  }
  let isValid = true
  for (const rule of attribute.validationRules) {
    if (!isValid) {
      return isValid
    }
    if (rule.validationFn) {
      const validationFn = getValidationFnByName(rule.validationFn)
      isValid = validationFn ? validationFn(match[rule.regexGroupIdx]) : false
    }
    if (rule.validationFn) {
      const idx = rule.regexGroupIdx || 0
      let textToValidate = match[idx]
      if (rule.stripChars) {
        for (const regex of rule.stripChars) {
          textToValidate = match[idx].replace(regex, '')
        }
      }
      const validationFn = getValidationFnByName(rule.validationFn)
      isValid = validationFn ? validationFn(textToValidate) : false
    }
  }
  return isValid
}

/**
 * Find the attribute in the text
 * @param {object} searchedAttribute - attribute to find
 * @param {string} text - text to check
 * @returns {object} attribute found
 */
const findAttributeInText = (searchedAttribute, text) => {
  const normalizedText = searchedAttribute.oneWord ? text : removeSpaces(text)
  const regExp = new RegExp(searchedAttribute.regex, searchedAttribute.flag)
  const result = normalizedText.match(regExp)
  if (result?.length > 0) {
    if (searchedAttribute.validationRules?.length > 0) {
      if (!checkValidationRulesFn(searchedAttribute, result)) {
        return null
      }
    }
    return {
      name: searchedAttribute.name,
      value: result[0],
      postTextRules: searchedAttribute.postTextRules,
      type: searchedAttribute.type,
      dateFormat: searchedAttribute.dateFormat
    }
  }
  return null
}

/**
 * In some situations, the matching text will be incomplete, because of
 * how the OCR will split the elements.
 * For instance, the regex on IBAN is not a fixed length, as it can vary up to 34 chars.
 * If the OCR splits the IBAN in several blocks, the left one might be considered as valid,
 * even though some chars are missing.
 * To cope with this, we add this step to try to find the most chars on the right, on the same
 * line, i.e. with the same Y coordinate but with a greater X.
 *
 * @param {object[]} OCRResult - OCR result
 * @param {object} matchingBox - box of the matching text
 * @param {string} matchText - text matched
 * @param {object} searchedAttribute - attribute to find
 * @returns {string} final text matched
 */
const findMatchingTextOnSameLine = (
  OCRResult,
  matchingBox,
  matchText,
  searchedAttribute
) => {
  const top = matchingBox.bounding.top
  const right = matchingBox.bounding.left + matchingBox.bounding.width
  let finalMatchText = matchText
  let rightText = ''
  for (const block of OCRResult) {
    for (const line of block.lines) {
      for (const el of line.elements) {
        if (
          Math.abs(el.bounding.top - top) < MAX_LINE_SHIFT_THRESHOLD &&
          el.bounding.left > right
        ) {
          // find other element on same line, on the right
          rightText += el.text
          const mergedText = matchText + rightText
          if (findAttributeInText(searchedAttribute, mergedText)) {
            finalMatchText = mergedText
          }
        }
      }
    }
  }
  return finalMatchText
}

/**
 * Find the attribute in the element
 * @param {object[]} OCRResult - OCR result
 * @param {object} box - box to check
 * @param {object} searchedAttribute - attribute to find
 * @returns {object} attribute found
 */
const findAttribute = (OCRResult, box, searchedAttribute) => {
  const attr = findAttributeInText(searchedAttribute, box.text)
  if (attr) {
    // Extra step to find splitted text
    const newMatchText = findMatchingTextOnSameLine(
      OCRResult,
      box,
      attr.value,
      searchedAttribute
    )
    attr.value = newMatchText
    return attr
  }
  return null
}

/**
 * Find the attribute in the lines
 * @param {object[]} OCRResult - OCR result
 * @param {object} searchedAttribute - attribute to find
 * @returns {object} attribute found
 */
const findAttributeInLines = (OCRResult, searchedAttribute) => {
  for (const block of OCRResult) {
    for (const line of block.lines) {
      const attr = findAttribute(OCRResult, line, searchedAttribute)
      if (attr) {
        return attr
      }
    }
  }
  return null
}

/**
 * Find the attribute in the elements
 * @param {object[]} OCRResult - OCR result
 * @param {object} searchedAttribute - attribute to find
 * @returns {object} attribute found
 */
const findAttributeInElements = (OCRResult, searchedAttribute) => {
  for (const block of OCRResult) {
    for (const line of block.lines) {
      for (const el of line.elements) {
        const attr = findAttribute(OCRResult, el, searchedAttribute)
        if (attr) {
          return attr
        }
      }
    }
  }
}

/**
 * Find attributes by regex
 * @param {object[]} OCRResult - OCR result
 * @param {object} attributesRegex - attributes to find
 * @returns {object[]} attributes found
 */
const findAttributesByRegex = (OCRResult, attributesRegex) => {
  const attributesToFind = attributesRegex
    ? attributesRegex.filter(att => !(att.enabled === false))
    : []
  const foundAttributes = []
  for (const attr of attributesToFind) {
    /**
     * Searching by line first rather than elements avoids to find false positive.
     * Typically for BIC, the regex is not very discriminative and can match other elemnts.
     * But the actual BIC is quite often a separated block in OCR, while false positive such
     * as a name will be detected alongside other attributes on the same line.
     * Note we do not search by block, at is this seems not necessary and adds complexity when
     * trying to detect other text on the same Y coordinates.
     */

    // Try to find directly by the lines
    const resultByLines = findAttributeInLines(OCRResult, attr)
    if (resultByLines) {
      foundAttributes.push(resultByLines)
      continue
    }
    // If it failed, try to find by elements
    const resultByElements = findAttributeInElements(OCRResult, attr)
    if (resultByElements) {
      foundAttributes.push(resultByElements)
      continue
    }
  }
  return foundAttributes
}

const hasMatchingText = (blocks, regex) => {
  const regExp = new RegExp(regex)
  for (const block of blocks) {
    for (const line of block.lines) {
      // Check regexp against line text
      const normalizedLine = normalizeText(line.text)
      if (regExp.test(normalizedLine)) {
        return true
      }
      // If the line failed, check by splitted element
      for (const el of line.elements) {
        const normalizedEl = normalizeText(el.text)
        if (regExp.test(normalizedEl)) {
          return true
        }
      }
    }
  }
  return false
}

const isMatchingRules = (blocks, rules) => {
  if (!rules) {
    return null
  }
  // All the references must be found
  for (const refRule of rules) {
    const match = hasMatchingText(blocks, refRule.regex)
    if (!match) {
      return false
    }
  }
  return true
}

/**
 * From the given OCR and rules, try to find which version the paper belongs
 *
 * For instance, an identity card may have 2 versions.
 * A set of regex rules is defined to identify each version, against OCR.
 *
 * @param {object} OCRWithSides - The OCR for both sides, front and back
 * @param {Array<object>} versionReferences - The references for each paper version
 * @returns {object} The matching version
 */
export const findPaperVersion = (OCRWithSides, versionReferences) => {
  const OCRFront = OCRWithSides?.front?.OCRResult
  const OCRBack = OCRWithSides?.back?.OCRResult

  for (const versionRef of versionReferences) {
    const frontRules =
      versionRef?.referenceRules?.filter(ref => ref.side === 'front') || []
    const backRules =
      versionRef?.referenceRules?.filter(ref => ref.side === 'back') || []

    const shouldDetectFront = OCRFront && frontRules.length > 0
    const shouldDetectBack = OCRBack && backRules.length > 0
    const hasMatchForFront =
      shouldDetectFront && isMatchingRules(OCRFront, frontRules)
    const hasMatchForBack =
      shouldDetectBack && isMatchingRules(OCRBack, backRules)

    if (shouldDetectFront && shouldDetectBack) {
      if (hasMatchForFront && hasMatchForBack) {
        return { version: versionRef.version }
      }
    } else if (shouldDetectFront && hasMatchForFront) {
      return { version: versionRef.version }
    } else if (shouldDetectBack && hasMatchForBack) {
      return { version: versionRef.version }
    }
  }
  return { version: null }
}

/**
 * The paperType + side are used as fallback when no paper is automatically found
 *
 * @param {object} OCRResult - OCR result
 * @param {object} imgSize - image size
 * @param {object} ocrAttributesSide - OCR attributes for the document side
 * @returns {object} attributes found
 */
export const findAttributes = (OCRResult, imgSize, ocrAttributesSide = {}) => {
  if (!OCRResult || OCRResult.length < 1) {
    return null
  }
  const { attributesRegex, size } = ocrAttributesSide
  let attributesByBox = []
  if (size?.width && size?.height) {
    attributesByBox = findAttributesByBox(OCRResult, ocrAttributesSide, imgSize)
  }
  const attributesByRegex = findAttributesByRegex(OCRResult, attributesRegex)

  // TODO: when an attribute is both found by box and regex, which one should be kept?(@paultranvan)
  // => For now, we keep in priority the result found via the regex (@merkur39)
  // => Note this implies strict regex to minimize false positives (@paultranvan)
  const foundAttributes = unionBy(attributesByRegex, attributesByBox, 'name')
  log('info', 'foundAttributes: ' + JSON.stringify(foundAttributes))
  const processedAttributes = postProcessing(foundAttributes)
  log('info', 'postProcessedAttributes: ' + JSON.stringify(processedAttributes))

  return { attributes: processedAttributes }
}
