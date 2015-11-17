module.exports = function (data) {
    if (typeof data !== 'object') {
        return [data];
    }

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
};
