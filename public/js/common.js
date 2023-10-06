$(document).ready(function () {  
  // let resultValue = sessionStorage.getItem("resultValue");
  let userValue = JSON.parse(sessionStorage.getItem("userDetails"));
  let headerText = document.querySelector("#headerText");

  if (window.location.href.includes("addDetail")) {
    headerText.append(" - Save Employee Details");
  }
  if (window.location.href.includes("viewDetail")) {
    headerText.append(" - View Employee Details");
  }
  if (window.location.href.includes("addDesignation")) {
    headerText.append(" - View Designation Details");
  }
  if (window.location.href.includes("addDepartment")) {
    headerText.append(" - View Department Details");
  }
  if (window.location.href.includes("addLocation")) {
    headerText.append(" - View Location Details");
  }

  if(userValue !== null){
    if (userValue.result.userType === "BANK") {
      let userFirstName = userValue.result.firstName;
      let userLastName = userValue.result.lastName;
      $("#frontAdminHeader").html(
        " Hi " + userFirstName + " " + userLastName
      );
    }
  }
  $("#logOutHm").click(function () {
    window.location.href = "/logout";
    sessionStorage.clear();
  });
  $(".actLi").click(function(){
    // var $this = $(this);
    // setTimeout(function(){
    //   $this.toggleClass("bg_white");
    // },500)
    $(this).toggleClass("bg_white")
    $(".subMenu").toggle();
  })
  // $(".actLi").on("mouseenter", function () {
  //   $(this).addClass("bg_white");
  //   $(".subMenu").slideDown();
  // }).on("mouseleave", function () {
  //   var $this = $(this);
  //   setTimeout(function(){
  //     $this.removeClass("bg_white");
  //   },200)
  //   $(".subMenu").slideUp("fast");
  //   });
    
  $(".dashLink a").removeClass("SideActive");
  let querySelector = 'a.topnav-item[href="' + window.location.pathname + '"]';
  $('a.topnav-item[href="' + window.location.pathname + '"]') .parents(".actLi").addClass("bg_white")
  .find(".subMenu") .css("display", "block");
  $(querySelector).addClass("SideActive"); 
});

