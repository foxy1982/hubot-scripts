var _ = require('lodash');

function getRoom(body) {
    return 'general';
}

function getColor(body) {
    if (body.state === 'error') {
        return "#FF0000";
    }

    if (body.state === 'warning') {
        return "#FFAA00";
    }

    if (body.state === 'ok') {
        return "#00CC00";
    }

    return "#888888";
}

function formatStateString(state) {
    if (state === "ok") {
        return "OK";
    }

    return _.capitalize(state);
}

function createProblemEnvelope(body) {
    return {
        channel: getRoom(body),
        attachments: [{
            color: getColor(body),
            pretext: "I've found an issue! Someone do something",
            author_name: body.author.name,
            author_link: body.author.url,
            title: body.title,
            title_link: body.url,
            text: body.notes,
            fallback: "Problem found!",
            fields: [{
                title: "Severity",
                value: formatStateString(body.state)
            },{
                title: "Detail",
                value: body.detail
            },{
                title: "State Type",
                value: _.capitalize(body.stateType || "not supplied")
            }]
        }]
    };
}

function createRecoveryEnvelope(body) {
    return {
        channel: getRoom(body),
        attachments: [{
            color: getColor(body),
            pretext: "Problem solved. Nothing to see here",
            author_name: body.author.name,
            author_link: body.author.url,
            title: body.title,
            title_link: body.url,
            fallback: "Problem resolved",
            fields: [{
                title: "Detail",
                value: body.detail
            },{
                title: "State Type",
                value: _.capitalize(body.stateType || "not supplied")
            }]
        }]
    };
}

module.exports = function(robot) {
    robot.router.post('/hubot/alert', function(req, res) {
        var body = req.body;

        robot.logger.debug('received message: ' + JSON.stringify(body));

        var envelope;

        if (body.state === "ok") {
            envelope = createRecoveryEnvelope(body);
        } else {
            envelope = createProblemEnvelope(body);
        }

        robot.logger.debug('created envelope: ' + JSON.stringify(envelope));

        robot.adapter.customMessage(envelope);

        res.send('OK');
    });
}
