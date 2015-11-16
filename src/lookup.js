/*# Description:
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
*/
var aws = require('aws-sdk');
var lookupEngine = require('./lookupEngine');

module.exports = function (robot) {
    var key = process.env.HUBOT_S3_LOOKUP_ACCESS_KEY_ID
    var secret = process.env.HUBOT_S3_LOOKUP_SECRET_ACCESS_KEY
    var bucket = process.env.HUBOT_S3_LOOKUP_BUCKET
    var brainKey = "lookup"
    var lookupPath = "lookup.json"

    if (!key) {
        throw new Error('S3 lookup requires HUBOT_S3_LOOKUP_ACCESS_KEY_ID')
    }
    if (!secret) {
        throw new Error('S3 lookup requires HUBOT_S3_LOOKUP_SECRET_ACCESS_KEY')
    }
    if (!bucket) {
        throw new Error('S3 lookup requires HUBOT_S3_LOOKUP_BUCKET')
    }
    robot.logger.debug("Starting lookup");

    aws.config.credentials = {
        accessKeyId: key,
        secretAccessKey: secret
    };

    aws.config.region = "eu-west-1";

    var doLookup = function (data, query) {
        var queryArray = query.split(' ');
        return lookupEngine(data, queryArray);
    }

    var formatLookupResult = function (lookupResult) {
        if (!lookupResult) {
            return 'I can\'t find any matches for that';
        }
        return JSON.stringify(lookupResult);
    }

    var lookup = function (msg, query) {
        robot.logger.debug("lookup")
        var data = robot.brain.get(brainKey);
        robot.logger.debug("Data:" + JSON.stringify(data));
        robot.logger.debug("Query:<" + query + ">");
        var lookupResult = doLookup(data, query);
        var response = formatLookupResult(lookupResult);
        msg.send(response);
    }

    var refresh = function (msg) {
        robot.logger.debug("lookup-refresh")
        s3 = new aws.S3()
        s3.getObject({
            Bucket: bucket,
            Key: lookupPath,
            ResponseContentType: 'application/json'
        }, function (err, data) {
            robot.logger.debug("lookup-refresh-callback")
            if (err) {
                robot.logger.debug("Request:")
                robot.logger.debug(this.request.httpRequest)
                robot.logger.debug(err)
                if (msg) {
                    msg.send("Failed to refresh from S3: " + err)
                }
                return
            }

            dataString = data.Body.toString()

            robot.logger.debug(dataString)

            dataObject = JSON.parse(dataString)

            robot.brain.set(brainKey, dataObject)
            if (msg) {
                robot.logger.debug(dataString)
                msg.send("Refresh complete")
            }
        });
    }

    robot.respond("/lookup(.*)?/i", function (msg) {
        var query = msg.match[1]
        lookup(msg, query)
    });

    robot.respond("/lookup-refresh/i", function (msg) {
        refresh(msg)
    });

    refresh()
}
