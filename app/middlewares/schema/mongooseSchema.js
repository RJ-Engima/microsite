const mongoose = require("mongoose");
const constant = require("../../configs/constants");
const bluebird = require("bluebird");
const log = require('../../configs/log');
mongoose.Promise = bluebird;

let env = process.env.ENV
if(env==="DEV"){
  mongoose.connect("mongodb://" +constant.MONGOURL + ":" +constant.MONGOPORT +"/" +constant.MONGODB,
    { useNewUrlParser: true }
    ,(err,success)=>{
      if(err){
        log.error('Database connection unsuccessfull')
        log.error(err)
      }
      if(success){
        log.warn("Database connection Successfull")
      }
  });
}
if(env==="UAT"){
  mongoose.connect(constant.MONGOURL, {
    replicaSet : "mongo-uat-cluster",
    useNewUrlParser: true,
    loggerLevel: 'info',
    authSource: "admin",
    useUnifiedTopology:true
  },(err,success)=>{
  if(err){
    log.error('Database connection unsuccessfull')
    log.error(err)
  }
  if(success){
    log.warn("Database connection Successfull")
  }
  });
}

mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

const commonProperty = {
  status: Number,
  authLevel: Number,
  userLevel: Number,
  roleLevel: Number,
  hrBranch: Object,
  portalLink: String,
  name: Object,
  declined: {
    type: Number,
    default: 0,
  },
  reason: String,
  statusDesc: String,
  changed: {
    type: Date,
    default: Date.now,
  },
  created: {
    type: Date,
    default: Date.now,
  },
};
const designationInfoSchema = new mongoose.Schema(
  {
    department:String,
    designation: String,
    createdBy: String,
    changedBy: String,
  },
  { timestamps: true }
);

exports.designationData = mongoose.model(
  "designationInfo",
  designationInfoSchema
);
const departmentInfoSchema = new mongoose.Schema(
  {
    department: String,
    createdBy: String,
    changedBy: String,
  },
  { timestamps: true }
);

exports.departmentData = mongoose.model("departmentInfo", departmentInfoSchema);
const locationInfoSchema = new mongoose.Schema(
  {
    location: String,
    createdBy: String,
    changedBy: String,
  },
  { timestamps: true }
);

exports.locationData = mongoose.model("locationInfo", locationInfoSchema);
const saveAdminInfoSchema = new mongoose.Schema({
  saveAdminInfoData: {
    fullName: {type:String},
    phoneNumber:{
      index:true,
      type:String,
      unique:true
    },
    eMail: {
      index:true,
      type:String,
      unique:true
    },
    department: {type:String},
    designation: {type:String},
    doj: {type:String},
    location: {type:String},
    status:{
     type: String,
     default:'Pending'
    }
   },
});
saveAdminInfoSchema.index({"saveAdminInfoData.phoneNumber":1},{"saveAdminInfoData.eMail":1})
saveAdminInfoSchema.add(commonProperty);
exports.saveAdminInfoData = mongoose.model(
  "saveAdminInfo",
  saveAdminInfoSchema
);

const onboardingSchema = new mongoose.Schema(
  {
    employeeDetails: {
      basicDetails: {
        BankDetails: String,
        Bank_Details: {
          AccountNumber: String,
          BankAccountName: String,
          BankBranch: String,
          BankName: String,
          IFSCcode: String,
        },
        Communication_Address: {
          AreaLocality: String,
          Block_Flat: String,
          City: String,
          Country: String,
          Pincode: Number,
          Premesis_Building: String,
          State: String,
          TalukDistrict: String,
        },
        Permanant_Address: {
          AreaLocality: String,
          Block_Flat: String,
          City: String,
          Country: String,
          Pincode: String,
          Premesis_Building: String,
          State: String,
          TalukDistrict: String,
        },
        Personal_Details: {
          AlterContact: String,
          AnniversaryDate: String,
          Contact: String,
          Dob: String,
          FirstName: String,
          Gender: String,
          LastName: String,
          LinkedProfile: String,
          MaritalStatus: String,
          Nationality: String,
          PersonalmailID: String,
        },
      },
      documents: {
        AadharNo: String,
        AadharBackside: Buffer,
        AadharFrontside: Buffer,
        CasualPic1: Buffer,
        CasualPic2: Buffer,
        PanNo: String,
        Panpic: Buffer,
        AddressProofID: {
          Backside: Buffer,
          Frontside: Buffer,
          IDProof: String,
          Number: String,
        },
        Passport: {
          PassportNo: String,
          PassportExpDate: String,
          PassportDoc: Buffer,
        },
        AddressProof: String,
      },
      eduWorkExp: {
        Education: [
          {
            Education: String,
            EduCertificate: Buffer,
            FieldofStudy: String,
            YearofCompletion: String,
          },
        ],
        Certification: {
          Certificate: Buffer,
          Education: String,
          FieldofStudy: String,
          YearofCompletion: String,
        },
        Experience: String,
        WorkStatus: {
          Status: String,
          EmployeeName: String,
          Position: String,
          DateofJoin: String,
        },
        Work_Status: [
          {
            Status: String,
            EmployeeName: String,
            DateofJoin: String,
            DateofRelieve: String,
            Position: String,
            Relieving_letter: Buffer,
            TotalExperience: String,
            UAN_number: String,
          },
          {
            EmployeeName: String,
            DateofJoin: String,
            DateofRelieve: String,
            Position: String,
            TotalExperience: String,
          },
        ],
      },
      medicalInsurDetails: {
        EmrgncyCntDtls: {
          ContactNo_1: Number,
          ContactNo_2: Number,
          ContactPers_1: String,
          ContactPers_2: String,
          Relationship_1: String,
          Relationship_2: String,
        },
        InsuranceDetails: [
          {
            DoB: String,
            Name: String,
            Relationship: String,
          },
        ],

        MedicalStatus: {
          BloodGrp: String,
          Certificate: Buffer,
          Date_dose1: String,
          Date_dose2: String,
          Reason: String,
          VaccinationStatus: String,
        },
      },
      pastTime: {
        Hobbies: String,
        Mantra: String,
        TopBucket: String,
        favBooks: String,
        favFood: String,
        favMovie: String,
        favSportsTeam: String,
        favTravel: String,
      },
      preference: {
        Accessories: Array,
        Bag: String,
        Books: Array,
        Bottle: String,
        JoiningDate: String,
        Laptop: String,
        MailID: String,
        NoteBook: String,
        Tshirt: String,
      },
    },
    employeeName: {
      type: String,
    },
    phoneNumber: {
      type: String,
      unique: true,
    },
    files:Object
  },
  { timestamps: true },
);

exports.onboardInfo = mongoose.model("onboardingInfo", onboardingSchema);
const saveOtpInfoSchema = new mongoose.Schema(
  {
    mobileNo: String,
    otp: { type: String },
    status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
exports.otpInfo = mongoose.model("otpInfo", saveOtpInfoSchema);
