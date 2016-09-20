var _ = require('lodash');
var roomSanitizer = require('../lib/roomSanitizer');

function getRoom(body) {
    return roomSanitizer(body.category || 'hubot-dev');
}

function getColor(body) {
    if (body.state === 'error') {
        return '#FF0000';
    }

    if (body.state === 'warning') {
        return '#FFAA00';
    }

    if (body.state === 'ok') {
        return '#00CC00';
    }

    return '#888888';
}

function formatStateString(state) {
    if (state === 'ok') {
        return 'OK';
    }

    return _.capitalize(state);
}

function createUnknownStateEnvelope(body) {
    var text = 'Service has entered an unknown state';
    return {
        channel: getRoom(body),
        attachments: [{
            color: '#888888',
            pretext: text,
            fallback: text,
            title: body.title,
            title_link: body.url
        }]
    };
}

function createSoftStateEnvelope(body) {
    var text = 'Possible problem detected, rechecking...';
    return {
        channel: getRoom(body),
        attachments: [{
            color: '#FFFF00',
            pretext: text,
            fallback: text,
            title: body.title,
            title_link: body.url
        }]
    };
}

function createProblemEnvelope(body) {
    return {
        channel: getRoom(body),
        attachments: [{
            color: getColor(body),
            pretext: 'I\'ve found an issue! Someone do something',
            author_name: body.author.name,
            author_link: body.author.url,
            title: body.title,
            title_link: body.url,
            text: body.notes,
            fallback: 'Problem found!',
            fields: [{
                title: 'Severity',
                value: formatStateString(body.state)
            },{
                title: 'Detail',
                value: body.detail
            }]
        }]
    };
}

function createRecoveryEnvelope(body) {
    return {
        channel: getRoom(body),
        attachments: [{
            color: getColor(body),
            pretext: 'Problem solved. Nothing to see here',
            author_name: body.author.name,
            author_link: body.author.url,
            title: body.title,
            title_link: body.url,
            fallback: 'Problem resolved',
            fields: [{
                title: 'Detail',
                value: body.detail
            }]
        }]
    };
}

module.exports = {
    createSoftStateEnvelope: createSoftStateEnvelope,
    createUnknownStateEnvelope: createUnknownStateEnvelope,
    createProblemEnvelope: createProblemEnvelope,
    createRecoveryEnvelope: createRecoveryEnvelope
};
