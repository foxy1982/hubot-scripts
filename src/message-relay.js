var AWS = require('aws-sdk');
var Consumer = require('sqs-consumer');

var robot;

function handleMessage(data, done) {
    robot.logger.debug('handleMessage: ' + JSON.stringify(data));
    var body = JSON.parse(data.Body);
    var message = body.message;

    if (message) {
        robot.logger.debug('message is: ' + message);
        var envelope = {
            room: body.channel || '#here-be-raptors'
        };
        robot.logger.debug('envelope is: ' + JSON.stringify(envelope));

        var messages = [message];

        robot.send(envelope, messages);
    }

    robot.logger.debug('calling done');

    done();
}

module.exports = function (robotParam) {

    robot = robotParam;

    var key = process.env.HUBOT_SQS_MESSAGE_RELAY_ACCESS_KEY_ID;
    var secret = process.env.HUBOT_SQS_MESSAGE_RELAY_SECRET_ACCESS_KEY;
    var queue = process.env.HUBOT_SQS_MESSAGE_RELAY_QUEUE;

    if (!key) {
        throw new Error('S3 message relay requires HUBOT_SQS_MESSAGE_RELAY_ACCESS_KEY_ID');
    }
    if (!secret) {
        throw new Error('S3 message relay requires HUBOT_SQS_MESSAGE_RELAY_SECRET_ACCESS_KEY');
    }
    if (!queue) {
        throw new Error('S3 message relay requires HUBOT_SQS_MESSAGE_RELAY_QUEUE');
    }
    robot.logger.debug("Starting message relay");

    AWS.config.credentials = {
        accessKeyId: key,
        secretAccessKey: secret
    };

    AWS.config.region = "eu-west-1";

    var app = Consumer.create({
        queueUrl: queue,
        handleMessage: handleMessage,
        sqs: new AWS.SQS()
    });

    app.start();
};
