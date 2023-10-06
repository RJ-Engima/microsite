const constants = require("../app/configs/constants");
const log = require("../app/configs/log");
const customizeData = require("./middlewares/getCustomizedData");
const mongooseSchema = require('./middlewares/mongooseSchema');
const RegistrationModel = mongooseSchema.registrationData;
const formValidator = require('./middlewares/formValidator');
const request = require("request");
const requestP = require("./middlewares/request_promise");
const queryGenerator = require("./middlewares/queries");
const CaptureKycModel = mongooseSchema.CaptureOnlyKycModel;
const FileStorageConfigModel = mongooseSchema.FileStorageConfigModel;
const fs = require("fs");
var AWS = require("aws-sdk");
var express = require('express');
var app = express();
const path = require("path");
const multer = require('multer');
const moment = require("moment");
const { validationResult } = require('express-validator/check');
let Client = require('ssh2-sftp-client');
const { json } = require("body-parser");
const { callbackify } = require("util");
const logger = require("../app/configs/log");
const sftpConnectConfig = constants.SFTP_CONNECT_CONFIG;
const accountTypeConst = JSON.parse(fs.readFileSync(path.join(__dirname, "/configs/AccountTypeConstants.json"), "utf8"));
const s3 = new AWS.S3({
    accessKeyId: constants.AWS_ACCESS_KEY_ID,
    secretAccessKey: constants.AWS_SECRET_ACCESS_KEY,
    Bucket: constants.AWS_BUCKET_NAME,
    region: constants.AWS_REGION
});
 
const storage = multer.memoryStorage();
var upload = multer({
    storage: storage, fileFilter: function (req, file, cb) {
        let fileType = [".jpg", ".jpeg", ".png", ".pdf", ".JPG", ".JPEG", ".PNG"];
        if (fileType.includes(path.extname(file.originalname))) {
            cb(null, true)
        } else {
            cb(new Error("File format not supported"));
        }
    }, limits: { fileSize: constants.FILE_UPLOAD_SIZE }
}).any();
 
const storage_kyc = multer.diskStorage({
    destination: './dirStorage/uploads/',
    filename: function (req, file, cb) {
        let fileName = JSON.parse(req.body.jsonBody).customerId + '_' + file.fieldname + "_" + moment().format("YYYY-MM-DD");
        let fileNameToReplace = fileName.replace(/\s+/g, '_').toLowerCase() + path.extname(file.originalname);
        cb(null, fileNameToReplace);
    }
});
 
const upload_kyc = multer({
    storage: storage_kyc,
    fileFilter: function (req, file, cb) {
        let fileType = [".jpg", ".jpeg", ".png", ".pdf", ".JPG", ".JPEG", ".PNG"];
        if (fileType.includes(path.extname(file.originalname))) {
            cb(null, true)
        } else {
            cb(new Error("Upload instructed document types"));
        }
    }, limits: { fileSize: constants.FILE_UPLOAD_SIZE }
}).any();
 
 
module.exports = function (app) {
    app.post('/validateLogin', function (req, res) {
 
        log.info("Accessing login for user " + req.body.user);
 
        let validateUserNameAndPasswordJson = {
            "userName": req.body.user,
            "password": req.body.pass
        };
 
        request({
            url: constants.AUTH_LOGIN_URL,
            method: 'POST',
            body: JSON.stringify(validateUserNameAndPasswordJson),
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Basic eWFwcGF5OnlhcHBheQ==",
                'APPLICATION': constants.APP_NAME
            }
        }, function (error, response, body) {
            if (error) {
                log.error(error);
                if (error.code === "EHOSTUNREACH") {
                    res.status(500).send("Something went wrong..! Check your internet connection");
                } else {
                    res.status(500).send(constants.INTERNAL_SERVER_ERROR);
                }
            } else {
                if (response.statusCode === 500) {
                    let errorInfo = JSON.parse(body);
                    log.error("Status Code ::" + response.statusCode + " : Response body :: " + JSON.stringify(body));
                    res.send(response.statusCode, errorInfo.exception.detailMessage);
                } else if (response.statusCode === 200) {
                    let resInfo = JSON.parse(body);
                    log.info("Login Response :: " + JSON.stringify(resInfo));
                    let login = resInfo.result.loginDetail;
                    let application = resInfo.result.applicationDetails[0];
                    let branch = resInfo.result.branchDetails;
 
                    let responseTosend = {};
                    responseTosend.userName = login.userName;
                    responseTosend.userFirstName = login.firstName;
                    responseTosend.userType = login.userType;
                    responseTosend.attempt = login.attempt;
                    let tempDet = customizeData.getSelBxAndDtlRec(login.userType, resInfo.result);
                    if (tempDet.boolean === false) {
                        responseTosend.firstSelectBoxValues = tempDet.selectBoxValues;
                        responseTosend.detailedRecords = tempDet.detailedRecords;
                        responseTosend.businessArr = tempDet.businessArr;
                        let menuData = customizeData.getMenuData(resInfo.result.applicationDetails[0].menuDatas);
                        responseTosend.menuList = menuData.options;
 
                        if (resInfo.result.applicationDetails[0].menuDatas[0].subMenuList.length === 0) {
                            responseTosend.menuLink = resInfo.result.applicationDetails[0].menuDatas[0].menuLink
                        } else {
                            responseTosend.menuLink = resInfo.result.applicationDetails[0].menuDatas[0].subMenuList[0].menuLink;
                        }
                        req.session.userId = login.userName;
                        req.session.userType = responseTosend.userType;
                        req.session.bank = responseTosend.detailedRecords[0].bankName;
                        req.session.role = application.data.role.name;
                        req.session.authLevel = tempDet.detailedRecords[0].noOfAuthLevel;
                        req.session.roleLevel = application.data.role.roleLevel;
                        req.session.userLevel = login.userLevel;
                        req.session.userMenus = menuData.userMenus;
 
                        if (branch == null) {
                            req.session.branch = null;
                        } else {
                            req.session.branch = branch;
                        }
                        if (req.session.userLevel !== 0 && req.session.userLevel != null) {
                            req.session.status = req.session.userLevel;
                        } else {
                            req.session.status = req.session.roleLevel;
                        }
 
                        log.info("RESPONSE TO SEND" + JSON.stringify(responseTosend));
                        res.status(200).send(responseTosend);
                    } else {
                        res.status(500).send("Invalid User Type");
                    }
 
                } else {
                    let errorInfo = JSON.parse(body);
                    log.error("Status Code ::" + response.statusCode + " : Response body :: " + JSON.stringify(body));
                    res.send(response.statusCode, errorInfo.exception.detailMessage);
                }
            }
        });
    });
  //Validate using Accesss Token
  app.post("/validate", function (req, res) {
      log.info("Oauth satrted");
    let accessToken = req.body.accessToken;
    let refreshToken = req.body.refreshToken;
    log.info(accessToken)
    log.info(refreshToken)
 
    if (accessToken === undefined || accessToken === "") {
      log.info("No Access Token found");
      res.redirect("/login");
    } else if (refreshToken === undefined || refreshToken === "") {
      log.info("No Refresh Token found");
      res.redirect("/login");
    } else {
      let applicationUrl = "KYC"
 
      log.info("App URL :: " + req.headers.referrerBaseUrl);
 
      request(
        {
          url: constants.AUTH_TOKEN_URL,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            APPLICATION: applicationUrl,
            authType: "STATIC",
            Authorization: "Bearer " + accessToken,
          },
        },
        function (error, response, body) {
          if (error) {
            res.status(500).send(error);
          } else {
            if (response.statusCode === 500) {
              let errorInfo = JSON.parse(body);
              log.error(
                "Status Code ::" +
                  response.statusCode +
                  " : Response body :: " +
                  JSON.stringify(body)
              );
              res
                .status(response.statusCode)
               .send(errorInfo.exception.detailMessage);
            } else if (response.statusCode === 401) {
              log.info(
                "Access Token is Expired and getting new  Access Token with Refresh Token"
              );
 
              request(
                {
                  url:
                    constants.AUTH_LOGIN_URL +
                    "?grant_type=refresh_token&refresh_token=" +
                    refreshToken,
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: "Basic eWFwcGF5OnlhcHBheQ==",
                    APPLICATION: applicationUrl,
                  },
                },
                function (error, response, body) {
                  log.info(body);
                  if (error) {
                    res.status(500).send(error);
                  } else {
                    if (response.statusCode === 500) {
                      log.info("Refresh Token Invalid/Expired");
                      res.redirect("/login_to");
                    } else if (response.statusCode === 401) {
                      log.info("Invalid Refresh Token");
                      res.redirect("/login_to");
                    } else if (response.statusCode === 200) {
                      req.session.accessToken =
                        response.headers["access_token"];
                      req.session.refreshToken =
                        response.headers["refresh_token"];
                      res.redirect("/tokenLogin");
                    }
                  }
                }
              );
            } else if (response.statusCode === 200) {
              log.info("Logging in using Access Token");
              req.session.accessToken = accessToken;
              req.session.refreshToken = refreshToken;
              let resInfo = JSON.parse(body);
            //   log.info("Login Response :: " + JSON.stringify(resInfo));
              let login = resInfo.result.loginDetail;
              let application = resInfo.result.applicationDetails[0];
              let branch = resInfo.result.branchDetails;
 
              let responseTosend = {};
              responseTosend.userName = login.userName;
              responseTosend.userFirstName = login.firstName;
              responseTosend.userType = login.userType;
              responseTosend.attempt = login.attempt;
              let tempDet = customizeData.getSelBxAndDtlRec(login.userType, resInfo.result);
              if (tempDet.boolean === false) {
                  responseTosend.firstSelectBoxValues = tempDet.selectBoxValues;
                  responseTosend.detailedRecords = tempDet.detailedRecords;
                  responseTosend.businessArr = tempDet.businessArr;
                  let menuData = customizeData.getMenuData(resInfo.result.applicationDetails[0].menuDatas);
                  responseTosend.menuList = menuData.options;
 
                  if (resInfo.result.applicationDetails[0].menuDatas[0].subMenuList.length === 0) {
                      responseTosend.menuLink = resInfo.result.applicationDetails[0].menuDatas[0].menuLink
                  } else {
                      responseTosend.menuLink = resInfo.result.applicationDetails[0].menuDatas[0].subMenuList[0].menuLink;
                  }
                  req.session.programData =  responseTosend.detailedRecords;
                  req.session.firstSelectBoxValues =  responseTosend.firstSelectBoxValues;
                  req.session.menuList =  responseTosend.menuList;
                  req.session.businessArr = tempDet.businessArr
                  req.session.userId = login.userId;
                  req.session.userType = responseTosend.userType;
                  req.session.bank = responseTosend.detailedRecords[0].bankName;
                  req.session.role = application.data.role.name;
                  req.session.authLevel = tempDet.detailedRecords[0].noOfAuthLevel;
                  req.session.roleLevel = application.data.role.roleLevel;
                  req.session.userLevel = login.userLevel;
                  req.session.userMenus = menuData.userMenus;
                  req.session.menuLink = responseTosend.menuLink
                  req.session.userName = login.userName;
                  req.session.userFirstName = login.firstName;
                  req.session.userType = login.userType;
                  req.session.attempt = login.attempt;
 
                  if (branch == null) {
                      req.session.branch = null;
                  } else {
                      req.session.branch = branch;
                  }
                  if (req.session.userLevel !== 0 && req.session.userLevel != null) {
                      req.session.status = req.session.userLevel;
                  } else {
                      req.session.status = req.session.roleLevel;
                  }
                  log.info(tempDet)
                  log.info("RESPONSE TO SEND" + JSON.stringify(tempDet.businessArr));
                  // res.status(200).send(responseTosend);
                //   response.writeHead(301, {
                //       Location: `http://localhost:7878/approveKyc`
                //   }).end();
                res.redirect("/redirecting");
              } else {
                  res.status(500).send("Invalid User Type");
              }
 
            } else {
              let errorInfo = JSON.parse(body);
              log.error(
                "Status Code ::" +
                  response.statusCode +
                  " : Response body :: " +
                  JSON.stringify(body)
              );
              res
                .status(response.statusCode)
                .send(errorInfo.exception.detailMessage);
            }
          }
        }
      );
    }
  });
  app.get('/getUserDetails', function (req, res) {
    let responseTosend = {};
    responseTosend.detailedRecords = req.session.programData;
    responseTosend.userName = req.session.userName;
    responseTosend.userType = req.session.userType;
    responseTosend.userId = req.session.userId;
    responseTosend.firstSelectBoxValues = req.session.firstSelectBoxValues;
    responseTosend.businessSelectBoxValues = req.session.businessArr;
    responseTosend.menuList = req.session.menuList;
    responseTosend.menuLink = req.session.menuLink;
    res.status(200).send(responseTosend);
});
 
 
    // Check Entity ID Already Exists
    app.post('/checkCustomerId', function (req, res) {
 
        log.info("Accessing Check Customer Id :: " + req.body.business + " -- JS Body ::  " + req.body.id);
        request({
            url: constants.M2P_URL + '/business-entity-manager/fetchKitNo/' + req.body.id,
            method: 'GET',
            headers: {
                'Authorization': constants.AUTHORIZATION_TOKEN,
                'Content-Type': 'application/json',
                'TENANT': req.body.business
            }
        }, function (error, response, body) {
            if (error) {
                log.error(error);
                res.status(500).send();
            } else {
                if (response.statusCode === 500) {
                    log.info(JSON.stringify(body));
                    let errorInfo = JSON.parse(body);
                    log.info('Check Customer Id Exists :: StatusCode : ' + response.statusCode + ' ResponseException : ' + errorInfo.exception.shortMessage);
                    res.send(response.statusCode, errorInfo.exception.shortMessage);
                } else if (response.statusCode === 200) {
                    let resInfo = JSON.parse(body);
                    log.info('Check Customer Id Exists :: StatusCode : ' + response.statusCode + ' ResponseResult : ' + JSON.stringify(resInfo.result));
                    res.send(response.statusCode, resInfo.result);
                } else {
                    log.info('Check Customer Id Exists :: ');
                    res.send(response.statusCode, 'Something went wrong');
                }
            }
        });
    });
 
    app.post('/registration', function (req, res) {
 
        upload_kyc(req, res, function (err) {
            if (err) {
                log.error(err);
                if (err instanceof multer.MulterError) {
                    if (err.code === "LIMIT_FILE_SIZE") {
                        res.status(500).send(constants.FILE_UPLOAD_ERR_MSG);
                    } else {
                        res.status(500).send(err.message);
                    }
                } else {
                    log.error(err);
                    res.status(500).send(constants.INTERNAL_SERVER_ERROR);
                }
            } else {
 
 
                let jsonBody = JSON.parse(req.body.jsonBody);
                log.info(jsonBody.business);
                let query = requestP.getPartnerToken(jsonBody.business);
                query.then(partnerObj => {
                    log.info(`Partner Id: ${JSON.stringify(partnerObj)}`);
                    if (typeof partnerObj.partnerUrl != "undefined" && partnerObj.partnerUrl.includes("/v2/register")) {
                        console.log("V2 Registration");
                        registrationV2(req, res);
                    }
                    else {
                        console.log("V3 Registration Routing");
                        registrationV3(req, res);
                    }
 
                });
 
            }
        });
    });
 
 
    function registrationV2(req, res) {
 
        log.info("into V2 registration :: Request Body :: " + JSON.stringify(req.body));
 
        log.info("Bank:::::::: " + req.session.bank);
 
        let jsonBody = JSON.parse(req.body.jsonBody);
        // jsonBody.Contact_No = `+91${jsonBody.Contact_No}`;
 
 
 
        log.info("JSON Body" + JSON.stringify(jsonBody));
        let validator = formValidator.validateRegistrationV2(jsonBody);
 
        if (validator.error) {
            res.status(500).send(validator.error);
        } else {
 
            log.info(validator.registrationV2ApiData.kitInfo[0].kitNo);
            log.info(validator.registrationV2ApiData);
            let resInfo = requestP.postRequest(constants.M2P_URL + "kit-manager/findKitStatus", jsonBody.business, { "kitNo": validator.registrationV2ApiData.kitInfo[0].kitNo });
            resInfo.then(kitResponse => {
                log.info(JSON.stringify(kitResponse));
                if (kitResponse.statusCode === 200) {
                    if (kitResponse.body.result.cardStatus === "UNALLOCATED") {
 
                        let validatorCardType = validator.registrationV2ApiData.kitInfo[0].cardType;
                        let responseCardType = kitResponse.body.result.cardType.charAt(0);
 
                        log.info(validatorCardType);
                        log.info(responseCardType);
 
                        if (validatorCardType === responseCardType) {
                            log.info(req.session.authLevel);
                           if (req.session.authLevel === 0) {
                                let resInfo = requestP.postRequestKyc(requestP.getRpOptions(partnerObj.partnerId, partnerObj.partnerToken, constants.KYC_URL + "kyc/v2/register", validator.registrationV2ApiData));
                                resInfo.then((response) => {
                                    log.info("V2 Response: :: " + JSON.stringify(response));
                                    if (response.statusCode === 200) {
                                        let kycRefNo;
 
                                        if (req.files.length === 0) {
                                            kycRefNo = response.body.result.kycRefNo;
                                            // res.status(500).send("Upload Kyc documents to continue");
                                            res.status(200).send("Registered Successfully");
                                        } else {
                                            uploadKycDocuments(jsonBody, req).then(partnerObj => {
                                                if (partnerObj == null) {
                                                    res.status(500).send(constants.PARTNER_TOKEN_NOT_FOUND);
                                                } else {
                                                    requestP.postRequestKyc(requestP.getRpOptions(partnerObj.partnerId, partnerObj.partnerToken, constants.UPLOAD_KYC_URL_V2, req.session.obj)).then((response) => {
                                                        log.info(JSON.stringify(response));
                                                        if (response.statusCode === 200) {
                                                            registerToMongo(validator, kycRefNo, req.session.documents, req, res);
                                                        } else {
                                                            res.status(500).send(response.body.exception.detailMessage);
                                                        }
                                                    }).catch((err) => {
                                                        log.error(err);
                                                        res.status(500).send(constants.INTERNAL_SERVER_ERROR);
                                                    })
                                                }
                                            })
                                        }
                                    }
                                }).catch((err) => {
                                    log.error(err);
                                    res.status(500).send(constants.INTERNAL_SERVER_ERROR);
                                });
                            } else {
                                if (req.files.length === 0) {
                                    CaptureKycModel.findOne({
                                        "business": jsonBody.business,
                                        "kitNumber": jsonBody.kitNo
                                    }, function (err, userObj) {
                                        if (userObj == null) {
                                            registerToMongo(validator, null, [], req, res);
                                        } else {
                                            registerToMongo(validator, null, userObj.kycData.documents, req, res);
                                        }
                                    });
                                } else {
                                    let documents = [];
                                    for (let i = 0; i < req.files.length; i++) {
 
                                        if (path.extname(req.files[i].originalname) === '.pdf' && req.files[i].size > constants.PDF_UPLOAD_SIZE) {
                                            return res.status(500).send(constants.PDF_UPLOAD_ERR_MSG);
                                        }
                                        let fileData = {};
                                        fileData["documentFilePath"] = constants.UPLOAD_SERVER_PATH + req.session.bank + "/" + jsonBody.business + "/" + (jsonBody.customerId + '_' + req.files[i].fieldname + "_" + moment().format("YYYY-MM-DD")).replace(/\s+/g, '_').toLowerCase() + path.extname(req.files[i].originalname);
                                        fileData["documentType"] = req.files[i].fieldname;
                                        fileData["documentFileName"] = (jsonBody.customerId + '_' + req.files[i].fieldname + "_" + moment().format("YYYY-MM-DD")).replace(/\s+/g, '_').toLowerCase() + path.extname(req.files[i].originalname);
                                        documents.push(fileData);
                                    }
                                    registerToMongo(validator, null, documents, req, res);
                                }
                            }
                        } else {
                            res.status(500).send(constants.KIT_CARD_MISMATCH);
                        }
                    } else {
                        res.status(500).send(constants.KIT_ASSIGNED_ALREADY);
                    }
                } else {
                    res.status(500).send(constants.KIT_NOT_FOUND);
                }
            }).catch(err => {
                log.error(err);
                res.status(500).send(constants.KIT_NOT_FOUND);
            })
 
 
 
 
 
        }
    }
 
    function registrationV3(req, res) {
 
        log.info("into V3 registration :: Request Body :: " + JSON.stringify(req.body));
 
        log.info("Bank:::::::: " + req.session.bank);
 
        let jsonBody = JSON.parse(req.body.jsonBody);
        jsonBody.contactNo = `+91${jsonBody.contactNo}`;
        let validator = formValidator.validateRegistrationV3(jsonBody);
        log.info("JSON Body" + JSON.stringify(jsonBody));
 
        if (validator.error) {
            res.status(500).send(validator.error);
        } else {
            log.info("Checking Kit Status for V3 Registration");
            let resInfo = requestP.postRequest(constants.M2P_URL + "kit-manager/findKitStatus", jsonBody.business, { "kitNo": validator.registrationApiData.kitNo });
            resInfo.then(kitResponse => {
                log.info(JSON.stringify(kitResponse));
                if (kitResponse.statusCode === 200) {
                    if (kitResponse.body.result.cardStatus === "UNALLOCATED") {
                        if (validator.registrationApiData.cardType === kitResponse.body.result.cardType.charAt(0)) {
                            if (req.session.authLevel === 0) {
                                let resInfo = requestP.postRequest(constants.M2P_URL + "/registration-manager/v3/register", jsonBody.business, validator.registrationApiData);
                                resInfo.then((response) => {
                                    log.info(JSON.stringify(response));
                                    if (response.statusCode === 200) {
                                        let kycRefNo;
                                        if (req.files.length === 0) {
                                            kycRefNo = response.body.result.kycRefNo;
                                            res.status(500).send("Upload Kyc documents to continue");
                                        } else {
                                            log.info("Uploading Documents");
                                            uploadKycDocuments(jsonBody, req).then(partnerObj => {
                                                if (partnerObj == null) {
                                                    res.status(500).send(constants.PARTNER_TOKEN_NOT_FOUND);
                                                } else {
                                                    requestP.postRequestKyc(requestP.getRpOptions(partnerObj.partnerId, partnerObj.partnerToken, constants.UPLOAD_KYC_URL_V2, req.session.obj)).then((response) => {
                                                        log.info(JSON.stringify(response));
                                                        if (response.statusCode === 200) {
                                                            registerToMongo(validator, kycRefNo, req.session.documents, req, res);
                                                        } else {
                                                            res.status(500).send(response.body.exception.detailMessage);
                                                        }
                                                    }).catch((err) => {
                                                        log.error(err);
                                                        res.status(500).send(constants.INTERNAL_SERVER_ERROR);
                                                    })
                                                }
                                            })
                                        }
                                    }
                                }).catch((err) => {
                                    log.error(err);
                                    res.status(500).send(constants.INTERNAL_SERVER_ERROR);
                                });
                            } else {
                                if (req.files.length === 0) {
                                    CaptureKycModel.findOne({
                                        "business": jsonBody.business,
                                        "kitNumber": jsonBody.kitNo
                                    }, function (err, userObj) {
                                        if (userObj == null) {
                                            registerToMongo(validator, null, [], req, res);
                                        } else {
                                            registerToMongo(validator, null, userObj.kycData.documents, req, res);
                                        }
                                    });
                                } else {
                                    let documents = [];
                                    for (let i = 0; i < req.files.length; i++) {
 
                                        if (path.extname(req.files[i].originalname) === '.pdf' && req.files[i].size > constants.PDF_UPLOAD_SIZE) {
                                            return res.status(500).send(constants.PDF_UPLOAD_ERR_MSG);
                                        }
                                        let fileData = {};
                                        fileData["documentFilePath"] = constants.UPLOAD_SERVER_PATH + req.session.bank + "/" + jsonBody.business + "/" + (jsonBody.customerId + '_' + req.files[i].fieldname + "_" + moment().format("YYYY-MM-DD")).replace(/\s+/g, '_').toLowerCase() + path.extname(req.files[i].originalname);
                                        fileData["documentType"] = req.files[i].fieldname;
                                        fileData["documentFileName"] = (jsonBody.customerId + '_' + req.files[i].fieldname + "_" + moment().format("YYYY-MM-DD")).replace(/\s+/g, '_').toLowerCase() + path.extname(req.files[i].originalname);
                                        documents.push(fileData);
                                    }
                                    registerToMongo(validator, null, documents, req, res);
                                }
                            }
                        } else {
                            res.status(500).send(constants.KIT_CARD_MISMATCH);
                        }
                    } else {
                        res.status(500).send(constants.KIT_ASSIGNED_ALREADY);
                    }
                } else {
                    res.status(500).send(constants.KIT_NOT_FOUND);
                }
            }).catch(err => {
                log.error(err);
                res.status(500).send(constants.KIT_NOT_FOUND);
            })
        }
        //     }
        // });
    }
 
    app.post('/editRegistration', function (req, res) {
        upload_kyc(req, res, function (err) {
            if (err) {
                log.error(err);
                if (err instanceof multer.MulterError) {
                    if (err.code === "LIMIT_FILE_SIZE") {
                        res.status(500).send(constants.FILE_UPLOAD_ERR_MSG);
                    } else {
                        res.status(500).send(err.message);
                    }
                } else {
                    log.error(err);
                    res.status(500).send(constants.INTERNAL_SERVER_ERROR);
                }
            } else {
 
                let jsonBody = JSON.parse(req.body.jsonBody);
                log.info(jsonBody.business);
 
                let query = requestP.getPartnerToken(jsonBody.business);
                query.then(partnerObj => {
                    log.info(`Partner Id: ${JSON.stringify(partnerObj)}`);
 
                    let validator;
                    if (typeof partnerObj.partnerUrl != "undefined" && partnerObj.partnerUrl.includes("/v2/register")) {
 
                        log.info("into edit V2 registration :: Request Body :: " + JSON.stringify(req.body));
                        let jsonBody = JSON.parse(req.body.jsonBody);
                        validator = formValidator.validateRegistrationV2(jsonBody, "edit");
                    }
                    else {
 
                        log.info("into edit V3 registration :: Request Body :: " + JSON.stringify(req.body));
                        let jsonBody = JSON.parse(req.body.jsonBody);
                        validator = formValidator.validateRegistrationV3(jsonBody, "edit");
                    }
                    if (validator.error) {
                        res.status(500).send(validator.error);
                    } else {
                        let kitNo;
                        let cardType;
                        if (typeof partnerObj.partnerUrl != "undefined" && partnerObj.partnerUrl.includes("/v2/register")) {
                            kitNo = validator.registrationV2ApiData.kitInfo[0].kitNo;
                            cardType = validator.registrationV2ApiData.kitInfo[0].cardType;
                        }
                        else {
                            kitNo = validator.registrationApiData.kitNo;
                            cardType = validator.registrationApiData.cardType;
                        }
 
                        let resInfo = requestP.postRequest(constants.M2P_URL + "kit-manager/findKitStatus", jsonBody.business, { "kitNo": kitNo });
                        resInfo.then(kitResponse => {
                            log.info(JSON.stringify(kitResponse));
                            if (kitResponse.statusCode === 200) {
                                if (kitResponse.body.result.cardStatus === "UNALLOCATED") {
 
                                    if (cardType === kitResponse.body.result.cardType.charAt(0)) {
                                        RegistrationModel.findById(jsonBody.id, function (err, userObj) {
                                            if (err) {
                                                log.error(err);
                                                res.status(500).send(constants.INTERNAL_SERVER_ERROR);
                                            } else {
                                                if (userObj == null) {
                                                    log.error("user not found");
                                                    res.status(500).send(constants.INTERNAL_SERVER_ERROR);
                                                } else {
                                                    if (req.files.length === 0) {
                                                        updateToMongo(validator, userObj.kycData == null ? [] : userObj.kycData.documents, userObj, req, res);
                                                    } else {
                                                        let documents;
                                                        if (userObj.kycData == null) {
                                                            documents = [];
                                                            for (let i = 0; i < req.files.length; i++) {
                                                                let fileData = {};
                                                                fileData["documentFilePath"] = constants.UPLOAD_SERVER_PATH + req.session.bank + "/" + jsonBody.business + "/" + (jsonBody.customerId + '_' + req.files[i].fieldname + "_" + moment().format("YYYY-MM-DD")).replace(/\s+/g, '_').toLowerCase() + path.extname(req.files[i].originalname);
                                                                fileData["documentType"] = req.files[i].fieldname;
                                                                fileData["documentFileName"] = (jsonBody.customerId + '_' + req.files[i].fieldname + "_" + moment().format("YYYY-MM-DD")).replace(/\s+/g, '_').toLowerCase() + path.extname(req.files[i].originalname);
                                                                documents.push(fileData);
                                                            }
                                                            updateToMongo(validator, documents, userObj, req, res);
                                                        } else {
                                                            let files = req.files;
                                                            documents = userObj.kycData.documents;
                                                            for (let i = 0; i < files.length; i++) {
                                                                let bool = false;
                                                                for (let j = 0; j < documents.length; j++) {
                                                                    if (req.files[i].fieldname === documents[j].documentType) {
                                                                        bool = true;
                                                                        documents[j].documentFileName = (jsonBody.customerId + '_' + req.files[i].fieldname + "_" + moment().format("YYYY-MM-DD")).replace(/\s+/g, '_').toLowerCase() + path.extname(req.files[i].originalname);
                                                                        documents[j].documentFilePath = constants.UPLOAD_SERVER_PATH + req.session.bank + "/" + jsonBody.business + "/" + (jsonBody.customerId + '_' + req.files[i].fieldname + "_" + moment().format("YYYY-MM-DD")).replace(/\s+/g, '_').toLowerCase() + path.extname(req.files[i].originalname);
                                                                        break;
                                                                    }
                                                                }
                                                                if (bool === false) {
                                                                    let doc = {
                                                                        "documentType": req.files[i].fieldname,
                                                                        "documentFileName": (jsonBody.customerId + '_' + req.files[i].fieldname + "_" + moment().format("YYYY-MM-DD")).replace(/\s+/g, '_').toLowerCase() + path.extname(req.files[i].originalname),
                                                                        "documentFilePath": constants.UPLOAD_SERVER_PATH + req.session.bank + "/" + jsonBody.business + "/" + (jsonBody.customerId + '_' + req.files[i].fieldname + "_" + moment().format("YYYY-MM-DD")).replace(/\s+/g, '_').toLowerCase() + path.extname(req.files[i].originalname)
                                                                    };
                                                                    documents.push(doc);
                                                                }
 
                                                            }
                                                            updateToMongo(validator, documents, userObj, req, res);
                                                        }
                                                    }
                                                }
                                            }
                                        });
                                    } else {
                                        res.status(500).send(constants.KIT_CARD_MISMATCH);
                                    }
                                } else {
                                    res.status(500).send(constants.KIT_ASSIGNED_ALREADY);
                                }
                            } else {
                                res.status(500).send(constants.KIT_NOT_FOUND);
                            }
                        }).catch(err => {
                            log.error(err);
                            res.status(500).send(constants.KIT_NOT_FOUND);
                        })
                    }
 
                })
            }
        });
    });
 
 
    app.post("/viewRegistration", function (req, res) {
        let searchId = req.body.id;
        RegistrationModel.findById(searchId, function (err, userObj) {
            if (err) {
                log.error(err);
                res.status(500).send(constants.INTERNAL_SERVER_ERROR);
            } else {
                if (userObj == null) {
                    res.status(404).send()
                } else {
                    let data = {};
                    if (typeof userObj.registrationV2Data != "undefined" && userObj.registrationV2Data != null) {
                        data.registrationV2Data = userObj.registrationV2Data;
                        log.info(JSON.stringify(data.registrationV2Data));
                    }
                    else {
                        data.registrationData = userObj.registrationData;
                        log.info(JSON.stringify(data.registrationData));
                    }
 
                    data.kycData = userObj.kycData;
                    data.corporate = userObj.corporate;
                    data.business = userObj.business;
                    if (userObj.kycData != null) {
                        userObj.kycData.documents.forEach(elem => {
                            elem.documentViewType = path.extname(elem.documentFileName);
                        });
                    }
                    if (req.headers.referer.split("/")[3] === "viewRegistration") {
                        data.readOnly = true;
                    }
 
                    res.send(data);
 
                }
            }
        })
 
    });
 
 
    app.post("/registration/getFileData", (req, res) => {
        log.info("Request body for get file data" + JSON.stringify(req.body));
        try {
            var bitmap = fs.readFileSync(constants.UPLOAD_FILE_PATH + req.body.documentFileName);
            let responseBody = { "base64String": "" };
            responseBody.base64String = Buffer.from(bitmap).toString("base64");
            let documentViewType = path.extname(req.body.documentFileName);
            let docViewArr = [".jpg", ".jpeg", ".png", ".JPG", ".JPEG", ".PNG"];
            if (docViewArr.includes(documentViewType)) {
                responseBody.base64String = `data:image/png;base64,${responseBody.base64String}`;
            }
            if (documentViewType === ".pdf") {
                responseBody.base64String = `data:application/pdf;base64,${responseBody.base64String}`;
            } if ((documentViewType === ".tiff") || (documentViewType === ".tif")) {
                responseBody.base64String = `data:application/tiff;base64,${responseBody.base64String}`;
            }
            res.send(responseBody);
        } catch (e) {
            log.info(e);
            res.status(500).send(constants.INTERNAL_SERVER_ERROR);
        }
    })
 
    app.post("/kyc/getFileData", (req, res, resp) => {
        console.log('checking for view registration getFileData.',req.body.documentFileName)
        log.info("Request body for get file data" + JSON.stringify(req.body));
        let query = requestP.getPartnerToken(req.body.business);
        query.then(partnerObj => {
            if (typeof partnerObj.s3BucketEnabled !== "undefined" && partnerObj.s3BucketEnabled != false) {
                log.info("Contacting S3 Bucket for the file : ");
 
                let responseBody = {
                    "base64String": ""
                };
 
                let fileName = partnerObj.bank + "/" + partnerObj.partnerId + "/" + req.body.documentFileName;
                log.info("File Name to fetch : " + fileName);
                let params = {
                    Bucket: constants.AWS_BUCKET_NAME,
                    Key: fileName
                };
 
                s3.getObject(params).promise().then((data) => {
                    fs.writeFileSync(constants.DOWNLOAD_FILE_PATH + req.body.documentFileName, data.Body)
                    log.info('file downloaded successfully')
                    try {
                        let bitmap = fs.readFileSync(constants.DOWNLOAD_FILE_PATH + req.body.documentFileName);
                        responseBody.base64String = Buffer.from(bitmap).toString("base64");
                        let documentViewType = path.extname(req.body.documentFileName);
                        let docViewArr = [".jpg", ".png", ".jpeg"];
                        if (docViewArr.includes(documentViewType.toLowerCase())) {
                            responseBody.base64String = `data:image/png;base64,${responseBody.base64String}`;
                        }
                        if (documentViewType === ".pdf") {
                            responseBody.base64String = `data:application/pdf;base64,${responseBody.base64String}`;
                        } if ((documentViewType === ".tiff") || (documentViewType === ".tif")) {
                            responseBody.base64String = `data:application/tiff;base64,${responseBody.base64String}`;
                        }
                        res.status(200).send(responseBody);
                    } catch (e) {
                        log.info(e);
                        res.status(500).send(constants.INTERNAL_SERVER_ERROR);
                    }
                }).catch((err) => {
                    log.error(err);
                    res.status(500).send(constants.INTERNAL_SERVER_ERROR);
                })
            } else {
                let sftp = new Client();
                sftp.connect(sftpConnectConfig, 'on').then(() => {
                    log.info("Established successful connection with sftp server");
                    sftp.fastGet(constants.UPLOAD_SERVER_PATH + partnerObj.bank + "/" + partnerObj.partnerId + "/" + req.body.documentFileName, constants.DOWNLOAD_FILE_PATH + req.body.documentFileName, {}).then((response) => {
                        log.info(JSON.stringify(response));
                        let responseBody = {
                            "base64String": ""
                        };
                        try {
                            let bitmap = fs.readFileSync(constants.DOWNLOAD_FILE_PATH + req.body.documentFileName);
                            responseBody.base64String = Buffer.from(bitmap).toString("base64");
                            let documentViewType = path.extname(req.body.documentFileName);
                            let docViewArr = [".jpg", ".png", ".jpeg"];
                            if (docViewArr.includes(documentViewType.toLowerCase())) {
                                responseBody.base64String = `data:image/png;base64,${responseBody.base64String}`;
                            }
                            if (documentViewType === ".pdf") {
                                responseBody.base64String = `data:application/pdf;base64,${responseBody.base64String}`;
                            }
                            res.status(200).send(responseBody);
                        } catch (e) {
                            log.info(e);
                            res.status(500).send(constants.INTERNAL_SERVER_ERROR);
                        }
                    }).catch((err) => {
                        log.info(err);
                        res.status(500).send(constants.INTERNAL_SERVER_ERROR);
                    })
                }).catch((err) => {
                    log.error("Error connecting sftp");
                    sftp.end().then(() => log.info("SFTP connection closed")).catch((err) => log.error(err));
                    console.error(err);
                    res.status(500).send(constants.INTERNAL_SERVER_ERROR);
                })
            }
        });
    });
 
 
    app.post("/docDelete", function (req, res) {
        log.info("Request body to delete kyc document" + JSON.stringify(req.body.docDelete));
        var delObj = req.body.docDelete;
        let query = requestP.getPartnerToken(req.body.business);
        query.then(partnerObj => {
            if (partnerObj == null) {
                res.status(500).send(constants.PARTNER_TOKEN_NOT_FOUND)
            } else {
                let resInfo = requestP.postRequestKyc(requestP.getRpOptions(partnerObj.partnerId, partnerObj.partnerToken, constants.KYC_BASE_URL + "kyc/delete/documents", delObj));
                resInfo.then((response) => {
                    log.info(JSON.stringify(response));
                    if (response.statusCode === 200) {
                        var resInfo = JSON.stringify(response.body);
                        console.log(JSON.stringify(response.body));
                        res.send(response.statusCode, resInfo);
                    } else if (response.statusCode === 500) {
                        log.info(JSON.stringify(body));
                        let errorInfo = JSON.parse(body);
                        log.info('Check Customer Id Exists :: StatusCode : ' + response.statusCode + ' ResponseException : ' + errorInfo.exception.shortMessage);
                        res.send(response.statusCode, errorInfo.exception.shortMessage);
                    } else {
                        log.info('No Document Exists :: ');
                        res.send(response.statusCode, 'Something went wrong');
                    }
                }).catch((err) => {
                    log.error(err);
                    res.status(500).send(constants.INTERNAL_SERVER_ERROR);
                })
            }
        });
 
    });
 
    app.post("/fetchKycViaRefNo/:type", (req, res) => {
        console.log("FetchByRefno is called : ");
        let kycObj = {
            "kycRefNo": req.body.kycRefNo
        };
        let query = requestP.getPartnerToken(req.body.business);
        query.then(partnerObj => {
            if (partnerObj == null) {
                res.status(500).send(constants.PARTNER_TOKEN_NOT_FOUND)
            } else {
                let resInfo = requestP.postRequestKyc(requestP.getRpOptions(partnerObj.partnerId, partnerObj.partnerToken, constants.KYC_BASE_URL + "kyc/fetchByKycRefNo", kycObj));
                resInfo.then((response) => {
                    log.info(JSON.stringify(response));
                    if (response.statusCode === 200) {
                        let data = {};
                        if (req.params.type === "all") {
                            data.registrationData = response.body.result.registration;
                            data.parentData = response.body.result.parentDetails;
                            data.documents = response.body.result.documents;
                            data.kycInfo = response.body.result.kycInfo;
                            if (data.documents.length === 0) {
                                res.send(data);
                            } else {
                                FileStorageConfigModel.findOne({ "business": req.body.business }).lean().exec(function (err, fileStorageConfig) {
                                    if (err) {
                                        log.error(err);
                                        res.status(500).send(constants.INTERNAL_SERVER_ERROR);
                                    } else {
                                        if (fileStorageConfig != null) {
                                            data.stream = fileStorageConfig.stream;
                                            if (fileStorageConfig.stream) {
                                                //code for other stream options goes here
                                                res.send(data);
                                            } else {
                                                res.send(data);
                                            }
                                        } else {
                                            for (let i = 0; i < data.documents.length; i++) {
                                                data.documents[i].documentViewType = path.extname(data.documents[i].documentFileName);
                                            }
                                            data.stream = true;
                                            res.send(data);
                                        }
                                    }
                                });
                            }
                        } else if (req.params.type === "doc") {
                            let data = {};
                            data.documents = response.body.result.documents;
                            let sftpDownloadArr = [];
                            if (data.documents.length === 0) {
                                res.send(data);
                            } else {
 
                                if (typeof partnerObj.s3BucketEnabled !== "undefined" && partnerObj.s3BucketEnabled != false) {
                                    log.info("Contacting S3 Bucket for the file : ");
                                    let doc = data.documents;
                                    for (let i = 0; i < data.documents.length; i++) {
 
                                        let fileName = partnerObj.bank + "/" + partnerObj.partnerId + "/" + doc[i].documentFileName;
                                        log.info("File Name to fetch : " + fileName);
                                        let params = {
                                            Bucket: constants.AWS_BUCKET_NAME,
                                            Key: fileName
                                        };
 
                                        s3.getObject(params).promise().then((data) => {
                                            fs.writeFileSync(constants.DOWNLOAD_FILE_PATH + doc[i].documentFileName, data.Body)
                                            log.info('file downloaded successfully')
 
                                        }).catch((err) => {
                                            log.error(err);
                                        })
                                    }
 
                                    for (let j = 0; j < doc.length; j++) {
                                        doc[j].documentViewType = path.extname(doc[j].documentFileName);
                                        let bitmap = fs.readFileSync(constants.DOWNLOAD_FILE_PATH + doc[j].documentFileName);
                                        doc[j].base64String = Buffer.from(bitmap).toString("base64");
                                    }
                                    res.send(data);
                                }
                                else {
                                    log.info("Regual SFTP File Fetch : ");
                                    sftp.connect(sftpConnectConfig, 'on').then(() => {
                                        log.info("Connected to SFTP");
                                        let doc = data.documents;
                                        for (let i = 0; i < data.documents.length; i++) {
                                            let sftpPromise;
                                            sftpPromise = sftp.fastGet(constants.UPLOAD_SERVER_PATH + req.session.bank + "/" + req.body.business + "/" + doc[i].documentFileName, constants.DOWNLOAD_FILE_PATH + doc[i].documentFileName, {});
                                            sftpDownloadArr.push(sftpPromise);
                                        }
 
                                        Promise.all(sftpDownloadArr).then((info) => {
                                            log.info(JSON.stringify(info));
                                            sftp.end().then(() => log.info("SFTP Connection closed")).catch((err) => log.error(err));
 
                                            let doc = data.documents;
                                            for (let j = 0; j < doc.length; j++) {
                                                doc[j].documentViewType = path.extname(doc[j].documentFileName);
                                                let bitmap = fs.readFileSync(constants.DOWNLOAD_FILE_PATH + doc[j].documentFileName);
                                                doc[j].base64String = Buffer.from(bitmap).toString("base64");
                                            }
                                            res.send(data);
                                        }).catch(err => {
                                            log.error("Error reading files");
                                            console.log(err);
                                            res.status(500).send(constants.INTERNAL_SERVER_ERROR);
                                        })
                                    }).catch((err) => {
                                        log.error("Error connecting sftp");
                                        sftp.end().then(() => log.info("SFTP connection closed")).catch((err) => log.error(err));
                                        console.log(err);
                                        res.status(500).send(constants.INTERNAL_SERVER_ERROR);
                                    })
                                }
 
                            }
                        }
                    } else {
                        res.status(500).send(response.body.exception.detailMessage);
                    }
                }).catch((err) => {
                    log.error(err);
                    res.status(500).send(constants.INTERNAL_SERVER_ERROR);
                })
            }
        })
    });
 
    app.get('/fetchDetailsByEntityId/:entityId/:business', function (req, res) {
        log.info("Accessing fetch Entity Details  :: " + req.params.business + " -- JS Body ::  " + req.params.entityId);
        let resInfo = requestP.getRequest(constants.KYC_BASE_URL + 'kyc/fetchdetails/fetchByentity?entityId=' + req.params.entityId, req.params.business);
        resInfo.then((response) => {
            log.info(`Fetch Details Response: ${JSON.stringify(response)}`);
            if (response.statusCode === 200) {
                req.session.entity = response.body.result;
                console.log('Response Stored :' + req.session.entity);
                res.send(response);
            } else {
                res.status(500).send();
            }
        }).catch((err) => {
            log.error(err);
            res.status(500).send(customizeData.setKycResponse(null, constants.INTERNAL_SERVER_ERROR));
        });
    });
 
    app.post('/creditcheck/pull', function (req, res) {
        log.info("Accessing Credit Pull Details  :: " + req.session.entity.business + " -- JS Body ::  " + req.session.entity.entityId);
 
        let addressInfo = null, gender = null, dateInfo = null, re, panNo = null, aadharNo = null, voterId = null,
            drivingLicense = null, passportNo = null, rationCardNo = null, motherName = null, spouseName = null;
 
        if (req.session.entity != null) {
            for (i = 0; i < req.session.entity.addressInfo.length; i++) {
                if (req.session.entity.addressInfo[i].addressCategory.includes('PERMANENT')) {
                    addressInfo = [req.session.entity.addressInfo[i]];
                }
            }
 
            if (req.session.entity.gender === "MALE" && req.session.entity.gender != null) {
                gender = "M";
            } else if (req.session.entity.gender === "FEMALE" && req.session.entity.gender != null) {
                gender = "F";
           } else {
                gender = "T";
            }
 
            if (req.session.entity.motherName != null) {
                motherName = req.session.entity.motherName;
            }
            if (req.session.entity.spouseName != null) {
                spouseName = req.session.entity.spouseName;
            }
 
            for (i = 0; i < req.session.entity.dateInfo.length; i++) {
                req.session.entity.dateInfo[i].date = moment(req.session.entity.dateInfo[i].date).format("YYYY-MM-DD");
            }
 
            for (i = 0; i < req.session.entity.kycInfo.length; i++) {
                if (req.session.entity.kycInfo[i].documentType === "PAN" && req.session.entity.kycInfo[i].documentType) {
                    panNo = req.session.entity.kycInfo[i].documentNo;
                }
                if (req.session.entity.kycInfo[i].documentType === "AADHAR" && req.session.entity.kycInfo[i].documentType) {
                    aadharNo = req.session.entity.kycInfo[i].documentNo;
                }
 
                if (req.session.entity.kycInfo[i].documentType === "VOTERID" && req.session.entity.kycInfo[i].documentType) {
                    voterId = req.session.entity.kycInfo[i].documentNo;
                }
 
                if (req.session.entity.kycInfo[i].documentType === "DRIVINGLICENCE" && req.session.entity.kycInfo[i].documentType) {
                    drivingLicense = req.session.entity.kycInfo[i].documentNo;
                }
 
                if (req.session.entity.kycInfo[i].documentType === "PASSPORT" && req.session.entity.kycInfo[i].documentType) {
                    passportNo = req.session.entity.kycInfo[i].documentNo;
                }
 
                if (req.session.entity.kycInfo[i].documentType === "RATIONCARD" && req.session.entity.kycInfo[i].documentType) {
                    rationCardNo = req.session.entity.kycInfo[i].documentNo;
                }
            }
 
            re = {
                "panNo": panNo,
                "aadharNo": aadharNo,
                "voterId": voterId,
                "drivingLicense": drivingLicense,
                "passportNo": passportNo,
                "rationCardNo": rationCardNo,
                "addressDtos": addressInfo,
                "communicationDtos": req.session.entity.communicationInfo,
                "specialDateDtos": req.session.entity.dateInfo,
                "firstName": req.session.entity.firstName,
                "middleName": req.session.entity.middleName,
                "lastName": req.session.entity.lastName,
                "gender": gender,
                "fatherName": req.session.entity.fatherName,
                "motherName": motherName,
                "spouseName": spouseName,
                "ownHouse": false
            }
        }
        let responseToSend;
        let mappedAccounts;
        log.info('RE Variable', re);
        let resInfo = requestP.postRequest(constants.CREDIT_CARD_URL + 'statement/creditcheck/pull', req.session.entity.business, re);
        resInfo.then((response) => {
            log.info(`Fetch Details Response: ${JSON.stringify(response)}`);
            if (response.statusCode === 200) {
                if (response.body.result.accounts != null) {
                    let accounts = response.body.result.accounts;
                    mappedAccounts = accounts.map(item => {
                        let newItem = item;
                        newItem.accountNonSummarySegmentFields.accountType = getAccountType(item.accountNonSummarySegmentFields.accountType);
                        return newItem;
                    });
                    log.info('mapped accounts :', mappedAccounts);
                }
 
                let allAccType = [];
                if (typeof mappedAccounts === "undefined") {
                    log.info('mapped accounts is undefined skipping mapping');
                } else {
                    mappedAccounts.forEach(ele => {
                        allAccType.push(ele.accountNonSummarySegmentFields.accountType);
                    });
                }
                let accType = [...new Set(allAccType)];
                log.info('accType', accType);
                if (typeof mappedAccounts === "undefined") {
                    responseToSend = response.body.result;
                } else {
                    responseToSend = response.body.result;
                    responseToSend.accounts = mappedAccounts;
                    responseToSend.accType = accType;
                }
                log.info('acctypetosend', responseToSend);
                res.status(200).send(responseToSend);
            } else {
                res.status(500).send();
            }
        }).catch((err) => {
            log.error(err);
            res.status(500).send(customizeData.setKycResponse(null, constants.INTERNAL_SERVER_ERROR));
        });
    });
 
    function getAccountType(number) {
        let result = accountTypeConst.filter(element => {
            return element.number === number
        });
 
        return result[0].text;
    }
 
    // app.post('/creditcheck/pull', function (req, res) {
    //     log.info("Accessing Credit Pull Details  :: " + req.session.entity.business + " -- JS Body ::  " + req.session.entity.entityId);
    //
    //     let addressInfo = null;
    //
    //     let gender = null;
    //
    //     let dateInfo = null;
    //
    //     let re;
    //
    //     let panNo = null;
    //
    //     let aadharNo = null;
    //
    //     let voterId = null;
    //
    //     let drivingLicense = null;
    //
    //     let passportNo = null;
    //
    //     let rationCardNo = null;
    //
    //     let motherName = null;
    //
    //     let spouseName = null;
    //
    //     if (req.session.entity != null) {
    //         for (i = 0; i < req.session.entity.addressInfo.length; i++) {
    //             if (req.session.entity.addressInfo[i].addressCategory.includes('PERMANENT')) {
    //                 addressInfo = [req.session.entity.addressInfo[i]];
    //             }
    //         }
    //
    //         if (req.session.entity.gender === "MALE" && req.session.entity.gender != null) {
    //             gender = "M";
    //         } else if (req.session.entity.gender === "FEMALE" && req.session.entity.gender != null) {
    //             gender = "F";
    //         } else {
    //             gender = "T";
    //         }
    //
    //         if (req.session.entity.motherName != null) {
    //             motherName = req.session.entity.motherName;
    //         }
    //         if (req.session.entity.spouseName != null) {
    //             spouseName = req.session.entity.spouseName;
    //
    //         }
    //
    //
    //         for (i = 0; i < req.session.entity.dateInfo.length; i++) {
    //
    //             let date = moment(req.session.entity.dateInfo[i].date).format("YYYY-MM-DD");
    //             req.session.entity.dateInfo[i].date = date;
    //         }
    //
    //         for (i = 0; i < req.session.entity.kycInfo.length; i++) {
    //
    //             if (req.session.entity.kycInfo[i].documentType === "PAN" && req.session.entity.kycInfo[i].documentType) {
    //                 panNo = req.session.entity.kycInfo[i].documentNo;
    //             }
    //             if (req.session.entity.kycInfo[i].documentType === "AADHAR" && req.session.entity.kycInfo[i].documentType) {
    //                 aadharNo = req.session.entity.kycInfo[i].documentNo;
    //             }
    //
    //             if (req.session.entity.kycInfo[i].documentType === "VOTERID" && req.session.entity.kycInfo[i].documentType) {
    //                 voterId = req.session.entity.kycInfo[i].documentNo;
    //             }
    //
    //             if (req.session.entity.kycInfo[i].documentType === "DRIVINGLICENCE" && req.session.entity.kycInfo[i].documentType) {
    //                 drivingLicense = req.session.entity.kycInfo[i].documentNo;
    //             }
    //
    //             if (req.session.entity.kycInfo[i].documentType === "PASSPORT" && req.session.entity.kycInfo[i].documentType) {
    //                 passportNo = req.session.entity.kycInfo[i].documentNo;
    //             }
    //
    //             if (req.session.entity.kycInfo[i].documentType === "RATIONCARD" && req.session.entity.kycInfo[i].documentType) {
    //                 rationCardNo = req.session.entity.kycInfo[i].documentNo;
    //             }
    //
    //         }
    //
    //
    //         re = {
    //             "panNo": panNo,
    //             "aadharNo": aadharNo,
    //             "voterId": voterId,
    //             "drivingLicense": drivingLicense,
    //             "passportNo": passportNo,
    //             "rationCardNo": rationCardNo,
    //             "addressDtos": addressInfo,
    //             "communicationDtos": req.session.entity.communicationInfo,
    //             "specialDateDtos": req.session.entity.dateInfo,
    //             "firstName": req.session.entity.firstName,
    //             "middleName": req.session.entity.middleName,
    //             "lastName": req.session.entity.lastName,
    //             "gender": gender,
    //             "fatherName": req.session.entity.fatherName,
    //             "motherName": motherName,
    //             "spouseName": spouseName,
    //             "ownHouse": false
    //         }
    //     }
    //     let de = {
    //         "addressDtos": [
    //             {
    //                 "address1": "HOTEL NOVOTEL & PULLMAN",
    //                 "address2": "COMMERCIAL TOWER 5TH FLO",
    //                 "address3": "OR ASSEST AREA NO 2 HOSP",
    //                 "city": "DELHI",
    //                 "state": "DELHI",
    //                 "country": "",
    //                 "pincode": "110037"
    //             }
    //         ],
    //         "communicationDtos": [
    //             {
    //                 "contactNo": "",
    //                 "emailId": "",
    //                 "notification": true,
    //                 "primary": true,
    //                 "contactType": "MOBILE"
    //             }
    //         ],
    //         "specialDateDtos": [
    //             {
    //                 "dateType": "DOB",
    //                 "date": "1974-09-30"
    //             }
    //         ],
    //         "firstName": "SUDHANSHU",
    //         "middleName": "",
    //         "lastName": "",
    //         "panNo": "ACKPK5279R",
    //         "aadharNo": null,
    //         "voterId": null,
    //         "drivingLicense": null,
    //         "passportNo": null,
    //         "rationCardNo": null,
    //         "gender": "M",
    //         "fatherName": "",
    //         "motherName": "",
    //         "spouseName": "",
    //         "ownHouse": true
    //     }
    //     console.log('RE VArilable', re);
    //     let resInfo = requestP.postRequest(constants.CREDIT_CARD_URL + 'statement/creditcheck/pull', req.session.entity.business, re);
    //     resInfo.then((response) => {
    //         log.info(`Fetch Details Response: ${JSON.stringify(response)}`);
    //         if (response.statusCode === 200) {
    //             let accounts = response.body.result.accounts;
    //             let mappedAccounts = accounts.map(item => {
    //                 let newItem = item;
    //                 newItem.accountNonSummarySegmentFields.accountType = getAccountType(item.accountNonSummarySegmentFields.accountType);
    //                 return newItem;
    //             });
    //             console.log('is everything ok', mappedAccounts);
    //             let allAccType = [];
    //             mappedAccounts.forEach(ele => {
    //                 allAccType.push(ele.accountNonSummarySegmentFields.accountType);
    //             });
    //             let accType = [...new Set(allAccType)];
    //             console.log('accType', accType);
    //             let responseToSend = response.body.result;
    //             responseToSend.accounts = mappedAccounts;
    //             responseToSend.accType = accType;
    //             console.log('acctypetosend', responseToSend);
    //             res.status(200).send(responseToSend);
    //         } else {
    //             res.status(500).send();
    //         }
    //     }).catch((err) => {
    //         log.error(err);
    //         res.status(500).send(customizeData.setKycResponse(null, constants.INTERNAL_SERVER_ERROR));
    //     });
    // });
    //
    // function getAccountType(number) {
    //     let result = accountTypeConst.filter(element => {
    //         return element.number === number
    //     });
    //
    //     return result[0].text;
    // }
 
 
    app.post('/getRegistrationData', function (req, res) {
 
        log.info(req.body.business);
        let query = requestP.getPartnerToken(req.body.business);
        query.then(partnerObj => {
            log.info(`Partner Id: ${JSON.stringify(partnerObj)}`);
 
            let status = [];
            let declined = { "declined": 0 };
            for (var i = (req.session.status - 1); i < req.session.authLevel; i++) {
                status.push(i);
            }
 
            if (req.header('Referer').split("/")[3] === "registrationList") {
                declined = {};
            }
 
            let query = queryGenerator.generateQuery(status, req.body.business, req.body.corporate, declined, req);
            RegistrationModel.find(query, function (err, data) {
                if (err) {
                    log.error(err);
                    res.status(500).send(constants.INTERNAL_SERVER_ERROR);
                } else {
                    if (data.length > 0) {
                        log.info(`Fetched ${data.length} records`);
                        let dataSet = customizeData.generateDataSet(req);
 
                        if (typeof partnerObj.partnerUrl != "undefined" && partnerObj.partnerUrl.includes("/v2/register")) {
                            dataSet.data = customizeData.normalizeRegistrationV2Data(data, req);
                        }
                        else {
                            dataSet.data = customizeData.normalizeRegistrationData(data, req);
                        }
                        res.send(dataSet);
                    } else if (data.length === 0) {
                        let dataset = customizeData.generateDataSet(req);
                        res.send(dataset);
                    }
                }
            }).limit(100);
 
 
        });
    });
 
    app.post('/approveRegistration', function (req, res) {
 
        let searchById = req.body.id;
 
        RegistrationModel.findById(searchById, function (err, userObj) {
            if (err) {
                log.error(err);
                res.status(500).send(constants.INTERNAL_SERVER_ERROR)
            } else if (userObj) {
                if ((userObj.authLevel - userObj.status) === 1) {
 
                    if (typeof userObj.registrationV2Data != "undefined" && userObj.registrationV2Data != null) {
                        let obj = userObj.registrationV2Data;
                        // obj.creator = userObj.name.makerName;
                        // obj.changed = req.session.userId;
                    }
                    else {
                        let obj = userObj.registrationData;
                        obj.creator = userObj.name.makerName;
                        obj.changer = req.session.userId;
                    }
 
                    if (userObj.kycData == null) {
                        updateRegistrationData(userObj, req, res, false);
                    } else {
                        uploadKycDocumentsOnChecker(userObj, req, res);
                    }
                } else {
                    let data = {
                        "status": userObj.status + 1,
                        "changed": Date.now(),
                        "name.approvedName": req.session.userId,
                        "reason": null,
                        "declined": 0
                    };
 
                    userObj.set(data);
                    userObj.save((err) => {
                        if (err) {
                            res.status(500).send(constants.INTERNAL_SERVER_ERROR);
                        } else {
                            res.send(constants.APPROVE_SUCCESS_MSG);
                        }
                    });
                }
            } else {
                res.status(500).send(constants.INTERNAL_SERVER_ERROR);
            }
        });
 
 
    });
 
 
    app.post('/declineRegistration', function (req, res) {
 
 
        let searchData = req.body.id;
        RegistrationModel.findById(searchData, function (err, userObj) {
            if (err) {
                log.error(err);
                res.status(500).send(constants.INTERNAL_SERVER_ERROR);
            } else if (userObj) {
                let status;
                if (req.body.decValue === 4) {
                    status = -2;
                } else {
                    if (userObj.userLevel !== 0 && userObj.userLevel != null) {
                        status = userObj.userLevel;
                    } else {
                        status = userObj.roleLevel;
                    }
                }
                userObj.set({
                    "status": status,
                    "declined": req.session.status,
                    "reason": req.body.declineReason,
                    "name.approvedName": req.session.userId,
                    "changed": new Date
                });
                userObj.save((err) => {
                    if (err) {
                        log.error(constants.INTERNAL_SERVER_ERROR);
                    } else {
                        log.info("Entity declined for id ::" + req.body.id);
                        res.send(constants.DECLINE_SUCCESS_MSG);
                    }
                });
            }
        });
    });
 
 
    app.post("/getKycDataViaApi", function (req, res) {
        let query = requestP.getPartnerToken(req.body.business);
        query.then(partnerObj => {
            if (partnerObj == null) {
                log.error(constants.PARTNER_TOKEN_NOT_FOUND);
                let dataSet = customizeData.generateDataSet(req);
                res.send(dataSet);
            } else {
                let options;
 
                if (req.body.status === "ALL") {
                    options = requestP.getRpOptions(partnerObj.partnerId, partnerObj.partnerToken, constants.KYC_BASE_URL + `kyc/fetchByPartnerIdv2?pagenumber=${req.body.pageNumber}&pagesize=${req.body.pageSize}`, {
                        "business": req.body.business,
                        "businessType": req.body.corporate
                    })
                } else {
                    let url = constants.KYC_BASE_URL;
                    url += `kyc/fetchByStatusv2?pagenumber=${req.body.pageNumber}&pagesize=${req.body.pageSize}`
 
                    options = requestP.getRpOptions(partnerObj.partnerId, partnerObj.partnerToken, url, {
                        "kycStatus": req.body.status,
                        "businessType": req.body.corporate,
                        "currentStatus": req.body.currentKycStatus
                    })
                }
 
 
                let resInfo = requestP.postRequestKyc(options);
                resInfo.then((response) => {
                    log.info(JSON.stringify(response));
                    if (response.statusCode === 200) {
                        let dataSet = customizeData.generateDataSetForKyc(req, response.body.pagination);
                        dataSet.data = customizeData.normalizeKycData(response.body.result, req, req.body.status);
                        res.send(dataSet);
                    } else {
                        let dataSet = customizeData.generateDataSet(req);
                        res.send(dataSet);
                    }
                }).catch((err) => {
                    log.error(err);
                    res.status(500).send(constants.INTERNAL_SERVER_ERROR);
                })
            }
        }).catch(err => {
            log.error(err);
            res.status(500).send(constants.INTERNAL_SERVER_ERROR)
        });
    });
 
 
    app.post("/getKycDataViaApiv2", function (req, res) {
        let query = requestP.getPartnerToken(req.body.business);
        query.then(partnerObj => {
            if (partnerObj == null) {
                log.error(constants.PARTNER_TOKEN_NOT_FOUND);
                let dataSet = customizeData.generateDataSet(req);
                res.send(dataSet);
            } else {
                let options;
 
                let url = constants.KYC_BASE_URL;
                url += `kyc/fetch/getRegistrationDetailsByStatus?page=${req.body.pageNumber}&size=${req.body.pageSize}`
 
                options = requestP.getRpOptions(partnerObj.partnerId, partnerObj.partnerToken, url, {
                    "status": req.body.status,
                    "businessType": req.body.corporate,
                    "kycStatus": constants.VERIFIED,
                    "approverCategory": req.session.role,
                    "approverLevel": req.session.roleLevel,
                    "currentKycStatus": req.body.currentKycStatus
               })
 
 
                let resInfo = requestP.postRequestKyc(options);
                resInfo.then((response) => {
                    log.info(JSON.stringify(response));
                    if (response.statusCode === 200) {
                        let dataSet = customizeData.generateDataSetForKyc(req, response.body.pagination);
                        dataSet.data = customizeData.normalizeKycData(response.body.result, req, req.body.status);
                        res.send(dataSet);
                    } else {
                        let dataSet = customizeData.generateDataSet(req);
                        res.send(dataSet);
                    }
                }).catch((err) => {
                    log.error(err);
                    res.status(500).send(constants.INTERNAL_SERVER_ERROR);
                })
            }
        }).catch(err => {
            log.error(err);
            res.status(500).send(constants.INTERNAL_SERVER_ERROR)
       });
    });
 
 
    app.post("/advancedKycSearch", function (req, res) {
        let query = requestP.getPartnerToken(req.body.business);
        query.then(partnerObj => {
            if (partnerObj == null) {
                log.error(constants.PARTNER_TOKEN_NOT_FOUND);
                let dataSet = customizeData.generateDataSet(req);
                res.send(dataSet);
            } else {
                let options = requestP.getRpOptions(partnerObj.partnerId, partnerObj.partnerToken, constants.KYC_BASE_URL + `kyc/fetchEntityByCriteria`, req.body)
                let resInfo = requestP.postRequestKyc(options);
                resInfo.then((response) => {
                    log.info(JSON.stringify(response));
                    if (response.statusCode === 200) {
                        let dataSet = customizeData.generateDataSetForKyc(req, response.body.pagination);
                        dataSet.data = customizeData.normalizeKycData(response.body.result, req, req.body.status);
                        res.send(dataSet);
                    } else {
                        let dataSet = customizeData.generateDataSet(req);
                        res.send(dataSet);
                    }
                }).catch((err) => {
                    log.error(err);
                    res.status(500).send(constants.INTERNAL_SERVER_ERROR);
                })
            }
        }).catch(err => {
            log.error(err);
            res.status(500).send(constants.INTERNAL_SERVER_ERROR)
        });
    });
 // const file = s3GetFiles().then((file)=>{
                    //     let buf = Buffer.from(file.Body);
                    //     let base64 = buf.toString('base64');
                    //     let image="<img src='data:image/jpeg;base64," + base64 + "'" + "/>";
                    //     return image
                    // }).catch((error)=>{
                    //     log.error(error)
                    //     return error
                    // })
    app.post("/uploadKycViaApiv2", function (req, res) {
        let sftp = new Client();
        let jsonBody = req.body;
        let documents = jsonBody.documents;
        let documentsToSend = [];
        let sftpUploadArr = [];
        let files = req.body.files;
 
        let query = requestP.getPartnerToken(jsonBody.business);
        query.then(partnerObj => {
            if (partnerObj == null) {
                res.status(500).send(constants.PARTNER_TOKEN_NOT_FOUND)
            }
        else
    {
        if (typeof partnerObj.s3BucketEnabled !== "undefined" && partnerObj.s3BucketEnabled != false) {
 
            console.log("S3 Enabled : ");
            if (documents.length + files.length > 5) {
                res.status(500).send("Only five documents are allowed to upload");
            } else {
                for (let i = 0; i < files.length; i++) {
 
                    if (path.extname(files[i].originalname) === '.pdf' && files[i].size > constants.PDF_UPLOAD_SIZE) {
                        return res.status(500).send(constants.PDF_UPLOAD_ERR_MSG);
                    }
 
                  
                    let doc1 = {
                        "documentType": null,
                        "documentFileName": files[i].filename,
                        "documentFilePath": partnerObj.bank + "/" + partnerObj.partnerId + "/"  + files[i].filename
                    };
                 
                    documentsToSend.push(doc1);
 
                    let fileName = files[i].filename ;
                    let file = fs.createReadStream(constants.UPLOAD_FILE_PATH + fileName);
                    var filePath = doc1.documentFilePath;
 
                    console.log("Document Name Upload to S3 V1 :"+fileName+ path.extname(files[i].originalname));
 
 
                    const s3UploadParams = {
                        Bucket: constants.AWS_BUCKET_NAME,
                        Body: file,
                        Key: filePath
                    }
 
                    s3Upload(s3UploadParams, req, res);
 
                }
 
                let statusObj = {
                    "entityId": jsonBody.customerId,
                    "kycStatus": constants.PENDING
                };
 
                    let kycObj = {
                        "entityId": jsonBody.customerId,
                        "documents": documentsToSend
                    };
                    let resInfo = requestP.postRequestKyc(requestP.getRpOptions(partnerObj.partnerId, partnerObj.partnerToken, constants.UPLOAD_KYC_URL_V2, kycObj, false));
 
                    resInfo.then(response1 => {
                        log.info(JSON.stringify(response1));
                        if (response1.statusCode === 200) {
                            res.send(constants.SUCCESS_EDIT_MSG);
                        } else {
                            res.status(500).send(response.body.exception.detailMessage);
                        }
                    }).catch(err => {
                        log.error(err);
                        res.status(500).send(constants.INTERNAL_SERVER_ERROR);
                    })
 
 
                let resInfo1 = requestP.postRequestKyc(requestP.getRpOptions(partnerObj.partnerId, partnerObj.partnerToken, constants.UPDATE_KYC, statusObj, false));
                                        resInfo1.then(response1 => {
                                            log.info(JSON.stringify(response1));
                                            if (response1.statusCode === 200) {
                                                res.send(constants.SUCCESS_EDIT_MSG);
                                            } else {
                                                res.status(500).send(response.body.exception.detailMessage);
                                            }
                                        }).catch(err => {
                                            log.error(err);
                                            res.status(500).send(constants.INTERNAL_SERVER_ERROR);
                                        })
 
            }
        }
        else {
            logger.info("SFTP Upload Model : ");
 
            sftp.connect(sftpConnectConfig, 'on').then(() => {
                log.info("Connected to SFTP");
                if (documents.length + files.length > 5) {
                    res.status(500).send("Only five documents are allowed to upload");
                } else {
                    for (let i = 0; i < files.length; i++) {
 
                        if (path.extname(files[i].originalname) === '.pdf' && files[i].size > constants.PDF_UPLOAD_SIZE) {
                            return res.status(500).send(constants.PDF_UPLOAD_ERR_MSG);
                        }
                        let doc = {
                            "documentType": null,
                            "documentFileName": (jsonBody.customerId + '_' + "KYC" + (documents.length + i) + "_" + moment().format("YYYY-MM-DD")).replace(/\s+/g, '_').toLowerCase() + path.extname(files[i].originalname),
                            "documentFilePath": constants.UPLOAD_SERVER_PATH + jsonBody.bank + "/" + jsonBody.business + "/" + (jsonBody.customerId + '_' + "KYC" + (documents.length + i) + "_" + moment().format("YYYY-MM-DD")).replace(/\s+/g, '_').toLowerCase() + path.extname(files[i].originalname)
                        };
                        let fileName = jsonBody.customerId + '_' + files[i].fieldname + "_" + moment().format("YYYY-MM-DD");
                        let fileNameToReplace = fileName.replace(/\s+/g, '_').toLowerCase() + path.extname(files[i].originalname);
                        let sftpPromise = sftp.put(constants.UPLOAD_FILE_PATH + fileNameToReplace, doc.documentFilePath, "utf-8");
                        sftpUploadArr.push(sftpPromise);
                        documentsToSend.push(doc);
                    }
                    Promise.all(sftpUploadArr).then((data) => {
                        log.info(JSON.stringify(data));
                        sftp.end().then(() => log.info("SFTP connection closed")).catch((err) => log.error(err));
 
                        let query = requestP.getPartnerToken(jsonBody.business);
                        query.then(partnerObj => {
                            if (partnerObj == null) {
                                res.status(500).send(constants.PARTNER_TOKEN_NOT_FOUND)
                            } else {
                                let kycObj = {
                                    "entityId": jsonBody.customerId,
                                    "documents": documentsToSend
                                };
                                let resInfo = requestP.postRequestKyc(requestP.getRpOptions(partnerObj.partnerId, partnerObj.partnerToken, constants.UPLOAD_KYC_URL_V2, kycObj, false));
                                resInfo.then((response) => {
                                    log.info(JSON.stringify(response));
                                    if (response.statusCode === 200) {
                                        let statusObj = {
                                            "entityId": kycObj.entityId,
                                            "kycStatus": constants.PENDING
                                        };
                                        let resInfo1 = requestP.postRequestKyc(requestP.getRpOptions(partnerObj.partnerId, partnerObj.partnerToken, constants.UPDATE_KYC, statusObj, false));
                                        resInfo1.then(response1 => {
                                            log.info(JSON.stringify(response1));
                                            if (response1.statusCode === 200) {
                                                res.send(constants.SUCCESS_EDIT_MSG);
                                            } else {
                                                res.status(500).send(response.body.exception.detailMessage);
                                            }
                                        }).catch(err => {
                                            log.error(err);
                                            res.status(500).send(constants.INTERNAL_SERVER_ERROR);
                                        })
                                    } else {
                                        res.status(500).send(response.body.exception.detailMessage);
                                    }
                                }).catch((err) => {
                                    log.error(err);
                                    res.status(500).send(constants.INTERNAL_SERVER_ERROR);
                                })
                            }
                        })
                    }).catch(err => {
                        console.log(err);
                        sftp.end().then(() => log.info("SFTP connection closed")).catch((err) => log.error(err));
                        res.status(500).send(constants.INTERNAL_SERVER_ERROR);
                    })
                }
            }).catch(err => {
                log.info("Error connecting to sftp");
                console.log(err);
                sftp.end().then(() => log.info("SFTP connection closed")).catch((err) => log.error(err));
                res.status(500).send(constants.INTERNAL_SERVER_ERROR);
            });
 
        }
    }}).catch(err => {
                log.error(err);
                res.status(500).send(constants.INTERNAL_SERVER_ERROR)
            });
 
 
 
    });
 
    app.post("/approveKycViaApi", function (req, res) {
        let query = requestP.getPartnerToken(req.body.business);
        query.then(partnerObj => {
            if (partnerObj == null) {
                res.status(500).send(constants.PARTNER_TOKEN_NOT_FOUND)
            } else {
                let resInfo = requestP.postRequestKyc(requestP.getRpOptions(partnerObj.partnerId, partnerObj.partnerToken, constants.UPDATE_KYC, {
                    "entityId": req.body.customerId,
                    "kycStatus": constants.VERIFIED,
                    "cifNumber": req.body.cifNumber,
                    "creditLimit": req.body.creditLimit
                }));
                resInfo.then((response) => {
                    log.info(JSON.stringify(response));
                    if (response.statusCode === 200) {
                        res.send(constants.APPROVE_SUCCESS_MSG);
                    } else {
                        res.status(500).send(response.body.exception.detailMessage);
                    }
                }).catch((err) => {
                    log.error(err);
                    res.status(500).send(constants.INTERNAL_SERVER_ERROR);
                })
            }
        }).catch(err => {
            log.error(err);
            res.status(500).send(constants.INTERNAL_SERVER_ERROR)
        });
    });
 
    app.post("/updateKycViaCifApi", function (req, res) {
        // let query = requestP.getPartnerToken(req.body.business);
        // query.then(partnerObj => {
        //     if (partnerObj == null) {
        //         res.status(500).send(constants.PARTNER_TOKEN_NOT_FOUND)
        //     } else {
        // let resInfo = requestP.postRequestKyc(requestP.getRpOptions(partnerObj.partnerId, partnerObj.partnerToken, constants.UPDATE_CIF_URL, {
        //     "entityId": req.body.customerId,
        //     "cifNumber": req.body.cifNumber
        // });
        let resInfo = requestP.postRequest(constants.UPDATE_CIF_URL, req.body.business, { "entityId": req.body.customerId, "cifNumber": req.body.cifNumber });
        resInfo.then((response) => {
            log.info(JSON.stringify(response));
            if (response.statusCode === 200) {
                res.send(constants.UPDATE_SUCCESS_MSG);
            } else {
                res.status(500).send(response.body.exception.detailMessage);
            }
        }).catch((err) => {
            log.error(err);
            res.status(500).send(constants.INTERNAL_SERVER_ERROR);
        })
        // }
        // }).catch(err => {
        //     log.error(err);
        //     res.status(500).send(constants.INTERNAL_SERVER_ERROR)
        // });
    });
 
    app.post("/updateKycViaCreditApi", function (req, res) {
        // let query = requestP.getPartnerToken(req.body.business);
        // query.then(partnerObj => {
        //     if (partnerObj == null) {
        //         res.status(500).send(constants.PARTNER_TOKEN_NOT_FOUND)
        //     } else {
        // let resInfo = requestP.postRequestKyc(requestP.getRpOptions(partnerObj.partnerId, partnerObj.partnerToken, constants.UPDATE_CIF_URL, {
        //     "entityId": req.body.customerId,
        //     "cifNumber": req.body.cifNumber
        // });
        let resInfo = requestP.postRequest(constants.UPDATE_CIF_URL, req.body.business, { "entityId": req.body.customerId, "creditLimit": req.body.creditLimit });
        resInfo.then((response) => {
            log.info(JSON.stringify(response));
            if (response.statusCode === 200) {
                res.send(constants.UPDATE_SUCCESS_MSG);
            } else {
                res.status(500).send(response.body.exception.detailMessage);
            }
        }).catch((err) => {
            log.error(err);
            res.status(500).send(constants.INTERNAL_SERVER_ERROR);
        })
        // }
        // }).catch(err => {
        //     log.error(err);
        //     res.status(500).send(constants.INTERNAL_SERVER_ERROR)
        // });
    });
 
    app.post("/updateKycViaAccountNoApi", function (req, res) {
 
        let resultss = requestP.getRequest(constants.KYC_BASE_URL + 'kyc/fetchdetails/fetchByentity?entityId=' + req.body.customerId, req.body.business);
        let creditLimit;
        resultss.then((response) => {
            log.info(`Fetch Details Response: ${JSON.stringify(response)}`);
            if (response.statusCode === 200) {
                creditLimit = response.body.result.creditLimit;
                let resInfo = requestP.postRequest(constants.UPDATE_CIF_URL, req.body.business, { "entityId": req.body.customerId, "accountNo": req.body.ACC, "creditLimit": creditLimit });
                resInfo.then((response) => {
                    log.info(JSON.stringify(response));
                    if (response.statusCode === 200) {
                        res.send(constants.UPDATE_SUCCESS_MSG);
                    } else {
                        res.status(500).send(response.body.exception.detailMessage);
                    }
                }).catch((err) => {
                    log.error(err);
                    res.status(500).send(constants.INTERNAL_SERVER_ERROR);
                })
            } else {
                res.status(500).send();
            }
        }).catch((err) => {
            log.error(err);
            res.status(500).send(customizeData.setKycResponse(null, constants.INTERNAL_SERVER_ERROR));
        });
    });
 
 
    app.post("/declineKycViaApi", function (req, res) {
        let query = requestP.getPartnerToken(req.body.business);
        query.then(partnerObj => {
            if (partnerObj == null) {
                res.status(500).send(constants.PARTNER_TOKEN_NOT_FOUND)
            } else {
                let resInfo = requestP.postRequestKyc(requestP.getRpOptions(partnerObj.partnerId, partnerObj.partnerToken, constants.UPDATE_KYC, {
                    "entityId": req.body.customerId,
                    "kycRefNo": "",
                    "kycStatus": constants.FAILED,
                    "description": req.body.decReason,
                    "currentStatus": req.body.currentStatus
                }));
                resInfo.then((response) => {
                    log.info(JSON.stringify(response));
                    if (response.statusCode === 200) {
                        res.send(constants.DECLINE_SUCCESS_MSG);
                    } else {
                        res.status(500).send(response.body.exception.detailMessage);
                    }
                }).catch((err) => {
                    log.error(err);
                    res.status(500).send(constants.INTERNAL_SERVER_ERROR);
                })
            }
        }).catch(err => {
            log.error(err);
            res.status(500).send(constants.INTERNAL_SERVER_ERROR)
        });
    });
 
 
    app.get("/checkKitNo/:business/:kitNo", (req, res) => {
        CaptureKycModel.findOne({
            "business": req.params.business,
            "kitNumber": req.params.kitNo
        }, function (err, userObj) {
            if (userObj == null) {
                res.send();
            } else {
                res.status(500).send();
            }
        })
    });
 
    app.post("/editRegistrationData", (req, res) => {
        let jsonBody = req.body;
        jsonBody.contactNo = `+91${jsonBody.contactNo}`;
        let validator = formValidator.validateRegistrationV3(jsonBody, "edit");
        if (validator.error) {
            return res.status(500).send(validator.error);
        }
 
        let query = requestP.getPartnerToken(jsonBody.business);
        query.then(partnerObj => {
            if (partnerObj == null) {
                res.status(500).send(constants.PARTNER_TOKEN_NOT_FOUND);
            } else {
                let resInfo = requestP.postRequestKyc(requestP.getRpOptions(partnerObj.partnerId, partnerObj.partnerToken, constants.KYC_BASE_URL + "kyc/updateDetails", validator.registrationApiData));
                resInfo.then((response) => {
                    log.info(JSON.stringify(response));
                    if (response.statusCode === 200) {
                        res.send();
                    } else if (response.statusCode === 500) {
                        res.status(500).send(response.body.exception.detailMessage);
                    } else {
                        res.status(500).send(constants.INTERNAL_SERVER_ERROR);
                    }
                })
            }
        });
    });
 
    app.post('/changePassword', [customizeData.changePasswordValidation], function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(500).send(errors.array()[0].msg);
        }
 
        if (req.body.oldPassword.trim() === req.body.newPassword.trim()) {
            return res.status(500).send("New Password and Old Password cannot be the same");
        }
 
        if (!(req.body.confirmPassword.trim() === req.body.newPassword.trim())) {
            return res.status(500).send("New Password does not match with Confirm Password");
        }
 
        let jsonData = {
            "userName": req.session.userId,
            "oldPassword": req.body.oldPassword,
            "newPassword": req.body.newPassword,
            "changer": req.session.userId,
            "attempt": 1
        };
 
        request({
            url: constants.AUTH_URL + '/user/changePassword',
            method: 'POST',
            body: JSON.stringify(jsonData),
            headers: {
                'Content-Type': 'application/json',
                'APPLICATION': 'KYC'
            }
        }, function (error, response, body) {
            if (error) {
                res.status(500).send(error);
            } else {
                if (response.statusCode === 500) {
                    log.error(body);
                    let errorInfo = JSON.parse(body);
                    res.status(response.statusCode).send(errorInfo.exception.shortMessage);
                } else if (response.statusCode === 200) {
                    let resInfo = JSON.parse(body);
                    res.status(response.statusCode).send(resInfo.result);
                } else {
                    log.error('Change password Error');
                    res.status(response.statusCode).send('Something went wrong');
                }
            }
        });
    });
 
    app.post("/editRegistrationDataV2", (req, res) => {
        upload_kyc(req, res, function (err) {
            if (err) {
                log.error(err);
                if (err instanceof multer.MulterError) {
                    if (err.code === "LIMIT_FILE_SIZE") {
                        res.status(500).send(constants.FILE_UPLOAD_ERR_MSG);
                    } else {
                        res.status(500).send(err.message);
                    }
                } else {
                    log.error(err);
                    res.status(500).send(constants.INTERNAL_SERVER_ERROR);
                }
            } else {
                let registrationData = JSON.parse(req.body.registrationData);
                let editDataRequest = requestP.postRequest("http://localhost:7878/editRegistrationData", null, registrationData);
                editDataRequest.then((response) => {
                    log.info(JSON.stringify(response));
                    if (response.statusCode === 500) {
                        res.status(500).send(response.body);
                    } else if (response.statusCode === 200) {
                        let jsonBody = JSON.parse(req.body.jsonBody);
                        jsonBody.bank = req.session.bank;
                        let files = [];
                        for (let i = 0; i < req.files.length; i++) {
                            files.push(req.files[i]);
                            delete files[i]["buffer"];
                        }
                        jsonBody.files = files;
                        let uploadFileRequest = requestP.postRequest("http://localhost:7878/uploadKycViaApiv2", null, jsonBody);
                        uploadFileRequest.then((fileRequestResponse) => {
                            log.info(JSON.stringify(fileRequestResponse));
                            if (fileRequestResponse.statusCode === 200) {
                                res.status(200).send(fileRequestResponse.body);
                            } else if (fileRequestResponse.statusCode === 500) {
                                res.status(fileRequestResponse.statusCode).send(fileRequestResponse.body);
                            } else {
                                res.status(500).send(constants.INTERNAL_SERVER_ERROR);
                            }
                        });
                    } else {
                        res.status(500).send(constants.INTERNAL_SERVER_ERROR);
                    }
                })
 
            }
        })
    })
};
 
let entityDetailQuery = function (type, val) {
    let url;
    switch (type) {
        case "ENTITYID":
            url = "business-entity-manager/fetchbyentityid/" + encodeURIComponent(val);
            break;
        case "MOBILENO":
            url = "business-entity-manager/getByMobileNo/" + encodeURIComponent(val);
            break;
        case "KITNO":
            url = "business-entity-manager/getByKitNo/" + encodeURIComponent(val);
            break;
        case "CARDNO":
            url = "business-entity-manager/getListByCardNo/" + encodeURIComponent(val);
            break;
        default:
            url = undefined;
    }
    return url;
};
 
 
function registerToMongo(validator, kycRefNo, fileData, req, res) {
    let mongoData = {};
    mongoData.status = req.session.status;
    mongoData.roleLevel = req.session.roleLevel;
    mongoData.userLevel = req.session.userLevel;
    mongoData.authLevel = req.session.authLevel;
    mongoData.registrationData = validator.registrationApiData;
 
    if (typeof validator.registrationV2ApiData != "undefined" && validator.registrationV2ApiData != null) {
        if (validator.registrationV2ApiData.kitInfo[0].cardType === 'P') {
            validator.registrationV2ApiData.kitInfo[0].cardType = "PHYSICAL";
        }
        if (validator.registrationV2ApiData.kitInfo[0].cardType === 'V') {
            validator.registrationV2ApiData.kitInfo[0].cardType = "VIRTUAL";
        }
 
        var cardExpDate = validator.registrationV2ApiData.kitInfo[0].expDate;
        console.log("Card Expiry Date:: " + cardExpDate);
 
        var convertedCardExpDate = new Date(cardExpDate);
        validator.registrationV2ApiData.kitInfo[0].expDate = parseInt(convertedCardExpDate.getTime().toString());
        console.log(validator.registrationV2ApiData.kitInfo[0].expDate);
 
        var dobDate = validator.registrationV2ApiData.dateInfo[0].date;
        console.log("Date of Birth " + dobDate);
 
        var convertedDobDate = new Date(dobDate);
 
        validator.registrationV2ApiData.dateInfo[0].date = parseInt(convertedDobDate.getTime().toString());
        console.log(validator.registrationV2ApiData.dateInfo[0].date);
 
 
        mongoData.registrationV2Data = validator.registrationV2ApiData;
 
    }
    mongoData.business = JSON.parse(req.body.jsonBody).business;
    mongoData.corporate = JSON.parse(req.body.jsonBody).Corporate_Id;
    mongoData.bank = req.session.bank;
    mongoData.branch = req.session.branch;
    mongoData.name = {
        "makerName": req.session.userId
    };
    mongoData.reason = null;
    mongoData.kycRefNo = kycRefNo;
    if (fileData.length === 0) {
        mongoData.kycData = null;
    } else {
        mongoData.kycData = {
            "declined": 0,
            "status": req.session.authLevel,
            "reason": null,
            "created": new Date(),
            "changed": new Date(),
            "documents": fileData,
            "makerName": req.session.userId
        }
    }
    let regData = new RegistrationModel(mongoData);
    regData.save((err) => {
        if (err) {
            log.error(err);
            res.status(constants.INTERNAL_SERVER_ERROR);
        } else {
            if (validator.registrationV2ApiData != null) {
                log.info("customer data saved to mongo :: customer ID ::" + validator.registrationV2ApiData.entityId);
            }
            else {
                log.info("customer data saved to mongo :: customer ID ::" + validator.registrationApiData.entityId);
            }
            res.send(constants.SUCCESS_SAVE_MSG);
        }
    });
}
 
function updateToMongo(validator, documents, userObj, req, res) {
    let kyc = userObj.kycData;
    if (documents.length === 0) {
        kyc = null;
    } else {
        kyc = {
            "declined": 0,
            "status": req.session.authLevel,
            "reason": null,
            "created": new Date(),
            "changed": new Date(),
            "documents": documents,
            "makerName": req.session.userId
        }
    }
 
    if (typeof userObj.registrationV2Data != "undefined" && userObj.registrationV2Data != null) {
        if (validator.registrationV2ApiData.kitInfo[0].cardType === 'P') {
            validator.registrationV2ApiData.kitInfo[0].cardType = "PHYSICAL";
        }
        if (validator.registrationV2ApiData.kitInfo[0].cardType === 'V') {
            validator.registrationV2ApiData.kitInfo[0].cardType = "VIRTUAL";
        }
 
        userObj.set({
            "kycData": kyc,
            "status": req.session.status,
            "declined": 0,
            "registrationV2Data": validator.registrationV2ApiData,
            "changed": new Date(),
            "name.changerName": req.session.userId,
            "reason": null
        });
        userObj.markModified("registrationV2Data");
    } else {
        userObj.set({
            "kycData": kyc,
            "status": req.session.status,
            "declined": 0,
            "registrationData": validator.registrationApiData,
            "changed": new Date(),
            "name.changerName": req.session.userId,
            "reason": null
        });
        userObj.markModified("registrationData");
    }
 
    userObj.markModified("kycData");
    userObj.markModified("name");
 
    userObj.save((err) => {
        if (err) {
            log.error(err);
            res.status(500).send(constants.INTERNAL_SERVER_ERROR);
        } else {
            if (typeof userObj.registrationV2Data != "undefined" && userObj.registrationV2Data != null) {
                log.info("Successfully edited data for entity id ::" + validator.registrationV2ApiData.entityId);
            }
            else {
                log.info("Successfully edited data for entity id ::" + validator.registrationApiData.entityId);
            }
            res.send(constants.SUCCESS_EDIT_MSG);
        }
    })
}
 
function updateRegistrationDataV2(userObj, req, res) {
    requestP.getPartnerToken(userObj.business).then((partnerObj) => {
        if (partnerObj == null) {
            log.error("Partner id /token not found");
            res.status(500).send(constants.INTERNAL_SERVER_ERROR);
        } else {
            let obj = {};
            if (typeof userObj.registrationV2Data != "undefined" && userObj.registrationV2Data != null) {
                obj.entityId = userObj.registrationV2Data.entityId;
                obj.documents = userObj.kycData.documents;
            }
            else {
                obj.entityId = userObj.registrationData.entityId;
                obj.documents = userObj.kycData.documents;
            }
            let resInfo = requestP.postRequestKyc(requestP.getRpOptions(partnerObj.partnerId, partnerObj.partnerToken, constants.UPLOAD_KYC_URL_V2, obj));
            resInfo.then((response) => {
                log.info(JSON.stringify(response));
                if (response.statusCode === 200) {
                    res.send(constants.SUCCESS_SAVE_MSG);
                } else if (response.statusCode === 500) {
                    res.status(500).send(response.body.exception.detailMessage);
                } else {
                    res.status(500).send(constants.INTERNAL_SERVER_ERROR);
                }
            }).catch((err) => {
                log.error(err);
                res.status(500).send(constants.INTERNAL_SERVER_ERROR)
            })
        }
    }).catch((err) => {
        log.error(err);
        res.status(500).send(constants.INTERNAL_SERVER_ERROR)
    })
}
 
function updateRegistrationData(userObj, req, res, updateKyc) {
 
    if (typeof userObj.registrationData != "undefined" && userObj.registrationData != null) {
        let obj = userObj.registrationData;
        obj.changer = req.session.userId;
        obj.changed = new Date();
        let resInfo = requestP.postRequest(constants.M2P_URL + 'registration-manager/v3/register', userObj.business, obj);
        resInfo.then((response) => {
            log.info(JSON.stringify(response));
            if (response.statusCode === 200) {
               let kycRefNo = response.body.result.kycRefNo;
                let data = {
                    "status": userObj.status + 1,
                    "kycRefNo": kycRefNo,
                    "changed": Date.now(),
                    "name.approvedName": req.session.userId,
                    "reason": null,
                    "declined": 0
                };
 
                userObj.set(data);
                userObj.save((err) => {
                    if (err) {
                        res.status(500).send(constants.INTERNAL_SERVER_ERROR);
                    } else {
                        if (updateKyc) {
                            updateRegistrationDataV2(userObj, req, res);
                        } else {
                            res.send(constants.APPROVE_SUCCESS_MSG);
                        }
 
                    }
                });
            } else if (response.statusCode === 500) {
                res.status(500).send(response.body.exception.detailMessage);
            } else {
                res.status(500).send(constants.INTERNAL_SERVER_ERROR);
            }
        }).catch((err) => {
            log.error(err);
            res.status(500).send(constants.INTERNAL_SERVER_ERROR)
        });
    }
    else {
        requestP.getPartnerToken(userObj.business).then((partnerObj) => {
            if (partnerObj == null) {
                log.error("Partner id /token not found");
                res.status(500).send(constants.INTERNAL_SERVER_ERROR);
            } else {
                let resInfo = requestP.postRequestKyc(requestP.getRpOptions(partnerObj.partnerId, partnerObj.partnerToken, constants.KYC_URL + 'kyc/v2/register', userObj.registrationV2Data));
                resInfo.then((response) => {
 
                    log.info("V2 Response:: " + JSON.stringify(response));
                    if (response.statusCode === 200) {
                        let kycRefNo = response.body.result.kycRefNo;
                        let data = {
                            "status": userObj.status + 1,
                            "kycRefNo": kycRefNo,
                            "changed": Date.now(),
                            "name.approvedName": req.session.userId,
                            "reason": null,
                            "declined": 0
                        };
 
                        userObj.set(data);
                        userObj.save((err) => {
                            if (err) {
                                res.status(500).send(constants.INTERNAL_SERVER_ERROR);
                            } else {
                                if (updateKyc) {
                                    updateRegistrationDataV2(userObj, req, res);
                                } else {
                                    res.send(constants.APPROVE_SUCCESS_MSG);
                                }
 
                            }
                        });
                    } else if (response.statusCode === 500) {
                        res.status(500).send(response.body.exception.detailMessage);
                    } else {
                        res.status(500).send(constants.INTERNAL_SERVER_ERROR);
                    }
                }).catch((err) => {
                    log.error(err);
                    res.status(500).send(constants.INTERNAL_SERVER_ERROR)
                });
 
            }
 
        });
 
    }
}
 
async function uploadKycDocuments(jsonBody, req) {
    let obj = {};
    obj.documents = [];
    obj.entityId = jsonBody.entityId;
    for (let i = 0; i < req.files.length; i++) {
        let fileData = {};
        fileData["documentFilePath"] = constants.UPLOAD_SERVER_PATH + req.session.bank + "/" + jsonBody.business + "/" + (jsonBody.customerId + '_' + req.files[i].fieldname + "_" + moment().format("YYYY-MM-DD")).replace(/\s+/g, '_').toLowerCase() + path.extname(req.files[i].originalname);
        fileData["documentType"] = req.files[i].fieldname;
        fileData["documentFileName"] = (jsonBody.customerId + '_' + req.files[i].fieldname + "_" + moment().format("YYYY-MM-DD")).replace(/\s+/g, '_').toLowerCase() + path.extname(req.files[i].originalname);
        obj.documents.push(fileData);
    }
    req.session.documents = obj;
    let query = requestP.getPartnerToken(jsonBody.business);
    return await query;
}
 
function uploadKycDocumentsOnChecker(userObj, req, res) {
 
    let sftpUploadArr = [];
    let sftp = new Client();
    let partnerId = userObj.business;
    log.info(partnerId);
    let query = requestP.getPartnerToken(partnerId);
    query.then(partnerObj => {
        if (partnerObj == null) {
            logger.info("Partner Token Not Idetified / Failed");
            res.status(500).send(constants.PARTNER_TOKEN_NOT_FOUND)
        }
        else {
            logger.info("Partner Token Identified : ")
 
            if (typeof partnerObj.s3BucketEnabled !== "undefined" && partnerObj.s3BucketEnabled != false) {
 
                console.log("S3 Enabled : ");
                for (let i = 0; i < userObj.kycData.documents.length; i++) {
                    let doc = userObj.kycData.documents[i];
                    const file = fs.createReadStream(constants.UPLOAD_FILE_PATH + doc.documentFileName);
                    var fileName = doc.documentFileName;
                    var filePath = partnerObj.bank + "/" + partnerObj.partnerId + "/" + doc.documentFileName;
 
                    const s3UploadParams = {
                        Bucket: constants.AWS_BUCKET_NAME,
                        Body: file,
                        Key: filePath
                    }
 
                    s3Upload(s3UploadParams, req, res);
 
                }
 
                updateRegistrationData(userObj, req, res, true);
 
 
            } else {
                sftp.connect(sftpConnectConfig, 'on').then(() => {
                    log.info("Connected to SFTP");
                    for (let i = 0; i < userObj.kycData.documents.length; i++) {
                        let doc = userObj.kycData.documents[i];
                        let sftpPromise = sftp.fastPut(constants.UPLOAD_FILE_PATH + doc.documentFileName, doc.documentFilePath, {});
                        sftpUploadArr.push(sftpPromise);
                    }
 
                    Promise.all(sftpUploadArr).then((data) => {
                        log.info(JSON.stringify(data));
                        sftp.end().then(() => log.info("SFTP connection closed")).catch((err) => log.error(err));
                        updateRegistrationData(userObj, req, res, true);
                    }).catch((err) => {
                        log.error(err);
                        res.status(500).send(constants.INTERNAL_SERVER_ERROR)
                    });
                }).catch((err) => {
                    log.info("Error connecting to sftp");
                    log.error(err);
                    res.status(500).send(constants.INTERNAL_SERVER_ERROR)
                })
            }
 
 
        }
    });
 
 
 
}
 
async function s3Upload(s3UploadParams) {
    log.info("S3 Bucket Upload Called : ");
 
    try {
        const stored = await s3.upload(s3UploadParams).promise().then((data) => {
 
            log.info('file uploaded successfully to S3');
            log.info('File Path : ' + s3UploadParams.Key);
 
        }).catch((err) => {
            log.error("S3 Upload Failed for File : " + s3UploadParams.Key)
            log.error(err);
        });
    }
    catch (err) {
        console.log(err)
    }
    log.info("End of S3 Upload Method");
}
 // Get Files froom S3 Onboarding-User Data
 app.post('/hrms/getFiles', authenticateJWT, async function (req, res) {
    log.info('Accessing S3-Bucket for user documents.')
    let checkName = req.body.employeeName
    let checkPhone = req.body.phoneNumber
    const s3 = new AWS.S3({
        accessKeyId: constant.AWS_ACCESS_KEY_ID,
        secretAccessKey: constant.AWS_SECRET_ACCESS_KEY,
        Bucket: constant.AWS_BUCKET_NAME,
        region: constant.AWS_REGION
    });
    let files
    try {
    await mongooseSchema.onboardInfo.find({ "employeeName": checkName, "phoneNumber": checkPhone }).exec(function (err, result) {
        if (err) {
            log.error(err)
            res.status(500).send("Something went wrong in getting data")
        }
        if (result) {
            log.info('Successfully retrieved data for Accessing S3 files')
            files = result[0].files
            s3GetFiles(files)
        }else{
            log.info('No record found')
            res.status(404).send("No record found")
        } 
    })
    async function s3GetFiles(fileData){
        let keys = Object.keys(fileData)
        let filePath =[]
        let filename = []
        for(i=0;i<keys.length;i++){
            let path = files[keys[i]].uploadname
            filename.push(path)
        }
        for(i=0;i<keys.length;i++){
            let path = files[keys[i]].filepath
            filePath.push(path)
        }
        const params = filePath.map(file=>{
            return{
                Bucket: constant.AWS_BUCKET_NAME,
                Key: file
            }
        })
        
        const s3files = await Promise.all(params.map(param => s3.getObject(param).promise()))
        for(i=0;i<s3files.length;i++){
            fs.writeFileSync(constant.DOWNLOAD_FILE_PATH + "/"+filename[i],s3files[i].Body)
        }
        const base64File = filename.map(file=>{
            return fs.readFileSync("./dirStorage/micro-docs/downloads/"+file, {encoding: 'base64'});
        })
        let s3Files ={}
        // let resp = data
        // let buffData = []
        // data.map(buffer=> buffData.push(buffer.Body))
        let type = ""
        let ext = ""
        for(i=0;i<keys.length;i++){
            ext = path.extname(files[keys[i]].originalname)
            switch(ext){
                case".png"||".PNG": type = "image/png";
                break;
                
                case".jpg"||".JPG": type = "image/jpg";
                break;
                
                case".jpeg"||".JPEG": type = "image/jpeg";
                break;
                
                case".pdf"||".PDF": type = "application/pdf";
                break;
            }
            // const base64String = new Buffer.from(buffData[i]).toString("base64") 
            // resp[i].base64File = `data:${type};base64,${base64String}`
            // resp[i].fileType = path.extname(files[keys[i]].originalname)
            // fs.writeFileSync(constant.DOWNLOAD_FILE_PATH + "/"+filename[i],data[i].Body)
            
            Object.assign(s3Files,{[keys[i]]:{
                "base64File":`data:${type};base64,`+base64File[i],
                "fileType":path.extname(files[keys[i]].originalname)
            }})
        }
        // for(i=0;i<keys.length;i++){
        //     Object.assign(s3Files,{[keys[i]]:resp[i]})
        // }
        log.info('S3 fetching files successfull')
        res.status(200).send(s3Files);
    }
    } catch (err) {
        log.error(err);
        res.status(500).send(err)
        return;
    }
})
// Get Files from S3 Onboarding-User Data
app.post('/hrms/getFiles', authenticateJWT, async function (req, res) {
    log.info('Accessing S3-Bucket for user documents.')
    let checkName = req.body.employeeName
    let checkPhone = req.body.phoneNumber
    let files
    try {
    await mongooseSchema.onboardInfo.find({ "employeeName": checkName, "phoneNumber": checkPhone }).exec(function (err, result) {
        if (err) {
            log.error(err)
            res.status(500).send("Something went wrong in getting data")
        }
        if (result) {
            log.info('Successfully retrieved data for Accessing S3 files')
            files = result[0].files
            s3GetFiles(files)
        }else{
            log.info('No record found')
            res.status(404).send("No record found")
        } 
    })
    async function s3GetFiles(fileData){
        let keys = Object.keys(fileData)
        let filePath =[]
        for(i=0;i<keys.length;i++){
            let path = files[keys[i]].uploadname
            filePath.push(path)
        }
        const params = filePath.map(file=>{
            return fs.readFileSync("./dirStorage/micro-docs/uploads/"+file, {encoding: 'base64'});
        })
        let s3Files ={}
        let type = ""
        let ext = ""
        for(i=0;i<keys.length;i++){
            ext = path.extname(files[keys[i]].originalname)
            switch(ext){
                case".png"||".PNG": type = "image/png";
                break;
                
                case".jpg"||".JPG": type = "image/jpg";
                break;
                
                case".jpeg"||".JPEG": type = "image/jpeg";
                break;
                
                case".pdf"||".PDF": type = "application/pdf";
                break;
            }
            Object.assign(s3Files,{[keys[i]]:{
                "base64File":`data:${type};base64,`+params[i],
                "fileType":path.extname(files[keys[i]].originalname)
            }})
        }
        log.info('S3 fetching files successfull')
        await res.status(200).send(s3Files);
    }
    } catch (err) {
        log.error(err);
        res.status(500).send(err)
        return;
    }
})