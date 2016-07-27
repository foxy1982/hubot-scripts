var roomSanitizer = require('../lib/roomSanitizer');

module.exports = function(robot) {
    if (process.env.HUBOT_STARTUP_MESSAGE_ROOM && process.env.HUBOT_STARTUP_MESSAGE) {
        var room = roomSanitizer(process.env.HUBOT_STARTUP_MESSAGE_ROOM);
        var message = process.env.HUBOT_STARTUP_MESSAGE;
        robot.logger.info("Sending: " + message + " to: " + room);
        robot.messageRoom(room, message);
    } else {
        console.log("HUBOT_STARTUP_MESSAGE_ROOM and HUBOT_STARTUP_MESSAGE must be defined");
    }
};
