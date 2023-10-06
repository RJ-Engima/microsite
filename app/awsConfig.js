const AWS = require('aws-sdk');
const constant = require('./configs/constants.js');
const fs = require('fs');

 //AWS S3-Bucket Config
 exports.s3Upload = async(file)=>{
     const s3 = new AWS.S3({
        accessKeyId: constant.AWS_ACCESS_KEY_ID,
        secretAccessKey: constant.AWS_SECRET_ACCESS_KEY,
        Bucket: constant.AWS_BUCKET_NAME,
        region: constant.AWS_REGION
    });

    const params = {
        Bucket: constant.AWS_BUCKET_NAME,
        Body: file.buffer,
        Key: file.userName+"/"+file.originalname
    };
    console.log(file.buffer);
    return await s3.upload(params).promise()
 }