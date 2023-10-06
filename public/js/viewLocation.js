$(document).ready(function () {
  $('input[type=text]').attr('autocomplete', 'off');

  $("#logoutAdm").click(function () {
    sessionStorage.clear();
    window.location.href = "/logout";
  });
  var enc_token = $('meta[name="csrf-token"]').attr("content");
  var token = sessionStorage.getItem("hrmsToken");
  let userDetails = sessionStorage.getItem("userDetails");
  let result = JSON.parse(userDetails);
  let hrName = result.result.firstName;
  callGetTableMethod();
  $("body").addClass("bgblue");
  //text only
  $(".limitchar").keypress(function (e) {
    if (e.which >31 && e.which != 32 && (e.which < 65 || e.which > 90)&&(e.which < 97 || e.which > 122)) {
      return false;
    }
  });
  function callGetTableMethod() {
    $.ajax({
      url: "/hrms/getLocationData",
      type: "GET",
      headers: { "csrf-token": enc_token, authorization: `bearer ${token}` },
      success: function (json) {
        let tableHeaders = "";
        $.each(json.columns, function (i, val) {
          tableHeaders += "<th>" + val + "</th>";
        });
        $("#locationTable").empty();
        $("#locationTable").append(
          '<table class="table" id="adminSavedInfo"><thead><tr>' +
            tableHeaders +
            "</tr></thead></table>"
        );
        $("#adminSavedInfo").DataTable(json);
      },
      error: function (XMLHttpRequest) {
        notify(XMLHttpRequest.responseText, "danger custom_success");
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
    let name = '"' + array[1] + '"';
    $(".locaName").text(name);
  });
  //click no button in delete modal
  $("#confirm_locaNo").click(function () {
    $("#confirmdelete").modal("hide");
    $("#adminSavedInfo tr").removeClass("remove_row");
  });
  //delete confirm
  $("#confirm_locaYes").on("click", function (e) {
    let name = array[1];
    e.preventDefault();
    $.ajax({
      url: "/hrms/delete/location",
      type: "POST",
      headers: { "csrf-token": enc_token, authorization: `bearer ${token}` },
      data: {
        hrName: hrName,
        location: name,
      },
      beforeSend: function () {},
      success: function (returndata) {
        notify(returndata, "primary custom_success");
        $("#confirmdelete").modal('hide');
        setTimeout(() => {
          location.reload();
        }, 1000);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        notify(XMLHttpRequest.responseText, "danger custom_success");
      },
    });
  });
  //click edit button
  // $("#editLocaDtl").hide();
  var editarr = [];
  $(document).on("click", "#edit", function () {
    $("#editLocaDtl").show();
    $("#editLocaDtl input").focus();
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
    $("#edit_loca").val(editarr[1]);
  });
  $("#edit_close").on("click", function () {
    $("#editLocaDtl").hide();
  });
  $("#edit_LocaSubmit").on("click", function () {
    var edituserdata = {
      location: $("#edit_loca").val(),
    };
    //Fullname Validation
    if (edituserdata.fullname == "") {
      $("#edit_loca").focus();
      $("#edit_loca").css("border", "1px solid red");
    } else {
      $("#edit_loca").css("border", "0.5px solid rgba(20, 27, 86, 0.2)");
    }
    //edit api call function
    if (edituserdata.location != "") {
      $("#confirmedit").show();
    }
  });
  $("#discard_locaEdit").click(function () {
    $("#confirmedit, #editLocaDtl").hide();
  });
  $('#edit_loca').keyup(function(event) {
    if (event.keyCode === 13) {
      $("#edit_LocaSubmit").click();
    }
  });
  $('#new_loca').keyup(function(event) {
    if (event.keyCode === 13) {
      $("#addSubmit").click();
    }
  });
  $("#confirm_LocaEdit").click(function () {
    $.ajax({
      url: "/hrms/update/location",
      type: "POST",
      headers: { "csrf-token": enc_token, authorization: `bearer ${token}` },
      data: {
        hrName: hrName,
        location: editarr[1],
        newLocation: $("#edit_loca").val(),
      },
      beforeSend: function () {},
      success: function (returndata) {
        $("#confirmedit, #editLocaDtl").hide();
        notify(returndata, "primary custom_success");
        setTimeout(() => {
          location.reload();
        }, 1000);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        notify(XMLHttpRequest.responseText, "danger custom_success");
      },
    });
  });
  $("#addnewLoca").click(() => {
    $("#addLoca").show();
    $("#addLoca input").focus();
  });
  $("#add_close").click(() => {
    $("#addLoca").hide();
  });
  $("#addSubmit").click(function () {
    if ($("#new_loca").val() !== "") {
      $.ajax({
        url: "/hrms/add/location",
        type: "POST",
        headers: { "csrf-token": enc_token, authorization: `bearer ${token}` },
        data: {
          hrName: hrName,
          newLocation: $("#new_loca").val(),
        },
        beforeSend: function () {},
        success: function (returndata) {
          $("#addLoca").hide();
          notify(returndata, "primary custom_success");
          setTimeout(() => {
            location.reload();
          }, 1000);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          notify(JSON.parse(XMLHttpRequest.responseText), "danger custom_success");
          $("#confirmedit, #editLocaDtl").hide();
        },
      });
    } else {
      $("#new_loca").css("border", "1px solid red");
    }
    $("#new_loca").keyup(() => {
      $("#new_loca").css("border", "0.5px solid rgba(20, 27, 86, 0.2)");
    });
  });
  $(".addclose").click(function(){
    $(".edit_input").val("");
    $("#new_loca").css("border", "0.5px solid rgba(20, 27, 86, 0.2)");
  });
  
  
  // $(".caplet").keypress(function () {
  //   $(this).val((index,value)=>{
  //     return capitalizeEachWord(value)
  //   })
  // })
  // function capitalizeEachWord(str) {
  //   return str.replace(/\w\S*/g, function(txt) {
  //     return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  //   }); 
  // };
  
});
