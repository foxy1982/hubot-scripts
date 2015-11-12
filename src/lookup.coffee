# Description:
#   Lookup service for static data
#
# Dependencies:
#   None
#
# Configuration:
#   None
#
# Commands:
#   hubot lookup - connects to S3 and gets data for static lookup
#
# Author:
#

module.exports = (robot) ->
  robot.respond /lookup (.*)?/i, (msg) ->
    data = msg.match[1]
    msg.send lookup(msg, data)

lookup = (msg)->
  return msg.send data
