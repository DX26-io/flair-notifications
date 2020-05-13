
const axios = require('axios');
var models = require('./database/models/index');
var logger = require('./logger');
const channelJob = require('./jobs/channelJobs');
const db = require('./database/models/index');
var moment = require('moment');
const util = require('./util');
var config = require('./jobs/team-message-payload');
const AppConfig = require('./jobs/load-notification-config');
var modelsUtil =  require('./jobs/models-utils');

let notificationConfig;

async function init() {
    notificationConfig = await AppConfig.getConfig();
}
init();

exports.sendTeamNotification = async function sendNotification(teamConfig, reportData) {
    config.title = teamConfig.reportTitle;
    var tablekey = Object.keys(teamConfig.tableData[0]);
    var table = "<div style='overflow-x:auto;'><table><tr>";
    var message = [];
    for (var j = 0; j < tablekey.length; j++) {
        table += "<th style='border:1px solid #a0a7a7'>" + tablekey[j] + "</th>";
    }
    table += "</tr><tbody><div>";
    for (let index = 0; index < teamConfig.tableData.length; index++) {
        if (index < notificationConfig.totalRecord) {
            const element = teamConfig.tableData[index];
            table += "<tr>";
            for (var j = 0; j < tablekey.length; j++) {
                table += "<td style='border:1px solid #a0a7a7'>" + element[tablekey[j]] + "</td>";
            }
        }
    }
    table += "</tr></tbody><table>";
    table = modelsUtil.createTableForNotification(teamConfig.tableData,teamConfig.measure);

    config.sections[0].text = table;
    config.sections[0].summary = table;
    config.sections[0].facts[0].value = teamConfig.dashboard;
    config.sections[0].facts[1].value = teamConfig.view;
    config.sections[0].activitySubtitle = teamConfig.description;
    config.potentialAction[0].targets[0].uri = teamConfig.shareLink;
    config.potentialAction[1].targets[0].uri = teamConfig.buildUrl;

    webhookURL = await channelJob.getWebhookList(teamConfig.webhookURL);

    try {

        var notificationSent = false, errorMsg = "";
        thresholdTime = teamConfig.isThresholdReport ? "Threshold run at " + moment(moment().format()).format(util.dateFormat()) : "Scheduled report run at " + moment(moment().format()).format(util.dateFormat());

        config.potentialAction[2].targets[0].uri = util.getViewDataURL(teamConfig.shareLink, teamConfig.schedulerTaskMeta.id);
        config.potentialAction[3].targets[0].uri = teamConfig.flairInsightsLink;

        config.text = thresholdTime + '<br> ![chart image](' + teamConfig.base64 + ')' + '<br><p style="color:#9B41A3;font-size:12px">' + teamConfig.compressText + "</p>";
        if (teamConfig.visualizationType == "Table" || teamConfig.visualizationType == "Pivot Table") {
            config.text = thresholdTime + '<br> ';
        }
        else {
            config.text = thresholdTime + '<br> ![chart image](' + teamConfig.base64 + ')' + '<br><p style="color:#9B41A3;font-size:12px">' + teamConfig.compressText + "</p>";
        }

        return new Promise(async (resolve, reject) => {
            if (webhookURL.records.length == 0) {
                errorMsg = "Webhook is not found."
            }
            else {
                for (let index = 0; index < webhookURL.records.length; index++) {
                    message.push(webhookURL.records[index].config.webhookName)
                    await axios.post(webhookURL.records[index].config.webhookURL, config)
                        .then(async (res) => {
                            try {
                                if (res.data == "1") {
                                    notificationSent = true;
                                }
                                else {
                                    errorMsg = res.data;
                                    notificationSent = false;
                                }

                            } catch (error) {
                                errorMsg = error;
                                logger.log({
                                    level: 'error',
                                    message: 'error occurred while sending team' + reportData.report_obj.thresholdAlert ? ' for threshold alert' : '',
                                    errMsg: error,
                                });

                                reject({
                                    success: 0,
                                    message: 'Something wrong while sending team notification'
                                });
                            }
                        })
                        .catch((error) => {
                            logger.log({
                                level: 'error',
                                message: 'error occurred while sending team message ' + reportData.report_obj.thresholdAlert ? ' for threshold alert' : '',
                                errMsg: error.message
                            });
                            logger.debug({
                                level: 'error',
                                message: 'error occurred while sending team message ' + reportData.report_obj.thresholdAlert ? ' for threshold alert' : '',
                                errMsg: error
                            });

                            reject({
                                success: 0,
                                message: 'Something wrong while sending team notification'
                            });
                        })
                }
            }

            if (notificationSent) {
                logger.log({
                    level: 'info',
                    message: reportData.report_obj.thresholdAlert ? 'team message send for threshold alert' : 'team message send'
                });

                resolve({
                    success: 1,
                    message: message.toString()
                });
            }
            else {
                logger.log({
                    level: 'error',
                    message: 'error occurred while sending team message',
                    errMsg: errorMsg,
                });
                if (errorMsg.indexOf(notificationConfig.teamSizeLimitError >= 0)) {
                    reject({
                        success: 0,
                        message: 'Something wrong while sending team notification'
                    });
                }
                else {
                    reject({
                        success: 0,
                        message: 'Failed to send notification due to MS Teams max size limit reached'
                    });
                }
            }
        })

    } catch (error) {

        logger.log({
            level: 'error',
            message: 'error occurred while sending team message',
            errMsg: error,
        });
        reject({
            success: 0,
            message: 'Something wrong while sending team notification'
        });
    }

}
