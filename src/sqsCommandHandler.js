var sqsCommandSender = require('../lib/sqsCommandSender');
var SqsCommandResponder = require('../lib/sqsCommandResponder');

var robot;

module.exports = function (rbt) {
    robot = rbt;
    robot.logger.debug("Starting sqsCommandHandler");

    var commandSender = new sqsCommandSender(robot);
    var commandResponder = new SqsCommandResponder(robot);

    robot.catchAll(function (msg) {
        commandSender.postMessage(msg.message.rawText);
    });
};
