var sqsCommandSender = require('../lib/sqsCommandSender');
var SqsCommandResponder = require('../lib/sqsCommandResponder');

var robot;

module.exports = function (rbt) {
    robot = rbt;
    robot.logger.debug("Starting sqsCommandHandler");

    var commandSender = new sqsCommandSender(robot);
    var commandResponder = new SqsCommandResponder(robot);

    robot.respond("/( .*)?/i", function (msg) {
        robot.logger.debug("Handling: " + msg.message);
        var rawText = msg.message.rawText;
        robot.logger.debug("Raw Text: " + rawText);
        var command = rawText;
        if (rawText.indexOf(" ") > 0) {
            command = rawText.substr(rawText.indexOf(" "), rawText.length);
        }
        robot.logger.debug("Parsed to: " + command);
        robot.logger.debug("Room is: " + msg.message.room);
        commandSender.postMessage(command.trim(), msg.message.room);
    });
};
