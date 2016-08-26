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
        var command = msg.message.rawText.substr(msg.message.rawText.indexOf(" "), msg.message.rawText.length);
        robot.logger.debug("Parsed to: " + command);
        commandSender.postMessage(command);
    });
};
