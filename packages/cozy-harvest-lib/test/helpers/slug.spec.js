/* eslint-env jest */
import { slugify } from 'helpers/slug'

describe('Slug', () => {
  describe('slugify', () => {
    it('replaces spaces', () => {
      expect(slugify('Foo bar')).toBe('foo_bar')
    })

    it('replaces non words characters', () => {
      expect(slugify('Foo@bar,')).toBe('foo_bar_')
    })

    it('replaces multiple dashes', () => {
      expect(slugify('Foo----bar')).toBe('foo-bar')
    })

    it('trims dashes', () => {
      expect(slugify('--Foo bar-----')).toBe('foo_bar')
    })

    it('trims spaces', () => {
      expect(slugify('   Foo bar  ')).toBe('foo_bar')
    })
  })
})
