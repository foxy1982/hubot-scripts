function innerEngine(data, query) {
    if (query.length === 0) {
        return data;
    }

    var head = query.shift();

    if (!data[head]) {
        return data;
    }

    return innerEngine(data[head], query);
}

module.exports = function (data, query) {
    return innerEngine(data, query);
};
