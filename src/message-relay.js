var AWS = require('aws-sdk');
var Consumer = require('sqs-consumer');

var robot;

function handleMessage(message, done) {
    robot.logger.debug('handleMessage: ' + JSON.stringify(message));
    if (message.message) {
        robot.logger.debug('message is: ' + message.message);
        var envelope = {
            room: message.channel || '#here-be-raptors'
        };
        robot.logger.debug('envelope is: ' + envelope);

        var messages = [message.message];

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
        throw new Error('S3 webshot requires HUBOT_SQS_MESSAGE_RELAY_ACCESS_KEY_ID');
    }
    if (!secret) {
        throw new Error('S3 webshot requires HUBOT_SQS_MESSAGE_RELAY_SECRET_ACCESS_KEY');
    }
    if (!queue) {
        throw new Error('S3 webshot requires HUBOT_SQS_MESSAGE_RELAY_QUEUE');
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
