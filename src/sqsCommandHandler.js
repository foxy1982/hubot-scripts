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
        var command = msg.message.substr(msg.message.indexOf(" "), msg.message.length);
        robot.logger.debug("Parsed to: ")
        commandSender.postMessage(msg.message.rawText);
    });
};
