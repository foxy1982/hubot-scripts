# Description:
#   Lookup service for static data
#
# Dependencies:
#   None
#
# Configuration:
#   HUBOT_S3_LOOKUP_ACCESS_KEY_ID      - AWS Access Key ID with S3 permissions
#   HUBOT_S3_LOOKUP_SECRET_ACCESS_KEY  - AWS Secret Access Key for ID
#   HUBOT_S3_LOOKUP_BUCKET             - Bucket to fetch lookup from
#
# Commands:
#   hubot lookup - connects to S3 and gets data for static lookup
#
# Author:
#

aws = require 'aws-sdk'

module.exports = (robot) ->
  key = process.env.HUBOT_S3_LOOKUP_ACCESS_KEY_ID
  secret = process.env.HUBOT_S3_LOOKUP_SECRET_ACCESS_KEY
  bucket = process.env.HUBOT_S3_LOOKUP_BUCKET
  brainKey = "lookup"
  lookupPath = "lookup.json"

  if (!key)
    throw new Error('S3 lookup requires HUBOT_S3_LOOKUP_ACCESS_KEY_ID')

  if (!secret)
    throw new Error('S3 lookup requires HUBOT_S3_LOOKUP_SECRET_ACCESS_KEY')

  if (!bucket)
    throw new Error('S3 lookup requires HUBOT_S3_LOOKUP_BUCKET')

  robot.logger.debug "starting"

  aws.config.credentials = {
    accessKeyId: key,
    secretAccessKey: secret
  }

  aws.config.region = "eu-west-1"

  lookup = (msg, query)->
    robot.logger.debug "lookup"
    response = robot.brain.get brainKey
    msg.send response

  refresh = (msg) ->
    robot.logger.debug "refresh"
    s3 = new aws.S3
    s3.getObject({
      Bucket: bucket,
      Key: lookupPath,
      ResponseContentType: 'application/json'
    }, (err, data) ->
      robot.logger.debug "refresh-callback"
      if (err)
        robot.logger.debug "Request:"
        robot.logger.debug this.request.httpRequest
        robot.logger.debug err
        if (msg)
          msg.send "Failed to refresh from S3: " + err
        return

      dataString = data.Body.toString

      robot.brain.set brainKey, JSON.parse(dataString)
      if msg
        robot.logger.debug dataString
        msg.send "Refresh complete"
    )

  robot.respond /lookup(.*)?/i, (msg) ->
    query = msg.match[1]
    lookup(msg, query)

  robot.respond /lookup-refresh/i, (msg) ->
    refresh(msg)

  refresh
