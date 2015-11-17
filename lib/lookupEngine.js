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

function replaceAliases(query, aliases) {
    if (!aliases) {
        return query;
    }

    var returnQuery = [];
    for (var i = 0; i < query.length; i++) {
        var queryItem = query[i];
        if (aliases[queryItem]) {
            returnQuery.push(aliases[queryItem])
        } else {
            returnQuery.push(queryItem);
        }
    }
    return returnQuery;
}

module.exports = function (data, query, aliases) {
    var normalizedQuery = replaceAliases(query, aliases);
    return innerEngine(data, normalizedQuery);
};
