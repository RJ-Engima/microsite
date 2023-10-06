$(document).ready(function () {
  $("input[type=text]").attr("autocomplete", "off");

  var allowClone = true;
  var expcounter = 0;
  var medcounter = 0;
  var enc_token = $('meta[name="csrf-token"]').attr("content");
  var token = sessionStorage.getItem("hrmsToken");
  let date = new Date();
  date.setDate(date.getDate() + 1);
  $(".datepicker")
    .datepicker({
      format: "dd/mm/yyyy",
      autoclose: true,
      startDate: date,
    })
    .on("change", function () {
      $(this).datepicker("hide");
    });
  $(".limitchar").keypress(function (e) {
    if (
      e.which > 31 &&
      e.which != 32 &&
      (e.which < 65 || e.which > 90) &&
      (e.which < 97 || e.which > 122)
    ) {
      return false;
    }
  });

  $.ajax({
    url: "/hrms/list/department",
    headers: { "csrf-token": enc_token, authorization: `bearer ${token}` },
    type: "POST",
    success: function (data) {
      data.map((i) => {
        $("#edit_department").append(`<option value="${i}">${i}</option>`);
      });
      $("#edit_department").selectpicker("refresh");
    },
  });
  $.ajax({
    url: "/hrms/list/location",
    headers: { "csrf-token": enc_token, authorization: `bearer ${token}` },
    type: "POST",
    success: function (data) {
      data.map((i) => {
        $("#edit_location").append(`<option value="${i}">${i}</option>`);
      });
      $("#edit_location").selectpicker("refresh");
    },
  });
  $("#logoutAdm").click(function () {
    sessionStorage.clear();
    window.location.href = "/logout";
  });
  let userDetails = sessionStorage.getItem("userDetails");
  let result = JSON.parse(userDetails);
  let hrName = result.result.firstName;
  $("body").addClass("bgblue");

  callGetTableMethod();
  function callGetTableMethod() {
    $.ajax({
      url: "/hrms/getSavedInfoData",
      type: "GET",
      headers: { "csrf-token": enc_token, authorization: `bearer ${token}` },
      success: function (json) {
        let columns = [
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
        ]
        function formatDateWithTime(date) {
          return moment(date).format("YYYY-MM-DD HH:mm:ss");
        }
        let arr = [];
        json.forEach(function (element) {
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
        // return arr;
        let tableHeaders = "";
        $.each(columns, function (i, val) {
          tableHeaders += "<th>" + val + "</th>";
        });
        $("#adminSaveDetailsTable").empty();
        $("#adminSaveDetailsTable").append(
          '<table class="table" id="adminSavedInfo"><thead><tr>' +
            tableHeaders +
            "</tr></thead></table>"
        );
        $("#adminSavedInfo").DataTable({
          bPaginate: true,
          data: arr,
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
          rowCallback: function(row, data, index){
          if(data[9]==="Pending"){
            $(row).find('td:eq(9)').css('color', 'red');
          }
          if(data[9]==="Completed"){
            $(row).find('td:eq(9)').css('color', '#4caf50 ');
            $(row).find('td:eq(10) #edit').attr('disabled',true)
            $(row).find('td:eq(10) #edit').css('opacity','0.5')
          }
        }
        });
      },
      error: function (XMLHttpRequest) {
        notify(XMLHttpRequest.responseText, "danger");
      },
    });
  }

  let array = [];
  $(document).on("click", "#delete", function () {
    if (array !== []) {
      array = [];
    }
    $("#confirmdelete").modal("show");
    var removedata = $(this)
      .parents("tr")
      .addClass("remove_row")
      .siblings()
      .removeClass("remove_row");
    $(this)
      .parents(".remove_row")
      .find("td")
      .each(function () {
        let val = $(this).text();
        array.push(val);
      });
  });
  //click no button in delete modal
  $("#confirm_no").click(function () {
    $("#confirmdelete").modal("hide");
    $("#adminSavedInfo tr").removeClass("remove_row");
  });
  //delete confirm
  $("#confirm_yes").on("click", function (e) {
    let name = array[2];
    let phnumber = array[6];
    e.preventDefault();
    $.ajax({
      url: "/hrms/delete/employeeData",
      type: "POST",
      headers: { "csrf-token": enc_token, authorization: `bearer ${token}` },
      data: {
        hrName: hrName,
        fullName: name,
        phoneNumber: phnumber,
      },
      beforeSend: function () {},
      success: function (returndata) {
        notify(returndata, "primary custom_success");
        $("#confirmdelete").hide();
        setTimeout(location.reload(), 1000);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        notify(XMLHttpRequest.responseText, "danger custom_success");
      },
    });
  });
  //click edit button
  var editarr = [];
  $(document).on("click", "#edit", function () {
    $("#edit_designation").empty();
    $("#edit_designation").selectpicker("destroy");
    $("#edit_designation").selectpicker();
    $("#editViewDtl").show();
    $("#editViewDtl #edit_name").focus();
    if (editarr !== []) {
      editarr = [];
    }
    $(this).parents("tr").addClass("edit_tr").siblings().removeClass("edit_tr");
    $(this)
      .parents(".edit_tr")
      .find("td")
      .each(function () {
        let edit = $(this).text();
        editarr.push(edit);
      });
    $.ajax({
      url: "/hrms/list/designation",
      headers: { "csrf-token": enc_token, authorization: `bearer ${token}` },
      type: "POST",
      data: {
        department: editarr[7],
      },
      success: function (data) {
        data.map((i) => {
          $("#edit_designation").append(`<option value="${i}">${i}</option>`);
        });
        $("#edit_designation").selectpicker("refresh");
        $("#edit_designation").selectpicker("val", editarr[8]);
      },
    });
    $("#edit_name").val(editarr[2]);
    $("#edit_email").val(editarr[3]);
    $("#edit_doj").val(editarr[4]);
    $("#edit_location").selectpicker("val", editarr[5]);
    $("#edit_phno").val(editarr[6]);
    $("#edit_department").selectpicker("val", editarr[7]);
  });
  $("#edit_close").on("click", function () {
    $("#editViewDtl").hide();
  });
  let re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  $("#edit_email").on("change", () => {
    let email = $("#edit_email").val();
    if (!re.test(email)) {
      $("#edit_email").focus();
      $("#edit_email").css("border", "1px solid red");
    } else {
      $("#edit_email").css("border", "0.5px solid rgba(20, 27, 86, 0.2)");
    }
  });
  $("#edit_phno").keypress(function (evt) {
    // Only ASCII character in that range allowed
    var ASCIICode = evt.which ? evt.which : evt.keyCode;
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) return false;
    return true;
  });
  //   $('.limitchar').unbind('keyup change input paste').bind('keyup change input paste',function(e){
  //     var $this = $(this);
  //     var val = $this.val();
  //     var valLength = val.length;
  //     var maxCount = $this.attr('maxlength');
  //     if(valLength>maxCount){
  //         $this.val($this.val().substring(0,maxCount));
  //     }
  // });
  $("#edit_submit").on("click", function () {
    var edituserdata = {
      fullname: $("#edit_name").val(),
      email: $("#edit_email").val(),
      doj: $("#edit_doj").val(),
      location: $("#edit_location").val(),
      phoneNumber: $("#edit_phno").val(),
      department: $("#edit_department").val(),
      designation: $("#edit_designation").val(),
    };
    //Fullname Validation
    if (edituserdata.fullname == "") {
      $("#edit_name").focus();
      $("#edit_name").css("border", "1px solid red");
    } else {
      $("#edit_name").css("border", "0.5px solid rgba(20, 27, 86, 0.2)");
    }
    // //Email Validation
    if (edituserdata.email == "") {
      $("#edit_email").focus();
      $("#edit_email").css("border", "1px solid red");
    } else {
      $("#edit_email").css("border", "0.5px solid rgba(20, 27, 86, 0.2)");
    }
    //Date of Joining Validation
    if (edituserdata.doj == "") {
      $("#edit_doj").focus();
      $("#edit_doj").css("border", "1px solid red");
    } else {
      $("#edit_doj").css("border", "0.5px solid rgba(20, 27, 86, 0.2)");
    }
    //Location Validation
    if (edituserdata.location == "") {
      $(".location").focus();
      $(".location").css("border", "1px solid red");
    } else {
      $(".location").css("border", "0.5px solid rgba(20, 27, 86, 0.2)");
    }
    //Phone Number Validation
    if (edituserdata.phoneNumber == "") {
      $("#edit_phno").focus();
      $("#edit_phno").css("border", "1px solid red");
    } else {
      $("#edit_phno").css("border", "0.5px solid rgba(20, 27, 86, 0.2)");
    }

    //Departmant Validation
    if (edituserdata.department == "") {
      $(".department").focus();
      $(".department").css("border", "1px solid red");
    } else {
      $(".department").css("border", "0.5px solid rgba(20, 27, 86, 0.2)");
    }
    //Designation Validation
    if (edituserdata.designation == "") {
      $(".designation").focus();
      $(".designation").css("border", "1px solid red");
    } else {
      $(".designation").css("border", "0.5px solid rgba(20, 27, 86, 0.2)");
    }
    //edit api call function
    if (
      edituserdata.fullname != "" &&
      edituserdata.email != "" &&
      edituserdata.doj != "" &&
      edituserdata.location != "" &&
      edituserdata.phoneNumber != "" &&
      edituserdata.department != "" &&
      edituserdata.designation != ""
    ) {
      $("#confirmedit").show();
    }
  });
  $("#discard_edit").click(function () {
    $("#confirmedit, #editViewDtl").hide();
  });
  $("#confirm_edit").click(function (e) {
    e.preventDefault();
    $.ajax({
      url: "/hrms/update/edituser",
      type: "POST",
      headers: { "csrf-token": enc_token, authorization: `bearer ${token}` },
      data: {
        fullName: editarr[2],
        phoneNumber: editarr[6],
        saveAdminInfoData: {
          fullName: $("#edit_name").val(),
          eMail: $("#edit_email").val(),
          doj: $("#edit_doj").val(),
          location: $("#edit_location").val(),
          phoneNumber: $("#edit_phno").val(),
          department: $("#edit_department").val(),
          designation: $("#edit_designation").val(),
          status: "Pending",
        },
      },
      beforeSend: function () {},
      success: function (returndata) {
        $("#confirmedit, #editViewDtl").hide();
        notify(returndata, "primary custom_success");
        setTimeout(location.reload(), 1000);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        notify(XMLHttpRequest.responseText, "danger custom_success");
      },
    });
  });
  $(".caplet").keypress(function () {
    $(this).val((index, value) => {
      return capitalizeEachWord(value);
    });
  });
  function capitalizeEachWord(str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
  var viewarr = [];
  let view;
  $(document).on("click", "#view", function (e) {
    e.preventDefault();
    if (viewarr !== []) {
      viewarr = [];
    }
    $(".cloneNewExp").show();
    $(this).parents("tr").addClass("edit_tr").siblings().removeClass("edit_tr");
    $(this)
      .parents(".edit_tr")
      .find("td")
      .each(function () {
        let edit = $(this).text();
        viewarr.push(edit);
      });
    $.ajax({
      url: "/hrms/getSavedUserData",
      type: "POST",
      headers: { "csrf-token": enc_token, authorization: `bearer ${token}` },
      data: {
        employeeName: viewarr[2],
        phoneNumber: viewarr[6],
      },
      beforeSend: function () {
      },
      success: function (returndata) {
        view = returndata.data;
        //Personal-Details
        $("#viewFname").text(view.basicDetails.Personal_Details.FirstName);
        $("#viewLname").text(view.basicDetails.Personal_Details.LastName);
        $("#viewDob").text(view.basicDetails.Personal_Details.Dob);
        $("#viewNationality").text(
          view.basicDetails.Personal_Details.Nationality
        );
        $("#viewGender").text(view.basicDetails.Personal_Details.Gender);
        $("#viewMobileNo").text(view.basicDetails.Personal_Details.Contact);
        $("#viewMaritalSts").text(
          view.basicDetails.Personal_Details.MaritalStatus
        );
        $("#viewPersMail").text(
          view.basicDetails.Personal_Details.PersonalmailID
        );
        $("#viewLnkd").text(view.basicDetails.Personal_Details.LinkedProfile);
        if (view.basicDetails.Personal_Details.MaritalStatus === "Married") {
          $(".annv-content").show();
          $("#viewAnnvDate").text(
            view.basicDetails.Personal_Details.AnniversaryDate
          );
        }
        if (view.basicDetails.Personal_Details.AlterContact != "") {
          $("#viewAltMobileNo").text(
            view.basicDetails.Personal_Details.AlterContact
          );
        }
        //Communication-Address
        $("#viewComPin").text(view.basicDetails.Communication_Address.Pincode);
        $("#viewComCountry").text(
          view.basicDetails.Communication_Address.Country
        );
        $("#viewComState").text(view.basicDetails.Communication_Address.State);
        $("#viewComDist").text(
          view.basicDetails.Communication_Address.TalukDistrict
        );
        $("#viewComCity").text(view.basicDetails.Communication_Address.City);
        $("#viewComArea").text(
          view.basicDetails.Communication_Address.AreaLocality
        );
        $("#viewComStr").text(
          view.basicDetails.Communication_Address.Premesis_Building
        );
        $("#viewComDoor").text(
          view.basicDetails.Communication_Address.Block_Flat
        );
        //Permanent-Address
        $("#viewPerPin").text(view.basicDetails.Permanant_Address.Pincode);
        $("#viewPerCountry").text(view.basicDetails.Permanant_Address.Country);
        $("#viewPerState").text(view.basicDetails.Permanant_Address.State);
        $("#viewPerDist").text(
          view.basicDetails.Permanant_Address.TalukDistrict
        );
        $("#viewPerCity").text(view.basicDetails.Permanant_Address.City);
        $("#viewPerArea").text(
          view.basicDetails.Permanant_Address.AreaLocality
        );
        $("#viewPerStr").text(
          view.basicDetails.Permanant_Address.Premesis_Building
        );
        $("#viewPerDoor").text(view.basicDetails.Permanant_Address.Block_Flat);
        //Bank-Details
        if (view.basicDetails.BankDetails === "Create New salary Account") {
          $(".viewBnkChk").show();
          $(".viewBnk").hide();
          $("#viewCrtAcc").text(view.basicDetails.BankDetails);
        } else {
          $(".viewBnkChk").hide();
          $(".viewBnk").show();
          $("#viewBnkperName").text(
            view.basicDetails.Bank_Details.BankAccountName
          );
          $("#viewBnkNum").text(view.basicDetails.Bank_Details.AccountNumber);
          $("#viewBnkBranch").text(view.basicDetails.Bank_Details.BankBranch);
          $("#viewBnkName").text(view.basicDetails.Bank_Details.BankName);
          $("#viewIfscNum").text(view.basicDetails.Bank_Details.IFSCcode);
        }
        //Preference Section
        var viewBooks = view.preference.Books.toString();
        var viewAccess = view.preference.Accessories.toString();
        $("#viewOffMail").text(view.preference.MailID);
        $("#viewDoj").text(view.preference.JoiningDate);
        $("#viewLaptp").text(view.preference.Laptop);
        $("#viewAcces").text(viewAccess);
        $("#viewBag").text(view.preference.Bag);
        $("#viewBottle").text(view.preference.Bottle);
        $("#viewTshirt").text(view.preference.Tshirt);
        $("#viewBooks").text(viewBooks);
        $("#viewScrib").text(view.preference.NoteBook);
        //Documents

        let addressProof = view.documents.AddressProofID.IDProof;
        if (addressProof === "Driving License") {
          $(".driveChk").show();
          $(".aadChk").hide();
          $(".voterChk").hide();
          $("#viewLiceNo").text(view.documents.AddressProofID.Number);
        }
        if (view.documents.AddressProof === "Same as in Aadhar Card") {
          $(".driveChk").hide();
          $(".aadChk").show();
          $(".voterChk").hide();
          $("#addProof").text(view.documents.AddressProof);
        }
        if (addressProof === "Voter ID") {
          $(".driveChk").hide();
          $(".aadChk").hide();
          $(".voterChk").show();
          $("#viewVoterNo").text(view.documents.AddressProofID.Number);
        }
        // $('.viewPass-content').css({"display":"none"})
        if (view.documents.Passport.PassportNo) {
          $(".viewPass-content").show();
          $("#viewPassNum").text(view.documents.Passport.PassportNo);
          $("#viewPassExp").text(view.documents.Passport.PassportExpDate);
        } else {
          $(".viewPass-content").hide();
        }
        $("#viewAadNum").text(view.documents.AadharNo);
        $("#viewPanNum").text(view.documents.PanNo);
        //Education and Work-Experience
        if (view.eduWorkExp.Education[0]) {
          $(".edu").show();
          $(".edu2").hide();
          $(".edu3").hide();
          $("#viewEdu").text(view.eduWorkExp.Education[0].Education);
          $("#viewField").text(view.eduWorkExp.Education[0].FieldofStudy);
          $("#viewYrComp").text(view.eduWorkExp.Education[0].YearofCompletion);
        }
        if (view.eduWorkExp.Education[0] && view.eduWorkExp.Education[1]) {
          $(".edu2").show();
          $(".edu3").hide();
          $("#viewEdu2").text(view.eduWorkExp.Education[1].Education);
          $("#viewField2").text(view.eduWorkExp.Education[1].FieldofStudy);
          $("#viewYrComp2").text(view.eduWorkExp.Education[1].YearofCompletion);
        }
        if (
          view.eduWorkExp.Education[0] &&
          view.eduWorkExp.Education[1] &&
          view.eduWorkExp.Education[2]
        ) {
          $(".edu2").show();
          $(".edu3").show();
          $("#viewEdu3").text(view.eduWorkExp.Education[2].Education);
          $("#viewField3").text(view.eduWorkExp.Education[2].FieldofStudy);
          $("#viewYrComp3").text(view.eduWorkExp.Education[2].YearofCompletion);
        }
        // $('.viewCertif-content').css({"display":"none"})
        if (view.eduWorkExp.Certification.Education) {
          $(".viewCertif-content").show();
          $("#viewCertEdu").text(view.eduWorkExp.Certification.Education);
          $("#viewCertField").text(view.eduWorkExp.Certification.FieldofStudy);
          $("#viewCertYr").text(view.eduWorkExp.Certification.YearofCompletion);
        } else {
          $(".viewCertif-content").hide();
        }
        if (view.eduWorkExp.Experience === "Fresher") {
          $(".expRelieved").hide();
          $(".expWorking").hide();
          $("viewWrkExp").show();
          $("#viewWrkExp").text(view.eduWorkExp.Experience);
        } else {
          if (Object.keys(view.eduWorkExp.WorkStatus).length < 0) {
            $(".expWorking").hide();
          } else {
            $(".expWorking").show();
            $(".expRelieved").hide();
            $(".wrkExpSts").hide();
            $("#viewWrkSts").text(view.eduWorkExp.WorkStatus.Status);
            $("#viewWrkEmpName").text(view.eduWorkExp.WorkStatus.EmployeeName);
            $("#viewWrkPost").text(view.eduWorkExp.WorkStatus.Position);
            $("#viewWrkDoj").text(view.eduWorkExp.WorkStatus.DateofJoin);
          }
        }
        if (view.eduWorkExp.Work_Status.length === 0) {
          $(".expRelieved").hide();
        } else {
          $(".expRelieved").show();
          $(".expWorking").hide();
          $(".wrkExpSts").hide();
          $("#viewRelSts").text(view.eduWorkExp.Work_Status[0].Status);
          $("#viewRelEmpName").text(
            view.eduWorkExp.Work_Status[0].EmployeeName
          );
          $("#viewRelPost").text(view.eduWorkExp.Work_Status[0].Position);
          $("#viewRelExp").text(view.eduWorkExp.Work_Status[0].TotalExperience);
          $("#viewRelDoj").text(view.eduWorkExp.Work_Status[0].DateofJoin);
          $("#viewRelDoR").text(view.eduWorkExp.Work_Status[0].DateofRelieve);
          if (view.eduWorkExp.Work_Status[0].UAN_number !== "") {
            $(".uanNum").show();
            $("#viewRelUan").text(view.eduWorkExp.Work_Status[0].UAN_number);
          } else {
            $(".uanNum").hide();
          }
          for (i = 1; i < view.eduWorkExp.Work_Status.length; i++) {
            addExp();
            if (view.eduWorkExp.WorkStatus[i] != []) {
              $("#viewRelEmpName" + [i]).text(
                view.eduWorkExp.Work_Status[i].EmployeeName
              );
              $("#viewRelPost" + [i]).text(
                view.eduWorkExp.Work_Status[i].Position
              );
              $("#viewRelExp" + [i]).text(
                view.eduWorkExp.Work_Status[i].TotalExperience
              );
              $("#viewRelDoj" + [i]).text(
                view.eduWorkExp.Work_Status[i].DateofJoin
              );
              $("#viewRelDoR" + [i]).text(
                view.eduWorkExp.Work_Status[i].DateofRelieve
              );
            }
            function addExp() {
              if (allowClone) {
                expcounter++;
                let packing = $(".viewNewExp");
                let clone = packing.clone();
                clone.appendTo(".cloneNewExp");
                clone.attr("class", "viewNewExp" + expcounter);
                clone.find("h4").text("Experence-" + (expcounter + 1));
                clone
                  .find("#viewRelEmpName")
                  .attr("id", "viewRelEmpName" + expcounter);
                clone
                  .find("#viewRelPost")
                  .attr("id", "viewRelPost" + expcounter);
                clone.find("#viewRelExp").attr("id", "viewRelExp" + expcounter);
                clone.find("#viewRelDoj").attr("id", "viewRelDoj" + expcounter);
                clone.find("#viewRelDoR").attr("id", "viewRelDoR" + expcounter);
                clone.show();
              }
            }
          }
        }
        //Medical-Insurance
        for (i = 1; i < view.medicalInsurDetails.InsuranceDetails.length; i++) {
          addMed();
          if (view.medicalInsurDetails.InsuranceDetails[i]) {
            $("#viewInsurName" + [i]).text(
              view.medicalInsurDetails.InsuranceDetails[i].Name
            );
            $("#viewInsurRel" + [i]).text(
              view.medicalInsurDetails.InsuranceDetails[i].Relationship
            );
            $("#viewInsurDob" + [i]).text(
              view.medicalInsurDetails.InsuranceDetails[i].DoB
            );
          }
        }
        function addMed() {
          if (allowClone) {
            medcounter++;
            let packing = $(".viewMedInsur");
            let clone = packing.clone();
            clone.appendTo(".cloneNewInsur");
            clone.attr("class", "viewMedInsur" + expcounter);
            clone
              .find("#viewInsurName")
              .attr("id", "viewInsurName" + medcounter);
            clone.find("#viewInsurRel").attr("id", "viewInsurRel" + medcounter);
            clone.find("#viewInsurDob").attr("id", "viewInsurDob" + medcounter);
            clone.find("h4").text("Nominee-" + (medcounter + 1));
            clone.show();
            return;
          }
        }
        $("#viewInsurName").text(
          view.medicalInsurDetails.InsuranceDetails[0].Name
        );
        $("#viewInsurRel").text(
          view.medicalInsurDetails.InsuranceDetails[0].Relationship
        );
        $("#viewInsurDob").text(
          view.medicalInsurDetails.InsuranceDetails[0].DoB
        );
        $("#viewBg").text(view.medicalInsurDetails.MedicalStatus.BloodGrp);
        $("#viewVaccSts").text(
          view.medicalInsurDetails.MedicalStatus.VaccinationStatus
        );
        let vaccSts = view.medicalInsurDetails.MedicalStatus.VaccinationStatus;
        if (vaccSts === "One Dose") {
          $(".vaccDose1").show();
          $(".vaccDose2").hide();
          $(".vaccCerti").show();
          $(".vaccReason").show();
          $("#viewDose1Date").text(
            view.medicalInsurDetails.MedicalStatus.Date_dose1
          );
          $("#viewVaccRes").text(view.medicalInsurDetails.MedicalStatus.Reason);
        }
        if (vaccSts === "Two Doses") {
          $(".vaccDose1").show();
          $(".vaccDose2").show();
          $(".vaccCerti").show();
          $(".vaccReason").hide();
          $("#viewDose1Date").text(
            view.medicalInsurDetails.MedicalStatus.Date_dose1
          );
          $("#viewDose2Date").text(
            view.medicalInsurDetails.MedicalStatus.Date_dose2
          );
        }
        if (vaccSts === "Not Yet Vaccinated") {
          $(".vaccDose1").hide();
          $(".vaccDose2").hide();
          $(".vaccCerti").hide();
          $(".vaccReason").show();
          $("#viewVaccRes").text(view.medicalInsurDetails.MedicalStatus.Reason);
        }
        $("#viewEmrName1").text(
          view.medicalInsurDetails.EmrgncyCntDtls.ContactPers_1
        );
        $("#viewEmrName2").text(
          view.medicalInsurDetails.EmrgncyCntDtls.ContactPers_2
        );
        $("#viewEmrRel1").text(
          view.medicalInsurDetails.EmrgncyCntDtls.Relationship_1
        );
        $("#viewEmrRel2").text(
          view.medicalInsurDetails.EmrgncyCntDtls.Relationship_2
        );
        $("#viewEmrCnt1").text(
          view.medicalInsurDetails.EmrgncyCntDtls.ContactNo_1
        );
        $("#viewEmrCnt2").text(
          view.medicalInsurDetails.EmrgncyCntDtls.ContactNo_2
        );
        //Past-Time
        $("#viewHobbies").text(view.pastTime.Hobbies);
        $("#viewFavBook").text(view.pastTime.favTravel);
        $("#viewFavMovie").text(view.pastTime.favMovie);
        $("#viewFavTravel").text(view.pastTime.Hobbies);
        $("#viewfavFood").text(view.pastTime.favFood);
        $("#viewFavSports").text(view.pastTime.favSportsTeam);
        $("#viewMantra").text(view.pastTime.Mantra);
        $("#viewBuckList").text(view.pastTime.TopBucket);
        $("#fetchModal").modal("show");
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        $("#fetchModal").modal("hide");
        // notify(XMLHttpRequest.responseText, "danger custom_success");
      },
    });
    $.ajax({
      url: "/hrms/getFiles",
      type: "POST",
      headers: { "csrf-token": enc_token, authorization: `bearer ${token}` },
      data: {
        employeeName: viewarr[2],
        phoneNumber: viewarr[6],
      },
      beforeSend: function () {},
      success: function (data) {
        //Documents
        let fileData = data;
        // console.log(fileData);
        let casulPic1 = $("#viewCasPic .preview_img_modal").attr("name");
        let aadhFrnt = $("#viewAadFrnt .preview_img_modal").attr("name");
        let aadhBck = $("#viewAadBck .preview_img_modal").attr("name");
        let panPic = $("#viewPanPic .preview_img_modal").attr("name");
        $("#viewCasPic .preview_img_modal").attr(
          "src",
          fileData[casulPic1].base64File
        );
        $("#viewAadFrnt .preview_img_modal").attr(
          "src",
          fileData[aadhFrnt].base64File
        );
        $("#viewAadBck .preview_img_modal").attr(
          "src",
          fileData[aadhBck].base64File
        );
        $("#viewPanPic .preview_img_modal").attr(
          "src",
          fileData[panPic].base64File
        );

        if (view.documents.CasualPic2) {
          $(".casPic2").show();
          let casualPic2 = $("#viewCasPic2 .preview_img_modal").attr("name");
          $("#viewCasPic2 .preview_img_modal").attr(
            "src",
            fileData[casualPic2].base64File
          );
        } else {
          $(".casPic2").hide();
        }
        let addressProof = view.documents.AddressProofID.IDProof;
        if (addressProof === "Driving License") {
          let liceFrnt = $("#viewLiceFrnt .preview_img_modal").attr("name");
          let liceBck = $("#viewLiceBck .preview_img_modal").attr("name");
          $("#viewLiceFrnt .preview_img_modal").attr(
            "src",
            fileData[liceFrnt].base64File
          );
          $("#viewLiceBck .preview_img_modal").attr(
            "src",
            fileData[liceBck].base64File
          );
        }
        if (addressProof === "Voter ID") {
          let voterFrnt = $("#viewVoterFrnt .preview_img_modal").attr("name");
          let voterBack = $("#viewVoterBck .preview_img_modal").attr("name");
          $("#viewVoterFrnt .preview_img_modal").attr(
            "src",
            fileData[voterFrnt].base64File
          );
          $("#viewVoterBck .preview_img_modal").attr(
            "src",
            fileData[voterBack].base64File
          );
        }
        if (view.documents.Passport.PassportNo) {
          let passFrnt = $("#viewPassFrnt .preview_img_modal").attr("name");
          $("#viewPassFrnt .preview_img_modal").attr(
            "src",
            fileData[passFrnt].base64File
          );
        } else {
          $(".viewPass-content").hide();
        }
        //Education and Work-Experience
        if (view.eduWorkExp.Education[0]) {
          let eduCert1 = $("#viewEduCert .preview_img_modal").attr("name");
          $("#viewEduCert .preview_img_modal").attr(
            "src",
            fileData[eduCert1].base64File
          );
        }
        if (view.eduWorkExp.Education[0] && view.eduWorkExp.Education[1]) {
          let eduCert2 = $("#viewEduCert2 .preview_img_modal").attr("name");
          $("#viewEduCert2 .preview_img_modal").attr(
            "src",
            fileData[eduCert2].base64File
          );
        }
        if (
          view.eduWorkExp.Education[0] &&
          view.eduWorkExp.Education[1] &&
          view.eduWorkExp.Education[2]
        ) {
          let eduCert3 = $("#viewEduCert3 .preview_img_modal").attr("name");
          $("#viewEduCert3 .preview_img_modal").attr(
            "src",
            fileData[eduCert3].base64File
          );
        }
        // $('.viewCertif-content').css({"display":"none"})
        if (view.eduWorkExp.Certification.Education) {
          let certFi = $("#viewCertUp .preview_img_modal").attr("name");
          $("#viewCertUp .preview_img_modal").attr(
            "src",
            fileData[certFi].base64File
          );
        } else {
          $(".viewCertif-content").hide();
        }
        if (view.eduWorkExp.Experience !== "Fresher") {
          console.log(
            view.eduWorkExp.Work_Status[0].Relieving_letter.data.length
          );
          if (
            view.eduWorkExp.Work_Status[0].Relieving_letter.data.length === 0
          ) {
            $(".viewRelDoc").hide();
          } else {
            let relievDoc = $("#viewRelDoc .preview_img_modal").attr("name");
            $("#viewRelDoc .preview_img_modal").attr(
              "src",
              fileData[relievDoc].base64File
            );
          }
        }
        //Medical-Insurance
        let vaccSts = view.medicalInsurDetails.MedicalStatus.VaccinationStatus;
        if (vaccSts !== "Not Yet Vaccinated") {
          let vaccCerti = $("#viewVaccCert .preview_img_modal").attr("name");
          $("#viewVaccCert .preview_img_modal").attr(
            "src",
            fileData[vaccCerti].base64File
          );
        }
        $(function () {
          $.each($(".preview_img_modal"), function () {
            var imgsrc = $(this).attr("src");
            if (imgsrc.includes("application/pdf") === true) {
              $(this).addClass("hide");
              $(this).parent().find(".pdf").removeClass("hide");
            }
          });
        });
        setTimeout(() => {
          $("#fetchModal").modal("hide");
          $("#viewModal").modal("show");
        }, 500);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        $("#fetchModal").modal("hide");
        $("#viewModal").modal("hide");
        notify(XMLHttpRequest.responseText, "danger custom_success");
      },
    });
  });
  $(".modalClose").click(() => {
    allowClone = false;
    $("#viewModal").modal("hide");
  });
  $("#viewModal").modal("hide");
  $(".download").click(function () {
    let img = $(this).siblings(".preview_img_modal").attr("src");
    let fileName = $(this).siblings(".preview_img_modal").attr("name");
    saveAs(img, fileName);
  });
});
