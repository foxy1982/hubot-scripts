var sqsCommandSender = require('../lib/sqsCommandSender');
var SqsCommandResponder = require('../lib/sqsCommandResponder');

var robot;

module.exports = function (rbt) {
    robot = rbt;
    robot.logger.debug("Starting sqsCommandHandler");

    var commandSender = new sqsCommandSender(robot);
    var commandResponder = new SqsCommandResponder(robot);

    robot.catchAll(function (msg) {
        robot.logger.debug("Handling: " + msg.message);
        var rawText = msg.message.rawText;
        robot.logger.debug("Raw Text: " + msg.message.length);
        var command = rawText.substr(rawText.indexOf(" "), rawText.length);
        robot.logger.debug("Parsed to: " + command);
        commandSender.postMessage(command);
    });
};
