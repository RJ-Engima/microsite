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
      url: "/hrms/getDesignationData",
      type: "GET",
      headers: { "csrf-token": enc_token, authorization: `bearer ${token}` },
      success: function (json) {
        let tableHeaders = "";
        $.each(json.columns, function (i, val) {
          tableHeaders += "<th>" + val + "</th>";
        });
        $("#designationTable").empty();
        $("#designationTable").append(
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
    $(".desgnName").text(name);
  });
  //click no button in delete modal
  $("#confirm_DesgnNo").click(function () {
    $("#confirmdelete").modal("hide");
    $("#adminSavedInfo tr").removeClass("remove_row");
  });
  //delete confirm
  $("#confirm_DesgnYes").on("click", function (e) {
    e.preventDefault()
    let department = array[1];
    let designation = array[2];
    e.preventDefault();
    $.ajax({
      url: "/hrms/delete/designation",
      type: "POST",
      headers: { "csrf-token": enc_token, authorization: `bearer ${token}` },
      data: {
        hrName: hrName,
        department: department,
        designation: designation,
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
    $("#edit_department").empty();
    $("#edit_department").selectpicker("destroy");
    $("#edit_department").selectpicker();
    $("#editDesgnDtl").show();
    $("#edit_Desgn").focus();
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
        url: "/hrms/list/department",
        headers: { "csrf-token": enc_token, authorization: `bearer ${token}` },
        type: "POST",
        success: function (data) {
          data.map((i) => {
            $("#edit_department").append(`<option value="${i}">${i}</option>`);
          });
          $("#edit_department").selectpicker("refresh");
          $("#edit_department").selectpicker("val", editarr[1]);
        },
      });  
    $("#edit_Desgn").val(editarr[2]);
  });
  $("#edit_close").on("click", function () {
    $("#edit_department").selectpicker("refresh");
    $("#editDesgnDtl").hide();
  });
  $('#edit_Desgn').keyup(function(event) {
    if (event.keyCode === 13) {
      $("#edit_DesgnSubmit").click();
    }
  });
$('#new_Desgn').keyup(function(event) {
  if (event.keyCode === 13) {
    $("#addSubmit").click();
  }
});
//capitalize_Words 

// function capitalizeFirstLetter(string){
//   return string.charAt(0).toUpperCase() + string.slice(1);
// }
  $("#edit_DesgnSubmit").on("click", function () {
    var editDesgndata = {
      designation: $("#edit_Desgn").val(),
    };
    //Fullname Validation
    if (editDesgndata.designation == "") {
      $("#edit_Desgn").focus();
      $("#edit_Desgn").css("border", "1px solid red");
    } else {
      $("#edit_Desgn").css("border", "0.5px solid rgba(20, 27, 86, 0.2)");
    }

    //edit api call function
    if ($("#edit_designation").val() != "") {
      $("#confirmedit").show();
    }
  });
  $("#discard_DesgnEdit").click(function () {
    $("#confirmedit, #editDesgnDtl").hide();
  });
  $("#confirm_DesgnEdit").click(function (e) {
    e.preventDefault()
    $.ajax({
      url: "/hrms/update/designation",
      type: "POST",
      headers: { "csrf-token": enc_token, authorization: `bearer ${token}` },
      data: {
        hrName: hrName,
        department: editarr[1],
        newDepartment: $('#edit_department').val(),
        designation: editarr[2],
        newDesignation: $("#edit_Desgn").val(),
      },
      beforeSend: function () {},
      success: function (returndata) {
        $("#confirmedit, #editDesgnDtl").hide();
        notify(returndata, "primary custom_success");
        setTimeout(() => {
          location.reload();
        }, 1000);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        notify(XMLHttpRequest.responseText, "danger custom_success");
        $("#confirmedit, #editDesgnDtl").hide();
      },
    });
  });

  $("#addSubmit").click(function (e) {
    e.preventDefault()
    if ($("#new_Desgn").val() !== "" && $("#department").val() !== "") {
      $.ajax({
        url: "/hrms/add/designation",
        type: "POST",
        headers: { "csrf-token": enc_token, authorization: `bearer ${token}` },
        data: {
          hrName: hrName,
          department:$('#department').val(),
          newDesignation: $("#new_Desgn").val(),
        },
        beforeSend: function () {},
        success: function (returndata) {
          notify(returndata, "primary custom_success");
          $("#addDesgn").hide();
          setTimeout(() => {
            location.reload();
          }, 1000);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          notify(JSON.parse(XMLHttpRequest.responseText), "danger custom_success");
        },
      });
    } else {
      $(".department button").css("border", "1px solid red");
      $("#new_Desgn").css("border", "1px solid red");
    }
    $("#new_Desgn").keyup(() => {
      $("#new_Desgn").css("border", "0.5px solid rgba(20, 27, 86, 0.2)");
    });
    $("#department").change(()=>{
      $(".department button").css("border", "0.5px solid rgba(20, 27, 86, 0.2)");
    })
  });
  //modal popup for add new button
  $("#addnewDeprt").click(function () {
    
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
    $("#addDesgn").show();
    $("#new_Desgn").focus();
  });
  $("#addDesgnClose").click(function () {
    $("#addDesgn").hide();
  });
  $(".addclose").click(function(){
    $('#department').empty()
    $('#department').selectpicker('destroy')
    $('#department').selectpicker()
    $(".edit_input").val("");
    $(".department button").css("border", "0.5px solid rgba(20, 27, 86, 0.2)");
    $("#new_Desgn").css("border", "0.5px solid rgba(20, 27, 86, 0.2)");
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
