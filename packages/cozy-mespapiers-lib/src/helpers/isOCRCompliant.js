const isOCRCompliant = steps => {
  return steps.some(step => 'ocr' in step)
}

export { isOCRCompliant }
