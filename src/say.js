module.exports = function (robot) {
    robot.router.post('/hubot/say/:room', function (req, res) {
        var room = req.params.room || '#here-be-raptors';

        var data;

        if (req.body.message) {
            data = message;
        } else {
            data = req.body;
        }

        var envelope = {
            room: room
        };

        robot.send(envelope, data);

        res.send('OK');
    });
}
