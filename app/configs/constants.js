const path = require("path");
exports.M2P_URL = `${process.env.BASE_M2P_URL}/Yappay/`;
exports.AUTH_BASE_URL = `${process.env.BASE_URL_AUTH}/uaa/auth/`;
exports.NOTIFICATION_URL = `${process.env.BASE_URL_NOTIFICATION}/notification/`;
exports.EMAIL_NOTIFY = `${process.env.BASE_URL_NOTIFICATION}/notification/email/notify`;
exports.EMAIL_NOTIFY_PRODUCTION = "https://notify.yappay.in/notification/email/notify/";


exports.LOCAL_URL = `http://localhost:${process.env.APPLICATION_PORT}/`;
exports.MONGOURL = process.env.MONGO_URL;
exports.MONGOPORT = process.env.MONGO_PORT;
exports.MONGODB = process.env.MONGO_DB;

exports.MONGO_RECORD_LIMIT = 2500;

exports.AUTH_BASIC_TOKEN = "Basic eWFwcGF5OnlhcHBheQ==";

exports.SECRETKEY = "39943b68d15aa38be34e5db9b6cb26af";
exports.ACCESSKEY = "b144932091624091b6f3bd3def3303e8";


exports.GenerateOtp = 'otp-manager/generate/';
exports.ValidateOtp = 'business-entity-manager/validateOtp';
exports.ValidatePassOtp = 'v2/user/validateOtp';

exports.MAIL_TO = "hr@m2pfintech.com";
exports.MAIL_ERROR = "Error sending mail to customer";
exports.MAIL_SUCCESS = "Mail sent to user successfully";
exports.ERROR_MSG = "Something went wrong. Please try again later";
exports.SWR_MSG = "Error";
exports.SUCCESS_SAVE_MSG = "Saved Successfully";
exports.SUCCESS_EDIT_MSG = "Edited successfully";
exports.APPROVE_SUCCESS_MSG = "Successfully Approved";
exports.APPROVE_SUCCESS_NOTIFY = "Data Saved Successfully in Database";
exports.INVALID_USER = "Invalid User";
exports.INTERNAL_SERVER_ERROR = "Internal Server Error!!";
exports.APPLICATION_NAME = "HRMS";

exports.WAITING_FOR_APPROVAL = "PENDING";
exports.APPROVED = "APPROVED";
exports.DECLINED = "DECLINED";
exports.PENDING = "PENDING";
exports.SUCCESS = "SUCCESS";
exports.SUCCESSWITHERROR = "SUCCESS WITH ERROR";
exports.OTP_MSG = "OTP Sent to Mobile Number";
exports.MONGO_ERROR_MSG = "Error saving data";
exports.MONGO_NO_RECORD = "No Record Found";
exports.INVALID_OTP = "Invalid OTP";

exports.AWS_ACCESS_KEY_ID = "AKIAXCZAGJ4XWKEMBV74"
exports.AWS_SECRET_ACCESS_KEY = "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"
exports.AWS_BUCKET_NAME = "m2p-s3-microsite"
exports.AWS_REGION = "ap-south-1"
exports.FILE_UPLOAD_SIZE = 5000000
exports.UPLOAD_FILE_PATH = "./dirStorage/micro-docs/uploads"
exports.DOWNLOAD_FILE_PATH = "./dirStorage/micro-docs/downloads"


exports.ROUTES = ["/home"];

exports.APIROUTES = ["/hrms/save/info", "/hrms/validateEmail", "/hrms/validateOtp", "/hrms/validateUserName", "/hrms/validatePassOtp", "/hrms/getSavedInfoData","/hrms/save/onboardingData","/hrms/delete/employeeData"];

exports.WATCH_PATH = ['./views/registration/*.handlebars', './public/js/registration/*.js'];