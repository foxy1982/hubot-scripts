var target = require('../lib/lookupFormatter');
require('chai').should();

describe('Lookup formatter', function () {

    it('should return a string with a single string if given a string', function () {
        var data = 'test';
        var result = target(data);
        result.should.equal(data);
    });

    it('should return a title and string if given an object with a string', function () {
        var data = {
            'title': 'content'
        };
        var result = target(data);
        result.should.equal('title: content');
    });

    it('should return a title and ellipses if given an object with a subobject', function () {
        var data = {
            'title': {
                'subobject': 'content'
            }
        };
        var result = target(data);
        result.should.equal('title...');
    });

    it('should return multiple lines if given an object with multiple strings', function () {
        var data = {
            'title': 'content',
            'title2': 'content2'
        };
        var result = target(data);
        result.should.equal('title: content\ntitle2: content2');
    });

    it('should return multiple lines if given an array', function () {
        var data = [
            'item1',
            'item2'
        ];
        var result = target(data);
        result.should.equal('item1\nitem2');
    });
});
