$(document).ready(function () {
  $('input[type=text]').attr('autocomplete', 'off');
  $('input[type=url]').attr('autocomplete', 'off');
  $('input[type=number]').attr('autocomplete', 'off');
  $('input[type=number]').attr('autocomplete', 'off');
  $('input[type=email]').attr('autocomplete', 'off');
  $('input[type=url]').attr('autocomplete', 'off');
  $('textarea').attr('autocomplete', 'off');

  var enc_token = $('meta[name="csrf-token"]').attr("content");
  var token = sessionStorage.getItem("token");
  $("#logOutHm").click(function () {
    window.location.href = "/logout";
    sessionStorage.clear();
  });
  var current_fs, next_fs, opacity, previous_fs; //fieldsets
  var eduCnt, expCnt; //counters
  var allowClone = true;
  var preExpcounter = 0
  var preMedcounter = 0
  $(".annv").css("display", "none");
  let userDetails = sessionStorage.getItem("resultValue");
  let phoneNumber = JSON.parse(userDetails).phoneNumber;
  let resultfullName = JSON.parse(userDetails).fullName;
  $("#contact").val(phoneNumber);
  $("#frontHomeHeader").text(resultfullName);
  $("#userId").text(resultfullName);
  //work experience
  $("#relstartdate,#relenddate").change(function () {
    let start = $("#relstartdate").val();
    let myEnd = $("#relenddate").val();
    if (start != "" && myEnd != "") {
      let startDate = moment(start, "MM.YYYY");
      let endDate = moment(myEnd, "MM.YYYY");
      let result = moment.preciseDiff(startDate, endDate);
      $("#calculate-date").text(result);
    }
  });
  //New Experience Calc
  $(".addingexperience").click(function () {
    $(".expCal").each(function () {
      $(this).change(function () {
        for (expCnt = 2; expCnt <= expcounter; expCnt++) {
          let exp_StrDt = $("#addExp" + expCnt)
            .find("#relstartdate" + expCnt)
            .val();
          let exp_EndDt = $("#addExp" + expCnt)
            .find("#relenddate" + expCnt)
            .val();
          var result1;
          if (exp_StrDt[expCnt] != "" && exp_EndDt[expCnt] != "") {
            let startDate = moment(exp_StrDt, "MM.YYYY");
            let endDate = moment(exp_EndDt, "MM.YYYY");
            result1 = moment.preciseDiff(startDate, endDate);
            $("#calculate-date" + expCnt).text(result1);
          } else {
            return;
          }
        }
      });
    });
    return false;
  });
  //Next Fieldset change
  function nextPage() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    next_fs.show();
    current_fs.animate(
      { opacity: 0 },
      {
        step: function (now) {
          opacity = 1 - now;
          current_fs.css({
            display: "none",
            position: "relative",
          });
          next_fs.css({ opacity: opacity });
        },
        duration: 600,
      }
    );
  }
  // Next PAcman
  function nextPacman() {
    var $parent = $("#progressbar li")
      .eq($("fieldset").index(current_fs))
      .next("li");
    $("#progressbar li.active")
      .removeClass("active")
      .find(".test")
      .removeClass("f1");
    $parent
      .addClass("active change-bg")
      .find(".test")
      .addClass("f1 yellowdot")
      .removeClass("animatedmode");
  }
  //preview upload append in img tag
  $(".file-input").change(function () {
    var img_val = URL.createObjectURL(event.target.files[0]);
    var upload_input_value = $(".file-input").val();
    var fileExtension = ["jpeg", "jpg", "png", "gif", "bmp"];
    if (upload_input_value == null) {
      $(this)
        .parent(".file-drop-area")
        .find(".upload_img")
        .attr("src", "./assets/portalAsset/images/casualPic.png");
    } else if (
      $.inArray($(this).val().split(".").pop().toLowerCase(), fileExtension) ==
      -1
    ) {
      $(this)
        .parent(".file-drop-area")
        .find(".upload_img")
        .attr("src", "./assets/portalAsset/images/pdf_img.png")
        .addClass("pdf_img");
    } else {
      $(this)
        .parent(".file-drop-area")
        .find(".upload_img")
        .attr("src", img_val);
    }
  });
  $("#altcasualpic").click(function () {
    $("#upPicNew").val(null);
    $("#casualNew_pic").attr("src", "./assets/portalAsset/images/casualPic.png");
    $("#casual-content .choose-file-button").html("Upload from Desktop");
  });
  // alert(upload_value);
  // Anniversary Date display
  $("input:radio[name=marital_status]").change(function () {
    if ($("input:radio[name=marital_status]:checked").val() == "Single") {
      $(".annv").css("display", "none");
      $(".annv #anniversary_date").val("").prop("disabled", true);
    } else if (
      $("input:radio[name=marital_status]:checked").val() == "Married"
    ) {
      $(".annv").css("display", "inline-block");
      $(".annv #anniversary_date").val("").prop("disabled", false);
      $("#anniversary_date").removeClass("errMSg");
      $("#anniversary_date").parent().find(".ErrorMessage").hide();
    }
  });
  // Email Validation
  $("#personalemailid").change(function () {
    let re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    email = $("#personalemailid").val();
    if (!re.test(email)) {
      $("#personalemailid").focus();
      $("#personalemailid").addClass("errMSg");
      $("#personalemailid").parent().find(".emailError").show();
      $("#personalemailid").parent().find(".ErrorMessage").hide();
    } else {
      $("#personalemailid").removeClass("errMSg");
      $("#personalemailid").parent().find(".ErrorMessage").hide();
      $("#personalemailid").parent().find(".emailError").hide();
    }
  });
  //Pan Num format
  // $(function () {
  $("#pan_num").on("keyup", function () {
    // alert("test pan number")
    var regex = /([A-Z]){5}([0-9]){4}([A-Z]){1}$/;
    if (regex.test($(this).val())) {
      $("#pan_num").removeClass("preErrMsg");
      $("#pan_num").parent(".field-div").find(".panErr").hide();
      return true;
    } else {
      $("#pan_num").focus();
      $("#pan_num").addClass("preErrMsg");
      $("#pan_num").parent(".field-div").find(".panErr").show();
      return false;
    }
  });
  //alternative contact number
  $("#alternative_minus").click(function () {
    $("#alternatecontactinput").hide();
    $("#alter_contact").val("");
    $("#alternate-number").show();
  });
  //casual pic function
  $("#altcasualpic").click(function () {
    $("#casual").show();
    $("#casual-content").hide();
    $("#upPicNew").val(null);
  });

  //limit set for all field
  // $(".limitchar")
  //   .unbind("keyup change input paste")
  //   .bind("keyup change input paste", function (e) {
  //     var $this = $(this);
  //     var val = $this.val();
  //     var valLength = val.length;
  //     var maxCount = $this.attr("maxlength");
  //     if (valLength > maxCount) {
  //       $this.val($this.val().substring(0, maxCount));
  //     }
  //   });
  //datepicker for disable past and today date
  var date = new Date();
  date.setDate(date.getDate() + 1);
  $(".doj-sel")
    .datepicker({
      format: "mm/dd/yyyy",
      startDate: date,
      autoclose: true,
    })
    .on("change", function () {
      $(this).datepicker("hide");
    });
  $(".uanDiv").hide();
  $("#uanYes").click(function(){
    $(".uanDiv").show();
  });
  $("#uanNo").click(function(){
    $(".uanDiv").hide();
    $(".uanDiv input").val("");
  });
  // Bank Check
  $("#newAcc").change(function () {
    if ($(this).is(":checked") == false) {
      $(".bankcheck").show();
      $(".bankFil").each(function () {
        $(this).val("").prop("disabled", false);
        $(".bankFil").removeClass("errMSg");
        $(".field-div").parent(".bankcheck").find(".ErrorMessage").hide();
      });
    } else if ($(this).is(":checked")) {
      $(".bankcheck").hide();
      $(".bankFil").each(function () {
        $(this).val("").prop("disabled", true);
      });
    }
  });
  if ($("#newAcc").is(":checked")) {
    $(".bankcheck .bankFil").removeClass("errMSg");
    $(".bankcheck .ErrorMessage").hide();
  }

  //Basic Details Validation
  $("#basic-details").click(function () {
    $(".basicFil").each(function () {
      if ($(this).val() == "") {
        $(this).focus();
        $(this).addClass("errMSg");
        $(this).parent().find(".ErrorMessage").show();
      }
      if ($(this).val() != "") {
        $(this).removeClass("errMSg");
        $(this).parent().find(".ErrorMessage").hide();
      }
      $(this).keypress(function () {
        $(this).removeClass("errMSg");
        $(this).parent().find(".ErrorMessage").hide();
      });
    });
    $(".bankFil").each(function () {
      if ($(this).val() == "") {
        $(this).addClass("errMSg");
        $(this).parent().find(".ErrorMessage").show();
      }
      if ($(this).val() != "") {
        $(this).removeClass("errMSg");
        $(this).parent().find(".ErrorMessage").hide();
      }
      $(this).change(function () {
        $(this).removeClass("errMSg");
        $(this).parent().find(".ErrorMessage").hide();
      });
      $(this).keypress(function () {
        $(this).removeClass("errMSg");
        $(this).parent().find(".ErrorMessage").hide();
      });
    });
    // gender select
    if ($("input[name='gender']:checked").length == 0) {
      $(".gen-sel").addClass("errMSg");
      $(".genChe").parent(".genErr").find(".ErrorMessage").show();
    }
    $("input:radio[name=gender]").change(function () {
      $(".gen-sel").removeClass("errMSg");
      $(".genChe").parent(".genErr").find(".ErrorMessage").hide();
    });
    //dob select
    if ($(".dob-sel").val() == "") {
      $(".dob-sel").addClass("errMSg");
      $(".dob-sel").parent(".dob").find(".ErrorMessage").show();
    }
    $(".dob-sel").change(function () {
      $(".dob-sel").removeClass("errMSg");
      $(".dob-sel").parent(".dob").find(".ErrorMessage").hide();
    });
    // marital select validate
    if ($("input[name='marital_status']:checked").length == 0) {
      $(".mar-stat").addClass("errMSg");
      $(".marital").parents(".marErr").find(".ErrorMessage").show();
    }
    $("input:radio[name=marital_status]").change(function () {
      $(".mar-stat").removeClass("errMSg");
      $(".marital").parents(".marErr").find(".ErrorMessage").hide();
    });
    // annivedate select validate
    if ($("input[name='marital_status']:checked").val() == "Married") {
      if ($("#anniversary_date").val() == "") {
        $("#anniversary_date").addClass("errMSg");
        $("#anniversary_date").parent().find(".ErrorMessage").show();
      }
      $("#anniversary_date").change(function () {
        $("#anniversary_date").removeClass("errMSg");
        $("#anniversary_date").parent().find(".ErrorMessage").hide();
      });
    }
    //personal-email validate
    if ($("#personalemailid").val() == "") {
      $("#personalemailid").addClass("errMSg");
      $("#personalemailid").parent().find(".ErrorMessage").show();
    }
    //mobile number validate
    $(".num").keypress(function () {
      $(this).parents(".mob-num").find(".num").removeClass("errMSg");
      $(this).parents(".mob-num").find(".ErrorMessage").hide();
    });
    //permanant add check validate
    $("input[name=permanent]").change(function () {
      if (
        $(this).prop("checked") == true &&
        $(".perCheck .basicFil").val() != ""
      ) {
        $(".perCheck .basicFil").removeClass("errMSg");
        $(this).parents(".perCheck").find(".ErrorMessage").hide();
      }
      if ($(".perCheck .basicFil").val() == "") {
        $(".perCheck .basicFil").addClass("errMSg");
        $(this).parents(".perCheck").find(".ErrorMessage").show();
      }
    });
    //basic-details check
    let FirstName = $("#first_name").val(),
      LastName = $("#last_name").val(),
      Dob = $("#dob").val(),
      Gender = $("input:radio[name=gender]:checked").val(),
      Nationality = $(".nationality .filter-option").text(),
      MaritalStatus = $("input:radio[name=marital_status]:checked").val(),
      AnniversaryDate = $("#anniversary_date").val(),
      PersonalmailID = $("#personalemailid").val(),
      AlterContact = $("#alter_contact").val(),
      LinkedProfile = $("#linkedin_profile").val(),
      Pincode = $("#pincode-val").val(),
      Country = $(".country-val .filter-option").text(),
      State = $("#state-val").val(),
      TalukDistrict = $("#taluk-val").val(),
      City = $("#city-val").val(),
      AreaLocality = $("#area-val").val(),
      Premesis_Building = $("#building-val").val(),
      Block_Flat = $("#block-val").val(),
      Pincode_get = $("#pincode-get").val(),
      Country_get = $(".country-get .filter-option").text(),
      State_get = $("#state-get").val(),
      TalukDistrict_get = $("#taluk-get").val(),
      City_get = $("#city-get").val(),
      AreaLocality_get = $("#area-get").val(),
      Premesis_Building_get = $("#building-get").val(),
      Block_Flat_get = $("#block-get").val(),
      BankAccountName = $("#acc_name").val(),
      AccountNumber = $("#acc_number").val(),
      IFSCcode = $("#ifsc_code").val(),
      Bank = $("#bank_name").val(),
      BankBranch = $("#bank_branch").val();

    if (
      FirstName != "" &&
      LastName != "" &&
      Dob != "" &&
      Gender != "" &&
      Nationality != "" &&
      MaritalStatus != "" &&
      PersonalmailID != "" &&
      Pincode != "" &&
      Country != "" &&
      State != "" &&
      TalukDistrict != "" &&
      City != "" &&
      AreaLocality != "" &&
      Premesis_Building != "" &&
      Block_Flat != "" &&
      Pincode_get != "" &&
      Country_get != "" &&
      State_get != "" &&
      TalukDistrict_get != "" &&
      City_get != "" &&
      AreaLocality_get != "" &&
      Premesis_Building_get != "" &&
      Block_Flat_get != ""
    ) {
      if ($("#newAcc").is(":checked") == true && MaritalStatus == "Married") {
        if (AnniversaryDate != "") {
          current_fs = $("#basic-details").parent();
          next_fs = $("#basic-details").parent().next();
          nextPage();
          nextPacman();
        }
      } else if (
        $("#newAcc").is(":checked") == true &&
        MaritalStatus == "Single"
      ) {
        current_fs = $("#basic-details").parent();
        next_fs = $("#basic-details").parent().next();
        nextPage();
        nextPacman();
      } else if (
        $("#newAcc").is(":checked") == false &&
        MaritalStatus == "Married"
      ) {
        if (
          BankAccountName != "" &&
          AccountNumber != "" &&
          IFSCcode != "" &&
          Bank != "" &&
          BankBranch != "" &&
          AnniversaryDate != ""
        ) {
          current_fs = $("#basic-details").parent();
          next_fs = $("#basic-details").parent().next();
          nextPage();
          nextPacman();
        }
      } else if (
        $("#newAcc").is(":checked") == false &&
        MaritalStatus == "Single"
      ) {
        if (
          BankAccountName != "" &&
          AccountNumber != "" &&
          IFSCcode != "" &&
          Bank != "" &&
          BankBranch != ""
        ) {
          current_fs = $("#basic-details").parent();
          next_fs = $("#basic-details").parent().next();
          nextPage();
          nextPacman();
        }
      }else{
        notify('Some fields are empty',"danger")
      }
    } else {
      notify('Some fields are empty',"danger")
    }
    $(".errMSg").filter(":first").focus();
    // current_fs = $("#basic-details").parent();
    // next_fs = $("#basic-details").parent().next();
    // nextPage();
    // nextPacman();
  });
  // Preferrence Details Validation
  //Laptop sec Refresh
  $("#macstorage, #windowstorage, .mac-store").hide();
  $(".windowcheck").click(function () {
    $("#select_model_mac").val("").selectpicker("refresh");
    $("#select_screen_mac").val("").selectpicker("refresh");
    $(".mac-store").show();
    $("#windowstorage").show();
    $("#macstorage").hide();
  });
  $(".macchecked").click(function () {
    $("#select_ram_win").val("").selectpicker("refresh");
    $("#select_screen_win").val("").selectpicker("refresh");
    $("#macstorage").show();
    $("#windowstorage").hide();
    $(".mac-store").show();
  });
  $("#preferance-btn").click(function () {
    // prefer email id
    if ($("#prefermail_id").val() == "") {
      $("#prefermail_id").focus();
      $("#prefermail_id").addClass("preErrMsg");
      $("#prefermail_id").parent().find(".prefErr").show();
    }
    $("#prefermail_id").change(function () {
      $("#prefermail_id").removeClass("preErrMsg");
      $("#prefermail_id").parent().find(".prefErr").hide();
    });
    $("#prefermail_id").keypress(function () {
      $("#prefermail_id").removeClass("preErrMsg");
      $("#prefermail_id").parent().find(".prefErr").hide();
    });
    //Joining date
    if ($(".doj-sel").val() == "") {
      $(".doj-sel").focus();
      $(".doj-sel").addClass("preErrMsg");
      $(".doj-sel").parent().find(".prefErr").show();
    } else {
      $(".doj-sel").removeClass("preErrMsg");
      $(".doj-sel").parent().find(".prefErr").hide();
    }
    $(".doj-sel").change(function () {
      $(".doj-sel").removeClass("preErrMsg");
      $(".doj-sel").parent().find(".prefErr").hide();
    });
    //Laptop select Validation
    if ($("input:radio[name=laptop]:checked").length == 0) {
      $("#windowchecked").addClass("preErrMsg");
      $("#macchecked").addClass("preErrMsg");
      $(".lapErr").find(".btn-lap").addClass("preErrMsg");
      $(".lapErr").parents(".lap-sel").find(".prefErr").show();
    }
    if ($("input:radio[name=laptop]:checked").length != 0) {
      $("#windowchecked").removeClass("preErrMsg");
      $("#macchecked").removeClass("preErrMsg");
      $(".lapErr").find(".btn-lap").removeClass("preErrMsg");
      $(".lapErr").parent().find(".prefErr").hide();
    }
    $("input:radio[name=laptop]").change(function () {
      $("#windowchecked").removeClass("preErrMsg");
      $("#macchecked").removeClass("preErrMsg");
      $(".lapErr").find(".btn-lap").removeClass("preErrMsg");
      $(".lapErr").parent().find(".prefErr").hide();
    });
    // Bag Selection
    if ($("input:radio[name=Briefcase]:checked").length == 0) {
      $(".bagErr").focus();
      $(".bagErr").addClass("preErrMsg");
      $(".bagErr .btn-lap").addClass("preErrMsg");
      $(".briefErr").addClass("preErrMsg");
      $(".bagErr").parent().find(".prefErr").show();
    }
    $("input:radio[name=Briefcase]").change(function () {
      $(".bagErr").removeClass("preErrMsg");
      $(".briefErr").removeClass("preErrMsg");
      $(".bagErr .btn-lap").removeClass("preErrMsg");
      $(".bagErr").parent().find(".prefErr").hide();
    });
    //Bottle Selection
    if ($("input:radio[name=bottle]:checked").length == 0) {
      $(".bottleErr").focus();
      $(".bottleErr").addClass("preErrMsg");
      $(".text-center").parents(".bottles").find(".prefErr").show();
    }
    $("input:radio[name=bottle]").change(function () {
      $(".bottleErr").removeClass("preErrMsg");
      $(".text-center").parents(".bottles").find(".prefErr").hide();
    });
    //T-Shirt Selection
    if ($("input:radio[name=tshirt]:checked").length == 0) {
      $(".shirtErr").focus();
      $(".shirtErr").addClass("preErrMsg");
      $(".t-shirt-div").parents(".tshirt-content").find(".prefErr").show();
    }
    //Tshirt Size Selection
    if ($("#tshirt_size_1").val() == "") {
      $(".tshirt-sel1").focus();
      $(".tshirt-sel1").addClass("preErrMsg");
    }
    $("#tshirt_size_1").change(function () {
      $(".shirtErr").removeClass("preErrMsg");
      $(".tshirt-sel1").removeClass("preErrMsg");
      $(".t-shirt-div").parents(".tshirt-content").find(".prefErr").hide();
    });
    //Scrible Note Selection
    if ($("input:radio[name=notebook]:checked").length == 0) {
      $(".notebookcheck").focus();
      $(".noteErr").find(".btn-lap").addClass("preErrMsg");
      $(".noteErr").addClass("preErrMsg");
      $(".noteErr").parents(".notebookcheck").find(".prefErr").show();
    }
    $("input:radio[name=notebook]").change(function () {
      $(".noteErr").find(".btn-lap").removeClass("preErrMsg");
      $(".noteErr").removeClass("preErrMsg");
      $(".noteErr").parents(".notebookcheck").find(".prefErr").hide();
    });
    //Prefered Detaila check
    let preferMail = $("#prefermail_id").val(),
      doj = $("#joining_date").val(),
      laptop = $("input:radio[name=laptop]:checked").val(),
      
      bag = $("input:radio[name=Briefcase]:checked").length,
      bottle = $("input:radio[name=bottle]:checked").length,
      tshirt1 = $("input:radio[name=tshirt]:checked").val(),
      tshirtsize1 = $("#tshirt_size_1").val(),
      notebook = $("input:radio[name=notebook]:checked").length;
    if (
      preferMail != "" &&
      doj != "" &&
      laptop != "0" &&
      bag != "0" &&
      bottle != "0" &&
      tshirt1 != "" &&
      tshirtsize1 != "" &&
      notebook != "0"
    ) {
      current_fs = $("#preferance-btn").parent();
      next_fs = $("#preferance-btn").parent().next();
      nextPage();
      nextPacman();
    } else {
      notify('Some fields are empty',"danger")
    }
    $(".preErrMsg").filter(":first").focus();
    // current_fs = $("#preferance-btn").parent();
    // next_fs = $("#preferance-btn").parent().next();
    // nextPage();
    // nextPacman();
  });
  //Upload Documents Validations
  $("#voter-content").hide();
  $("#license-content").hide();
  $("#license").click(function () {
    $("#voter-content input").val(null);
    $("#voter-content .choose-file-button").html("Upload from Desktop</span>");
    $("#voter-content .upload_img").attr(
      "src",
      "./assets/portalAsset/images/casualPic.png"
    );
  });
  $("#Voter").click(function () {
    $("#license-content input").val(null);
    $("#license-content .choose-file-button").html(
      "Upload from Desktop</span>"
    );
    $("#license-content .upload_img").attr(
      "src",
      "./assets/portalAsset/images/casualPic.png"
    );
  });
  $("#plus").click(function () {
    $("#passport-content, .showpassportminus").show();
    $("#passport-content input").val("").prop("disable", false);
    $("#plus").hide();
  });
  $(".showpassportminus").click(function () {
    $("#passport-content, .showpassportminus").hide();
    $("#passport-content input").val("").prop("disable", true);
    $("#pass_num").removeClass("preErrMsg");
    $("#pass_expdate").removeClass("preErrMsg");
    $(".passUpload").removeClass("preErrMsg");
    $(".passUpload").parent(".field-div").find("prefErr").hide();
    $(".passUpload").parent().find(".prefErr").hide();
    $("#pass_expdate").parent().find(".prefErr").hide();
    $("#pass_num").parent().find(".prefErr").hide();
    $("#plus").show();
    $(".passUpload .upload_img").attr(
      "src",
      "./assets/portalAsset/images/casualPic.png"
    );
    $("#passport-content .choose-file-button").html(
      "Upload from Desktop</span>"
    );
  });
  $("#upload-btn").click(function () {
    // Picture Upload
    $(".upDoc").each(function () {
      if ($(this).val() == "") {
        $(this).parents(".uploadDoc").addClass("preErrMsg");
        $(this).parents(".uploadErr").find(".prefErr").show();
        $(this).parents(".uploadErr").find(".aadharname").hide();
      }
      $(this).change(function () {
        $(this).parents(".uploadErr").find(".prefErr").hide();
      });
    });
    // Pan Section Validation
    if ($("#pan_num").val() == "") {
      $("#pan_num").focus();
      $("#pan_num").addClass("preErrMsg");
      $("#pan_num").parent(".field-div").find(".prefErr").show();
    }
    $("#pan_num").change(function () {
      $("#pan_num").removeClass("preErrMsg");
      $("#pan_num").parent(".field-div").find(".prefErr").hide();
    });
    $("#pan_num").keypress(function () {
      $("#pan_num").removeClass("preErrMsg");
      $("#pan_num").parent(".field-div").find(".prefErr").hide();
    });
    // Aadhar section Validation
    if ($("#aadhar_num").val() == "") {
      $("#aadhar_num").focus();
      $("#aadhar_num").addClass("preErrMsg");
      $("#aadhar_num").parent(".field-div").find(".prefErr").show();
    }
    $("#aadhar_num").change(function () {
      $("#aadhar_num").removeClass("preErrMsg");
      $("#aadhar_num").parent(".field-div").find(".prefErr").hide();
    });
    $("#aadhar_num").keypress(function () {
      $("#aadhar_num").removeClass("preErrMsg");
      $("#aadhar_num").parent(".field-div").find(".prefErr").hide();
    });
    // Address Validation
    if ($("#aadharcheck").is(":checked")) {
      $("#aadharcheck").removeClass("preErrMsg");
      $(".add_check").removeClass("preErrMsg");
      $("#license").removeClass("preErrMsg");
      $("#Voter").removeClass("preErrMsg");
    } else if ($("#aadharcheck").is(":checked") == false) {
      $("#aadharcheck").addClass("preErrMsg");
      $(".add_check").addClass("preErrMsg");
      $("#license").addClass("preErrMsg");
      $("#Voter").addClass("preErrMsg");
    }
    $("#aadharcheck").change(function () {
      $("#aadharcheck").removeClass("preErrMsg");
      $(".add_check").removeClass("preErrMsg");
      $("#license").removeClass("preErrMsg");
      $("#Voter").removeClass("preErrMsg");
    });
    $("input:radio[name=add_proof]").change(function () {
      $(this).prop("checked", true);
      $("#aadharcheck").removeClass("preErrMsg");
      $(".add_check").removeClass("preErrMsg");
      $("#license").removeClass("preErrMsg");
      $("#Voter").removeClass("preErrMsg");
      $("#drive_num").removeClass("preErrMsg");
      $(".licenseFront").removeClass("preErrMsg");
      $(".licenseBack").removeClass("preErrMsg");
      $(".vtrBack").removeClass("preErrMsg");
      $("#voter_num").removeClass("preErrMsg");
      $(".vtrFront").removeClass("preErrMsg");
      $(".vtrBack").removeClass("preErrMsg");
      $("#drive_num").parent(".field-div").find(".prefErr").hide();
      $(".licenseBack").parent(".field-div").find(".prefErr").hide();
      $(".licenseFront").parent(".field-div").find(".prefErr").hide();
      $("#voter_num").parent(".field-div").find(".prefErr").hide();
      $(".vtrFront").parent(".field-div").find(".prefErr").hide();
      $(".vtrBack").parent(".field-div").find(".prefErr").hide();
    });
    // Driving License Validate
    if ($("input:radio[name=add_proof]:checked").val() == "driving") {
      $("#aadharcheck").removeClass("preErrMsg");
      $(".add_check").removeClass("preErrMsg");
      $("#license").removeClass("preErrMsg");
      $("#Voter").removeClass("preErrMsg");
      $(".licenseFront").parents(".field-div").find(".prefErr").hide();
      $(".licenseBack").parents(".field-div").find(".prefErr").hide();

      if ($("#drive_num").val() == "") {
        $("#drive_num").focus();
        $("#drive_num").addClass("preErrMsg");
        $("#drive_num").parent(".field-div").find(".prefErr").show();
      }
      if ($(".liceFrnt").val() == "") {
        $(".licenseFront").focus();
        $(".licenseFront").addClass("preErrMsg");
        $(".licenseFront").parent().find(".aadharname").hide();
        $(".licenseFront").parent().find(".prefErr").show();
      }
      if ($(".liceBck").val() == "") {
        $(".licenseBack").focus();
        $(".licenseBack").addClass("preErrMsg");
        $(".licenseBack").parent().find(".aadharname").hide();
        $(".licenseBack").parent().find(".prefErr").show();
      }
      $("#drive_num").change(function () {
        $("#drive_num").removeClass("preErrMsg");
        $("#drive_num").parent(".field-div").find(".prefErr").hide();
      });
      $("#drive_num").keypress(function () {
        $("#drive_num").removeClass("preErrMsg");
        $("#drive_num").parent(".field-div").find(".prefErr").hide();
      });
    }
    // VoterID Validate
    if ($("input:radio[name=add_proof]:checked").val() == "voter") {
      $("#aadharcheck").removeClass("preErrMsg");
      $(".add_check").removeClass("preErrMsg");
      $("#license").removeClass("preErrMsg");
      $("#Voter").removeClass("preErrMsg");
      $(".vtrFront").parents(".field-div").find(".prefErr").hide();
      $(".vtrBack").parents(".field-div").find(".prefErr").hide();
      if ($("#voter_num").val() == "") {
        $("#voter_num").focus();
        $("#voter_num").addClass("preErrMsg");
        $("#voter_num").parent(".field-div").find(".prefErr").show();
      }
      if ($(".voterFrnt").val() == "") {
        $(".vtrFront").focus();
        $(".vtrFront").parent(".field-div").find(".aadharname").hide();
        $(".vtrFront").parent(".field-div").find(".prefErr").show();
        $(".vtrFront").addClass("preErrMsg");
      }
      if ($(".voterBck").val() == "") {
        $(".vtrBack").focus();
        $(".vtrBack").parent(".field-div").find(".aadharname").hide();
        $(".vtrBack").parent(".field-div").find(".prefErr").show();
        $(".vtrBack").addClass("preErrMsg");
      }
      $("#voter_num").change(function () {
        $("#voter_num").removeClass("preErrMsg");
        $("#voter_num").parent(".field-div").find(".prefErr").hide();
      });
      $("#voter_num").keypress(function () {
        $("#voter_num").removeClass("preErrMsg");
        $("#voter_num").parent(".field-div").find(".prefErr").hide();
      });
    }
    //Upload Doc check
    let upPic = $("#upPic").val(),
      panNum = $("#pan_num").val(),
      panPic = $("#panPic").val(),
      aadhNum = $("#aadhar_num").val(),
      aadhFrnt = $("#aadharFrnt").val(),
      aadhBck = $("#aadharBck").val(),
      adrsProof = $("input:radio[name=add_proof]:checked").val(),
      drivNum = $("#drive_num").val(),
      drivLicFrnt = $(".liceFrnt").val(),
      drivLicBck = $(".liceBck").val(),
      voterNum = $("#voter_num").val(),
      voterFrnt = $(".voterFrnt").val(),
      voterBck = $(".voterBck").val(),
      passNum = $("#pass_num").val(),
      passExpDt = $("#pass_expdate").val(),
      passUpd = $(".passUp").val();
    if (
      upPic != "" &&
      panNum != "" &&
      panPic != "" &&
      aadhNum != "" &&
      aadhFrnt != "" &&
      aadhBck != ""
    ) {
      if ($("#aadharcheck").is(":checked") == true) {
        current_fs = $("#upload-btn").parent();
        next_fs = $("#upload-btn").parent().next();
        nextPage();
        nextPacman();
      } else if ($("#aadharcheck").is(":checked") == false) {
        if (adrsProof == "driving") {
          if (drivNum != "" && drivLicFrnt != "" && drivLicBck != "") {
            current_fs = $("#upload-btn").parent();
            next_fs = $("#upload-btn").parent().next();
            nextPage();
            nextPacman();
          }else{
            notify('Some fields are empty',"danger")
          }
        } else if (adrsProof == "voter") {
          if (voterNum != "" && voterFrnt != "" && voterBck != "") {
            current_fs = $("#upload-btn").parent();
            next_fs = $("#upload-btn").parent().next();
            nextPage();
            nextPacman();
          }
        }
      }else{
        notify('Some fields are empty',"danger")
      }
    }else{
      notify('Some fields are empty',"danger")
    }
    $(".preErrMsg").filter(":first").focus();
    // current_fs = $("#upload-btn").parent();
    // next_fs = $("#upload-btn").parent().next();
    // nextPage();
    // nextPacman();
  });
  // Eucation & Work-Expreience
  $('.addingeducation').click(()=>{
    $(".eduDoc").each(function () {
      $(this).parent().removeClass("preErrMsg");
      $(this).parents(".field-div").find(".aadharname").show();
      $(this).parents(".field-div").find(".upSizeErr").hide();
      $(this).parents(".field-div").find(".prefErr").hide();
    });
    $(".fieldEdu2").removeClass("preErrMsg");
    $('.fieldEdu2').parent().find(".prefErr").hide();
    $(".fieldEdu3").removeClass("preErrMsg");
    $('.fieldEdu3').parent().find(".prefErr").hide();
    $('.yearEdu2').removeClass("preErrMsg");
    $('.yearEdu2').parent().find(".prefErr").hide();
    $('.yearEdu3').removeClass("preErrMsg");
    $('.yearEdu3').parent().find(".prefErr").hide();

    if($('#select_edu').val()!=='' && $('#select_field').val()!==""&&$('#year_completion').val()!==''&& $('#eduCertificate').val()!==""){
      if($('#select_edu').prop('selectedIndex')== 1){
        $('#edu2').show()
      }
      if($('#select_edu').prop('selectedIndex')== 2){
        $('#edu2').show()
      }
    }
    if($('#new_edu2').val()!=='' && $('#new_field2').val()!==""&&$('#new_edu_yr2').val()!==''&& $('#new_eduCert2').val()!==""){
      if($('#select_edu').prop('selectedIndex')== 1){
        $('#edu3').show()
      }else{
        eduLoop()
      }
    }
    if($("#edu2").is(':visible')){
      if($('#select_edu').prop('selectedIndex')== 2){
        $('#new_edu2').selectpicker('val',"Under Graduation/ Bachelor’s level")
        $('#new_edu2').selectpicker('refresh')
        $('#new_edu2').selectpicker().prop('disabled',true)
        $('.addingeducation').hide()
      }
      if($('#select_edu').prop('selectedIndex')== 1){
        $('#new_edu2').selectpicker('val',"Post Graduation/Master’s level")
        $('#new_edu2').selectpicker('refresh')
        $('#new_edu2').selectpicker().prop('disabled',true)
      }
    }
    if($("#edu3").is(':visible')){
      if($('#select_edu').prop('selectedIndex')== 1){
        $('#new_edu3').selectpicker('val',"Under Graduation/ Bachelor’s level")
        $('#new_edu3').selectpicker('refresh')
        $('#new_edu3').selectpicker().prop('disabled',true)
        $('.addingeducation').hide()
      }
    }
  })
  $('#select_edu').change(()=>{
    if($('#select_edu').prop('selectedIndex')=== 1||2){
      if($('#edu2, #edu3').is(':visible',true)){
        $('#edu2').hide()
        $('#edu3').hide()
        $('#new_field2').val('')
        $('#new_edu_yr2').val('')
        $('#new_eduCert2').val('')
        $('#new_field3').val('')
        $('#new_edu_yr3').val('')
        $('#new_eduCert3').val('')
        $("#edu2 .choose-file-button").html("Upload from Desktop</span>");
        $("#edu2 .upload_img").attr("src","./assets/portalAsset/images/casualPic.png");
        $("#edu3 .choose-file-button").html("Upload from Desktop</span>");
        $("#edu3 .upload_img").attr("src","./assets/portalAsset/images/casualPic.png");
      }
      $('.addingeducation').show()
    }
    if($('#select_edu').prop('selectedIndex')=== 3){
      $('.addingeducation').hide()
    }
    $('.eduInfo').hide()
  })
  
  $("#relieved").click(function () {
    $(".workstart").val(null);
  });
  $("#working").click(function () {
    $("#relieved-content input").val(null);
    $("#calculate-date").text("-");
    $("#relieved-content .choose-file-button").html(
      "Upload from Desktop</span>"
    );
    $("#relieved-content .upload_img").attr(
      "src",
      "./assets/portalAsset/images/casualPic.png"
    );
  });
  $(".showcertificateminus").click(function () {
    $("#certificate-content, .showcertificateminus").hide();
    $(".certYr").val("").prop("disable", true);
    $("#certificateDoc").val(null);
    $("#certEdu").val("").trigger("change");
    $("#certField").val("").trigger("change");
    $(".certYr").removeClass("preErrMsg");
    $(".certYr").parent().find(".prefErr").hide();
    $(".certDoc").parent().removeClass("preErrMsg");
    $(".certDocErr").parent().find(".prefErr").hide();
    $("#certificate-content .choose-file-button").html(
      "Upload from Desktop</span>"
    );
    $("#certificate-content .upload_img").attr(
      "src",
      "./assets/portalAsset/images/casualPic.png"
    );
  });
  $("#yes-content").hide();
  $("input:radio[name=uan_num]").change(()=>{
    $("#uan_number").val('')
    $("#uan_number").removeClass("preErrMsg");
    $("#uan_number").parent().find(".prefErr").hide();
  })

  function eduLoop() {
    for (eduCnt = 1; eduCnt <= 3; eduCnt++) {
      // if ($("#new_edu" + eduCnt).val() == "") {
      //   $("#new_edu" + expCnt).focus();
      //   $(".newEdu" + eduCnt).addClass("preErrMsg");
      //   $(".newEdu" + eduCnt)
      //     .parent()
      //     .find(".prefErr")
      //     .show();
      // }
      // $(".newEdu" + eduCnt).change(function () {
      //   $(this).removeClass("preErrMsg");
      //   $(this).parent().find(".prefErr").hide();
      // });
      if ($("#new_field" + eduCnt).val() == "") {
        $("#new_field" + expCnt).focus();
        $(".fieldEdu" + eduCnt).addClass("preErrMsg");
        $(".fieldEdu" + eduCnt)
          .parent()
          .find(".prefErr")
          .show();
      }
      $(".fieldEdu" + eduCnt).change(function () {
        $(this).removeClass("preErrMsg");
        $(this).parent().find(".prefErr").hide();
        $('.eduInfo').hide()
      });
      if ($("#new_edu_yr" + eduCnt).val() == "") {
        $(".yearEdu" + eduCnt).addClass("preErrMsg");
        $(".yearEdu" + eduCnt)
          .parent()
          .find(".prefErr")
          .show();
      }
      $(".yearEdu" + eduCnt).change(function () {
        $(this).removeClass("preErrMsg");
        $(this).parent().find(".prefErr").hide();
      });
    }
  }
  function expLoop() {
    for (expCnt = 2; expCnt <= expcounter; expCnt++) {
      if ($("#exp_emp_name" + expCnt).val() == "") {
        $("#exp_emp_name" + expCnt).focus();
        $("#exp_emp_name" + expCnt).addClass("preErrMsg");
        $("#exp_emp_name" + expCnt)
          .parent()
          .find(".prefErr")
          .show();
      }
      $("#exp_emp_name" + expCnt).keypress(function () {
        $(this).removeClass("preErrMsg");
        $(this).parent().find(".prefErr").hide();
      });
      if ($("#exp_designation" + expCnt).val() == "") {
        $("#exp_designation" + expCnt).focus();
        $(".expDesg" + expCnt).addClass("preErrMsg");
        $(".expDesg" + expCnt)
          .parent()
          .find(".prefErr")
          .show();
      }
      $(".expDesg" + expCnt).change(function () {
        $(this).removeClass("preErrMsg");
        $(this).parent().find(".prefErr").hide();
      });
      if ($("#relstartdate" + expCnt).val() == "") {
        $("#relstartdate" + expCnt).focus();
        $("#relstartdate" + expCnt).addClass("preErrMsg");
        $("#relstartdate" + expCnt)
          .parent()
          .find(".prefErr")
          .show();
      }
      $("#relstartdate" + expCnt).change(function () {
        $(this).removeClass("preErrMsg");
        $(this).parent().find(".prefErr").hide();
      });
      if ($("#relenddate" + expCnt).val() == "") {
        $("#relenddate" + expCnt).focus();
        $("#relenddate" + expCnt).addClass("preErrMsg");
        $("#relenddate" + expCnt)
          .parent()
          .find(".prefErr")
          .show();
      }
      $("#relenddate" + expCnt).change(function () {
        $(this).removeClass("preErrMsg");
        $(this).parent().find(".prefErr").hide();
      });
    }
  }
  // $('.addingexperience').click(function(){
  //   if ($("#exp_emp_name").val() !== "" &&
  //     $("#exp_designation").val() !== "" &&
  //     $("#relstartdate").val() !== "" &&
  //     $("#relenddate").val() !== "" ) {
  //     addexperience()
  //     for (expCnt = 2; expCnt <= expcounter; expCnt++) {
  //       if($('#edu'+expCnt).is(":visible")){
  //         if ($("#exp_emp_name" + expCnt).val() !== "" && 
  //         $("#exp_designation" + expCnt).val() !== "" && 
  //         $("#relstartdate" + expCnt).val() !== "" &&
  //         $("#relenddate" + expCnt).val() !== "" ) {
  //           addexperience()
  //           return 
  //         }else{
  //           expLoop()
  //           // $('.addingexperience').prop('disabled',true)
  //         }
  //       }
  //     }
  //   }
  // })
  
  $("#education-btn").click(function () {
    expLoop();
    if($("#edu2").is(":visible")||$('#edu3').is(':visible')){
      eduLoop();
    }
    if ($("#select_edu").val() == "") {
      $(".masterDeg").addClass("preErrMsg");
      $(".masterDeg").parent().find(".prefErr").show();
    }
    if ($("#select_edu").val() != "") {
      $(".masterDeg").removeClass("preErrMsg");
      $(".masterDeg").parent().find(".prefErr").hide();
    }
    $(".masterDeg").change(function () {
      $(".masterDeg").removeClass("preErrMsg");
      $(".masterDeg").parent().find(".prefErr").hide();
    });
    if ($("#select_field").val() == "") {
      $("#select_field").addClass("preErrMsg");
      $("#select_field").parent().find(".prefErr").show();
    }
    $("#select_field").keypress(function () {
      $("#select_field").removeClass("preErrMsg");
      $("#select_field").parent().find(".prefErr").hide();
    });
    if ($("#year_completion").val() == "") {
      $("#year_completion").addClass("preErrMsg");
      $("#year_completion").parent().find(".prefErr").show();
    }
    $("#year_completion").change(function () {
      $("#year_completion").removeClass("preErrMsg");
      $("#year_completion").parent().find(".prefErr").hide();
    });
    $(".eduDoc").each(function () {
      if ($(this).val() == "") {
        $(this).parent().addClass("preErrMsg");
        $(this).parents(".field-div").find(".aadharname").hide();
        $(this).parents(".field-div").find(".upSizeErr").hide();
        $(this).parents(".field-div").find(".prefErr").show();
      }
    });
    // Work Experience Validate
    if ($("input:radio[name=work_exp]:checked").length == 0) {
      $("#Yes").addClass("preErrMsg");
      $("#No").addClass("preErrMsg");
      $(".wrkExp").parent().find(".prefErr").show();
    }
    $("input:radio[name=work_exp]").change(function () {
      $("#Yes").removeClass("preErrMsg");
      $("#No").removeClass("preErrMsg");
      $(".wrkExp").parent().find(".prefErr").hide();
    });
    if ($("input:radio[name=work_exp]:checked").val() == "Yes") {
      if ($("#exp_emp_name").val() == "") {
        $("#exp_emp_name").addClass("preErrMsg");
        $("#exp_emp_name").parent().find(".prefErr").show();
      }
      $("#exp_emp_name").change(function () {
        $("#exp_emp_name").removeClass("preErrMsg");
        $("#exp_emp_name").parent().find(".prefErr").hide();
      });
      $("#exp_emp_name").keypress(function () {
        $("#exp_emp_name").removeClass("preErrMsg");
        $("#exp_emp_name").parent().find(".prefErr").hide();
      });
      if ($("#exp_designation").val() == "") {
        $(".exp-desig").addClass("preErrMsg");
        $(".exp-desig").parent().find(".prefErr").show();
      }
      $("#exp_designation").change(function () {
        $(".exp-desig").removeClass("preErrMsg");
        $(".exp-desig").parent().find(".prefErr").hide();
      });
      if ($("input:radio[name=work_status]:checked").length == 0) {
        $("#working").addClass("preErrMsg");
        $("#relieved").addClass("preErrMsg");
        $(".wrkSts").parent().find(".prefErr").show();
      }
      $("input:radio[name=work_status]").change(function () {
        $("#working").removeClass("preErrMsg");
        $("#relieved").removeClass("preErrMsg");
        $(".wrkSts").parent().find(".prefErr").hide();
      });
      if ($("input:radio[name=work_status]:checked").val() == "Working") {
        if ($("#work_startdate").val() == "") {
          $(".workstart").addClass("preErrMsg");
          $(".workstart").parent().find(".prefErr").show();
        }
        $("#work_startdate").change(function () {
          $(".workstart").removeClass("preErrMsg");
          $(".workstart").parent().find(".prefErr").hide();
        });
      }
      if ($("input:radio[name=work_status]:checked").val() == "Relieved") {
        if ($("#relstartdate").val() == "") {
          $("#relstartdate").addClass("preErrMsg");
          $("#relstartdate").parent().find(".prefErr").show();
        }
        $("#relstartdate").change(function () {
          $("#relstartdate").removeClass("preErrMsg");
          $("#relstartdate").parent().find(".prefErr").hide();
        });
        if ($("#relenddate").val() == "") {
          $("#relenddate").addClass("preErrMsg");
          $("#relenddate").parent().find(".prefErr").show();
        }
        $("#relenddate").change(function () {
          $("#relenddate").removeClass("preErrMsg");
          $("#relenddate").parent().find(".prefErr").hide();
        });
        if ($("input:radio[name=uan_num]:checked").length == 0) {
          $("#uanYes").addClass("preErrMsg")
          $("#uanNo").addClass("preErrMsg")
          $("#uanYes").parents('.uanErr').find(".prefErr").show();
        }
        $("input:radio[name=uan_num]").change(()=>{
          $("#uanYes").removeClass("preErrMsg")
          $("#uanNo").removeClass("preErrMsg")
          $("#uanYes").parents('.uanErr').find(".prefErr").hide();
        })
        if ($("input:radio[name=uan_num]:checked").val() == "Yes") {
          if ($("#uan_number").val() == "") {
            $("#uan_number").addClass("preErrMsg");
            $("#uan_number").parent().find(".prefErr").show();
          }
          $("#uan_number").change(function () {
            $("#uan_number").removeClass("preErrMsg");
            $("#uan_number").parent().find(".prefErr").hide();
          });
          $("#uan_number").keypress(function () {
            $("#uan_number").removeClass("preErrMsg");
            $("#uan_number").parent().find(".prefErr").hide();
          });
        }
      }
    }
    
    //Education & Work-Exp check
    let eduSel = $("#select_edu").val(),
      eduField = $("#select_field").val(),
      eduYrComp = $("#year_completion").val(),
      eduCert = $("#eduCertificate").val(),
      workExp = $("input:radio[name=work_exp]:checked").val(),
      empName = $("#exp_emp_name").val(),
      designt = $("#exp_designation").val(),
      workSts = $("input:radio[name=work_status]:checked").val(),
      workStrDt = $("#work_startdate").val(),
      relStrdt = $("#relstartdate").val(),
      relEndDt = $("#relenddate").val(),
      uanNo = $("#uan_number").val();
    for (expCnt = 2; expCnt <= expcounter; expCnt++) {
      let exp_empName = $("#exp_emp_name" + expCnt).val();
      let exp_empDesig = $("#exp_designation" + expCnt).val();
      let exp_StrDt = $("#relstartdate" + expCnt).val();
      let exp_EndDt = $("#relenddate" + expCnt).val();
      if ($("#addExp" + expCnt).is(":visible", true)) {
        if (
          exp_empName != "" &&
          exp_empDesig != "" &&
          exp_StrDt != "" &&
          exp_EndDt != ""
        ) {
          let me = 1;
          me++;
        } else {
          notify('Some work experince fields are empty',"danger")
          return;
        }
      } else {
        return false;
      }
    }
    if (eduSel != "" && eduField != "" && eduYrComp != "" && eduCert != "") {
      if($('#select_edu').prop('selectedIndex')== 1){
        if($('#edu2').is(":visible",true) && $('#edu3').is(":visible",true) ){
          if($('#new_field2').val()!==""&&
          $('#new_edu_yr2').val()!==""&&
          $('#new_eduCert2').val()!==""&&
          $('#new_field3').val()!==""&&
          $('#new_edu_yr3').val()!==""&&
          $('#new_eduCert3').val()!==""){
            checkWrk()
          }
        }else{
          $('.eduInfo').show()
          notify('Some education details are missing',"danger")
        }
      }
      if($('#select_edu').prop('selectedIndex')== 2){
        if($('#edu2').is(":visible",true)){
          if($('#new_field2').val()!==""&&
          $('#new_edu_yr2').val()!==""&&
          $('#new_eduCert2').val()!==""){
            checkWrk()
          }
        }else{
          $('.eduInfo').show()
          notify('Some education details are missing',"danger")
        }
      }
      if($('#select_edu').prop('selectedIndex')== 3){
        checkWrk()
      }
      function checkWrk(){
        if (workExp == "Yes") {
          if (workSts == "Working") {
            if (workStrDt != "" && empName != "" && designt != "") {
              current_fs = $("#education-btn").parent();
              next_fs = $("#education-btn").parent().next();
              nextPage();
              nextPacman();
            }else{
              notify('Some work experince fields are empty',"danger")
            }
          } else if (workSts == "Relieved") {
            if (
              empName != "" &&
              designt != "" &&
              relStrdt != "" &&
              relEndDt != "" 
            ) {
              if ($("input:radio[name=uan_num]:checked").val() == "Yes"&& uanNo!=='') {
                current_fs = $("#education-btn").parent();
                next_fs = $("#education-btn").parent().next();
                nextPage();
                nextPacman();
  
              }else if($("input:radio[name=uan_num]:checked").val() == "No"){
                current_fs = $("#education-btn").parent();
                next_fs = $("#education-btn").parent().next();
                nextPage();
                nextPacman();
              }else{
                current_fs = $("#education-btn").parent();
                next_fs = $("#education-btn").parent().next();
                nextPage();
                nextPacman();
              }
            }else{
              notify('Some work experince fields are empty',"danger")
            }
          }
        } else if (workExp == "No") {
          current_fs = $("#education-btn").parent();
          next_fs = $("#education-btn").parent().next();
          nextPage();
          nextPacman();
        }

      }
    } else {
      notify('Some fields are empty',"danger")
    }
    $(".preErrMsg").filter(":first").focus();
    // current_fs = $("#education-btn").parent();
    // next_fs = $("#education-btn").parent().next();
    // nextPage();
    // nextPacman();
  });

  // Insurance and Medical Status
  function medLoop() {
    for (medCnt = 2; medCnt <= medcounter; medCnt++) {
      if ($("#insur_name" + medCnt).val() == "") {
        $("#insur_name" + medCnt).addClass("preErrMsg");
        $("#insur_name" + medCnt)
          .parent()
          .find(".prefErr")
          .show();
      }
      $("#insur_name" + medCnt).keypress(function () {
        $(this).removeClass("preErrMsg");
        $(this).parent().find(".prefErr").hide();
      });
      if ($("#insur_rel" + medCnt).val() == "") {
        $(".insurErr" + medCnt).addClass("preErrMsg");
        $(".insurErr" + medCnt)
          .parent()
          .find(".prefErr")
          .show();
      }
      $(".insurErr" + medCnt).change(function () {
        $(this).removeClass("preErrMsg");
        $(this).parent().find(".prefErr").hide();
      });
      if ($("#insur_dob" + medCnt).val() == "") {
        $("#insur_dob" + medCnt).addClass("preErrMsg");
        $("#insur_dob" + medCnt)
          .parent()
          .find(".prefErr")
          .show();
      }
      $("#insur_dob" + medCnt).change(function () {
        $(this).removeClass("preErrMsg");
        $(this).parent().find(".prefErr").hide();
      });
    }
  }
  $("#insurance-btn").click(function () {
    medLoop();
    $(".med_insur").each(function () {
      if ($(this).val() == "") {
        $(this).addClass("preErrMsg");
        $(this).parent(".field-div").find(".prefErr").show();
      }
      if ($(this).val() != "") {
        $(this).removeClass("preErrMsg");
        $(this).parent(".field-div").find(".prefErr").hide();
      }
      $(this).change(function () {
        $(this).removeClass("preErrMsg");
        $(this).parent(".field-div").find(".prefErr").hide();
      });
      $(this).keypress(function () {
        $(this).removeClass("preErrMsg");
        $(this).parent(".field-div").find(".prefErr").hide();
      });
    });
    if ($("#insur_rel").val() == "") {
      $(".insurErr").addClass("preErrMsg");
      $(".insurErr").parent().find(".prefErr").show();
    }
    $("#insur_rel").change(function () {
      $(".insurErr").removeClass("preErrMsg");
      $(".insurErr").parent().find(".prefErr").hide();
    });
    if ($("#cont_rel_1").val() == "") {
      $(".emgrCnt1").addClass("preErrMsg");
      $(".emgrCnt1").parent().find(".prefErr").show();
    }
    $("#cont_rel_1").change(function () {
      $(".emgrCnt1").removeClass("preErrMsg");
      $(".emgrCnt1").parent().find(".prefErr").hide();
    });
    if ($("#cont_rel_2").val() == "") {
      $(".emgrCnt2").addClass("preErrMsg");
      $(".emgrCnt2").parent().find(".prefErr").show();
    }
    if ($("#insur_bg").val() == "") {
      $(".blgErr").addClass("preErrMsg");
      $(".blgErr").parent().find(".prefErr").show();
    }
    $("#insur_bg").change(function () {
      $(".blgErr").removeClass("preErrMsg");
      $(".blgErr").parent().find(".prefErr").hide();
    });
    $("#cont_rel_2").change(function () {
      $(".emgrCnt2").removeClass("preErrMsg");
      $(".emgrCnt2").parent().find(".prefErr").hide();
    });
    if ($("input:radio[name=vac_sts]:checked").length == 0) {
      $(".dose").addClass("preErrMsg");
      $(".None").addClass("preErrMsg");
      $(".btn-group").parent(".vacc-div").find(".prefErr").show();
    }
    $("input:radio[name=vac_sts]").change(function () {
      $(".dose").removeClass("preErrMsg");
      $(".None").removeClass("preErrMsg");
      $("#dosedate_1").removeClass("preErrMsg");
      $("#dosedate_2").removeClass("preErrMsg");
      $("#dose_reason").removeClass("preErrMsg");
      $("#noDose").removeClass("preErrMsg");
      $(".vacupDoc").parent(".uploadDoc").removeClass("preErrMsg");
      $(".btn-group").parent(".vacc-div").find(".prefErr").hide();
      $("#dosedate_1").parent(".field-div").find(".prefErr").hide();
      $("#dosedate_2").parent(".field-div").find(".prefErr").hide();
      $("#dose_reason").parent(".field-div").find(".prefErr").hide();
      $("#noDose").parent(".field-div").find(".prefErr").hide();
    });
    if ($("input:radio[name=vac_sts]:checked").val() == "1Dose") {
      if ($("#dosedate_1").val() == "") {
        $("#dosedate_1").addClass("preErrMsg");
        $("#dosedate_1").parent(".field-div").find(".prefErr").show();
      }
      if ($("#dose_reason").val() == "") {
        $("#dose_reason").addClass("preErrMsg");
        $("#dose_reason").parent(".field-div").find(".prefErr").show();
      }
      if ($(".vacupDoc").val() == "") {
        $(".vacupDoc").parent(".uploadDoc").find(".prefErr").show();
      }
      $("#dosedate_1").change(function () {
        $("#dosedate_1").removeClass("preErrMsg");
        $("#dosedate_1").parent(".field-div").find(".prefErr").hide();
      });
      $("#dose_reason").change(function () {
        $("#dose_reason").removeClass("preErrMsg");
        $("#dose_reason").parent(".field-div").find(".prefErr").hide();
      });
      $("#dose_reason").keypress(function () {
        $("#dose_reason").removeClass("preErrMsg");
        $("#dose_reason").parent(".field-div").find(".prefErr").hide();
      });
      $("#dosedate_2").removeClass("preErrMsg");
      $("#noDose").removeClass("preErrMsg");
    }
    if ($("input:radio[name=vac_sts]:checked").val() == "2Doses") {
      if ($("#dosedate_1").val() == "") {
        $("#dosedate_1").addClass("preErrMsg");
        $("#dosedate_1").parent(".field-div").find(".prefErr").show();
      }
      if ($("#dosedate_2").val() == "") {
        $("#dosedate_2").addClass("preErrMsg");
        $("#dosedate_2").parent(".field-div").find(".prefErr").show();
      }
      if ($(".vacupDoc").val() == "") {
        $(".vacupDoc").parent(".uploadDoc").addClass(".preErrMsg");
      }
      $("#dosedate_1").change(function () {
        $("#dosedate_1").removeClass("preErrMsg");
        $("#dosedate_1").parent(".field-div").find(".prefErr").hide();
      });
      $("#dosedate_2").change(function () {
        $("#dosedate_2").removeClass("preErrMsg");
        $("#dosedate_2").parent(".field-div").find(".prefErr").hide();
      });
      $("#dose_reason").removeClass("preErrMsg");
    }
    if ($("input:radio[name=vac_sts]:checked").val() == "noDose") {
      if ($("#noDose").val() == "") {
        $("#noDose").addClass("preErrMsg");
        $("#noDose").parent(".field-div").find(".prefErr").show();
      }
      $("#noDose").change(function () {
        $("#noDose").removeClass("preErrMsg");
        $("#noDose").parent(".field-div").find(".prefErr").hide();
      });
      $("#dosedate_1").removeClass("preErrMsg");
      $("#dosedate_2").removeClass("preErrMsg");
      $("#dose_reason").removeClass("preErrMsg");
    }
    // Vaccine Certificate Upload
    if ($(".vacupDoc").val() == "") {
      $(".vacupDoc").parent(".uploadDoc").addClass("preErrMsg");
    }
    // Emergency Details
    $(".emgr_cont").each(function () {
      if ($(this).val() == "") {
        $(this).addClass("preErrMsg");
        $(this).parent(".field-div").find(".prefErr").show();
      }
      if ($(this).val() != "") {
        $(this).removeClass("preErrMsg");
        $(this).parent(".field-div").find(".prefErr").hide();
      }
      $(this).change(function () {
        $(this).removeClass("preErrMsg");
        $(this).parent(".field-div").find(".prefErr").hide();
      });
      $(this).keypress(function () {
        $(this).removeClass("preErrMsg");
        $(this).parent(".field-div").find(".prefErr").hide();
      });
    });

    let insurName = $("#insur_name").val(),
      insurRel = $("#insur_rel").val(),
      insurRel2 = $("#insur_rel2").val(),
      insurRel3 = $("#insur_rel3").val(),
      insurRel4 = $("#insur_rel4").val(),
      insurRel5 = $("#insur_rel5").val(),
      insurDob = $("#insur_dob").val(),
      insurBg = $("#insur_bg").val(),
      insurVccSts = $("input:radio[name=vac_sts]:checked").val(),
      insurVacDoc = $(".vacupDoc").val(),
      doseRes = $("#dose_reason").val(),
      doseDt1 = $("#dosedate_1").val(),
      doseDt2 = $("#dosedate_2").val(),
      noDose = $("#noDose").val(),
      EmrName1 = $("#cont_pers_1").val(),
      EmrName2 = $("#cont_pers_2").val(),
      EmrRel1 = $("#cont_rel_1").val(),
      EmrRel2 = $("#cont_rel_2").val(),
      EmrCnt1 = $("#cont_no_1").val(),
      EmrCnt2 = $("#cont_no_2").val();
    for (medCnt = 2; medCnt <= medcounter; medCnt++) {
      let insurName = $("#insur_name" + medCnt).val();
      let insurRel = $("#insur_rel" + medCnt).val();
      let insurDob = $("#insur_dob" + medCnt).val();
      if ($("#medical" + medCnt).is(":visible", true)) {
        if (insurName != "" && insurRel != "" && insurDob != "") {
          let me = 1;
          me++;
        } else {
          notify('Some fields are empty',"danger")
          return;
        }
      } else {
        return false;
      }
    }
    if (
      insurName != "" &&
      insurRel != "" &&
      insurDob != "" &&
      insurBg != "" &&
      EmrName1 != "" &&
      EmrName2 != "" &&
      EmrRel1 != "" &&
      EmrRel2 != "" &&
      EmrCnt1 != "" &&
      EmrCnt2 != ""
    ) {
      if (insurVccSts == "1Dose") {
        if (doseDt1 != "" && doseRes != "" && insurVacDoc != "") {
          current_fs = $("#insurance-btn").parent();
          next_fs = $("#insurance-btn").parent().next();
          nextPage();
          nextPacman();
        }
      } else if (insurVccSts == "2Doses") {
        if (doseDt1 != "" && doseDt2 != "" && insurVacDoc != "") {
          current_fs = $("#insurance-btn").parent();
          next_fs = $("#insurance-btn").parent().next();
          nextPage();
          nextPacman();
        }
      } else if (insurVccSts == "noDose") {
        if (noDose != "") {
          current_fs = $("#insurance-btn").parent();
          next_fs = $("#insurance-btn").parent().next();
          nextPage();
          nextPacman();
        }else{
          notify('Some fields are empty',"danger")
        }
      }
    } else {
      notify('Some fields are empty',"danger")
    }
    $(".preErrMsg").filter(":first").focus();
    // current_fs = $("#insurance-btn").parent();
    // next_fs = $("#insurance-btn").parent().next();
    // nextPage();
    // nextPacman();
  });
  $("#dose1").click(function () {
    $("#dosedate_2").val(null);
    $("#noDose").val(null);
  });
  $("#dose2").click(function () {
    $("#dose_reason").val(null);
    $("#noDose").val(null);
  });
  $("#none").click(function () {
    $("#dosedate_1").val(null);
    $("#dosedate_2").val(null);
    $("#dose_reason").val(null);
    $(".vacupDoc").val(null);
    $(".vaac_cert .choose-file-button").html("Upload from Desktop</span>");
  });
  $(".driveChk").hide();
  $(".voterChk").hide();
  $(".preBnkChk").show();
  // Preview Data
  $("#preview-btn").click(function () {
    var accessories = $(".accessory:checked")
      .map(function () {
        return this.value;
      })
      .get();
    var books = $(".select_books:checked")
      .map(function () {
        return this.value;
      })
      .get();
    var preBooks = books.toString();
    var preAccess = accessories.toString();
    var shirt = $("input:radio[name=tshirt]:checked").val();
    var shirtSiz = $("#tshirt_size_1").val();
    var shirts = shirt + "," + shirtSiz;
    // Basic Details
    $("#preFname").text($("#first_name").val());
    $("#preLname").text($("#last_name").val());
    $("#preDob").text($("#dob").val());
    $("#preNationality").text($(".nationality .filter-option").text());
    $("#preGender").text($("input:radio[name=gender]:checked").val());
    $("#preMobileNo").text($("#contact").val());
    $("#prePersMail").text($("#personalemailid").val());
    $("#preMaritalSts").text(
      $("input:radio[name=marital_status]:checked").val()
    );
    if ($("input:radio[name=marital_status]:checked").val() == "Married") {
      $(".annv-content").show();
      $("#preAnnvDate").text($("#anniversary_date").val());
    } else {
      $(".annv-content").hide();
    }
    $("#preLnkd").text($("#linkedin_profile").val());
    //  Communation Address
    $("#preComPin").text($("#pincode-val").val());
    $("#preComCountry").text($(".country-val .filter-option").text());
    $("#preComState").text($("#state-val").val());
    $("#preComDist").text($("#taluk-val").val());
    $("#preComCity").text($("#city-val").val());
    $("#preComArea").text($("#area-val").val());
    $("#preComSTr").text($("#building-val").val());
    $("#preComDoor").text($("#block-val").val());
    //  Permanant Address
    $("#prePerPin").text($("#pincode-get").val());
    $("#prePerCountry").text($(".country-get .filter-option").text());
    $("#prePerState").text($("#state-get").val());
    $("#prePerDist").text($("#taluk-get").val());
    $("#prePerCity").text($("#city-get").val());
    $("#prePerArea").text($("#area-get").val());
    $("#prePerSTr").text($("#building-get").val());
    $("#prePerDoor").text($("#block-get").val());
    //  Bank Details
    if ($("#newAcc").is(":checked")) {
      $(".preBnkChk").show();
      $(".preBnk").hide();
    } else {
      $(".preBnk").show();
      $("#preBnkperName").text($("#acc_name").val());
      $("#preBnkNum").text($("#acc_number").val());
      $("#preIfscNum").text($("#ifsc_code").val());
      $("#preBnkName").text($("#bank_name").val());
      $("#preBnkBranch").text($("#bank_branch").val());
    }
    //  Preference & Accessories
    $("#preOffMail").text($("#prefermail_id").val() + "@m2pfintech.com");
    $("#preDoj").text($("#joining_date").val());
    $("#preLaptp").text($("input:radio[name=laptop]:checked").val());
    $("#preAcces").text(preAccess);
    $("#preBag").text($("input:radio[name=Briefcase]:checked").val());
    $("#preBottle").text($("input:radio[name=bottle]:checked").val());
    $("#preTshirt").text(shirts);
    $("#preBooks").text(preBooks);
    $("#prepreScrib").text($("input:radio [name=notebook]:checked").val());
    // Upload Documents
    $("#prePanNum").text($("#pan_num").val());
    $("#preAadNum").text($("#aadhar_num").val());
    // Address Proof
    if ($("#aadharcheck").is(":checked")) {
      $(".driveChk").hide();
      $(".voterChk").hide();
    }

    var add_proof = $("input:radio[name=add_proof]:checked").val();
    if ($("#aadharcheck").is(":checked") == false) {
      if (add_proof == "driving") {
        $("#preLiceNo").text($("#drive_num").val());
        $(".driveChk").show();
        $(".voterChk").hide();
        $(".aadChk").hide();
      } else {
        $("#preVoterNo").text($("#voter_num").val());
        $(".driveChk").hide();
        $(".voterChk").show();
        $(".aadChk").hide();
      }
    }
    // Passport Details
    if (
      $("#pass_num").val() != "" &&
      $("#pass_expdate").val() != "" &&
      $(".passUp").val() != ""
    ) {
      $(".prePass-content").show();
      $("#prePassNum").text($("#pass_num").val());
      $("#prePassExp").text($("#pass_expdate").val());
      // $("#prePassFrnt").text($(".passUp").val());
    } else {
      $(".prePass-content").hide();
    }
    // Education Details
    $("#preEdu").text($("#select_edu").val());
    $("#preField").text($("#select_field").val());
    $("#preYrComp").text($("#year_completion").val());
    // Certification
    if (
      $(".certYr").val() != "" &&
      $("#certEdu").val() != "" &&
      $("#certField").val() != "" &&
      $("#certificateDoc").val() != ""
    ) {
      $(".preCert-content").show();
      $("#preCertEdu").text($(".certEdu").val());
      $("#preCertField").text($(".certField").val());
      $("#preCertYr").text($(".certYr").val());
    } else {
      $(".preCert-content").hide();
    }
    if($('#select_edu').prop('selectedIndex')== 2){
      console.log('edu2');
      $('#preViewedu2').show()
      $('#preEdu2').text($('#new_edu2').val())
      $('#preField2').text($('#new_field2').val())
      $('#preYrComp2').text($('#new_edu_yr2').val())
      $('#preViewedu3').hide()
    }
    if($('#select_edu').prop('selectedIndex')== 1){
      console.log('edu3');
      $('#preViewedu2').show()
      $('#preEdu2').text($('#new_edu2').val())
      $('#preField2').text($('#new_field2').val())
      $('#preYrComp2').text($('#new_edu_yr2').val())
      $('#preViewedu3').show()
      $('#preEdu3').text($('#new_edu3').val())
      $('#preField3').text($('#new_field3').val())
      $('#preYrComp3').text($('#new_edu_yr3').val())
    }
    if($('#select_edu').prop('selectedIndex')== 1){
      $('#preViewedu2').hide()
      $('#preViewedu3').hide()
    }
    let panImg = $("#panPic").val();
    let casualImg = $("#upPic").val();
    let addhFrntImg = $("#aadharFrnt").val();
    let addhBckImg = $("#aadharBck").val();
    let liceFrnt = $(".liceFrnt").val();
    let liceBck = $(".liceBck").val();
    let voterFrnt = $(".voterFrnt").val();
    let voterBck = $(".voterBck").val();
    let passFrnt = $(".passUp").val();
    let EduCertificateimg = $("#eduCertificate").val();
    let EduCertificateimg2 = $("#new_eduCert2").val();
    let EduCertificateimg3 = $("#new_eduCert3").val();
    let certification = $("#certificateDoc").val();

    let casualSrc = $("#casual_pic").attr("src");
    let panSrc = $("#pan_img").attr("src");
    let votBckSrc = $("#voterBck_img").attr("src");
    let votFrntSrc = $("#voterFrnt_img").attr("src");
    let passImgSrc = $("#passport_img").attr("src");
    let licFrntSrc = $("#licFrnt_img").attr("src");
    let licBckSrc = $("#licBck_img").attr("src");
    let aadhFrntSrc = $("#aadhFrnt_img").attr("src");
    let aadhBckSrc = $("#aadhBck_img").attr("src");
    let preview_educerticateimg = $("#educertificate_img").attr("src");
    let preview_educerticateimg2 = $("#educertificate_img2").attr("src");
    let preview_educerticateimg3 = $("#educertificate_img3").attr("src");
    let certificationSrc = $("#certification_img").attr("src");
   
    if (panImg == null) {
      $("#prePanPic .preview_img_modal").attr(
        "src",
        "./assets/portalAsset/images/casualPic.png"
      );
    } else {
      $("#prePanPic .preview_img_modal").attr("src", panSrc);
    }
    if (casualImg == null) {
      $("#preCasPic .preview_img_modal").attr(
        "src",
        "./assets/portalAsset/images/casualPic.png"
      );
    } else {
      $("#preCasPic .preview_img_modal").attr("src", casualSrc);
    }
    if (addhFrntImg == null) {
      $("#preAadFrnt .preview_img_modal").attr(
        "src",
        "./assets/portalAsset/images/casualPic.png"
      );
    } else {
      $("#preAadFrnt .preview_img_modal").attr("src", aadhFrntSrc);
    }
    if (addhBckImg == null) {
      $("#preAadBck .preview_img_modal").attr(
        "src",
        "./assets/portalAsset/images/casualPic.png"
      );
    } else {
      $("#preAadBck .preview_img_modal").attr("src", aadhBckSrc);
    }
    if (liceFrnt == null) {
      $("#preLiceFrnt .preview_img_modal").attr(
        "src",
        "./assets/portalAsset/images/casualPic.png"
      );
    } else {
      $("#preLiceFrnt .preview_img_modal").attr("src", licFrntSrc);
    }
    if (liceFrnt == null) {
      $("#preLiceFrnt .preview_img_modal").attr(
        "src",
        "./assets/portalAsset/images/casualPic.png"
      );
    } else {
      $("#preLiceFrnt .preview_img_modal").attr("src", licFrntSrc);
    }
    if (liceBck == null) {
      $("#preLiceBck .preview_img_modal").attr(
        "src",
        "./assets/portalAsset/images/casualPic.png"
      );
    } else {
      $("#preLiceBck .preview_img_modal").attr("src", licBckSrc);
    }
    if (voterFrnt == null) {
      $("#preVoterFrnt .preview_img_modal").attr(
        "src",
        "./assets/portalAsset/images/casualPic.png"
      );
    } else {
      $("#preVoterFrnt .preview_img_modal").attr("src", votFrntSrc);
    }
    if (voterBck == null) {
      $("#preVoterBck .preview_img_modal").attr(
        "src",
        "./assets/portalAsset/images/casualPic.png"
      );
    } else {
      $("#preVoterBck .preview_img_modal").attr("src", votBckSrc);
    }
    if (passFrnt == null) {
      $("#prePassFrnt .preview_img_modal").attr(
        "src",
        "./assets/portalAsset/images/casualPic.png"
      );
    } else {
      $("#prePassFrnt .preview_img_modal").attr("src", passImgSrc);
    }
    if (EduCertificateimg == null) {
      $("#preEduCert .preview_img_modal").attr(
        "src",
        "./assets/portalAsset/images/casualPic.png"
      );
    } else {
      $("#preEduCert .preview_img_modal").attr("src", preview_educerticateimg);
    }
    if (EduCertificateimg2 == null) {
      $("#preEduCert2 .preview_img_modal").attr(
        "src",
        "./assets/portalAsset/images/casualPic.png"
      );
    } else {
      $("#preEduCert2 .preview_img_modal").attr("src", preview_educerticateimg2);
    }
    if (EduCertificateimg3 == null) {
      $("#preEduCert3 .preview_img_modal").attr(
        "src",
        "./assets/portalAsset/images/casualPic.png"
      );
    } else {
      $("#preEduCert3 .preview_img_modal").attr("src", preview_educerticateimg3);
    }
    if (certification == null) {
      $("#preCertUp .preview_img_modal").attr(
        "src",
        "./assets/portalAsset/images/casualPic.png"
      );
    } else {
      $("#preCertUp .preview_img_modal").attr("src", certificationSrc);
    }
    // Work Experience
    $("#preWrkExp").text($("input:radio[name=work_exp]:checked").val());
    if ($("input:radio[name=work_exp]:checked").val() === "Yes") {
      $('.wrkExpSts').hide()
      if ($("input:radio[name=work_status]:checked").val() === "Working") {
        $('.expWorking').show()
        $('#preWrkSts').text($("input:radio[name=work_status]:checked").val())
        $('#preWrkEmpName').text($("#exp_emp_name").val())
        $('#preWrkPost').text($("#exp_designation").val())
        $('#preWrkDoj').text($("#work_startdate").val())
      }
      if($("input:radio[name=work_status]:checked").val()==='Relieved'){
        if($('#relivDoc').val()!==''){
          $('.preViewRelDoc').show()
          let relievDoc = $("#relivDoc").val();
          let relievDocSrc = $("#relivDoc_img").attr("src");
          if (relievDoc == null) {
            $('.preViewRelDoc').show()
          } else {
            $("#preRelDoc .preview_img_modal").attr("src", relievDocSrc);
          }
        }else{
          $('.preViewRelDoc').hide()
        }
        if($("input:radio[name=uan_num]:checked").val() === "Yes"){
          $('.uanNum').show()
          $('#preRelUan').text($("#uan_number").val())
        }else{
          $('.uanNum').hide()
        }
        $('.expWorking').hide()
        $('.expRelieved').show()
        $('#preRelSts').text($("input:radio[name=work_status]:checked").val())
        $('#preRelEmpName').text($("#exp_emp_name").val())
        $('#preRelPost').text($("#exp_designation").val())
        $('#preRelDoj').text($('#relstartdate').val())
        $('#preRelDoR').text($('#relenddate').val())
        $('#preRelExp').text($('#calculate-date').text())
        for(i=1;i<$('.preClone').length;i++){
          addExp()
          console.log(i);
          console.log($("#exp_emp_name"+i+1).val());
          $('#preRelEmpName'+i).text($("#exp_emp_name"+(i+1)).val())
          $('#preRelPost'+i).text($("#exp_designation"+(i+1)).val())
          $('#preRelDoj'+i).text($('#relstartdate'+(i+1)).val())
          $('#preRelDoR'+i).text($('#relenddate'+(i+1)).val())
          $('#preRelExp'+i).text($('#calculate-date'+(i+1)).text())
          function addExp() {
            if(allowClone){
              preExpcounter++;
              let packing = $(".preNewExp");
              let clone = packing.clone();
              clone.appendTo(".cloneNewExp");
              clone.attr("class", "preNewExp" + preExpcounter);
              clone.find("h4").text("Experence-"+(preExpcounter+1));
              clone.find("#preRelEmpName").attr("id","preRelEmpName" + preExpcounter);
              clone.find("#preRelPost").attr("id", "preRelPost" + preExpcounter);
              clone.find("#preRelDoj").attr("id", "preRelDoj" + preExpcounter);
              clone.find("#preRelDoR").attr("id", "preRelDoR" + preExpcounter);
              clone.find("#preRelExp").attr("id", "preRelExp" + preExpcounter);
              clone.show();
            }
          }
        }
      }
    }
    // Insurance Details
    $("#preInsurName").text($("#insur_name").val());
    $("#preInsurRel").text($("#insur_rel").val());
    $("#preInsurDob").text($("#insur_dob").val());
    // Medical Status
    $("#preBg").text($("#insur_bg").val());
    $("#preVaccSts").text($("input:radio[name=vac_sts]:checked").val());
    // $("#preVaccCert").text($(".vacupDoc").val());
    // Emergency Contact
    $("#preEmrName1").text($("#cont_pers_1").val());
    $("#preEmrRel1").text($("#cont_rel_1").val());
    $("#preEmrCnt1").text($("#cont_no_1").val());
    $("#preEmrName2").text($("#cont_pers_2").val());
    $("#preEmrRel2").text($("#cont_rel_2").val());
    $("#preEmrCnt2").text($("#cont_no_2").val());
    for(i=1;i<$('.preMedClone').length;i++){
      console.log('inside loop');
      addMed()
      $('#preInsurName'+i).text($("#insur_name"+(i+1)).val())
      $('#preInsurRel'+i).text($("#insur_rel"+(i+1)).val())
      $('#preInsurDob'+i).text($('#insur_dob'+(i+1)).val())
      function addMed() {
        if(allowClone){
          preMedcounter++;
          let packing = $(".preMedInsur");
          let clone = packing.clone();
          clone.appendTo(".cloneNewInsur");
          clone.attr("class", "preMedInsur" + preMedcounter);
          clone.find("h4").text("Nominee-"+(preMedcounter+1));
          clone.find("#preInsurName").attr("id", "preInsurName" + preMedcounter);
          clone.find("#preInsurRel").attr("id", "preInsurRel" + preMedcounter);
          clone.find("#preInsurDob").attr("id", "preInsurDob" + preMedcounter);
          clone.show();
        }
      }
    }
    if($("input:radio[name=vac_sts]:checked").val()==="1Dose"){
      $('.vaccDose1').show()
      $('#preDoseDate1').text($('#dosedate_1').val())
      $('#preReason').text($('#dose_reason').val())
    }else{
      $('.vaccDose1').hide()
    }
    if($("input:radio[name=vac_sts]:checked").val()==="2Doses"){
      $('.vaccDose2').show()
      $('#pre2DoseDate1').text($('#dosedate_1').val())
      $('#pre2DoseDate2').text($('#dosedate_2').val())
      $('.vaccCerti').show()
      let vaccupDoc = $(".vacupDoc").val()
      let vaccupDocSrc = $("#vaccupDoc_img").attr("src");
      if (vaccupDoc == null) {
        $('.preViewRelDoc').hide()
      } else {
        $("#preVaccCert .preview_img_modal").attr("src", vaccupDocSrc);
      }
    }else{
      $('.vaccDose2').hide()
    }
    if($("input:radio[name=vac_sts]:checked").val()==="noDose"){
      $('.vaccDose1').hide()
      $('.vaccDose2').hide()
      $('.vaccCerti').hide()
      $('.vaccNodose').show()
      $('#preNoReason').text($('#noDose').val())
    }else{
      $('.vaccNodose').hide()
    }
  });
  // TimePass Section
  $("#submit").click(function () {
    $(".tp_input").each(function () {
      if ($(this).val() == "") {
        $(this).addClass("preErrMsg");
        $(this).parent(".field-div").find(".prefErr").show();
      }
      if ($(this).val() != "") {
        $(this).removeClass("preErrMsg");
        $(this).parent(".field-div").find(".prefErr").hide();
      }
      $(this).change(function () {
        $(this).removeClass("preErrMsg");
        $(this).parent(".field-div").find(".prefErr").hide();
      });
      $(this).keypress(function () {
        $(this).removeClass("preErrMsg");
        $(this).parent(".field-div").find(".prefErr").hide();
      });
    });
    $(".preErrMsg").filter(":first").focus();
  });

  //save detail Button
  $("#SaveDtl_msg .close").click(function(){
    $("#SaveDtl_msg").hide();
  })
  $("#educErr .close").click(function(){
    $("#educErr").hide();
  })
  // $("#SaveDtl").click(function (e) {
  //   e.preventDefault();
  //   saveSec5();
  //   function saveSec5() {
  //     var basicDetails = {
  //       Personal_Details: {
  //         FirstName: $("#first_name").val(),
  //         LastName: $("#last_name").val(),
  //         Dob: $("#dob").val(),
  //         Gender: $("input:radio[name=gender]:checked").val(),
  //         Nationality: $(".nationality .filter-option").text(),
  //         PersonalmailID: $("#personalemailid").val(),
  //         Contact: $("#contact").val(),
  //         LinkedProfile: $("#linkedin_profile").val(),
  //       },
  //       Communication_Address: {
  //         Pincode: $("#pincode-val").val(),
  //         Country: $(".country-val .filter-option").text(),
  //         State: $("#state-val").val(),
  //         TalukDistrict: $("#taluk-val").val(),
  //         City: $("#city-val").val(),
  //         AreaLocality: $("#area-val").val(),
  //         Premesis_Building: $("#building-val").val(),
  //         Block_Flat: $("#block-val").val(),
  //       },
  //       Permanant_Address: {},
  //     };
  //     if ($("#alter_contact").val() != "") {
  //       basicDetails.Personal_Details.AlterContact = $("#alter_contact").val();
  //     }
  //     if ($("input:radio[name=marital_status]:checked").val() == "Married") {
  //       basicDetails.Personal_Details.MaritalStatus = "Married";
  //       basicDetails.Personal_Details.AnniversaryDate =
  //         $("#anniversary_date").val();
  //     } else {
  //       basicDetails.Personal_Details.MaritalStatus = "Single";
  //     }
  //     if ($("#permanant-address").is("checked")) {
  //       basicDetails.Permanant_Address = basicDetails.Communication_Address;
  //     } else {
  //       basicDetails.Permanant_Address = {
  //         Pincode: $("#pincode-get").val(),
  //         Country: $(".country-get .filter-option").text(),
  //         State: $("#state-get").val(),
  //         TalukDistrict: $("#taluk-get").val(),
  //         City: $("#city-get").val(),
  //         AreaLocality: $("#area-get").val(),
  //         Premesis_Building: $("#building-get").val(),
  //         Block_Flat: $("#block-get").val(),
  //       };
  //     }
  //     if ($("#newAcc").is(":checked")) {
  //       basicDetails.BankDetails = "Create New salary Account";
  //     } else {
  //       basicDetails.Bank_Details = {
  //         BankAccountName: $("#acc_name").val(),
  //         AccountNumber: $("#acc_number").val(),
  //         IFSCcode: $("#ifsc_code").val(),
  //         BankName: $("#bank_name").val(),
  //         BankBranch: $("#bank_branch").val(),
  //       };
  //     }
  //     var accessories = $(".accessory:checked")
  //       .map(function () {
  //         return this.value;
  //       })
  //       .get();
  //     var books = $(".select_books:checked")
  //       .map(function () {
  //         return this.value;
  //       })
  //       .get();
  //     var preference = {
  //       MailID: $("#prefermail_id").val() + "@m2pfintech.com",
  //       JoiningDate: $("#joining_date").val(),
  //       Laptop: $("input:radio[name=laptop]:checked").val(),
  //       Accessories: [accessories],
  //       Bag: $("input:radio[name=Briefcase]:checked").val(),
  //       Bottle: $("input:radio[name=bottle]:checked").val(),
  //       Tshirt:
  //         $("input:radio[name=tshirt]:checked").val() +
  //         ":" +
  //         $("#tshirt_size_1").val(),
        
  //       Books: [books],
  //       NoteBook: $("input:radio[name=notebook]:checked").val(),
  //     };
  //     var documents = {
  //       CasualPic1: $("#upPic").val(),
  //       // CasualPic2: $("#upPicNew").val(),
  //       PanNo: $("#pan_num").val(),
  //       Panpic: $("#panPic").val(),
  //       AadharNo: $("#aadhar_num").val(),
  //       AadharFrontside: $("#aadharFrnt").val(),
  //       AadharBackside: $("#aadharBck").val(),
  //       AddressProof: '',
  //       AddressProofID: {},
  //       Passport:{}
  //     };
  //     if ($("#upPicNew").val() != "") {
  //       documents.CasualPic2 = $("#upPicNew").val();
  //     } 
  //     if ($("#aadharcheck").is(":checked")) {
  //       documents.AddressProof = "Same as in Aadhar Card";
  //     }
  //     var add_proof = $("input:radio[name=add_proof]:checked").val();
  //     if ($("#aadharcheck").is(":checked") == false) {
  //       if (add_proof == "driving") {
  //         documents.AddressProofID = {
  //           Backside: $(".liceBck").val(),
  //           Frontside: $(".liceFrnt").val(),
  //           IDProof: "Driving License",
  //           Number: $("#drive_num").val().toString(),
  //         };
  //       } else {
  //         documents.AddressProofID = {
  //           Backside: $(".voterBck").val(),
  //           Frontside: $(".voterFrnt").val(),
  //           IDProof: "Voter ID",
  //           Number: $("#voter_num").val().toString(),
  //         };
  //       }
  //     }
  //     if (
  //       $("#pass_num").val() != "" &&
  //       $("#pass_expdate").val() != "" &&
  //       $(".passUp").val() != ""
  //     ) {
  //       documents.Passport.PassportNo = $("#pass_num").val();
  //       documents.Passport.PassportExpDate = $("#pass_expdate").val();
  //       documents.Passport.PassportDoc = $(".passUp").val();
  //     }
  //     var newEdu = [];
  //     var workExpNew = [];
  //     let uanSts = $("input:radio[name=uan_num]:checked").val()
  //     var educ = {
  //       Education: $("#select_edu").val(),
  //       FieldofStudy: $("#select_field").val(),
  //       YearofCompletion: $("#year_completion").val(),
  //       EduCertificate: $("#eduCertificate").val(),
  //     };
  //     newEdu.push(educ);
  //     for (eduCnt = 2; eduCnt <= 3; eduCnt++) {
  //       let edu = $("#edu" + eduCnt)
  //         .find("#new_edu" + eduCnt)
  //         .val();
  //       let field = $("#edu" + eduCnt)
  //         .find("#new_field" + eduCnt)
  //         .val();
  //       let year_new = $("#edu" + eduCnt)
  //         .find("#new_edu_yr" + eduCnt)
  //         .val();
  //       let certi = $("#edu" + eduCnt)
  //         .find("#new_eduCert" + eduCnt)
  //         .val();
  //       var eduObj = {};
  //       if(edu!==''){
  //         eduObj["Education"] = edu;
  //       }
  //       if(field!==''){
  //         eduObj["FieldofStudy"] = field;
  //       }
  //       if(year_new!==''){
  //         eduObj["YearofCompletion"] = year_new;
  //       }
  //       if(certi){
  //         eduObj["EduCertificate"] = certi;
  //       }
  //       newEdu.push(eduObj);
  //     }
  //     var eduWorkExp = {
  //       Education: newEdu,
  //     };
  //     if (
  //       $(".certYr").val() != "" &&
  //       $("#certEdu").val() != "" &&
  //       $("#certField").val() != "" &&
  //       $("#certificateDoc").val() != ""
  //     ) {
  //       eduWorkExp.Certification.YearofCompletion = $(".certYr").val();
  //       eduWorkExp.Certification.Education = $("#certEdu").val();
  //       eduWorkExp.Certification.FieldofStudy = $("#certField").val();
  //       eduWorkExp.Certification.Certificate = $("#certificateDoc").val();
  //     }
  //     var experience = $("input:radio[name=work_exp]:checked").val();
  //     var work_status = $("input:radio[name=work_status]:checked").val();
  //     if (experience == "Yes") {
  //       eduWorkExp.WorkStatus = {};
  //       eduWorkExp.Work_Status = {};
  //       if (work_status == "Relieved") {
  //         eduWorkExp.Work_Status = workExpNew;
  //         var expRel = {
  //           Status: $("input:radio[name=work_status]:checked").val(),
  //           EmployeeName: $("#exp_emp_name").val(),
  //           Position: $("#exp_designation").val(),
  //           DateofJoin: $(".rel_work_start").val(),
  //           DateofRelieve: $(".rel_work_end").val(),
  //           Relieving_letter: $("#relivDoc").val(),
  //           TotalExperience: $("#calculate-date").text(),
  //         };
  //         if(uanSts==="Yes"){
  //           expRel.UAN_number = $("#uan_number").val()
  //         }else{
  //           expRel.UAN_number = "Need to create new UAN number"
  //         }
  //         workExpNew.push(expRel);
  //       } else {
  //         eduWorkExp.WorkStatus = {
  //           Status: $("input:radio[name=work_status]:checked").val(),
  //           EmployeeName: $("#exp_emp_name").val(),
  //           Position: $("#exp_designation").val(),
  //           DateofJoin: $("#work_startdate").val(),
  //         };
  //       }
  //     } else {
  //       eduWorkExp.Experience = "Fresher";
  //     }
  //     for (expCnt = 2; expCnt <= expcounter; expCnt++) {
  //       let exp_empName = $("#addExp" + expCnt)
  //         .find("#exp_emp_name" + expCnt)
  //         .val();
  //       let exp_empDesig = $("#addExp" + expCnt)
  //         .find("#exp_designation" + expCnt)
  //         .val();
  //       let exp_StrDt = $("#addExp" + expCnt)
  //         .find("#relstartdate" + expCnt)
  //         .val();
  //       let exp_EndDt = $("#addExp" + expCnt)
  //         .find("#relenddate" + expCnt)
  //         .val();
  //       let experience = $("#calculate-date" + expCnt).text();
  //       exp = {};
  //       exp["EmployeeName"] = exp_empName;
  //       exp["Position"] = exp_empDesig;
  //       exp["DateofJoin"] = exp_StrDt;
  //       exp["DateofRelieve"] = exp_EndDt;
  //       exp["TotalExperience"] = experience;
  //       workExpNew.push(exp);
  //     }
  //     var insurNew = [];
  //     var insurDet = {
  //       Name: $("#insur_name").val(),
  //       Relationship: $("#insur_rel").val(),
  //       DoB: $("#insur_dob").val(),
  //     };
  //     var medicalInsurDetails = {
  //       InsuranceDetails: insurNew,
  //       MedicalStatus: {
  //         BloodGrp: $("#insur_bg").val(),
  //       },
  //       EmrgncyCntDtls: {
  //         ContactPers_1: $("#cont_pers_1").val(),
  //         Relationship_1: $("#cont_rel_1").val(),
  //         ContactNo_1: $("#cont_no_1").val(),
  //         ContactPers_2: $("#cont_pers_2").val(),
  //         Relationship_2: $("#cont_rel_2").val(),
  //         ContactNo_2: $("#cont_no_2").val(),
  //       },
  //     };
  //     insurNew.push(insurDet);
  //     for (medCnt = 2; medCnt <= medcounter; medCnt++) {
  //       let insurName = $("#medical" + medCnt)
  //         .find("#insur_name" + medCnt)
  //         .val();
  //       let insurRel = $("#medical" + medCnt)
  //         .find("#insur_rel" + medCnt)
  //         .val();
  //       let insurDob = $("#medical" + medCnt)
  //         .find("#insur_dob" + medCnt)
  //         .val();
  //       med = {};
  //       med["Name"] = insurName;
  //       med["Relationship"] = insurRel;
  //       med["Dob"] = insurDob;
  //       insurNew.push(med);
  //     }
  //     var vac_status = $("input:radio[name=vac_sts]:checked").val();
  //     if (vac_status == "noDose") {
  //       medicalInsurDetails.MedicalStatus.VaccinationStatus =
  //         "Not Yet Vaccinated";
  //       medicalInsurDetails.MedicalStatus.Reason = $("#noDose").val();
  //     } else if (vac_status == "1Dose") {
  //       medicalInsurDetails.MedicalStatus.VaccinationStatus = "One Dose";
  //       medicalInsurDetails.MedicalStatus.Date_dose1 = $("#dosedate_1").val();
  //       medicalInsurDetails.MedicalStatus.Reason = $("#dose_reason").val();
  //       medicalInsurDetails.MedicalStatus.Certificate = $(".vacupDoc").val();
  //     } else if (vac_status == "2Doses") {
  //       medicalInsurDetails.MedicalStatus.VaccinationStatus = "Two Doses";
  //       medicalInsurDetails.MedicalStatus.Date_dose1 = $("#dosedate_1").val();
  //       medicalInsurDetails.MedicalStatus.Date_dose2 = $("#dosedate_2").val();
  //       medicalInsurDetails.MedicalStatus.Certificate = $(".vacupDoc").val();
  //     }
  //     var saveDtlFormData = {
  //       basicDetails,
  //       preference,
  //       documents,
  //       eduWorkExp,
  //       medicalInsurDetails,
  //     };
  //     let employeeDetails = {
  //       employeeDetails: saveDtlFormData,
  //     };
  //     let employeeName = resultfullName;
  //     var jsonData = JSON.stringify({ employeeDetails, employeeName });
  //     window.localStorage.setItem("data", jsonData);
  //     submitSaveDtl();
  //     function submitSaveDtl() {
  //       $.ajax({
  //         url: "/hrms/partialsave/onboardingData",
  //         type: "POST",
  //         headers: {
  //           "csrf-token": enc_token,
  //           authorization: `bearer ${token}`,
  //         },
  //         data: {
  //           employeeDetails: saveDtlFormData,
  //           employeeName: resultfullName,
  //           phoneNumber: phoneNumber,
  //         },
  //         beforeSend: function () {},
  //         success: function (data) {
  //           $("#SaveDtl_msg").removeClass("hide").addClass("alert alert-primary alert-dismissible").slideDown().show();
  //           $("#messages_content").html("<h4>Your Detail Successfully Saved...</h4>");
  //           setTimeout(function () {
  //             $("#SaveDtl_msg").fadeOut("slow");
  //           }, 5000);
  //         },
  //       });
  //     }
  //   }
  // });

  // Final Data
  $("#submit").click(function (e) {
    e.preventDefault();
    var basicDetails = {
      Personal_Details: {
        FirstName: $("#first_name").val(),
        LastName: $("#last_name").val(),
        Dob: $("#dob").val(),
        Gender: $("input:radio[name=gender]:checked").val(),
        Nationality: $(".nationality .filter-option").text(),
        PersonalmailID: $("#personalemailid").val(),
        Contact: $("#contact").val(),
        LinkedProfile: $("#linkedin_profile").val(),
      },
      Communication_Address: {
        Pincode: $("#pincode-val").val(),
        Country: $(".country-val .filter-option").text(),
        State: $("#state-val").val(),
        TalukDistrict: $("#taluk-val").val(),
        City: $("#city-val").val(),
        AreaLocality: $("#area-val").val(),
        Premesis_Building: $("#building-val").val(),
        Block_Flat: $("#block-val").val(),
      },
      Permanant_Address: {},
    };
    if ($("#alter_contact").val() != "") {
      basicDetails.Personal_Details.AlterContact = $("#alter_contact").val();
    }
    if ($("input:radio[name=marital_status]:checked").val() == "Married") {
      basicDetails.Personal_Details.MaritalStatus = "Married";
      basicDetails.Personal_Details.AnniversaryDate =
        $("#anniversary_date").val();
    } else {
      basicDetails.Personal_Details.MaritalStatus = "Single";
    }
    if ($("#permanant-address").is("checked")) {
      basicDetails.Permanant_Address = basicDetails.Communication_Address;
    } else {
      basicDetails.Permanant_Address = {
        Pincode: $("#pincode-get").val(),
        Country: $(".country-get .filter-option").text(),
        State: $("#state-get").val(),
        TalukDistrict: $("#taluk-get").val(),
        City: $("#city-get").val(),
        AreaLocality: $("#area-get").val(),
        Premesis_Building: $("#building-get").val(),
        Block_Flat: $("#block-get").val(),
      };
    }
    if ($("#newAcc").is(":checked")) {
      basicDetails.BankDetails = "Create New salary Account";
    } else {
      // basicDetails.Bank_Details= {}
      basicDetails.Bank_Details = {
        BankAccountName: $("#acc_name").val(),
        AccountNumber: $("#acc_number").val(),
        IFSCcode: $("#ifsc_code").val(),
        BankName: $("#bank_name").val(),
        BankBranch: $("#bank_branch").val(),
      };
    }
    var accessories = $(".accessory:checked")
      .map(function () {
        return this.value;
      })
      .get();
    var books = $(".select_books:checked")
      .map(function () {
        return this.value;
      })
      .get();
    var preference = {
      MailID: $("#prefermail_id").val() + "@m2pfintech.com",
      JoiningDate: $("#joining_date").val(),
      Laptop: $("input:radio[name=laptop]:checked").val(),
      Accessories: [accessories],
      Bag: $("input:radio[name=Briefcase]:checked").val(),
      Bottle: $("input:radio[name=bottle]:checked").val(),
      Tshirt:
        $("input:radio[name=tshirt]:checked").val() +
        ":" +
        $("#tshirt_size_1").val(),
      Books: [books],
      NoteBook: $("input:radio[name=notebook]:checked").val(),
    };
    var documents = {
      CasualPic1: $("#upPic").val(),
      // CasualPic2: $("#upPicNew").val(),
      PanNo: $("#pan_num").val(),
      Panpic: $("#panPic").val(),
      AadharNo: $("#aadhar_num").val(),
      AadharFrontside: $("#aadharFrnt").val(),
      AadharBackside: $("#aadharBck").val(),
      AddressProof: '',
      AddressProofID: {},
      Passport: {}
    };
    if ($("#upPicNew").val() != "") {
      documents.CasualPic2 = $("#upPicNew").val();
    }
    if ($("#aadharcheck").is(":checked")) {
      documents.AddressProof = "Same as in Aadhar Card";
    }
    var add_proof = $("input:radio[name=add_proof]:checked").val();
    if ($("#aadharcheck").is(":checked") == false) {
      if (add_proof == "driving") {
        documents.AddressProofID = {
          IDProof: "Driving License",
          Number: $("#drive_num").val(),
          Backside: $(".liceBck").val(),
          Frontside: $(".liceFrnt").val(),
        };
      } else {
        documents.AddressProofID = {
          IDProof: "Voter ID",
          Number: $("#voter_num").val(),
          Backside: $(".voterBck").val(),
          Frontside: $(".voterFrnt").val(),
        };
      }
    }
    if (
      $("#pass_num").val() != "" &&
      $("#pass_expdate").val() != "" &&
      $(".passUp").val() != ""
    ) {
      documents.Passport.PassportNo = $("#pass_num").val();
      documents.Passport.PassportExpDate = $("#pass_expdate").val();
      documents.Passport.PassportDoc = $(".passUp").val();
    }
    var newEdu = [];
    var workExpNew = [];
    let uanSts = $("input:radio[name=uan_num]:checked").val()
    var educ = {
      Education: $("#select_edu").val(),
      FieldofStudy: $("#select_field").val(),
      YearofCompletion: $("#year_completion").val(),
      EduCertificate: $("#eduCertificate").val(),
    };
    newEdu.push(educ);
    for (eduCnt = 2; eduCnt <= 3; eduCnt++) {
      let edu = $("#edu" + eduCnt)
        .find("#new_edu" + eduCnt)
        .val();
      let field = $("#edu" + eduCnt)
        .find("#new_field" + eduCnt)
        .val();
      let year_new = $("#edu" + eduCnt)
        .find("#new_edu_yr" + eduCnt)
        .val();
      let certi = $("#edu" + eduCnt)
        .find("#new_eduCert" + eduCnt)
        .val();
      var eduObj = {};
      if(edu!==''){
        eduObj["Education"] = edu;
      }
      if(field!==''){
        eduObj["FieldofStudy"] = field;
      }
      if(year_new!==''){
        eduObj["YearofCompletion"] = year_new;
      }
      if(certi){
        eduObj["EduCertificate"] = certi;
      }
      newEdu.push(eduObj);
    }
    var eduWorkExp = {
      Education: newEdu,
      Certification:{}
    };
    if (
      $(".certYr").val() != "" &&
      $("#certEdu").val() != "" &&
      $("#certField").val() != "" &&
      $("#certificateDoc").val() != ""
    ) {
      eduWorkExp.Certification.YearofCompletion = $(".certYr").val();
      eduWorkExp.Certification.Education = $("#certEdu").val();
      eduWorkExp.Certification.FieldofStudy = $("#certField").val();
      eduWorkExp.Certification.Certificate = $("#certificateDoc").val();
    }
    var experience = $("input:radio[name=work_exp]:checked").val();
    var work_status = $("input:radio[name=work_status]:checked").val();
    if (experience == "Yes") {
      eduWorkExp.WorkStatus = {};
      eduWorkExp.Work_Status = {};
      if (work_status == "Relieved") {
        eduWorkExp.Work_Status = workExpNew;
        var expRel = {
          Status: $("input:radio[name=work_status]:checked").val(),
          EmployeeName: $("#exp_emp_name").val(),
          Position: $("#exp_designation").val(),
          DateofJoin: $(".rel_work_start").val(),
          DateofRelieve: $(".rel_work_end").val(),
          Relieving_letter: $("#relivDoc").val(),
          TotalExperience: $("#calculate-date").text(),
        };
        if(uanSts="Yes"){
          expRel.UAN_number = $("#uan_number").val()
        }else{
          expRel.UAN_number = "Need to create new UAN number"
        }
        workExpNew.push(expRel);
      } else {
        eduWorkExp.WorkStatus = {
          Status: $("input:radio[name=work_status]:checked").val(),
          EmployeeName: $("#exp_emp_name").val(),
          Position: $("#exp_designation").val(),
          DateofJoin: $("#work_startdate").val(),
        };
      }
    } else {
      eduWorkExp.Experience = "Fresher";
    }
    for (expCnt = 2; expCnt <= expcounter; expCnt++) {
      let exp_empName = $("#addExp" + expCnt)
        .find("#exp_emp_name" + expCnt)
        .val();
      let exp_empDesig = $("#addExp" + expCnt)
        .find("#exp_designation" + expCnt)
        .val();
      let exp_StrDt = $("#addExp" + expCnt)
        .find("#relstartdate" + expCnt)
        .val();
      let exp_EndDt = $("#addExp" + expCnt)
        .find("#relenddate" + expCnt)
        .val();
      let experience = $("#calculate-date" + expCnt).text();
      exp = {};
      exp["EmployeeName"] = exp_empName;
      exp["Position"] = exp_empDesig;
      exp["DateofJoin"] = exp_StrDt;
      exp["DateofRelieve"] = exp_EndDt;
      exp["TotalExperience"] = experience;
      workExpNew.push(exp);
    }
    var insurNew = [];
    var insurDet = {
      Name: $("#insur_name").val(),
      Relationship: $("#insur_rel").val(),
      DoB: $("#insur_dob").val(),
    };
    var medicalInsurDetails = {
      InsuranceDetails: insurNew,
      MedicalStatus: {
        BloodGrp: $("#insur_bg").val(),
      },
      EmrgncyCntDtls: {
        ContactPers_1: $("#cont_pers_1").val(),
        Relationship_1: $("#cont_rel_1").val(),
        ContactNo_1: $("#cont_no_1").val(),
        ContactPers_2: $("#cont_pers_2").val(),
        Relationship_2: $("#cont_rel_2").val(),
        ContactNo_2: $("#cont_no_2").val(),
      },
    };
    insurNew.push(insurDet);
    for (medCnt = 2; medCnt <= medcounter; medCnt++) {
      let insurName = $("#medical" + medCnt)
        .find("#insur_name" + medCnt)
        .val();
      let insurRel = $("#medical" + medCnt)
        .find("#insur_rel" + medCnt)
        .val();
      let insurDob = $("#medical" + medCnt)
        .find("#insur_dob" + medCnt)
        .val();
      med = {};
      med["Name"] = insurName;
      med["Relationship"] = insurRel;
      med["DoB"] = insurDob;
      insurNew.push(med);
    }
    var vac_status = $("input:radio[name=vac_sts]:checked").val();
    if (vac_status == "noDose") {
      medicalInsurDetails.MedicalStatus.VaccinationStatus =
        "Not Yet Vaccinated";
      medicalInsurDetails.MedicalStatus.Reason = $("#noDose").val();
    } else if (vac_status == "1Dose") {
      medicalInsurDetails.MedicalStatus.VaccinationStatus = "One Dose";
      medicalInsurDetails.MedicalStatus.Date_dose1 = $("#dosedate_1").val();
      medicalInsurDetails.MedicalStatus.Reason = $("#dose_reason").val();
      medicalInsurDetails.MedicalStatus.Certificate = $(".vacupDoc").val();
    } else if (vac_status == "2Doses") {
      medicalInsurDetails.MedicalStatus.VaccinationStatus = "Two Doses";
      medicalInsurDetails.MedicalStatus.Date_dose1 = $("#dosedate_1").val();
      medicalInsurDetails.MedicalStatus.Date_dose2 = $("#dosedate_2").val();
      medicalInsurDetails.MedicalStatus.Certificate = $(".vacupDoc").val();
    }
    var pastTime = {
      Hobbies: $("#hobbies").val(),
      favBooks: $("#fav_book").val(),
      favMovie: $("#fav_movie").val(),
      favTravel: $("#fav_trvl").val(),
      favFood: $("#fav_food").val(),
      favSportsTeam: $("#fav_sports").val(),
      Mantra: $("#fav_mantra").val(),
      TopBucket: $("#topList").val(),
    };
    var formData = {
      basicDetails,
      preference,
      documents,
      eduWorkExp,
      medicalInsurDetails,
      pastTime,
    };
    let employeeDetails = {
      employeeDetails: formData,
    };
    var jsonData = JSON.stringify(employeeDetails);
    window.localStorage.setItem("data", jsonData);
    
    submitData();
    function submitData() {
      let contact = $("#contact").val().trim()
      $.ajax({
        url: "/hrms/save/onboardingData",
        type: "POST",
        headers: {
          "csrf-token": enc_token,
          authorization: `bearer ${token}`,
        },
        data: {
          employeeDetails: formData,
          employeeName: resultfullName,
          phoneNumber:phoneNumber,
        },
        beforeSend: function () {},
        success: function (data) {
          $('#uploadModal').modal('show')
          let contact = $("#contact").val().trim()
          let formData = new FormData()
            formData.append('userName',resultfullName)
            formData.append('phoneNumber',phoneNumber)
            Array.prototype.forEach.call(document.querySelectorAll('input[type=file]'),
              function (input, i) {
                if (input.value) formData.append("files", input.files[0]);
                if (input.value) formData.append(input.name, input.files[0].name);
              }
            ); 
            $.ajax({
              url: "/hrms/uploadFiles",
              type: "POST",
              headers: {
                "csrf-token": enc_token,
                authorization: `bearer ${token}`,
              },
              cache: false,
              contentType: false,
              processData: false,
              data: formData,
              success: function(data){
                $("#msform").trigger("reset"); 
                window.location.href = "/thankyou";
              }
            })
        },
      });
    }
     
  });
  // Email Suggesstions
  // $(".suglab").hide();
  $(".flex-pre ,.suggested_hide").hide();
  $("#prefermail_id").keypress(function () {
    var fName = $("#first_name").val().toLowerCase().trim();
    var lName = $("#last_name").val().toLowerCase().trim();
    var newName = fName + lName;
    var domainNew = $("#domain").text();
    var domain = domainNew.toLowerCase().trim();
    var p1 = fName;
    var p3 = fName + "." + lName;
    var p5 = fName.substring(0, 1) + lName;
    var p6 = fName.substring(0, 1) + "." + lName;
    var p7 = fName + lName.substring(0, 1);
    var p8 = fName + "." + lName.substring(0, 1);
    $(".sug1").text(p1);
    $(".sug2").text(p7);
    $(".sug3").text(p8);
  });
  $("#prefermail_id").keyup(function () {
    // $(".suglab").show();
    $(".suggested_hide label").show();
    $(".flex-pre, .suggested_hide").show();
    $("#offId").text($(this).val().trim() + "@m2pfintech.com");
  });
  $(".suglab").click(function () {
    $("#prefermail_id").val($(this).find(".sugCom").text());
    $(".suglab").hide();
    $(".suggested_hide label").hide();
    $("#offId").text($(this).find(".sugCom").text() + "@m2pfintech.com");
  });
  $('.modalClose').click(()=>{
    preExpcounter = 0
    preMedcounter = 0
    allowClone= false;
    $('#previewmodal').modal('hide');
  });
});
// Adding Experience
var expcounter = 1;
function addexperience() {
  expcounter++;
  let packing = $("#exper");
  let clone = packing.clone();
  clone.appendTo(".experience-append-div");
  clone.attr("id", "exper" + expcounter);
  clone.attr("id", "addExp" + expcounter);
  clone.find("#exp_designation").addClass("expDesg" + expcounter);
  clone.find("#exp_emp_name").attr("id", "exp_emp_name" + expcounter);
  clone.find("#calculate-date").attr("id", "calculate-date" + expcounter);
  clone.find("#exp_designation").attr("id", "exp_designation" + expcounter);
  clone.find("#relstartdate").attr("id", "relstartdate" + expcounter);
  clone.find("#relenddate").attr("id", "relenddate" + expcounter);
  clone.find(".bootstrap-select").replaceWith(function () {
    return $("select", this);
  });
  $(".month-year")
    .datepicker({
      format: "mm yyyy",
      viewMode: "months",
      endDate: '+0m',
      minViewMode: "months",
      viewMode: "month year",
    })
    .on("change", function () {
      $(this).datepicker("hide");
    });
  clone.find("select").selectpicker();
  clone.show();
  $()
  $("#exp_designation" + expcounter).keydown(function (e) {
    var key = e.keyCode;
    if (
      !(
        /[a-z ]/i.test(String.fromCharCode(e.keyCode)) ||
        key == 8 ||
        key == 32 ||
        key == 46 ||
        key == 46 || (key == 37) || (key == 38) || (key == 39) || (key == 40)
      )
    ) {
      e.preventDefault();
    }
  });
  $("#exp_emp_name" + expcounter).keydown(function (e) {
    var key = e.keyCode;
    if (
      !(
        /[a-z ]/i.test(String.fromCharCode(e.keyCode)) ||
        key == 8 ||
        key == 32 ||
        key == 46 ||
        key == 46|| (key == 37) || (key == 38) || (key == 39) || (key == 40)
      )
    ) {
      e.preventDefault();
    }
  });
}
$("body").on("click", ".minus", function () {
  expcounter--;
  $(this).closest(".experience-content").remove();
});
$("#working").click(function () {
  expcounter = 1;
  $(".experience-append-div .experience-content ").remove();
});
// Adding Medical
var medcounter = 1;
function addmedical() {
  medcounter++;
  let packing = $("#medical");
  let clone = packing.clone();
  clone.appendTo(".medical-append-div");
  clone.attr("id", "medical" + medcounter);
  clone.find("#insur_rel").addClass("insurErr" + medcounter);
  clone.find("#insur_name").attr("id", "insur_name" + medcounter);
  clone.find("#insur_name").addClass('med_insur');
  clone.find("#insur_rel").attr("id", "insur_rel" + medcounter);
  clone.find("#insur_dob").attr("id", "insur_dob" + medcounter);
  clone.find(".bootstrap-select").replaceWith(function () {
    return $("select", this);
  });
    $(".insur_dob")
      .datepicker({
        format: "dd/mm/yyyy",
        maxViewMode: "years",
        startView: "years",
        endDate: '+0d',
        autoclose: true,
      })
      .on("change", function () {
        $(this).datepicker("hide");
      });
  clone.find("select").selectpicker();
  clone.show();
  if ($(".medical-append-div .medical-content").length == 4) {
    $("#addInsur").hide();
  }
  $("#insur_name" + medcounter).keydown(function (e) {
    var key = e.keyCode;
    if (
      !(
        /[a-z ]/i.test(String.fromCharCode(e.keyCode)) ||
        key == 8 ||
        key == 32 ||
        key == 46 ||
        key == 46 || (key == 37) || (key == 38) || (key == 39) || (key == 40)
      )
    ) {
      e.preventDefault();
    }
  });
  // $("insur_rel" + medcounter)
  // let remOpt =$(this).val()
  // $('.selectInsur option[value="'+remOpt+'"]').remove()
  $(".caplet").keypress(function () {
    $(this).val((index,value)=>{
      return capitalizeEachWord(value)
    })
  })
}
$("body").on("click", ".minus", function () {
  medcounter--;
  if ($(".medical-append-div .medical-content").length <= 4) {
    $("#addInsur").show();
  }
  $(this).closest(".medical-content").remove();
});
// File Upload Validate
$("input[type=file]").each(function () {
  $(this).change(function () {
    if (this.files.length == 0) {
      $(this).parent().addClass("preErrMsg");
      $(this).parents(".field-div").find(".aadharname").hide();
      $(this).parents(".field-div").find(".prefErr").show();
    } else {
      let size = this.files[0].size;
      if (size > 5242880) {
        this.value = null;
        $(this).parent().addClass("preErrMsg");
        $(this).parents(".field-div").find(".upSizeErr").show();
        $(this).parents(".field-div").find(".prefErr").hide();
        $(this).parents(".field-div").find(".aadharname").hide();
        $(this)
          .parents(".field-div")
          .find(".upload_img")
          .attr("src", "/assets/portalAsset/images/casualPic.png");
      } else {
        $(this).parent().removeClass("preErrMsg");
        $(this).parents(".field-div").find(".upSizeErr").hide();
        $(this).parents(".field-div").find(".prefErr").hide();
      }
    }
  });
});
// $(".texOnly").keypress(function (e) {
//   var key = e.keyCode;
//   if (
//     !(
//       /[a-z ]/i.test(String.fromCharCode(e.keyCode)) ||
//       key == 8 ||
//       key == 32 ||
//       key == 46 ||
//       key == 9 || (key == 37) || (key == 38) || (key == 39) || (key == 40)
//     )
//   ) {
//     e.preventDefault();
//   }
// });
$(".texOnly").keypress(function (e) {
  if (e.which >31 && e.which != 32 && (e.which < 65 || e.which > 90)&&(e.which < 97 || e.which > 122)) {
    return false;
  }
});
let charCode = [96,49,50,51,52,53,54,55,56,57,48,45,61,91,93,92,59,39,
  46,47,126,33,64,35,36,37,94,38,42,40,41,95,43,123,125,124,58,34,60,62,63,]
$("#hobbies").keypress(function(e){
 if(charCode.includes(e.which)){
  return false
 }
})
let charCodeOrg = [96,45,61,91,93,92,59,39,
  46,47,126,33,64,35,36,37,94,38,42,40,41,95,43,123,125,124,58,34,60,62,63,]
$("#exp_emp_name").keypress(function(e){
 if(charCodeOrg.includes(e.which)){
  return false
 }
})
var birthdate = new Date();
birthdate.setFullYear(birthdate.getFullYear() - 20);
$(function () {
  $(".dob-sel")
    .datepicker({
      format: "dd/mm/yyyy",
      maxViewMode: "years",
      startView: "years",
      endDate: birthdate,
      autoclose: true,
    })
    .on("change", function () {
      $(this).datepicker("hide");
    });
  $("#anniversary_date")
    .datepicker({
      format: "dd/mm/yyyy",
      maxViewMode: "years",
      startView: "years",
      autoclose: true,
    })
    .on("change", function () {
      $(this).datepicker("hide");
    });
});
$(".datepicker.year").datepicker({
  format: "yyyy",
  viewMode: "years",
  minViewMode: "years",
}).on("change", function () {
  $(this).datepicker("hide");
});

$('.month-year').datepicker({
  format: "mm yyyy",
  endDate: '+0m',
  viewMode: "months", 
  minViewMode: "months",
  viewMode: "month year",
})
.on("change", function () {
      $(this).datepicker("hide");
    });
$(".insur_dob, #dosedate_1, #dosedate_2")
.datepicker({
  format: "dd/mm/yyyy",
  maxViewMode: "years",
  startView: "years",
  endDate: '+0d',
  autoclose: true,
})
$("#pass_expdate")
.datepicker({
  format: "dd/mm/yyyy",
  maxViewMode: "years",
  startView: "years",
  autoclose: true,
})
.on("change", function () {
  $(this).datepicker("hide");
});
//number only
$(
  "#pincode-val,#acc_number,#pincode-get,#aadhar_num,#uan_number,#pincode-val,#aadhar_num,#cont_no_1,#cont_no_2"
).keypress(function (e) {
  if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
    return false;
  }
});
// special char
$(".speclChar").keypress(function (e) {
  let key = e.keyCode || e.which;
  let reg_exp = /^[A-Za-z0-9 ]+$/;
  var is_valid = reg_exp.test(String.fromCharCode(key));
  if (!is_valid) {
  }
  return is_valid;
});

function preview_inputfield() {
  $(".file-input").change(function () {
    var img_val = URL.createObjectURL(event.target.files[0]);
    var upload_input_value = $(".file-input").val();
    var fileExtension = ["jpeg", "jpg", "png", "gif", "bmp"];
    if (upload_input_value == null) {
      $(this)
        .parent(".file-drop-area")
        .find(".upload_img")
        .attr("src", "./assets/portalAsset/images/casual_pica.jpeg");
    } else if (
      $.inArray($(this).val().split(".").pop().toLowerCase(), fileExtension) ==
      -1
    ) {
      $(this)
        .parent(".file-drop-area")
        .find(".upload_img")
        .attr("src", "./assets/portalAsset/images/pdf_img.png")
        .addClass("pdf_img");
    } else {
      $(this)
        .parent(".file-drop-area")
        .find(".upload_img")
        .attr("src", img_val);
    }
  });
}

$('#aadhar_num').on('keypress change', function () {
  $(this).val(function (index, value) {
  return value.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ').trim();
  });
});

$(".caplet").keypress(function () {
  $(this).val((index,value)=>{
    return capitalizeEachWord(value)
  })
})
function capitalizeEachWord(str) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  }); 
};

// $('#insur_rel').change(function(){
//   $('.selectInsur').selectpicker('refresh')
//   let remOpt = $(this).val()
//   $('.selectInsur option[value="'+remOpt+'"]').remove()
// })
// $('#insur_rel').on('change', function(event ) {
//   var prevValue = $(this).data('previous');
// $('#insur_rel').not(this).find('option[value="'+prevValue+'"]').show();    
//   var value = $(this).val();
//  $(this).data('previous',value); $('#insur_rel').not(this).find('option[value="'+value+'"]').hide();
// });
// var inactivityTime = function () {
//   var time;
//   window.onload = resetTimer;
//   document.onmousemove = resetTimer;
//   document.onkeydown = resetTimer;
//   function stuck() {
//       $("#stuck").modal();
//   }
//   function resetTimer() {
//     clearTimeout(time);
//     time = setTimeout(stuck, 30000)
//     // 1000 milliseconds = 1 second
//   }
// };
// window.onload = function() {
//   inactivityTime();
// }
