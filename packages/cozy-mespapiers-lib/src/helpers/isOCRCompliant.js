const isOCRCompliant = steps => {
  return steps.some(
    step => step.isDisplayed === 'ocr' || step.isDisplayed === 'all'
  )
}

export { isOCRCompliant }
