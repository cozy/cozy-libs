import {isWebviewSourceBaseUrl} from "./environments";

describe('environmments', () => {
  describe('isWebviewSourceBaseUrl', () => {
    it('should be true when WebviewSourceBaseUrl providen', () => {
      // When
      const result = isWebviewSourceBaseUrl({baseUrl: 'http://', html: '<html></html>'});
      // Then
      expect(result).toBe(true)
    })
    it('should be false when WebviewSourceUri providen', () => {
      // When
      const result = isWebviewSourceBaseUrl({uri: 'http://'});
      // Then
      expect(result).toBe(false)
    })
  })
})
