"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _taggedTemplateLiteral2 = _interopRequireDefault(require("@babel/runtime/helpers/taggedTemplateLiteral"));

var _buildFilename = require("./buildFilename");

var _templateObject;

var mockOneContact = [{
  _id: 'contactId01',
  name: {
    givenName: 'Bernard',
    familyName: 'Chabert'
  }
}];
describe('buildFilename', function () {
  it('should replace "/" by "_" in qualificationName', function () {
    var paperName = (0, _buildFilename.buildFilename)({
      contacts: [],
      qualificationName: 'passport/test'
    });
    expect(paperName).toEqual('passport_test.pdf');
  });
  it.each(_templateObject || (_templateObject = (0, _taggedTemplateLiteral2.default)(["\n    opts | result\n    ", " | ", "\n    ", " | ", "\n    ", " | ", "\n    ", " | ", "\n    ", " | ", "\n    ", " | ", "\n    ", " | ", "\n    ", " | ", "\n    ", " | ", "\n    ", " | ", "\n    ", " | ", "\n    ", " | ", "\n    ", " | ", "\n  "])), {
    qualificationName: 'passport',
    formatedDate: '2022.01.01',
    contacts: mockOneContact,
    filenameModel: ['labelGivenByUser', 'contactName', 'featureDate'],
    metadata: {
      labelGivenByUser: 'Mon fichier'
    }
  }, 'Mon fichier - Bernard Chabert - 2022.01.01.pdf', {
    qualificationName: 'passport',
    formatedDate: '2022.01.01',
    contacts: [],
    filenameModel: ['labelGivenByUser', 'featureDate'],
    metadata: {
      labelGivenByUser: 'Mon fichier'
    }
  }, 'Mon fichier - 2022.01.01.pdf', {
    qualificationName: 'passport',
    formatedDate: '2022.01.01',
    contacts: [],
    filenameModel: ['labelGivenByUser', 'featureDate'],
    metadata: {
      labelGivenByUser: ''
    }
  }, '2022.01.01.pdf', {
    qualificationName: 'passport',
    formatedDate: '2022.01.01',
    contacts: [],
    filenameModel: ['labelGivenByUser', 'featureDate']
  }, '2022.01.01.pdf', {
    qualificationName: 'passport',
    formatedDate: '2022.01.01',
    contacts: [],
    filenameModel: ['labelGivenByUser', 'featureDate'],
    metadata: {}
  }, '2022.01.01.pdf', {
    qualificationName: 'passport',
    contacts: []
  }, 'passport.pdf', {
    qualificationName: 'passport',
    contacts: [],
    pageName: 'front'
  }, 'passport - front.pdf', {
    qualificationName: 'passport',
    contacts: mockOneContact
  }, 'passport - Bernard Chabert.pdf', {
    qualificationName: 'passport',
    contacts: [],
    formatedDate: '2022.01.01'
  }, 'passport - 2022.01.01.pdf', {
    qualificationName: 'passport',
    pageName: 'front',
    contacts: mockOneContact
  }, 'passport - front - Bernard Chabert.pdf', {
    qualificationName: 'passport',
    pageName: 'front',
    contacts: [],
    formatedDate: '2022.01.01'
  }, 'passport - front - 2022.01.01.pdf', {
    qualificationName: 'passport',
    contacts: mockOneContact,
    formatedDate: '2022.01.01'
  }, 'passport - Bernard Chabert - 2022.01.01.pdf', {
    qualificationName: 'passport',
    pageName: 'front',
    contacts: mockOneContact,
    formatedDate: '2022.01.01'
  }, 'passport - front - Bernard Chabert - 2022.01.01.pdf')("should return $result with \"$opts\" parameters", function (_ref) {
    var opts = _ref.opts,
        result = _ref.result;
    expect((0, _buildFilename.buildFilename)(opts)).toEqual(result);
  });
});