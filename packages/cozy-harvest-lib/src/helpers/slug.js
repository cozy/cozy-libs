/**
 * Generate slug from text.
 * @param  {string} text The text to slugify
 * @return {string}      The resulting slug
 */
export const slugify = (text, char = '_') =>
  text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, char) // Replace spaces with -
    .replace(/[^\w-]+/g, char) // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text

export default {
  slugify
}
