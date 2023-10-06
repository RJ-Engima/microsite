$(document).ready(function () {
  $('input[type=text]').attr('autocomplete', 'off');

  $("#logoutAdm").click(function () {
    window.location.href = "/logout";
    sessionStorage.clear();
  });
  var enc_token = $('meta[name="csrf-token"]').attr("content");
  var token = sessionStorage.getItem("hrmsToken");
  $("body").addClass("bgblue");
  $("#phoneNumber").keypress(function(evt){
    // Only ASCII character in that range allowed
    var ASCIICode = (evt.which) ? evt.which : evt.keyCode
    if (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57))
        return false;
    return true;
  });
  //datepicker for disable past and today date
  var date = new Date();
  date.setDate(date.getDate()+1);
  $('.datepicker').datepicker({
      format: 'dd/mm/yyyy',
      autoclose: true,
      startDate: date,
  }).on("change", function () {
      $(this).datepicker("hide");
  });
  //limit set for all field
  // $('.limitchar').unbind('keyup change input paste').bind('keyup change input paste',function(e){
  //     var $this = $(this);
  //     var val = $this.val();
  //     var valLength = val.length;
  //     var maxCount = $this.attr('maxlength');
  //     if(valLength>maxCount){
  //         $this.val($this.val().substring(0,maxCount));
  //     }
  // });
  //text only
  $(".limitchar").keypress(function (e) {
    if (e.which >31 && e.which != 32 && (e.which < 65 || e.which > 90)&&(e.which < 97 || e.which > 122)) {
      return false;
    }
  });
  $('#department').change(()=>{
    $('#designation').empty()
    $('#designation').selectpicker('destroy');
    $('#designation').selectpicker();
    $.ajax({
      url: "/hrms/list/designation",
      headers: { "csrf-token": enc_token, authorization: `bearer ${token}` },
      data:{
        department:$('#department').val()
      },
      type: "POST",
      success: function (data) {
        $('.deprErr').hide()
        data.map((i) => {
          $("#designation").append(`<option value="${i}">${i}</option>`);
        });
        $("#designation").selectpicker("refresh");
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        if(XMLHttpRequest.status===404){
          $('.deprErr').show()
          // notify(XMLHttpRequest.responseText, "primary custom_success");
        }else{
          notify(XMLHttpRequest.responseText, "danger custom_success");
        }
      },
    });
  })
  $.ajax({
    url: "/hrms/list/department",
    headers: { "csrf-token": enc_token, authorization: `bearer ${token}` },
    type: "POST",
    success: function (data) {
      data.map((i) => {
        $("#department").append(`<option value="${i}">${i}</option>`);
      });
      $("#department").selectpicker("refresh");
    },
  });
  $.ajax({
    url: "/hrms/list/location",
    headers: { "csrf-token": enc_token, authorization: `bearer ${token}` },

    type: "POST",
    success: function (data) {
      data.map((i) => {
        $("#location").append(`<option value="${i}">${i}</option>`);
      });
      $("#location").selectpicker("refresh");
    },
  });
  //REJAX Validator
  popupmail =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  $("#eMail").change(function () {
    if (!popupmail.test($(this).val())) {
      $("#eMail").css("border", "1px solid red");
      $(".AdIndiv .emailError").show();
      return false;
    } else {
      $(".AdIndiv .emailError").hide();
      $("#eMail").css("border", "0.5px solid rgba(20, 27, 86, 0.2)");
      $(".AdIndiv .emailError").hide();
    }
  });
  $("#saveDetails").click(function () {
    let requestData = {
      fullName: $("#fullName").val(),
      phoneNumber: $("#phoneNumber").val(),
      eMail: $("#eMail").val(),
      department: $("#department").val(),
      designation: $("#designation").val(),
      doj: $("#doj").val(),
      location: $("#location").val(),
      status: "Pending"
    };

    //Fullname Validation
    if (requestData.fullName == "") {
      // $("#fullName").addClass("addFocus");
      $("#fullName").focus();
      $("#fullName").css("border", "1px solid red");
      // return false;
    } else {
      $("#fullName").css("border", "0.5px solid rgba(20, 27, 86, 0.2)");
    }
    // //Email Validation
    if (requestData.eMail=="") {
      $("#eMail").css("border", "1px solid red");
    } else {
      $("#eMail").focus();
      $("#eMail").css("border", "0.5px solid rgba(20, 27, 86, 0.2)");
      // $("#eMail").addClass("addFocus");
      // return false;
    }
    //Date of Joining Validation
    if (requestData.doj == "") {
      // $("#doj").addClass("addFocus");
      $("#doj").focus();
      $("#doj").css("border", "1px solid red");
      // return false;
    } else {
      $("#doj").css("border", "0.5px solid rgba(20, 27, 86, 0.2)");
    }
    //Location Validation
    if (requestData.location == "") {
      // $(".location button").addClass("addFocus");
      $(".location button").focus();
      $(".location button").css("border", "1px solid red");
      // return false;
    } else {
      $(".location button").css("border", "0.5px solid rgba(20, 27, 86, 0.2)");
    }
    //Phone Number Validation
    if (requestData.phoneNumber == "") {
      // $("#phoneNumber").addClass("addFocus");
      $("#phoneNumber").focus();
      $("#phoneNumber").css("border", "1px solid red");
      // return false;
    } else {
      $("#phoneNumber").css("border", "0.5px solid rgba(20, 27, 86, 0.2)");
    }
    
    //Departmant Validation
    if (requestData.department == "") {
      // $("#department button").addClass("addFocus");
      $("#department button").focus();
      $(".department button").css("border", "1px solid red");
      // return false;
    } else {
      $(".department button").css(
        "border",
        "0.5px solid rgba(20, 27, 86, 0.2)"
        );
      }
      //Designation Validation
      if (requestData.designation == "") {
        $("#designation button").addClass("addFocus");
        $(".designation button").css("border", "1px solid red");
        // return false;
    } else {
      $(".designation button").css(
        "border",
        "0.5px solid rgba(20, 27, 86, 0.2)"
      );
    }

    // $(".selectdropdown").on("change", function () {
    //   $(this).find("button").css("border", "0.5px solid rgba(20, 27, 86, 0.2)");
    //   $(this).parent().find(".ErrorMessage").hide();
    // });
    $(".AdIn").each(function () {
      if ($(this).val() == "") {
        $(this).focus();
        $(this).parents(".AdInDiv").find(".ErrorMessage").show();
      }
      if ($(this).val() != "") {
        $(this).parents(".AdInDiv").find(".ErrorMessage").hide();
      }
    });
    $(".AdIn").keypress(function () {
      $(this).css("border", "0.5px solid rgba(20, 27, 86, 0.2)");
      $(this).parent().find(".ErrorMessage").hide();
      $(".AdIndiv .emailError").hide();
    });
    $(".AdIn").change(function () {
      $(this).css("border", "0.5px solid rgba(20, 27, 86, 0.2)");
      $(this).parent().find(".ErrorMessage").hide();
      $(".AdIndiv .emailError").hide();
    });
    $('#doj').change(()=>{
      $('#doj').css("border", "0.5px solid rgba(20, 27, 86, 0.2)");
      $('#doj').parent().find(".ErrorMessage").hide();
    })
    $('#designation').change(()=>{
      $('.designation').find("button").css("border", "0.5px solid rgba(20, 27, 86, 0.2)");
      $('.designation').parent().find(".ErrorMessage").hide();
    })
    $('#location').change(()=>{
      $('.location').find("button").css("border", "0.5px solid rgba(20, 27, 86, 0.2)");
      $('.location').parent().find(".ErrorMessage").hide();
    })
    $('#department').change(()=>{
      $('.department').find("button").css("border", "0.5px solid rgba(20, 27, 86, 0.2)");
      $('.designation').parent().find(".ErrorMessage").hide();
      $('.designation').parent().find(".deprErr").hide();
      $('.department').parent().find(".ErrorMessage").hide();
    })
    //API call
    if (
      requestData.fullName != "" &&
      requestData.phoneNumber != "" &&
      requestData.eMail != "" &&
      requestData.department != "" &&
      requestData.designation != "" &&
      requestData.doj != "" &&
      requestData.location != ""
    ) {
      $.ajax({
        url: "/hrms/save/info",
        type: "POST",
        headers: { "csrf-token": enc_token, authorization: `bearer ${token}` },
        data: requestData,
        beforeSend: function () {},
        success: function (returndata) {
          notify(returndata, "primary custom_success");
          // $('#AdminForm').trigger('reset')
         window.location.reload()
        $(".department").find('.dropdown-menu.inner li').removeClass('selected active')
        $(".department").find('.dropdown-menu.inner li a').removeClass('selected active')
        // option()
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          notify(XMLHttpRequest.responseText, "danger custom_success");
         
        },
      });
    }
    $(".addFocus").filter(":first").focus();
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
$("#fullName").focus();
// function notify(value, type) {
//   $.toast({
//     heading: value,
//     position: "top-right",
//     loaderBg: "#fec107",
//     // icon: type,
//     showHideTransition: "slide",
//     hideAfter: 1500,
//     textColor: "#eee",
//     allowToastClose: false,
//     textAlign: "left",
//   });
//   return;
// }
