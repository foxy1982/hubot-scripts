var AWS = require('aws-sdk');
var Consumer = require('sqs-consumer');
var proxy = require('proxy-agent');

var roomSanitizer = require('../lib/roomSanitizer');

var key = process.env.SQS_COMMAND_ACCESS_KEY_ID;
var secret = process.env.SQS_COMMAND_SECRET_ACCESS_KEY;
var httpProxy = process.env.HTTP_PROXY;
var commandQueue = process.env.SQS_COMMAND_RESPONSE_QUEUE;

var SqsCommandResponder = function(robot) {
    function initializeSqs() {
        if (!key) {
            throw new Error('SQS sender requires SQS_COMMAND_ACCESS_KEY_ID');
        }
        if (!secret) {
            throw new Error('SQS sender requires SQS_COMMAND_SECRET_ACCESS_KEY');
        }
        if (!commandQueue) {
            throw new Error('SQS sender requires queue in config');
        }

        AWS.config.credentials = {
            accessKeyId: key,
            secretAccessKey: secret
        };

        AWS.config.region = 'eu-west-1';

        if (httpProxy) {
            robot.logger.debug('setting proxy to: ' + httpProxy);

            AWS.config.update({
                httpOptions: {
                    agent: proxy(httpProxy)
                }
            });
        }

        var app = Consumer.create({
            queueUrl: commandQueue,
            handleMessage: handleSqsMessage,
            sqs: new AWS.SQS()
        });

        app.start();

        robot.logger.debug('sqs initialised');
    }

    function handleSqsMessage(data, done) {
        robot.logger.debug('handleSqsMessage: ' + JSON.stringify(data));
        var body = JSON.parse(data.Body);
        sendMessage(body);

        robot.logger.debug('calling done');
        done();
    }

    function sendMessage(body) {
        if (!body.envelope) {
            return robot.logger.debug('Body does not have envelope.  Body is: ' + body);
        }
        var envelope = body.envelope;

        if (!body.channel) {
            return robot.logger.debug('Body does not have channel.  Body is: ' + body);
        }
        envelope.channel = roomSanitizer(body.channel);

        robot.logger.debug('sending: ' + envelope);
        robot.adapter.customMessage(envelope);
    }

    initializeSqs();
};

module.exports = SqsCommandResponder;
