var aws = require('aws-sdk');
var fs = require('fs');
var webshot = require('webshot');
/*
module.exports = function (robot) {

    var key = process.env.HUBOT_S3_WEBSHOT_ACCESS_KEY_ID;
    var secret = process.env.HUBOT_S3_WEBSHOT_SECRET_ACCESS_KEY;
    var bucket = process.env.HUBOT_S3_WEBSHOT_BUCKET;
    var brainKey = "webshot";
    var configPath = "webshot.json";

    if (!key) {
        throw new Error('S3 webshot requires HUBOT_S3_WEBSHOT_ACCESS_KEY_ID');
    }
    if (!secret) {
        throw new Error('S3 webshot requires HUBOT_S3_WEBSHOT_SECRET_ACCESS_KEY');
    }
    if (!bucket) {
        throw new Error('S3 webshot requires HUBOT_S3_WEBSHOT_BUCKET');
    }
    robot.logger.debug("Starting webshot");

    aws.config.credentials = {
        accessKeyId: key,
        secretAccessKey: secret
    };

    aws.config.region = "eu-west-1";

    var refresh = function (msg) {
        robot.logger.debug("webshot-refresh");
        s3 = new aws.S3();
        s3.getObject({
            Bucket: bucket,
            Key: configPath,
            ResponseContentType: 'application/json'
        }, function (err, data) {
            robot.logger.debug("webshot-refresh-callback");
            if (err) {
                robot.logger.debug("Request:");
                robot.logger.debug(this.request.httpRequest);
                robot.logger.debug(err);
                if (msg) {
                    msg.send("Failed to refresh from S3: " + err);
                }
                return;
            }

            dataString = data.Body.toString();

            robot.logger.debug(dataString);

            dataObject = JSON.parse(dataString);

            robot.brain.set(brainKey, dataObject);
            if (msg) {
                robot.logger.debug(dataString);
                msg.send("Refresh complete");
            }
        });
    };

    var doWebshot = function (msg, query) {
        robot.logger.debug("webshot - query:" + query);

        var brainEntry = robot.brain.get(brainKey)[query];

        if (!brainEntry) {
            robot.logger.debug("No matching query found. Braindump: " + robot.brain.get(brainKey));
            msg.send("No matching query found. Available queries: " + Object.keys(robot.brain.get(brainKey).join(',')));
        }

        var webshotUrl = brainEntry.url;
        var webshotFile = brainEntry.file;

        webshot(webshotUrl, webshotFile, {
            renderDelay: 10000,
            windowSize: {
                width: 1600,
                height: 1200
            }
        }, function (err) {
            if (err) {
                return robot.logger.debug('Failed to capture screenshot: ' + err);
            }

            var imageUrl = uploadFile(webshotFile);
            if (imageUrl) {
                msg.send(imageUrl);
            }
        });
    };

    var uploadFile = function (fileName) {
        robot.logger.debug("upload-file");

        var fileStream = fs.createReadStream(fileName);

        fileStream.on('error', function (err) {
            if (err) {
                return robot.logger.debug('Error reading file:' + fileName + ' - ' + err);
            }
        });

        fileStream.on('open', function () {
            s3.putObject({
                Bucket: bucket,
                Key: fileName,
                ContentType: 'image/png',
                Body: fileStream
            }, function (err, data) {
                robot.logger.debug("putObject-callback");
                if (err) {
                    robot.logger.debug("Failed to upload to S3:");
                    robot.logger.debug(err);
                    return;
                }

                return bucket + fileName;
            });
        });
    };

    robot.respond("/webshot (.*)?/i", function (msg) {
        doWebshot(msg, msg.match[1]);
    });

    robot.respond("/webshot-refresh/i", function (msg) {
        refresh(msg);
    });

    refresh();
};
*/
