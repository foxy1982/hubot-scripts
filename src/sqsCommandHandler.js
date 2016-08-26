var sqsCommandSender = require('../lib/sqsCommandSender');

var robot;

module.exports = function (rbt) {
    robot = rbt;
    robot.logger.debug("Starting sqsCommandHandler");

    var commandSender = new sqsCommandSender(robot);

    robot.catchAll(function (message) {
        commandSender.postMessage(message);
    });
};
