var AWS = require('aws-sdk');
var proxy = require('proxy-agent');

var key = process.env.SQS_COMMAND_ACCESS_KEY_ID;
var secret = process.env.SQS_COMMAND_SECRET_ACCESS_KEY;
var httpProxy = process.env.HTTP_PROXY;
var commandQueue = process.env.SQS_COMMAND_QUEUE;

var SqsCommandSender = function(robot) {
    function initializeSqs() {
        if (!key) {
            throw new Error('SQS sender requires SQS_COMMAND_ACCESS_KEY_ID');
        }
        if (!secret) {
            throw new Error('SQS sender requires SQS_COMMAND_ACCESS_KEY');
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

        robot.logger.debug('sqs initialised');
    }

    function postMessage(message) {
        robot.logger.debug('publishing message via sqs: ' + JSON.stringify(message));
        var sqs = new AWS.SQS();

        var sqsParams = {
          MessageBody: JSON.stringify({command: message}),
          QueueUrl: commandQueue
        };

        sqs.sendMessage(sqsParams, function(err, message) {
            if (err) {
                robot.logger.debug('error returned from SQS: ' + JSON.stringify(message));
            }
        });
    }
};

module.exports = SqsCommandSender;
