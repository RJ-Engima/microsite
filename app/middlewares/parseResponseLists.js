const constant = require("../configs/constants");
const moment = require("moment");
const log = require("../configs/log");
const messageConstant = require("../configs/message");
const crypto = require("crypto");
var fs = require("fs");
const moment_business = require("moment-business-days");

function formatDateWithTime(date) {
  return moment(date).format("YYYY-MM-DD HH:mm:ss");
}

exports.generateDataSetForSavedInfo = function (req) {
  let columns;
  if (req==="/viewDetail") {
    columns = [
      ["Date Created"],
      ["Creator"],
      ["Candidate Name"],
      ["Email"],
      ["DOJ"],
      ["Location"],
      ["Mobile Number"],
      ["Department"],
      ["Designation"],
      ["Status"],
      ["Action"],
    ];
  }
  return {
    bPaginate: true,
    columns: columns,
    data: [],
    order: [[0, "desc"]],
    columnDefs: [
      {
        targets: -1,
        data: null,
        defaultContent:
          '<button id="view" class="action-button-previous previous-modal" data-toggle="modal" value="Preview"><img src="/assets/portalAsset/images/view.svg" /><button id="edit"><img src="/assets/portalAsset/images/edit.png" /></button><button id="delete"><img src="/assets/portalAsset/images/delete.svg" /></button>',
      },
    ],
    language: { search: "", searchPlaceholder: "Search..." },
    autoFill: false,
    // scrollX: '100%'
  };
};
exports.designationInfo = function (req) {
  let columns;

  if ( req ==="/addDesignation") {
    columns = [
      ["Date Created"],
      ["Department"],
      ["Designation"],
      ["Creator"],
      ["ChangedBy"],
      ["Action"],
    ];
  }
  return {
    bPaginate: true,
    columns: columns,
    data: [],
    order: [[0, "desc"]],
    columnDefs: [
      {
        targets: -1,
        data: null,
        defaultContent:
          '<button id="edit"><img src="/assets/portalAsset/images/edit.png" /></button><button id="delete"><img src="/assets/portalAsset/images/delete.svg" /></button>',
      },
    ],
    language: { search: "", searchPlaceholder: "Search..." },
    autoFill: false,
    // scrollX: '100%'
  };
};
exports.departmentInfo = function (req) {
  let columns;

  if ( req === "/addDepartment") {
    columns = [
      ["Date Created"],
      ["Department"],
      ["Creator"],
      ["ChangedBy"],
      ["Action"],
    ];
  }
  return {
    bPaginate: true,
    columns: columns,
    data: [],
    order: [[0, "desc"]],
    columnDefs: [
      {
        targets: -1,
        data: null,
        defaultContent:
          '<button id="edit"><img src="/assets/portalAsset/images/edit.png" /></button><button id="delete"><img src="/assets/portalAsset/images/delete.svg" /></button>',
      },
    ],
    language: { search: "", searchPlaceholder: "Search..." },
    autoFill: false,
    // scrollX: '100%'
  };
};
exports.locationInfo = function (req) {
  let columns;

  if (req === "/addLocation") {
    columns = [
      ["Date Created"],
      ["Location"],
      ["Creator"],
      ["ChangedBy"],
      ["Action"],
    ];
  }
  return {
    bPaginate: true,
    columns: columns,
    data: [],
    order: [[0, "desc"]],
    columnDefs: [
      {
        targets: -1,
        data: null,
        defaultContent:
          '<button id="edit"><img src="/assets/portalAsset/images/edit.png" /></button><button id="delete"><img src="/assets/portalAsset/images/delete.svg" /></button>',
      },
    ],
    language: { search: "", searchPlaceholder: "Search..." },
    autoFill: false,
    // scrollX: '100%'
  };
};

exports.normalizeSafeInfoData = function (data, req) {
  let arr = [];
  data.forEach(function (element) {
    let dataJson = [];
    dataJson.push(formatDateWithTime(element.created));
    dataJson.push(element.name.hrName);
    dataJson.push(element.saveAdminInfoData.fullName);
    dataJson.push(element.saveAdminInfoData.eMail);
    dataJson.push(element.saveAdminInfoData.doj);
    dataJson.push(element.saveAdminInfoData.location);
    dataJson.push(element.saveAdminInfoData.phoneNumber);
    dataJson.push(element.saveAdminInfoData.department);
    dataJson.push(element.saveAdminInfoData.designation);
    dataJson.push(element.saveAdminInfoData.status);
    arr.push(dataJson);
  });
  return arr;
};
exports.normalizeDesignationData = function (data, req) {
  let arr = [];
  data.forEach(function (element) {
    let dataJson = [];
    dataJson.push(formatDateWithTime(element.createdAt));
    dataJson.push(element.department);
    dataJson.push(element.designation);
    dataJson.push(element.createdBy);
    dataJson.push(element.changedBy);
    arr.push(dataJson);
  });
  return arr;
};
exports.normalizeDepartmentData = function (data, req) {
  let arr = [];
  data.forEach(function (element) {
    let dataJson = [];
    dataJson.push(formatDateWithTime(element.createdAt));
    dataJson.push(element.department);
    dataJson.push(element.createdBy);
    dataJson.push(element.changedBy);
    arr.push(dataJson);
  });
  return arr;
};
exports.normalizeLocationData = function (data, req) {
  let arr = [];
  data.forEach(function (element) {
    let dataJson = [];
    dataJson.push(formatDateWithTime(element.createdAt));
    dataJson.push(element.location);
    dataJson.push(element.createdBy);
    dataJson.push(element.changedBy);
    arr.push(dataJson);
  });
  return arr;
};
