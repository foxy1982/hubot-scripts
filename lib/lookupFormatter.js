function processArray(data) {
    var resultData = [];
    var keys = Object.keys(data);
    for (var i = 0; i < keys.length; i++) {
        if (typeof data[keys[i]] === 'string') {
            resultData.push(data[keys[i]]);
        }
    }
    return resultData;
}

function processObject(data) {
    var resultData = [];
    var keys = Object.keys(data);
    for (var i = 0; i < keys.length; i++) {
        if (typeof data[keys[i]] === 'string') {
            resultData.push(keys[i] + ": " + data[keys[i]]);
        } else {
            resultData.push(keys[i] + "...");
        }
    }
    return resultData;
}

module.exports = function (data) {
    if (typeof data !== 'object') {
        return data;
    }

    var resultData = [];

    if (Array.isArray(data)) {
        resultData = processArray(data);
    } else {
        resultData = processObject(data);
    }

    return resultData.join('\n');
};
