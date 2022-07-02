"use strict";

var _helpers = require("./helpers");

var mockContacts00 = [{
  _id: 'contactId01',
  name: {
    givenName: 'Bob',
    familyName: 'Durand'
  }
}, {
  _id: 'contactId02',
  name: {
    givenName: 'Alice',
    familyName: 'Durand'
  }
}];
var mockContacts01 = [{
  _id: 'contactId01',
  name: {
    givenName: 'Bernard',
    familyName: 'Chabert'
  }
}];
var mockContacts02 = [{
  _id: 'contactId01',
  name: {
    givenName: 'Bernard',
    familyName: 'Chabert'
  }
}, {
  _id: 'contactId02',
  name: {
    givenName: 'Clair',
    familyName: 'Guillot'
  }
}];
var mockContacts03 = [{
  _id: 'contactId01',
  name: {
    givenName: 'Bernard',
    familyName: 'Chabert'
  }
}, {
  _id: 'contactId02',
  name: {
    givenName: 'Clair',
    familyName: 'Guillot'
  }
}, {
  _id: 'contactId03',
  name: {
    givenName: 'Jean',
    familyName: 'Rossi'
  }
}];
var mockFiles = [{
  _id: 'fileId01',
  name: 'file01.pdf',
  relationships: {
    referenced_by: {
      data: [{
        id: 'contactId01',
        type: 'io.cozy.contacts'
      }]
    }
  }
}, {
  _id: 'fileId02',
  name: 'file02.pdf',
  relationships: {
    referenced_by: {
      data: [{
        id: 'contactId02',
        type: 'io.cozy.contacts'
      }]
    }
  }
}, {
  _id: 'fileId03',
  name: 'file03.pdf',
  relationships: {
    referenced_by: {
      data: [{
        id: 'contactId01',
        type: 'io.cozy.contacts'
      }, {
        id: 'contactId02',
        type: 'io.cozy.contacts'
      }]
    }
  }
}, {
  _id: 'fileId04',
  name: 'file04.pdf'
}];
var mockFilesWithoutContact = [{
  _id: 'fileId01',
  name: 'file01.pdf'
}, {
  _id: 'fileId02',
  name: 'file02.pdf'
}];
describe('helpers Papers', function () {
  describe('harmonizeContactsNames', function () {
    it('should return the names of the merged contacts', function () {
      var res = (0, _helpers.harmonizeContactsNames)(mockContacts00, jest.fn(function (key) {
        return key;
      }));
      expect(res).toBe('PapersList.contactMerged');
    });
    it('should return the name of the contact', function () {
      var res = (0, _helpers.harmonizeContactsNames)(mockContacts01, jest.fn(function (key) {
        return key;
      }));
      expect(res).toBe('Bernard Chabert');
    });
    it('should return the names of the contacts separated by a comma', function () {
      var res = (0, _helpers.harmonizeContactsNames)(mockContacts02, jest.fn(function (key) {
        return key;
      }));
      expect(res).toBe('Bernard Chabert, Clair Guillot');
    });
    it('should return the names of the contacts separated by a comma and ... ', function () {
      var res = (0, _helpers.harmonizeContactsNames)(mockContacts03, jest.fn(function (key) {
        return key;
      }));
      expect(res).toBe('Bernard Chabert, Clair Guillot, ... ');
    });
  });
  describe('groupFilesByContacts', function () {
    it('should return an object that groups the files with their contacts', function () {
      var expected = [{
        contacts: [mockContacts00[0]],
        files: [mockFiles[0]]
      }, {
        contacts: [mockContacts00[1]],
        files: [mockFiles[1]]
      }, {
        contacts: [mockContacts00[0], mockContacts00[1]],
        files: [mockFiles[2]]
      }, {
        contacts: [],
        files: [mockFiles[3]]
      }];
      var res = (0, _helpers.groupFilesByContacts)(mockFiles, mockContacts00);
      expect(res).toStrictEqual(expected);
    });
  });
  describe('buildFilesByContacts', function () {
    it('should return object with all papers filtered by contacts', function () {
      var expected = [{
        withHeader: true,
        contact: 'Alice Durand',
        papers: {
          maxDisplay: 3,
          list: [{
            _id: 'fileId02',
            name: 'file02.pdf',
            relationships: {
              referenced_by: {
                data: [{
                  id: 'contactId02',
                  type: 'io.cozy.contacts'
                }]
              }
            }
          }]
        }
      }, {
        withHeader: true,
        contact: 'Bob Durand',
        papers: {
          maxDisplay: 3,
          list: [{
            _id: 'fileId01',
            name: 'file01.pdf',
            relationships: {
              referenced_by: {
                data: [{
                  id: 'contactId01',
                  type: 'io.cozy.contacts'
                }]
              }
            }
          }]
        }
      }, {
        withHeader: true,
        contact: 'PapersList.contactMerged',
        papers: {
          maxDisplay: 3,
          list: [{
            _id: 'fileId03',
            name: 'file03.pdf',
            relationships: {
              referenced_by: {
                data: [{
                  id: 'contactId01',
                  type: 'io.cozy.contacts'
                }, {
                  id: 'contactId02',
                  type: 'io.cozy.contacts'
                }]
              }
            }
          }]
        }
      }, {
        withHeader: true,
        contact: 'PapersList.defaultName',
        papers: {
          maxDisplay: 3,
          list: [{
            _id: 'fileId04',
            name: 'file04.pdf'
          }]
        }
      }];
      var result = (0, _helpers.buildFilesByContacts)({
        files: mockFiles,
        contacts: mockContacts00,
        maxDisplay: 3,
        t: jest.fn(function (key) {
          return key;
        })
      });
      expect(result).toStrictEqual(expected);
    });
    it('should have not header if there are only files without contact', function () {
      var expected = [{
        withHeader: false,
        contact: 'PapersList.defaultName',
        papers: {
          maxDisplay: 3,
          list: [{
            _id: 'fileId01',
            name: 'file01.pdf'
          }, {
            _id: 'fileId02',
            name: 'file02.pdf'
          }]
        }
      }];
      var result = (0, _helpers.buildFilesByContacts)({
        files: mockFilesWithoutContact,
        contacts: mockContacts00,
        maxDisplay: 3,
        t: jest.fn(function (key) {
          return key;
        })
      });
      expect(result).toStrictEqual(expected);
    });
  });
});