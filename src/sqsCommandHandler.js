var sqsCommandSender = require('../lib/sqsCommandSender');
var SqsCommandReceiver = require('../lib/sqsCommandReceiver');

var robot;

module.exports = function (rbt) {
    robot = rbt;
    robot.logger.debug("Starting sqsCommandHandler");

    var commandSender = new sqsCommandSender(robot);
    var commandReceiver = new SqsCommandReceiver(robot);

    robot.catchAll(function (msg) {
        commandSender.postMessage(msg.message.rawText);
    });
};
