module.exports = function (robot) {
    robot.router.post('/hubot/say/:room', function (req, res) {
        room = req.params.room

        if (req.body.payload) {
            data = JSON.parse(req.body.payload).message;
        } else {
            data = req.body;
        }

        var envelope = {
            room: body.channel || '#here-be-raptors'
        };

        robot.send(envelope, data);

        res.send('OK');
    });
}
