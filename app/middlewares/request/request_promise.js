const log = require('../../configs/log');
const constant = require('../../configs/constants');
const reqPromise = require('request-promise');

exports.getRequest = function (url, business) {
    let headers = {
        'Authorization': 'Basic YWRtaW46YWRtaW4=',
        'Content-Type': 'application/json',
        'TENANT': business
    };
    let options = {
        uri: url,
        method: 'GET',
        headers: headers,
        json: true,
        resolveWithFullResponse: true,
        simple: false
    };

    log.info(`Hitting url :: ${url} with headers :: ${JSON.stringify(headers)}`);
    return reqPromise(options)
};

exports.postRequest = function (url, business, data) {
    let headers = {
        'Authorization': 'Basic YWRtaW46YWRtaW4=',
        'Content-Type': 'application/json',
        'TENANT': business,
        'APPLICATION': constant.APPLICATION
    };

    let options = {
        uri: url,
        method: 'POST',
        body: data,
        headers: headers,
        json: true,
        resolveWithFullResponse: true,
        simple: false
    };

    log.info(`Hitting url :: ${url} with headers :: ${JSON.stringify(headers)} and body :: ${JSON.stringify(data)}`);
    return reqPromise(options)
};