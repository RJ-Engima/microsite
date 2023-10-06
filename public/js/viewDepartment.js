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
  $(".limitchar").keypress(function (e) {
    if (e.which >31 && e.which != 32 && (e.which < 65 || e.which > 90)&&(e.which < 97 || e.which > 122)) {
      return false;
    }
  });
  function callGetTableMethod() {
    $.ajax({
      url: "/hrms/getDepartmentData",
      type: "GET",
      headers: { "csrf-token": enc_token, authorization: `bearer ${token}` },
      success: function (json) {
        let tableHeaders = "";
        $.each(json.columns, function (i, val) {
          tableHeaders += "<th>" + val + "</th>";
        });
        $("#departmentTable").empty();
        $("#departmentTable").append(
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
  $("#addnewDeprt").click(function () {
    $("#addDeprt").show();
    $("#addDeprt input").focus();
  });
  $("#add_close").click(() => {
    $("#addDeprt").hide();
  });
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
    $(".deprtName").text(name);
  });
  //click no button in delete modal
  $("#confirm_deprtNo").click(function () {
    $("#confirmdelete").modal("hide");
    $("#adminSavedInfo tr").removeClass("remove_row");
  });
  //delete confirm
  $("#confirm_deprtYes").on("click", function (e) {
    let name = array[1];
    e.preventDefault();
    $.ajax({
      url: "/hrms/delete/department",
      type: "POST",
      headers: { "csrf-token": enc_token, authorization: `bearer ${token}` },
      data: {
        hrName: hrName,
        department: name,
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
  var editarr = [];
  $(document).on("click", "#edit", function () {
    $("#editDeprtDtl").show();
    $("#edit_Deprt").focus();
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
    $("#edit_Deprt").val(editarr[1]);
  });
  $("#edit_close").on("click", function () {
    $("#addDeprt").hide();
    $("#editDeprtDtl").hide();
  });

  $("#edit_DeprtSubmit").on("click", function () {
    var edituserdata = {
      department: $("#edit_Deprt").val(),
    };
    //Fullname Validation
    if (edituserdata.department == "") {
      $("#edit_Deprt").focus();
      $("#edit_Deprt").css("border", "1px solid red");
    } else {
      $("#edit_Deprt").css("border", "0.5px solid rgba(20, 27, 86, 0.2)");
    }
    //edit api call function
    if (edituserdata.department != "") {
      $("#confirmedit").show();
    }
  });
  $('#edit_Deprt').keyup(function(event) {
    if (event.keyCode === 13) {
      $("#edit_DeprtSubmit").click();
    }
  });
  $("#discard_DeprtEdit").click(function () {
    $("#confirmedit, #editDeprtDtl").hide();
  });
  $("#confirm_DeprtEdit").click(function (e) {
    e.preventDefault()
    $.ajax({
      url: "/hrms/update/department",
      type: "POST",
      headers: { "csrf-token": enc_token, authorization: `bearer ${token}` },
      data: {
        hrName: hrName,
        department: editarr[1],
        newDepartment: $("#edit_Deprt").val(),
      },
      beforeSend: function () {},
      success: function (returndata) {
        $("#confirmedit, #editDeprtDtl").hide();
        notify(returndata, "primary custom_success");
        setTimeout(() => {
          location.reload();
        }, 1000);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        $("#confirmedit, #editDeprtDtl").hide();
        notify(XMLHttpRequest.responseText, "danger custom_success");
      },
    });
  });
  $("#addSubmit").click(function (e) {
    e.preventDefault()
    if ($("#new_Deprt").val() !== "") {
      $.ajax({
        url: "/hrms/add/department",
        type: "POST",
        headers: { "csrf-token": enc_token, authorization: `bearer ${token}` },
        data: {
          hrName: hrName,
          newDepartment: $("#new_Deprt").val(),
        },
        beforeSend: function () {},
        success: function (returndata) {
          $("#addDeprt").hide();
          notify(returndata, "primary custom_success");
          setTimeout(() => {
            location.reload();
          }, 1000);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          notify(JSON.parse(XMLHttpRequest.responseText), "danger custom_success");
        },
      });
    } else {
      $("#new_Deprt").css("border", "1px solid red");
    }
    $("#new_Deprt").keyup(() => {
      $("#new_Deprt").css("border", "0.5px solid rgba(20, 27, 86, 0.2)");
    });
  });
  $(".addclose").click(function(){
    $(".edit_input").val("");
    $("#new_Deprt").css("border", "0.5px solid rgba(20, 27, 86, 0.2)");
  });
  $('#new_Deprt').keyup(function(event) {
    if (event.keyCode === 13) {
      $("#addSubmit").click();
    }
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
