var target = require('../src/lookupEngine');
require('chai').should();

describe('Lookup', function () {

    var testData = {
        test1: {
            test1_1: 'test1_1',
            test1_2: {
                test1_2_1: 'test_1_2_1'
            }
        },
        test2: 'test2'
    };

    it('should return everything if there is no query', function() {
        var result = target(testData, '');
        result.should.equal(testData);
    });

    it('should return an object if requested', function() {
        var result = target(testData, ['test1']);
        result.should.equal(testData.test1);
    });

    it('should return a string if requested', function() {
        var result = target(testData, ['test2']);
        result.should.equal(testData.test2);
    });

    it('should return a nested object if requested', function() {
        var result = target(testData, ['test1', 'test1_1']);
        result.should.equal(testData.test1.test1_1);
    });

    it('should return options if something does not exist', function() {
        var result = target(testData, ['testx']);
        result.should.equal(testData);
    });

    it('should return options if something does not exist (2)', function() {
        var result = target(testData, ['test1', 'test1_x']);
        result.should.equal(testData.test1);
    });
});
