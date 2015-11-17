var target = require('../lib/lookupFormatter');
require('chai').should();

describe('Lookup formatter', function () {

    it('should return an array with a single string if given a string', function () {
        var data = 'test';
        var result = target(data);
        result.should.deep.equal([data]);
    });

    it('should return a title and string if given an object with a string', function () {
        var data = {
            'title': 'content'
        };
        var result = target(data);
        result.should.deep.equal(['title: content']);
    });

    it('should return a title and ellipses if given an object with a subobject', function () {
        var data = {
            'title': {
                'subobject': 'content'
            }
        };
        var result = target(data);
        result.should.deep.equal(['title...']);
    });
});
