module.exports = function(room) {
    if (room.startsWith('#')) {
        return room;
    }

    return '#' + room;
};
