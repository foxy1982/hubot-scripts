var AWS = require('aws-sdk');
var Consumer = require('sqs-consumer');
var messageBuilder = require('../lib/alertMessageBuilder');

function showMessage(body) {
    robot.logger.debug('received message: ' + JSON.stringify(body));

    var envelope;

    if (body.stateType === "soft") {
        if (body.state !== "ok") {
            envelope = messageBuilder.createSoftStateEnvelope(body);
        }
    } else {
        if (body.state === "ok") {
            envelope = messageBuilder.createRecoveryEnvelope(body);
        } else {
            envelope = messageBuilder.createProblemEnvelope(body);
        }
    }

    if (!envelope) {
        return robot.logger.debug('no envelope create for: ' + JSON.stringify(body));
    }

    robot.logger.debug('created envelope: ' + JSON.stringify(envelope));

    robot.adapter.customMessage(envelope);
}

function handleSqsMessage(data, done) {
    robot.logger.debug('handleMessage: ' + JSON.stringify(data));
    var body = JSON.parse(data.Body);
    showData(body);

    robot.logger.debug('calling done');
    done();
}

function initializeSqs(robot) {
    var key = process.env.HUBOT_SQS_ALERT_ACCESS_KEY_ID;
    var secret = process.env.HUBOT_SQS_ALERT_SECRET_ACCESS_KEY;
    var queue = process.env.HUBOT_SQS_ALERT_QUEUE;

    if (!queue) {
        return robot.logger.debug('No SQS queue specified for alert service');
    }

    if (!secret) {
        throw new Error('SQS alert listener requires HUBOT_SQS_ALERT_SECRET_ACCESS_KEY');
    }
    if (!queue) {
        throw new Error('SQS alert listener requires HUBOT_SQS_ALERT_QUEUE');
    }

    robot.logger.debug('Starting SQS alert listener');

    AWS.config.credentials = {
        accessKeyId: key,
        secretAccessKey: secret
    };

    AWS.config.region = 'eu-west-1';

    var app = Consumer.create({
        queueUrl: queue,
        handleMessage: handleSqsMessage,
        sqs: new AWS.SQS()
    });

    app.start();
}

module.exports = function(robot) {
    robot.router.post('/hubot/alert', function(req, res) {
        showData(req.body);
        res.send('OK');
    });

    initializeSqs(robot);
};
