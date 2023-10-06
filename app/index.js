const request = require('request');
const fs = require('fs');
const moment = require('moment');
const multer = require('multer');
const path = require('path');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const log = require('./configs/log.js');
const constant = require('./configs/constants.js');
const messageConstant = require('./configs/message');
const mongooseSchema = require('./middlewares/schema/mongooseSchema');
const requestP = require('./middlewares/request/request_promise');
const parseResponseLists = require('./middlewares/parseResponseLists');
const { response } = require('express');
const AWS = require('aws-sdk');
const saveAdminInfoData = mongooseSchema.saveAdminInfoData;

module.exports = function (app) {
    //JWT Authentication
    function jwtToken(user) {
        return jwt.sign(user, constant.ACCESSKEY, { expiresIn: "1h" });
    }
    function jwtHrmsToken(user) {
        return jwt.sign(user, constant.ACCESSKEY, { expiresIn: "1h" });
    }
    function authenticateJWT(req, res, next) {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.split(' ')[1];
            jwt.verify(JSON.parse(token), constant.ACCESSKEY, (err, user) => {
                if (err) {
                    return res.redirect('/');
                }
                if(user){
                    next();
                }
            });
        } else {
            return res.status(401).json('You are not authenticated !');
        }
    }
    //AWS S3-Bucket Configuration
    const tempStorage = multer.memoryStorage()
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, constant.UPLOAD_FILE_PATH)
        },
        filename: function (req, file, cb) {
            let fileName = req.body.userName+  '_' + file.originalname.split('.')[0] + "_" + moment().format("YYYY-MM-DD HH:mm");
            let fileNameToReplace = fileName.replace(/\s+/g, '_').toLowerCase() + path.extname(file.originalname);
            cb(null, fileNameToReplace);
        }
    })
    let upload = multer({
        storage: storage, fileFilter: function (req, file, cb) {
            let fileType = [".jpg", ".jpeg", ".png", ".pdf", ".JPG", ".JPEG", ".PNG"];
            if (fileType.includes(path.extname(file.originalname))) {
                cb(null, true)
            } else {
                cb(new Error("File format not supported"));
            }
        }, limits: { fileSize: constant.FILE_UPLOAD_SIZE }
    });
    let uploadAws = multer({
        storage: tempStorage, fileFilter: function (req, file, cb) {
            let fileType = [".jpg", ".jpeg", ".png", ".pdf", ".JPG", ".JPEG", ".PNG"];
            if (fileType.includes(path.extname(file.originalname))) {
                cb(null, true)
            } else {
                cb(new Error("File format not supported"));
            }
        }, limits: { fileSize: constant.FILE_UPLOAD_SIZE }
    });

    // TODO  >>>>>>>>>> Accessing Api's <<<<<<<<<<<
   
    //Saving Employee Details - Admin Part
    app.post('/hrms/save/info', authenticateJWT,  function (req, res) {
        log.info("Saving Profile Info");
        let adminInfo = new saveAdminInfoData({
            status: "0",
            roleLevel: "1",
            portalLink: "true",
            saveAdminInfoData: req.body,
            hrBranch: "Chennai",
            name: {
                "hrName": "hr@m2pfintech.com"
            }
        });
        adminInfo.save(function (err) {
            if (err) {
                log.error(err);
                let uniqErr = JSON.stringify(err)
                let chkPat = JSON.parse(uniqErr).keyPattern
                if(Object.keys(chkPat)[0]==='saveAdminInfoData.phoneNumber'){
                    res.status('409').send('Mobile number already Registered')
                }else if(Object.keys(chkPat)[0]==='saveAdminInfoData.eMail'){
                    res.status('409').send('Email already Registered')
                }else{
                    res.status(500).send("Something went wrong")
                }
            } else {
                log.info("Data Saved");
                log.info("Accessing for the Notification to Employee");
                let sendSmsNotify = {};
                sendSmsNotify.business = "M2P";
                sendSmsNotify.args = [
                    req.body.fullName,
                    req.body.eMail
                ];
                sendSmsNotify.mobileNo = "+91" + req.body.phoneNumber;
                sendSmsNotify.transactionType = "customer_registered";
                let sendSMSNotifyInfo = requestP.postRequest(constant.NOTIFICATION_URL + "sms/notify", "M2P", sendSmsNotify);
                sendSMSNotifyInfo.then((response) => {
                    let responseNotifyObj;
                    if (response.statusCode === 200) {
                        responseNotifyObj = response.body.code;
                        log.info("Notification Status:" + JSON.stringify(responseNotifyObj));
                        return res.status(200).send(constant.APPROVE_SUCCESS_NOTIFY);
                    } else if (response.statusCode === 500) {
                        responseNotifyObj = response.body.exception.detailMessage;
                        res.status(500).send(responseNotifyObj);
                    } else {
                        res.status(500).send(constant.INTERNAL_SERVER_ERROR);
                    }
                });
            }
        });
    });
    //Validating Email - Emp Part
    app.post('/hrms/validateEmail', function (req, res) {
        log.info("Checking Email");
        saveAdminInfoData.find({ "saveAdminInfoData.eMail": req.body.emailEmp }).exec(function (err, result) {
            emailEmp=req.body.emailEmp
            if (err) {
                log.info(err);
                res.status(500).send(constant.SWR_MSG);
            } else {
                if (result.length === 0) {
                    res.status(500).send(constant.MONGO_NO_RECORD);
                } else if (result.length > 0) {
                    if(result[0].saveAdminInfoData.status==="Pending"){
                        let data = result[0].saveAdminInfoData;
                        let mobileNo = "+91" + data.phoneNumber;
                        function generateOTP() {
                            var digits = '0123456789';
                            var otpLength = 6;
                            var otp = "";
                            for (let i = 1; i <= otpLength; i++) {
                                var index = Math.floor(Math.random() * (999999 - 100000) + 100000)
                                otp = index
                            }
                            return otp;
                        }
                        let otpNotify = {}
                        otpNotify.business = "M2P",
                            otpNotify.args = [generateOTP()],
                            otpNotify.mobileNo = "+91" + data.phoneNumber;
                        otpNotify.transactionType = "otp"
                        let sendOtpNotify = requestP.postRequest(constant.NOTIFICATION_URL + "sms/notify", "M2P", otpNotify);
                        sendOtpNotify.then((response) => {
                            let responseNotifyObj;
                            if (response.statusCode === 200) {
                                responseNotifyObj = response.body.code;
                                const user = responseNotifyObj
                                log.info("Notification Status:" + JSON.stringify(responseNotifyObj));
                                const otpInfo = mongooseSchema.otpInfo({
                                    mobileNo: otpNotify.mobileNo,
                                    otp: otpNotify.args[0],
                                    // status:false
                                })
                                res.status(response.statusCode).send({ status: "SUCCESS", data });
                                otpInfo.save(function (err, success) {
                                    if (err) {
                                        log.info(err)
                                    }
                                    if (success) {
                                        log.info("OTP data saved successfully")
                                    }
                                })
                            } else if (response.statusCode === 500) {
                                responseNotifyObj = response.body.exception.detailMessage;
                                res.status(500).send(responseNotifyObj);
                            } else {
                                res.status(500).send(constant.INTERNAL_SERVER_ERROR);
                            }
                        })
                    }else if(result[0].saveAdminInfoData.status==="Completed"){
                        log.info('User details already exits')
                        res.status(409).send('You have already Submitted your details')
                    }
                } else {
                    res.status(500).send(constant.SWR_MSG);
                }
            }
        });
    });
    //Validate OTP
    app.post('/hrms/validateOtp', function (req, res) {
        log.info('Validating OTP ...')
        const validateOtpMobile = {
            mobileNumber: req.body.mobileNumber,
            otp: req.body.otp
        };
        if (response.statusCode === 200) {
            try {
                mongooseSchema.otpInfo.find(
                    {
                        "mobileNo": validateOtpMobile.mobileNumber,
                        "otp": validateOtpMobile.otp,
                        // "status":{$ne:true}
                    }
                ).select('mobileNo otp status').exec(function (err, result) {
                    let resultChk = result[0]
                    if (err) {
                        log.info(err)
                    }
                    if (resultChk === undefined) {
                        log.info('Invalid OTP')
                        res.status(401).send('Invalid OTP')
                    } else if (resultChk.otp === req.body.otp && resultChk.status === true) {
                        log.info('OTP already verified or expired')
                        res.status(409).send('OTP already verified or expired')
                    } else if (req.body.mobileNumber === resultChk.mobileNo && req.body.otp === resultChk.otp && resultChk.status === false) {
                        mongooseSchema.otpInfo.updateOne({ "otp": resultChk.otp }, { $set: { "status": true } }).exec(function (err, result) {
                            if (err) {
                                log.info(err)
                                res.status(500).json('Something went wrong. Try again later')
                            }
                            if (result) {
                                log.info('OTP verified successfully')
                            }
                        })
                        let dataSend = JSON.stringify(resultChk)
                        const accessToken = jwtToken({ resultChk });
                        req.session.authtoken = accessToken
                        req.session.role = "user"
                        log.info("User::"+req.body.userName+" logged in")
                        log.info('Get Result Info View : StatusCode : ' + response.statusCode + ' ResponseResult : ' + JSON.stringify(req.body));
                        res.status(response.statusCode).send({ status: "SUCCESS", accessToken })
                    }
                })
            } catch (err) {
                log.error(err)
                res.status(500).send(constant.ERROR_MSG);
            }
        } else {
            res.status(500).send(constant.ERROR_MSG);
        }
    })
    //Validate Login
    app.post('/hrms/validateUserName', function (req, res) {
        log.info('Accessing Validate User Name');
        request({
            url: constant.AUTH_BASE_URL + 'v2/user/validateUser?userName=' + req.body.user,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'APPLICATION': constant.APPLICATION_NAME,
                'Authorization': 'Basic eWFwcGF5OnlhcHBheQ=='
            }
        }, function (error, response, body) {
            if (error) {
                log.error(error);
                if (error.code === "EHOSTUNREACH") {
                    res.status(500).send("Something went wrong..! Check your internet connection");
                } else if (error.code === "ECONNREFUSED") {
                    res.status(500).send("Something went wrong with connection !!! ");
                }
            } else {
                if (response.statusCode === 500) {
                    let errorInfo = JSON.parse(body).exception.detailMessage;
                    log.error("Status Code ::" + response.statusCode + " : Response body :: " + JSON.stringify(errorInfo));
                    res.status(200).send(constant.INVALID_USER);
                } else if (response.statusCode === 200) {
                    return res.status(200).send(JSON.stringify(response.body));
                } else {
                    let errorInfo = JSON.stringify(body);
                    log.error("Status Code ::" + response.statusCode + " : Response body :: " + JSON.stringify(body));
                    return res.status(response.statusCode).send(constant.INVALID_USER);
                }
            }
            res.end()
        });
    });
    //Validate Pass OTP
    app.post('/hrms/validatePassOtp', function (req, res) {
        log.info('Accessing Validate OTP for User Name');
        log.info('Validate Request Data : ' + JSON.stringify(req.body));
        let validatePassOtpMobile = {
            "otp": req.body.otp,
            "userName": req.body.userName
        };
        request({
            url: constant.AUTH_BASE_URL + constant.ValidatePassOtp,
            method: 'POST',
            body: JSON.stringify(req.body),
            headers: {
                'Content-Type': 'application/json',
            },
        }, function (error, response, body) {
            if (error) {
                log.info('Get Transaction View:' + error);
                res.status(500).send(error);
            } else {
                if (response.statusCode === 500) {
                    let errorInfo = JSON.parse(body);
                    log.error(errorInfo);
                    res.status(response.statusCode).send(errorInfo.exception);
                } else if (response.statusCode === 200) {
                    let resInfo = JSON.parse(body);
                    let userDetails = response.body.result
                    const accessToken = jwtHrmsToken(validatePassOtpMobile);
                    req.session.role = "BANK"
                    req.session.authtoken = accessToken;
                    log.info('Get Result Info View : StatusCode : ' + response.statusCode + ' ResponseResult : ' + JSON.stringify(resInfo));
                    return res.status(response.statusCode).send({ status: "SUCCESS", accessToken });
                    // res.status(200).send(constant.SUCCESS);
                } else {
                    log.info('Get Transaction View Error');
                    res.status(response.statusCode).send('Something went wrong');
                }
                res.end()
            }
        });
    });
    //Get Saved Data from Mongo - Admin Level
    app.get('/hrms/getSavedInfoData', authenticateJWT, function (req, res) {
        log.info('Getting user data...')
        let page = "/viewDetail"
        saveAdminInfoData.find({ "status": 0, "portalLink": "true" }).sort({
            created: -1
        }).exec(function (err, data) {
            if (err) {
                log.info(err);
                res.status(500).send(constant.SWR_MSG);
            } else {
                if (data.length > 0) {
                    return res.status(200).json(data);
                }
            }
        });
    });
    // Listiing Designation
    app.post('/hrms/list/designation', authenticateJWT, function (req, res) {
        // log.info("HRMS Designation list hit Received");
        let department = req.body.department
        mongooseSchema.designationData.find({department}, { "department": true }).distinct('designation').exec(function (err, data) {
            if (err) {
                log.error(err);
                res.status(500).send("Something went wrong")
            } else if (data.length !== 0) {
                // log.info('Success getting Designation list')
                res.status(response.statusCode).json(data)
            }else{
                res.status(404).send('Create new designation')
            }
        })
    })
    //Listing Department
    app.post('/hrms/list/department', authenticateJWT, function (req, res) {
        // log.info("HRMS Department list hit Received");
        mongooseSchema.departmentData.find({}, { "department": true }).distinct('department').exec(function (err, data) {
            if (err) {
                log.error(err);
                res.status(500).send("Something went wrong")
            } else if (data.length !== 0) {
                res.status(response.statusCode).json(data)
            }else{
                res.status(500).send("No records found")
            }
        })
    })
    //Listing Location
    app.post('/hrms/list/location', authenticateJWT, function (req, res) {
        // log.info("HRMS Location list hit Received");
        mongooseSchema.locationData.find({}, { "location": true }).distinct('location').exec(function (err, data) {
            if (err) {
                log.error(err);
                res.status(500).send("Something went wrong")
            } else if (data.length !== 0) {
                // log.info('Success getting Location list')
                res.status(response.statusCode).json(data)
            }else{
                res.status(500).send("No records found")
            }
        })
    })
    // Save Onboarding Data
    app.post('/hrms/save/onboardingData', authenticateJWT, function (req, res) {
        let checkName = req.body.employeeName
        let checkPhone = req.body.phoneNumber
        log.info('Save data for Onboarding user hit received')
        mongooseSchema.onboardInfo.findOne({ "employeeName": checkName, "phoneNumber": checkPhone }).exec(function (err, result) {
            if (err) {
                log.error(err)
            }
            if (result === null) {
                mongooseSchema.onboardInfo({
                    "employeeDetails": req.body.employeeDetails,
                    "employeeName": req.body.employeeName,
                    "phoneNumber": req.body.phoneNumber
                }).save(function (err,success) {
                    if (err) {
                        log.error(err);
                        res.status(500).send(constant.SWR_MSG);
                    } 
                    if(success){
                        let query = {"saveAdminInfoData.fullName":checkName,"saveAdminInfoData.phoneNumber":checkPhone}
                        let newData = { $set: { "saveAdminInfoData.status": "Completed" } }
                        saveAdminInfoData.updateOne(query,newData).exec((err,success)=>{
                            if(err) {
                                log.error(err);
                                res.status(500).send(constant.SWR_MSG);
                            }
                            if(success){
                                log.info("newUser: " + req.body.employeeName + ' - Data has been saved successfully')
                                res.status(200).send(constant.APPROVE_SUCCESS_MSG)
                            }else{
                                log.info('Something went wrong in saving Onboarding data')
                                res.status(500).send('Something went wrong')
                            } 
                        })
                    }
                });
            } else {
                let query = {"saveAdminInfoData.fullName":checkName,"saveAdminInfoData.phoneNumber":checkPhone}
                let newData = { $set: { "saveAdminInfoData.status": "Completed" } }
                saveAdminInfoData.updateOne(query,newData).exec((err,success)=>{
                    if(err) {
                        log.error(err);
                        res.status(500).send(constant.SWR_MSG);
                    }
                    if(success){
                        log.info("newUser: " + req.body.employeeName + ' - Data has been saved successfully')
                        res.status(200).send(constant.APPROVE_SUCCESS_MSG)
                    }else{
                        log.info('Something went wrong in saving Onboarding data')
                        res.status(500).send('Something went wrong')
                    } 
                })
            }
        })
    })
    app.post('/hrms/partialsave/onboardingData', authenticateJWT, function (req, res) {
        log.info('Save data for Onboarding user hit received')
        let checkName = req.body.employeeName
        let checkPhone = req.body.phoneNumber
        mongooseSchema.onboardInfo({
            "employeeDetails": req.body.employeeDetails,
            "employeeName": req.body.employeeName,
            "phoneNumber": req.body.phoneNumber
        }).save(function (err,success) {
            if (err) {
                log.error(err);
                res.status(500).send(constant.SWR_MSG);
            } 
            if(success){
                log.info("newUser: " + req.body.employeeName + ' - Data has been saved successfully')
                res.status(200).send(constant.APPROVE_SUCCESS_MSG)
            }
        });
    })
    //S3 files upload API
    app.post('/hrms/uploadFiles',upload.array('files'), authenticateJWT, async function(req,res){
        log.info("S3 Bucket Upload Called : ");
        let unlink = req.files
        async function s3Upload(files){
            let userName = req.body.userName
            const s3 = new AWS.S3({
                useAccelerateEndpoint: true,
                accessKeyId: constant.AWS_ACCESS_KEY_ID,
                secretAccessKey: constant.AWS_SECRET_ACCESS_KEY,
                Bucket: constant.AWS_BUCKET_NAME,
                region: constant.AWS_REGION
            });
        
            const params = files.map(file=>{
                return{
                    Bucket: constant.AWS_BUCKET_NAME,
                    Body: fs.createReadStream(file.path),
                    Key: userName+"/"+file.filename
                }
            })
            return await Promise.all(params.map(param => s3.upload(param).promise()))
        }
        function sendMail(userMail){
            log.info('Email api hit received')
            let mailData = {
                business: "M2PSITE",
                transactionType: "m2p_site_mail_notify",
                emailNotifyData: {
                    to_email: userMail,
                    title: "HRMS - Confirmation ",
                    body: "Thank you. Your Onbaording process is completed successfully"
                }
            }
            request(
                {
                    url: constant.EMAIL_NOTIFY_PRODUCTION,
                    method: "POST",
                    headers: {
                      "content-Type": "application/json",
                    },
                    body: JSON.stringify(mailData),
                },
                function (error, response, body) {
                    if (error) {
                        log.error(error);
                        return res.status(500).end("Something went wrong in Sending mail");
                    } else {
                        let responseNotifyObj;
                        if (response.statusCode === 200) {
                            responseNotifyObj = JSON.parse(response.body);
                            log.info("Email Notification Status:" + responseNotifyObj.code);
                            return res.status(200).json({"success":"Files uploaded in S3"+" & "+constant.APPROVE_SUCCESS_NOTIFY,"emailStatus":constant.MAIL_SUCCESS})
                        } else if (response.statusCode === 500) {
                            responseNotifyObj = response.body
                            log.error(responseNotifyObj)
                            res.status(500).send(responseNotifyObj);
                        } else {
                            log.error()
                            res.status(500).send(constant.MAIL_ERROR);
                        }
                    }
                }
            )
        }
        try{
            var data = Object.keys(req.body)
            data.splice(0,2)
            var keys = data
            let value = req.files
            let document = {}
            const result = await s3Upload(req.files)
            for(i=0;i<req.files.length;i++){
                Object.assign(document,{[keys[i]]:{
                    "originalname":value[i].originalname,
                    "uploadname":value[i].filename,
                    "filepath":result[i].Key,
                    "location":result[i].Location
                }})
            }
            log.info('Files uploaded successfully to S3');
            if(result){
                mongooseSchema.onboardInfo.find({"employeeName":req.body.userName,"phoneNumber":req.body.phoneNumber}).exec((err,resultData)=>{
                    if(err){
                        log.error(err)
                        res.status(500).send('Something went wrong')
                    }
                    if(resultData[0]){
                        let query = { "employeeName": req.body.userName, "phoneNumber": req.body.phoneNumber }
                        let newData = { $set: { "files": document} }
                        mongooseSchema.onboardInfo.updateOne(query,newData).exec((err,success)=>{
                            if(err){
                                log.error(err)
                                return res.status(500).send('Something went wrong')
                            }
                            if(success){
                                saveAdminInfoData.find({
                                    "saveAdminInfoData.fullName":req.body.userName,
                                    "saveAdminInfoData.phoneNumber":req.body.phoneNumber
                                    }).exec((err,resultData)=>{
                                        if(err){
                                            log.error(err)
                                        }
                                        if(resultData[0]){
                                            let userMail = resultData[0].saveAdminInfoData.eMail
                                            sendMail(userMail)
                                        }
                                })
                                log.info('S3 file details saved successfully in DB')
                            }
                        })
                    }
                })
            }
        }catch(err){
            log.error(err.message+":"+err.statusCode)
            res.status(err.statusCode).send(err)
        }
        log.info("End of S3 Upload Method");
    })
    //Get Saved Data from Mongo - Admin Level
    app.get('/hrms/getDesignationData', authenticateJWT, function (req, res) {
        let page = "/addDesignation"

        mongooseSchema.designationData.find({}).sort({
            created: -1
        }).exec(function (err, data) {
            if (err) {
                log.info(err);
                res.status(500).send(constant.SWR_MSG);
            } else {
                if (data.length > 0) {
                    let dataSet = parseResponseLists.designationInfo(page);
                    dataSet.data = parseResponseLists.normalizeDesignationData(data, req);
                    return res.status(200).json(dataSet);
                } else {
                    return res.status(200).json(parseResponseLists.designationInfo(page))
                }
            }
        });
    });
    app.get('/hrms/getDepartmentData', authenticateJWT, function (req, res) {
        let page = "/addDepartment"
        mongooseSchema.departmentData.find({}).sort({
            created: -1
        }).exec(function (err, data) {
            if (err) {
                log.info(err);
                res.status(500).send(constant.SWR_MSG);
            } else {
                if (data.length > 0) {
                    let dataSet = parseResponseLists.departmentInfo(page);
                    dataSet.data = parseResponseLists.normalizeDepartmentData(data, req);
                    return res.status(200).json(dataSet);
                } else {
                    return res.status(200).json(parseResponseLists.departmentInfo(page))
                }
            }
        });
    });
    app.get('/hrms/getLocationData', authenticateJWT, function (req, res) {
        let page = "/addLocation"
        mongooseSchema.locationData.find({}).sort({
            created: -1
        }).exec(function (err, data) {
            if (err) {
                log.info(err);
                res.status(500).send(constant.SWR_MSG);
            } else {
                if (data.length > 0) {
                    let dataSet = parseResponseLists.locationInfo(page);
                    dataSet.data = parseResponseLists.normalizeLocationData(data, req);
                    return res.status(200).json(dataSet);
                } else {
                    return res.status(200).json(parseResponseLists.locationInfo(page))
                }
            }
        });
    });
    // Get Saved Onboarding-User Data
    app.post('/hrms/getSavedUserData', authenticateJWT, async function (req, res) {
        log.info('Getting Onboard-details...')
        let checkName = req.body.employeeName
        let checkPhone = req.body.phoneNumber
        try {
            mongooseSchema.onboardInfo.find({ "employeeName": checkName, "phoneNumber": checkPhone }).exec(function (err, result) {
            if (err) {
                log.error(err)
                res.status(500).send("Something went wrong in getting data")
            }
            if (result[0]) {
                log.info('Data retrieved from DB successfully')
                let finalData = {}
                finalData.data = result[0].employeeDetails
                res.status(200).send(finalData)
            }else{
                log.info('No record found')
                res.status(404).send("No record found")
            } 
            })
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
                if (result[0]) {
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
    // Delete employee Data
    app.post('/hrms/delete/employeeData', authenticateJWT, function (req, res) {
        log.info("HRMS Employee delete hit Received");
        saveAdminInfoData.findOneAndDelete({ "saveAdminInfoData.fullName": req.body.fullName, "saveAdminInfoData.phoneNumber": req.body.phoneNumber }).sort("-_id").exec(function (err, data) {
            if (err) {
                log.error(err);
                res.status(500).send("Something went wrong")
            }
            if (!data) {
                log.info("No records found")
                return res.status(404).send('No record found')
            } else {
                log.info('HRMS Update: ' + req.body.hrName + ', removed ' + req.body.fullName)
                res.status(response.statusCode).json('User deleted successfully')
            }
        })
    })
    //Update Employee data - Admin
    app.post("/hrms/update/edituser", authenticateJWT, function (req, res) {
        log.info("HRMS Employee update hit Received");
        let query = {
            "saveAdminInfoData.fullName": req.body.fullName,
            "saveAdminInfoData.phoneNumber": req.body.phoneNumber,
        }
        let newData = {
            $set: {
                "saveAdminInfoData": req.body.saveAdminInfoData
            }
        }
        try {
            saveAdminInfoData.findOneAndUpdate(query, newData).exec((err, result) => {
                if (err) {
                    log.error(err);
                    let uniqErr = JSON.stringify(err)
                    let chkPat = JSON.parse(uniqErr).keyPattern
                    if(Object.keys(chkPat)[0]==='saveAdminInfoData.phoneNumber'){
                        res.status('409').send('Mobile number already Registered')
                    }else if(Object.keys(chkPat)[0]==='saveAdminInfoData.eMail'){
                        res.status('409').send('Email already Registered')
                    }else{
                        res.status(500).send("Something went wrong")
                    }
                }
                if (result) {
                    log.info("User:" + result.saveAdminInfoData.fullName + ",Data has been updated successfully");
                    res.status(200).json('User data has been updated successfully')
                }
            })
        } catch (err) {
            log.info(err)
            return res.status(500).end("Something went wrong in updating");
        }

    })
    //Adding Designation
    app.post('/hrms/add/designation', authenticateJWT, function (req, res) {
        log.info("HRMS Addnew-Designation list hit Received");
        const newDesgn = new mongooseSchema.designationData({
            'department':req.body.department,
            'designation': req.body.newDesignation,
            "createdBy": req.body.hrName,
            "changedBy": "None"
        })
        newDesgn.save(function (err, success) {
            if (err) {
                log.error(err);
                res.status(500).send("Something went wrong")
            } else if (success) {
                log.info('New designation added Successfully')
                res.status(response.statusCode).json('New designation added Successfully')
            }
        })
    })
    //Adding Department
    app.post('/hrms/add/department', authenticateJWT, function (req, res) {
        log.info("HRMS Addnew-Department list hit Received");
        const newDeprt = new mongooseSchema.departmentData({
            'department': req.body.newDepartment,
            "createdBy": req.body.hrName,
            "changedBy": "None"
        })
        newDeprt.save(function (err, success) {
            if (err) {
                log.error(err)
                res.status(500).send("Something went wrong")
            } else if (success) {
                log.info('New department added Successfully')
                res.status(response.statusCode).json('New department added Successfully')
            }
        })
    })
    //Adding Location
    app.post('/hrms/add/location', authenticateJWT, function (req, res) {
        log.info("HRMS Addnew-Location list hit Received");
        const newLoca = new mongooseSchema.locationData({
            'location': req.body.newLocation,
            "createdBy": req.body.hrName,
            "changedBy": "None"
        })
        newLoca.save(function (err, success) {
            if (err) {
                log.error(err)
                res.status(500).send("Something went wrong")
            } else if (success) {
                log.info('New location added Successfully')
                res.status(response.statusCode).json('New location added Successfully')
            }
        })
    })
     //Update Designation
     app.post("/hrms/update/designation", authenticateJWT, function (req, res) {
        log.info("HRMS Designation update hit Received");
        let hrName = req.body.hrName
        let department = req.body.department
        let newDepartment = req.body.newDepartment
        let oldName = req.body.designation
        let newName = req.body.newDesignation
        let query = {"department":department, "designation": oldName }
        let newData = { $set: { "department":newDepartment , "designation": newName, "changedBy": hrName } }
        try {
            mongooseSchema.designationData.find({'department':department,'designation':oldName}).exec((err,result)=>{
                if(err){
                    log.error(err)
                    res.status(500).send('Something went wrong')
                }
                if(result){
                    if(result[0].department===(department&&newDepartment)&&result[0].designation===(oldName && newName)){
                        res.status(409).send('No changes Occured')
                    }else{
                        mongooseSchema.designationData.findOneAndUpdate(query, newData).exec((err, result) => {
                            if (err) {
                                log.error(err);
                                res.status(500).json('Somethng went wrong')
                            }
                            if (result) {
                                log.info('Designation Update: ' + hrName + ', changed ' + oldName + ' to ' + newName)
                                res.status(200).json('Designation updated successfully')
                            }
                        })
                    }
                }
            })
        } catch (err) {
            log.info(err)
            return res.status(500).end("Something went wrong in updating");
        }
    })
    //Update Department
    app.post("/hrms/update/department", authenticateJWT, function (req, res) {
        log.info("HRMS Department update hit Received");
        let hrName = req.body.hrName
        let oldName = req.body.department
        let newName = req.body.newDepartment
        let query = { "department": oldName }
        let newData = { $set: { "department": newName, "changedBy": hrName } }

        try {
            mongooseSchema.departmentData.find({'department':req.body.newDepartment}).exec((err,result)=>{
                if(err){
                    log.error(err)
                    res.status(500).send('Something went wrong')
                }
                if(result[0]===undefined){
                    mongooseSchema.departmentData.findOneAndUpdate(query, newData).exec((err, result) => {
                        if (err) {
                            log.error(err);
                            res.status(500).json('Somethng went wrong')
                        }
                        if (result) {
                            log.info('Department Update: ' + hrName + ', changed ' + oldName + ' to ' + newName)
                            res.status(200).json('Department updated successfully')
                        }
                    })
                }else{
                    log.info('Department already exists')
                    res.status(409).json('Department already exists')   
                }
            })
        } catch (err) {
            log.info(err)
            return res.status(500).end("Something went wrong in updating");
        }
    })
    //Update Location
    app.post("/hrms/update/location", authenticateJWT, function (req, res) {
        log.info("HRMS Location update hit Received");
        let hrName = req.body.hrName
        let oldName = req.body.location
        let newName = req.body.newLocation
        let query = { "location": oldName }
        let newData = { $set: { "location": newName, "changedBy": hrName } }

        try {
            mongooseSchema.locationData.find({'location':req.body.newLocation}).exec((err,result)=>{
                if(err){
                    log.error(err)
                    res.status(500).send('Something went wrong')
                }
                if(result[0]===undefined){
                    mongooseSchema.locationData.findOneAndUpdate(query, newData).exec((err, result) => {
                        if (err) {
                            log.error(err);
                            res.status(500).json('Somethng went wrong')
                        }
                        if (result) {
                            log.info('Location Update: ' + hrName + ', changed ' + oldName + ' to ' + newName)
                            res.status(200).json('Location updated successfully')
                        }
                    })
                }else{
                    log.info('Location already exists')
                    res.status(409).json('Location already exists')
                }
            })
        } catch (err) {
            log.info(err)
            return res.status(500).end("Something went wrong in updating");
        }
    })
    //Delete Designation
    app.post('/hrms/delete/designation', authenticateJWT, function (req, res) {
        log.info("HRMS Designation delete hit Received");
        let hrName = req.body.hrName
        let department = req.body.department
        let designation = req.body.designation
        mongooseSchema.designationData.findOneAndDelete({"department":department ,"designation":designation }).sort("-_id").exec(function (err, data) {
            if (err) {
                log.error(err);
                res.status(500).send("Something went wrong")
            }
            if (!data) {
                log.info("No records found")
                res.status(404).send('No record found')
            } else {
                log.info('Designation Update: ' + hrName + ', removed ' + req.body.designation)
                res.status(response.statusCode).json('Designation deleted successfully')
            }
        })
    })
    // Delete Department
    app.post('/hrms/delete/department', authenticateJWT, function (req, res) {
        log.info("HRMS department delete hit Received");
        let hrName = req.body.hrName
        mongooseSchema.departmentData.findOneAndDelete({ "department": req.body.department }).sort("-_id").exec(function (err, data) {
            if (err) {
                log.error(err);
                res.status(500).send("Something went wrong")
            }
            if (!data) {
                log.info("No records found")
                res.status(404).send('No record found')
            } else {
                log.info('Department Update: ' + hrName + ', removed ' + req.body.department)
                res.status(response.statusCode).json('Department deleted successfully')
            }
        })
    })
    // Delete Location
    app.post('/hrms/delete/location', authenticateJWT, function (req, res) {
        log.info("HRMS Location delete hit Received");
        let hrName = req.body.hrName
        mongooseSchema.locationData.findOneAndDelete({ "location": req.body.location }).sort("-_id").exec(function (err, data) {
            if (err) {
                log.error(err);
                res.status(500).send("Something went wrong")
            }
            if (!data) {
                log.info("No records found")
                res.status(404).send('No record found')
            } else {
                log.info('Location Update: ' + hrName + ', removed ' + req.body.location)
                res.status(response.statusCode).json('Location deleted successfully')
            }
        })
    })    
};