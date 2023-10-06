$(document).ready(function () {
  sessionStorage.clear();
  var enc_token = $('meta[name="csrf-token"]').attr("content");
  $(".otpSix input")
    .on("keyup", function () {
      if (this.value.length >= this.maxLength) {
        $(this).next().focus();
      }
    })
    .keyup(function (e) {
      if (e.which === 8 && !this.value) {
        $(this).prev().focus();
      }
    });
  $(".otpSix input").keypress(function (e) {
    var charCode = e.which ? e.which : e.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
  });

  $(".resendBtn").click(function () {
    $(".otpPass").val("");
    $(".otpSix input:first-child").focus();
  });

  $(".otpSix input:last-child").keypress(function (e) {
    if (e.which === 13) {
      e.preventDefault;
      $("#otpForm").submit();
      return false;
    }
  });
  //Validate Email
  function validateEmail() {
    let emailEmp = $("#emailEmp").val();
    let reqEmail = {};
    reqEmail.emailEmp = emailEmp;
    if(emailEmp!==''){
      $.ajax({
        url: "/hrms/validateUserName",
        data: { user: $("#emailEmp").val() },
        headers: { "csrf-token": enc_token },
        type: "POST",
        beforeSend: function () {
          $(".signin").html("VERIFYING...").css("pointer-events", "none");
        },
        success: function (data) {
          if (data === "Invalid User") {
            $.ajax({
              url: "/hrms/validateEmail",
              type: "POST",
              headers: { "csrf-token": enc_token },
              data: reqEmail,
              beforeSend: function () {},
              success: function (returndata) {
                let data = JSON.stringify(returndata.data);
                sessionStorage.setItem("resultValue", data);
                $(".otpBox").css("display", "block");
                $(".otp").filter(":first").focus();
                $("#emailEmp").prop("disabled", true);
                $("#passwordDiv").css("display", "none");
                $(".inBrd").css("margin-bottom", "");
                $("#validateEmailBlock").css("display", "none");
                $("#validateOTPBlock").css("display", "block");
              },
              error: function (XMLHttpRequest, textStatus, errorThrown) {
                if(XMLHttpRequest.status===409){
                  notify(XMLHttpRequest.responseText, "primary");
                }else{
                  notify(XMLHttpRequest.responseText, "danger");
                }
              },
            });
          } else {
            sessionStorage.setItem("userDetails", JSON.parse(data));
            $("#passwordDiv").css("display", "block");
            $("#emailEmp").prop("disabled", true);
            $(".otpPass").filter(":first").focus();
            $("#passwordDiv").css("margin-bottom", "15px");
            $("#validateEmailBlock").css("display", "none");
            $("#validateOTPPassBlock").css("display", "block");
          }
        },
        error: function (data) {
          notify(XMLHttpRequest.responseText, "danger");
        },
      });
    }else{
      $("#emailEmp").css('border','1px solid red')
      notify('Enter your email',"danger")
    }
  }
  $("#emailForm").on("submit", function (e) {
    e.preventDefault();
    validateEmail();
  });
  $("#emailEmp").keypress(()=>{
    $("#emailEmp").css('border','0.5px solid #D0D1DD')
  })
  //Verify OTP for Employee
  
  function otpProceed(){
    $(".otp").each(function () {
      if ($(this).val() == "") {
        $(this).addClass("error");
        $(".error").filter(":first").focus();
        $(this).css("border", "2px solid red");
      } else {
        $(this).removeClass("error");
        $(this).css("border", "1px solid rgba(20, 27, 86, 0.2)");
      }
      $(this).change(() => {
        $(this).removeClass("error");
        $(this).css("border", "1px solid rgba(20, 27, 86, 0.2)");
      });
    });
    if (
      $("#otp1").val() !== "" &&
      $("#otp2").val() !== "" &&
      $("#otp3").val() !== "" &&
      $("#otp3").val() !== "" &&
      $("#otp5").val() !== "" &&
      $("#otp6").val() !== ""
    ) {
      let result = sessionStorage.getItem("resultValue");
      let phoneNumber = JSON.parse(result).phoneNumber;
      let userName = JSON.parse(result).fullName;
      let otpValue = $("input[class^=otp]")
        .map(function (idx, elem) {
          return $(elem).val();
        })
        .get();
      let requestData = {};
      requestData.mobileNumber = phoneNumber;
      requestData.otp = otpValue.toString().replace(/\,/g, "");
      $.ajax({
        url: "/hrms/validateOtp",
        type: "POST",
        headers: { "csrf-token": enc_token },
        data: {
          userName:userName,
          mobileNumber: "+91" + phoneNumber,
          otp: otpValue.toString().replace(/\,/g, ""),
        },
        beforeSend: function () {},
        success: function (returndata) {
          let data = JSON.stringify(returndata.accessToken);
          let status = JSON.stringify(returndata.status);
          sessionStorage.setItem("token", data);
          sessionStorage.setItem("status", status);
          let chkToken = sessionStorage.getItem("token");
          let chkStatus = sessionStorage.getItem("status");
          if (chkToken) {
            window.location = "/home";
          } else {
            window.location = "/";
            notify(data, "danger");
          }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          notify(XMLHttpRequest.responseText, "danger");
        },
      });
    }
  }
  $('.otp').keydown(function(e) {
    if (e.keyCode == 13) {
      otpProceed()
    }
  });
  $("#proceedFun").click(function (e) {
    otpProceed()
  });
  //Verify OTP for Password
  function otpProceedPass(){
    $(".otpPass").each(function () {
      if ($(this).val() == "") {
        $(this).addClass("error");
        $(".error").filter(":first").focus();
        $(this).css("border", "1px solid red");
      } else {
        $(this).removeClass("error");
        $(this).css("border", "1px solid rgba(20, 27, 86, 0.2)");
      }
      $(this).change(() => {
        $(this).removeClass("error");
        $(this).css("border", "1px solid rgba(20, 27, 86, 0.2)");
      });
    });
    if($('#otpPass1').val()!==''&&$('#otpPass2').val()!==''&&$('#otpPass3').val()!==''&&$('#otpPass3').val()!==''&&$('#otpPass5').val()!==''&&$('#otpPass6').val()!==''){
      let userName = $("#emailEmp").val();
      let otpPassValue = $("input[class^=otpPass]")
        .map(function (idx, elem) {
          return $(elem).val();
        })
        .get();
      let requestPassData = {};
      requestPassData.userName = userName;
      requestPassData.otp = otpPassValue.toString().replace(/\,/g, "");
      $.ajax({
        url: "/hrms/validatePassOtp",
        type: "POST",
        headers: { "csrf-token": enc_token },
        data: requestPassData,
        beforeSend: function () {},
        success: function (returndata) {
          let hrmsData = JSON.stringify(returndata.accessToken);
          sessionStorage.setItem("hrmsToken", hrmsData);
          let hrmsToken = sessionStorage.getItem("hrmsToken");
          if (hrmsToken) {
            window.location = "/addDetail";
          } else {
            notify(returndata, "danger");
          }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          let error = JSON.parse(XMLHttpRequest.responseText)
          notify(error.detailMessage, "danger");
        },
      });
    }
  }
  $('.otpPass').keydown(function(e) {
    if (e.keyCode == 13) {
      otpProceedPass()
    }
  });
  $("#proceedPassFunc").click(function (e) {
    otpProceedPass()
  });
  $("#resendOtp").click(() => {
    $('.otp').removeClass("error");
    $(".otp").css("border", "1px solid rgba(20, 27, 86, 0.2)");
    validateEmail();
  });
  $("#resendPassOtp").click(() => {
    $('.otpPass').removeClass("error");
    $('.otpPass').css("border", "1px solid rgba(20, 27, 86, 0.2)");
    validateEmail();
  });
});