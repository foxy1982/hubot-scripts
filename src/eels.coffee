# Description:
#   Eels!
#
# Dependencies:
#   None
#
# Configuration:
#   None
#
# Commands:
#   hubot eel me - A randomly selected eel
#   hubot eel bomb me <number> - Many many eels!
#
# Author:
#   iancotterill

module.exports = (robot) ->
  robot.respond /eels?(?: me)?$/i, (msg) ->
    msg.send eelMe(msg)

  robot.respond /eel bomb(?: me)?( \d+)?$/i, (msg) ->
    eels = msg.match[1] || 5
    msg.send(eelMe(msg)) for i in [1..eels]

eelMe = (msg)->
  eels = [
    'http://d2ws0xxnnorfdo.cloudfront.net/character/meme/bad-joke-eel',
    'http://s.hswstatic.com/gif/eels-slippery-2.jpg',
    'http://blog.journals.cambridge.org/wp-content/uploads/2013/08/Ribbon-eel-larvae-664x451.jpg',
    'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcT8JHtuxKrJD8P6lPnIv33lMZpXfeUBoEwOXHyR5MHtG7LcA0VBAw',
    'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTduCND_6mgIov3LB7DRqKfvH2_NxzRIbTjUGd5I5XPUOw0Czbg',
    'https://featuredcreature.com/wp-content/uploads/2013/10/moray3-thumb.jpg'
  ];

  return msg.random eels
