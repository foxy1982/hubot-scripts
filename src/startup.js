var roomSanitizer = require('./lib/roomSanitizer');

module.exports = function(robot) {
    if (process.env.HUBOT_STARTUP_MESSAGE_ROOM && process.env.HUBOT_STARTUP_MESSAGE) {
        robot.messageRoom(roomSanitizer(process.env.HUBOT_STARTUP_MESSAGE_ROOM), process.env.HUBOT_STARTUP_MESSAGE);
    } else {
        console.log("HUBOT_STARTUP_MESSAGE_ROOM and HUBOT_STARTUP_MESSAGE must be defined");
    }
};
