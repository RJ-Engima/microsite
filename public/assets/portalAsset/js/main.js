$(document).ready(function () {
  var current_fs, next_fs, previous_fs; //fieldsets
  var opacity;
  $(".previous").click(function () {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    current_fs = $(this).parent();
    previous_fs = $(this).parent().prev();
    previous_fs.show();
    current_fs.animate(
      { opacity: 0 },
      {
        step: function (now) {
          opacity = 1 - now;
          current_fs.css({
            display: "none",
            position: "relative",
          });
          previous_fs.css({ opacity: opacity });
        },
        duration: 600,
      }
    );
  });
  $(".radio-group .radio").click(function () {
    $(this).parent().find(".radio").removeClass("selected");
    $(this).addClass("selected");
  });
  $(".submit").click(function () {
    return false;
  });
  //previous active class
  $(".previous").click(function () {
    var $parent = $("#progressbar li")
      .eq($("fieldset").index(current_fs))
      .prev("li");
    $("#progressbar li.active")
      .removeClass("active change-bg")
      .find(".test")
      .addClass("f1 animatedmode");

    $parent.addClass("active");
  });
  //Book Selection
  $('#BookSection input[type="checkbox"]').on("change", function (evt) {
    var max = 3;
    if ($("#BookSection input[type='checkbox']:checked").length == max) {
      $("#BookSection input[type='checkbox']").attr("disabled", "disabled");
      $("#BookSection  input[type='checkbox']:checked").removeAttr("disabled");
    } else {
      $("input[type='checkbox']").removeAttr("disabled");
    }
  });
  //mobile formatting and country code
  $(function () {
    var input = document.querySelectorAll(
      "input[name=contact], input[name=alternatecontact]"
    );
    var iti_el = $(".iti.iti--allow-dropdown.iti--separate-dial-code");
    if (iti_el.length) {
      iti.destroy();
    }
    for (var i = 0; i < input.length; i++) {
      iti = intlTelInput(input[i], {
        autoHideDialCode: false,
        autoPlaceholder: "aggressive",
        initialCountry: "IN",
        separateDialCode: true,
        preferredCountries: ["in"],
        nationalMode: true,
        customPlaceholder: function (
          selectedCountryPlaceholder,
          selectedCountryData
        ) {
          return "" + selectedCountryPlaceholder.replace(/[0-9]/g, "X");
        },
        geoIpLookup: function (callback) {
          $.get("https://ipinfo.io", function () {}, "jsonp").always(function (
            resp
          ) {
            var countryCode = resp && resp.country ? resp.country : "";
            callback(countryCode);
          });
        },
        utilsScript:
          "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/16.0.0/js/utils.js",
      });
      $('input[name="contact"], input[name="alternatecontact"]').on(
        "focus click countrychange",
        function (e, countryData) {
          var pl = $(this).attr("placeholder") + "";
          var res = pl.replace(/X/g, "9");
          if (res != "undefined") {
            $(this).inputmask(res, {
              placeholder: "X",
              clearMaskOnLostFocus: true,
            });
          }
        }
      );
      $('input[name="contact"], input[name="alternatecontact"]').on(
        "focusout",
        function (e, countryData) {
          var intlNumber = iti.getNumber();
        }
      );
    }
  });
});
$("#welcomepopup").on("hidden.bs.modal", function () {
  $("#basic").addClass("active change-bg");
});
$("#welcomepopup").modal({
  show: false,
  backdrop: "static",
});
//table image show
$("#windowchecked").click(function () {
  if ($("#windLap").is(":checked") == true) {
    $(".windowtable img.windowtable").css("opacity", "1");
    $(".windowtable img.mactable").css("opacity", "0");
  } else if ($("#windLap").is(":checked") == false) {
    $(".windowtable img.mactable").css("opacity", "0");
  }
});
$("#macchecked").click(function () {
  if ($("#macLap").is(":checked") == true) {
    $(".windowtable img.mactable").css("opacity", "1");
    $(".windowtable img.windowtable").css("opacity", "0");
  } else if ($("#macLap").is(":checked") == false) {
    $(".windowtable img.windowtable").css("opacity", "0");
  }
});
$("#keyboardchecked").click(function () {
  if ($("#keyboard").is(":checked") == true) {
    $(".keyboardtable img").css("opacity", "1");
  } else if ($("#keyboard").is(":checked") == false) {
    $(".keyboardtable img").css("opacity", "0");
  }
});
$("#mousechecked").click(function () {
  if ($("#mouse").is(":checked") == true) {
    $(".mousetable img").css("opacity", "1");
  } else if ($("#mouse").is(":checked") == false) {
    $(".mousetable img").css("opacity", "0");
  }
});
$("#monitorchecked").click(function () {
  if ($("#monitor").is(":checked") == true) {
    $(".monitortable img").css("opacity", "1");
  } else if ($("#monitor").is(":checked") == false) {
    $(".monitortable img").css("opacity", "0");
  }
});
$("#lapstandchecked").click(function () {
  if ($("#LapStand").is(":checked") == true) {
    $(".laptopstandtable img").css("opacity", "1");
  } else if ($("#LapStand").is(":checked") == false) {
    $(".laptopstandtable img").css("opacity", "0");
  }
});
$("#giftchecked").click(function () {
  if ($("#gifts").is(":checked") == true) {
    $(
      ".badgestable img, .stickerstable img, .keychaintable img, .masktable img"
    ).css("opacity", "1");
  } else if ($("#gifts").is(":checked") == false) {
    $(
      ".badgestable img, .stickerstable img, .keychaintable img, .masktable img"
    ).css("opacity", "0");
  }
});
$("#backpackchecked").click(function () {
  if ($("#Backpack1").is(":checked") == true) {
    $(".badtable img.backpackgray").css("opacity", "1");
    $(".briefcasetablediv img").css("opacity", "0");
  } else if ($("#Backpack2").is(":checked") == false) {
    $(".badtable img.backpackgray").css("opacity", "0");
  }
  if ($("#Backpack2").is(":checked") == true) {
    $(".badtable img.Backpackred").css("opacity", "1");
    $(".briefcasetablediv img , .badtable img.backpackgray").css(
      "opacity",
      "0"
    );
  } else if ($("#Backpack2").is(":checked") == false) {
    $(".badtable img.Backpackred").css("opacity", "0");
  }
  if ($("#Backpack3").is(":checked") == true) {
    $(".badtable img.Backpackblack").css("opacity", "1");
    $(".briefcasetablediv img").css("opacity", "0");
  } else if ($("#Backpack3").is(":checked") == false) {
    $(".badtable img.Backpackblack").css("opacity", "0");
  }
});
$("#Briefcasechecked").click(function () {
  if ($("#Briefcase1").is(":checked") == true) {
    $(".badtable img.briefcasegray").css("opacity", "1");
    $(".backpacktablediv img").css("opacity", "0");
  } else if ($("#Briefcase1").is(":checked") == false) {
    $(".badtable img.briefcasegray").css("opacity", "0");
  }
  if ($("#Briefcase2").is(":checked") == true) {
    $(".badtable img.briefcasered").css("opacity", "1");
    $(".backpacktablediv img").css("opacity", "0");
  } else if ($("#Briefcase2").is(":checked") == false) {
    $(".badtable img.briefcasered").css("opacity", "0");
  }
  if ($("#Briefcase3").is(":checked") == true) {
    $(".badtable img.briefcaseblack").css("opacity", "1");
    $(".backpacktablediv img").css("opacity", "0");
  } else if ($("#Briefcase3").is(":checked") == false) {
    $(".badtable img.briefcaseblack").css("opacity", "0");
  }
});
$("#bottlechecked").click(function () {
  if ($("#bluebottle").is(":checked") == true) {
    $(".bottletable img.bottleblack").css("opacity", "1");
  } else if ($("#bluebottle").is(":checked") == false) {
    $(".bottletable img.bottleblack").css("opacity", "0");
  }
  if ($("#redbottle").is(":checked") == true) {
    $(".bottletable img.bottlegray").css("opacity", "1");
  } else if ($("#redbottle").is(":checked") == false) {
    $(".bottletable img.bottlegray").css("opacity", "0");
  }
  if ($("#blackbottle").is(":checked") == true) {
    $(".bottletable img.bottlered").css("opacity", "1");
  } else if ($("#blackbottle").is(":checked") == false) {
    $(".bottletable img.bottlered").css("opacity", "0");
  }
});
$("#tshirt").click(function () {
  $("#chooseTShirt").prop("checked", true);
  if ($("#chooseTShirt").is(":checked") == true) {
    $(".TshirtAllTable img.t-shirtgrey").css("opacity", "1");
  } else if ($("#chooseTShirt").is(":checked") == false) {
    $(".TshirtAllTable img.t-shirtgrey").css("opacity", "0");
  }
});
$("#unruledchecked").click(function () {
  if ($("#black-note").is(":checked") == true) {
    $(".notebooktable img.unrulednote").css("opacity", "1");
    $(".notebooktable img.rulednote").css("opacity", "0");
  } else if ($("#black-note").is(":checked") == false) {
    $(".notebooktable img.unrulednote").css("opacity", "0");
  }
});
$("#ruledchecked").click(function () {
  if ($("#red-note").is(":checked") == true) {
    $(".notebooktable img.rulednote").css("opacity", "1");
    $(".notebooktable img.unrulednote").css("opacity", "0");
  } else if ($("#red-note").is(":checked") == false) {
    $(".notebooktable img.rulednote").css("opacity", "0");
  }
});
//hover gif
$(document).ready(function () {
  $("#windowsblack").click(function () {
    $(".window-hover")
      .on("mouseenter", function () {
        $(this)
          .find("img")
          .attr("src", "./assets/portalAsset/images/windowsgif.gif");
      })
      .on("mouseleave", function () {
        $(this)
          .find("img")
          .attr("src", "./assets/portalAsset/images/windows.png");
      });
  });
  $("#windowswhite").click(function () {
    $(".window-hover")
      .on("mouseenter", function () {
        $(this)
          .find("img")
          .attr("src", "./assets/portalAsset/images/windowsilvergif.gif");
      })
      .on("mouseleave", function () {
        $(this)
          .find("img")
          .attr("src", "./assets/portalAsset/images/windowsilver.png");
      });
  });
  $("#macsilver").click(function () {
    $(".mac-hover")
      .on("mouseenter", function () {
        $(this)
          .find("img")
          .attr("src", "./assets/portalAsset/images/macbooksilvergif.gif");
      })
      .on("mouseleave", function () {
        $(this)
          .find("img")
          .attr("src", "./assets/portalAsset/images/macbooksilver.png");
      });
  });
  $("#macblack").click(function () {
    $(".mac-hover")
      .on("mouseenter", function () {
        $(this)
          .find("img")
          .attr("src", "./assets/portalAsset/images/macbook-gif.gif");
      })
      .on("mouseleave", function () {
        $(this)
          .find("img")
          .attr("src", "./assets/portalAsset/images/Macbook.png");
      });
  });
  $("#Briefcase1").click(function () {
    $(".bagcase-hover")
      .find("img")
      .attr("src", "./assets/portalAsset/images/BagBriefcasegray.png");
    $(".bagcase-hover")
      .on("mouseenter", function () {
        $(this)
          .find("img")
          .attr("src", "./assets/portalAsset/images/BagBriefcasegray.gif");
      })
      .on("mouseleave", function () {
        $(this)
          .find("img")
          .attr("src", "./assets/portalAsset/images/BagBriefcasegray.png");
      });
  });
  $("#graytshirt").click(function () {
    $(".Tshirt-hover")
      .find("img")
      .attr("src", "./assets/portalAsset/images/Tshirt_grey.png");
    $(".Tshirt-hover")
      .on("mouseenter", function () {
        $(this)
          .find("img")
          .attr("src", "./assets/portalAsset/images/Tshirt_grey.gif");
      })
      .on("mouseleave", function () {
        $(this)
          .find("img")
          .attr("src", "./assets/portalAsset/images/Tshirt_grey.png");
      });
  });
  $("#graytshirt1").click(function () {
    $(".Tshirt-hover1")
      .find("img")
      .attr("src", "./assets/portalAsset/images/Tshirt_grey.png");
    $(".Tshirt-hover1")
      .on("mouseenter", function () {
        $(this)
          .find("img")
          .attr("src", "./assets/portalAsset/images/Tshirt_grey.gif");
      })
      .on("mouseleave", function () {
        $(this)
          .find("img")
          .attr("src", "./assets/portalAsset/images/Tshirt_grey.png");
      });
  });
  $("#graytshirt2").click(function () {
    $(".Tshirt-hover2")
      .find("img")
      .attr("src", "./assets/portalAsset/images/Tshirt_grey.png");
    $(".Tshirt-hover2")
      .on("mouseenter", function () {
        $(this)
          .find("img")
          .attr("src", "./assets/portalAsset/images/Tshirt_grey.gif");
      })
      .on("mouseleave", function () {
        $(this)
          .find("img")
          .attr("src", "./assets/portalAsset/images/Tshirt_grey.png");
      });
  });
  $("#redtshirt").click(function () {
    $(".Tshirt-hover")
      .find("img")
      .attr("src", "./assets/portalAsset/images/Tshirt_red.png");
    $(".Tshirt-hover")
      .on("mouseenter", function () {
        $(this)
          .find("img")
          .attr("src", "./assets/portalAsset/images/Tshirt_red.gif");
      })
      .on("mouseleave", function () {
        $(this)
          .find("img")
          .attr("src", "./assets/portalAsset/images/Tshirt_red.png");
      });
  });
  $("#redtshirt1").click(function () {
    $(".Tshirt-hover1")
      .find("img")
      .attr("src", "./assets/portalAsset/images/Tshirt_red.png");
    $(".Tshirt-hover1")
      .on("mouseenter", function () {
        $(this)
          .find("img")
          .attr("src", "./assets/portalAsset/images/Tshirt_red.gif");
      })
      .on("mouseleave", function () {
        $(this)
          .find("img")
          .attr("src", "./assets/portalAsset/images/Tshirt_red.png");
      });
  });
  $("#redtshirt2").click(function () {
    $(".Tshirt-hover2")
      .find("img")
      .attr("src", "./assets/portalAsset/images/Tshirt_red.png");
    $(".Tshirt-hover2")
      .on("mouseenter", function () {
        $(this)
          .find("img")
          .attr("src", "./assets/portalAsset/images/Tshirt_red.gif");
      })
      .on("mouseleave", function () {
        $(this)
          .find("img")
          .attr("src", "./assets/portalAsset/images/Tshirt_red.png");
      });
  });
  $("#blacktshirt").click(function () {
    $(".Tshirt-hover")
      .find("img")
      .attr("src", "./assets/portalAsset/images/Tshirt_black.png");
    $(".Tshirt-hover")
      .on("mouseenter", function () {
        $(this)
          .find("img")
          .attr("src", "./assets/portalAsset/images/Tshirt_black.gif");
      })
      .on("mouseleave", function () {
        $(this)
          .find("img")
          .attr("src", "./assets/portalAsset/images/Tshirt_black.png");
      });
  });
  $("#blacktshirt1").click(function () {
    $(".Tshirt-hover1")
      .find("img")
      .attr("src", "./assets/portalAsset/images/Tshirt_black.png");
    $(".Tshirt-hover1")
      .on("mouseenter", function () {
        $(this)
          .find("img")
          .attr("src", "./assets/portalAsset/images/Tshirt_black.gif");
      })
      .on("mouseleave", function () {
        $(this)
          .find("img")
          .attr("src", "./assets/portalAsset/images/Tshirt_black.png");
      });
  });
  $("#blacktshirt2").click(function () {
    $(".Tshirt-hover2")
      .find("img")
      .attr("src", "./assets/portalAsset/images/Tshirt_black.png");
    $(".Tshirt-hover2")
      .on("mouseenter", function () {
        $(this)
          .find("img")
          .attr("src", "./assets/portalAsset/images/Tshirt_black.gif");
      })
      .on("mouseleave", function () {
        $(this)
          .find("img")
          .attr("src", "./assets/portalAsset/images/Tshirt_black.png");
      });
  });
  $(".window-hover")
    .on("mouseenter", function () {
      $(this)
        .find("img")
        .attr("src", "./assets/portalAsset/images/windowsilvergif.gif");
    })
    .on("mouseleave", function () {
      $(this)
        .find("img")
        .attr("src", "./assets/portalAsset/images/windowsilver.png");
    });
  $(".mac-hover")
    .on("mouseenter", function () {
      $(this)
        .find("img")
        .attr("src", "./assets/portalAsset/images/macbooksilvergif.gif");
    })
    .on("mouseleave", function () {
      $(this)
        .find("img")
        .attr("src", "./assets/portalAsset/images/macbooksilver.png");
    });
  $(".keyboard-hover")
    .on("mouseenter", function () {
      $(this)
        .find("img")
        .attr("src", "./assets/portalAsset/images/Keyboard.gif");
    })
    .on("mouseleave", function () {
      $(this)
        .find("img")
        .attr("src", "./assets/portalAsset/images/Keyboard.png");
    });
  $(".mouse-hover")
    .on("mouseenter", function () {
      $(this).find("img").attr("src", "./assets/portalAsset/images/mouse.gif");
    })
    .on("mouseleave", function () {
      $(this).find("img").attr("src", "./assets/portalAsset/images/mouse.png");
    });
  $(".monitor-hover")
    .on("mouseenter", function () {
      $(this)
        .find("img")
        .attr("src", "./assets/portalAsset/images/monitor.gif");
    })
    .on("mouseleave", function () {
      $(this)
        .find("img")
        .attr("src", "./assets/portalAsset/images/monitor.png");
    });
  $(".laptopstand-hover")
    .on("mouseenter", function () {
      $(this)
        .find("img")
        .attr("src", "./assets/portalAsset/images/LaptopStand.gif");
    })
    .on("mouseleave", function () {
      $(this)
        .find("img")
        .attr("src", "./assets/portalAsset/images/LaptopStand.png");
    });
  $(".bag-hover")
    .on("mouseenter", function () {
      $(this)
        .find("img")
        .attr("src", "./assets/portalAsset/images/Bag_Backpack.gif");
    })
    .on("mouseleave", function () {
      $(this)
        .find("img")
        .attr("src", "./assets/portalAsset/images/Bag_Backpack.png");
    });
  $(".bagcase-hover")
    .on("mouseenter", function () {
      $(this)
        .find("img")
        .attr("src", "./assets/portalAsset/images/Bag_Briefcase.gif");
    })
    .on("mouseleave", function () {
      $(this)
        .find("img")
        .attr("src", "./assets/portalAsset/images/BagBriefcase.png");
    });
  $(".gifts-hover")
    .on("mouseenter", function () {
      $(this).find("img").attr("src", "./assets/portalAsset/images/gifts.gif");
    })
    .on("mouseleave", function () {
      $(this).find("img").attr("src", "./assets/portalAsset/images/gifts.png");
    });
  $(".bluebottle-hover")
    .on("mouseenter", function () {
      $(this)
        .find("img")
        .attr("src", "./assets/portalAsset/images/blackbottle.gif");
    })
    .on("mouseleave", function () {
      $(this)
        .find("img")
        .attr("src", "./assets/portalAsset/images/blackbottle.png");
    });
  $(".graybottle-hover")
    .on("mouseenter", function () {
      $(this)
        .find("img")
        .attr("src", "./assets/portalAsset/images/graybottle.gif");
    })
    .on("mouseleave", function () {
      $(this)
        .find("img")
        .attr("src", "./assets/portalAsset/images/graybottle.png");
    });
  $(".redbottle-hover")
    .on("mouseenter", function () {
      $(this)
        .find("img")
        .attr("src", "./assets/portalAsset/images/redbottle.gif");
    })
    .on("mouseleave", function () {
      $(this)
        .find("img")
        .attr("src", "./assets/portalAsset/images/redbottle.png");
    });

  $(".Tshirt-hover,.Tshirt-hover1,.Tshirt-hover2")
    .on("mouseenter", function () {
      $(this)
        .find("img")
        .attr("src", "./assets/portalAsset/images/Tshirt_grey.gif");
    })
    .on("mouseleave", function () {
      $(this)
        .find("img")
        .attr("src", "./assets/portalAsset/images/Tshirt_grey.png");
    });
  $(".redT-hover, .redT-hover1, .redT-hover2")
    .on("mouseenter", function () {
      $(this)
        .find("img")
        .attr("src", "./assets/portalAsset/images/Tshirt_red.gif");
    })
    .on("mouseleave", function () {
      $(this)
        .find("img")
        .attr("src", "./assets/portalAsset/images/Tshirt_red.png");
    });
  $(".blackT-hover, .blackT-hover1, .blackT-hover2")
    .on("mouseenter", function () {
      $(this)
        .find("img")
        .attr("src", "./assets/portalAsset/images/Tshirt_black.gif");
    })
    .on("mouseleave", function () {
      $(this)
        .find("img")
        .attr("src", "./assets/portalAsset/images/Tshirt_black.png");
    });
  $(".blacknote-hover")
    .on("mouseenter", function () {
      $(this)
        .find("img")
        .attr("src", "./assets/portalAsset/images/Notebook_black.gif");
    })
    .on("mouseleave", function () {
      $(this)
        .find("img")
        .attr("src", "./assets/portalAsset/images/Notebook_black.png");
    });
  $(".rednote-hover")
    .on("mouseenter", function () {
      $(this)
        .find("img")
        .attr("src", "./assets/portalAsset/images/Notebook_red.gif");
    })
    .on("mouseleave", function () {
      $(this)
        .find("img")
        .attr("src", "./assets/portalAsset/images/Notebook_red.png");
    });
});
// set initial state ratio btn laptop check
var $laptop = $('.laptopcheck input[type="radio"]:checked');
$('.laptopcheck input[type="radio"]').change(function () {
  $laptop
    .prop("checked", false)
    .closest(".laptopcheck .card")
    .removeClass("checked");
  $laptop = $(this);
  $laptop.closest(".laptopcheck .card").addClass("checked");
});
// set initial state ratio btn bag check
var $bagcheck = $('.bagchk input[type="radio"]:checked');
$('.bagchk input[type="radio"]').change(function () {
  $bagcheck
    .prop("checked", false)
    .closest(".bagchk .card")
    .removeClass("checked");
  $bagcheck = $(this);
  $bagcheck.closest(".bagchk .card").addClass("checked");
});
// set initial state ratio btn bottle check
var $bottleSec = $('.bottlecheck input[type="radio"]:checked');
$('.bottlecheck input[type="radio"]').change(function () {
  $bottleSec
    .prop("checked", false)
    .closest(".bottlecheck .card")
    .removeClass("checked");
  $bottleSec = $(this);
  $bottleSec.closest(".bottlecheck .card").addClass("checked");
});
// set initial state ratio btn tshirtcheck check
var $tshirtSec = $('.tshirtcheck input[type="radio"]:checked');
$('.tshirtcheck input[type="radio"]').change(function () {
  $tshirtSec
    .prop("checked", false)
    .closest(".tshirtcheck .card")
    .removeClass("checked");
  $tshirtSec = $(this);
  $tshirtSec.closest(".card").addClass("checked");
});
// set initial state ratio btn tshirtcheck1 check
var $tshirtSec1 = $('.tshirtcheck1 input[type="radio"]:checked');
$('.tshirtcheck1 input[type="radio"]').change(function () {
  $tshirtSec1
    .prop("checked", false)
    .closest(".tshirtcheck1 .card")
    .removeClass("checked");
  $tshirtSec1 = $(this);
  $tshirtSec1.closest(".card").addClass("checked");
});
// set initial state ratio btn tshirtcheck2 check
var $tshirtSec2 = $('.tshirtcheck2 input[type="radio"]:checked');
$('.tshirtcheck2 input[type="radio"]').change(function () {
  $tshirtSec2
    .prop("checked", false)
    .closest(".tshirtcheck2 .card")
    .removeClass("checked");
  $tshirtSec2 = $(this);
  $tshirtSec2.closest(".card").addClass("checked");
});
// set initial state ratio btn notebook check
var $notebookSec = $('.notebookcheck input[type="radio"]:checked');
$('.notebookcheck input[type="radio"]').change(function () {
  $notebookSec
    .prop("checked", false)
    .closest(".notebookcheck .card")
    .removeClass("checked");
  $notebookSec = $(this);
  $notebookSec.closest(".notebookcheck .card").addClass("checked");
});
//storage for laptop
$("#macstorage, #windowstorage, .mac-store").hide();
$("#macchecked").click(function () {
  $("#macstorage").show();
  $("#windowstorage").hide();
  $(".mac-store").show();
});
$("#windowchecked").click(function () {
  $(".mac-store").show();
  $("#windowstorage").show();
  $("#macstorage").hide();
});
//welcome modal pupup onload
$(function () {
  $("#welcomepopup").modal("show");
  setTimeout(function () {
    $("#welcomepopup").modal("hide");
  }, 15000);
});
$("#welcomepopup").on("hidden.bs.modal", function () {
  $("#basic").addClass("active");
});
$("#welcomepopup").modal({
  show: false,
  backdrop: "static",
});
// show stuck kmodal popup in delay
$(function () {
  setTimeout(function () {
    $("#stuck").modal();
  }, 900000);
  setTimeout(function () {
    $("#stuck").modal("hide");
  }, 915000);
});

//message alert
$(".inputfield:first").keypress(function () {
  $("#message").removeClass("hidesave").addClass("adding").slideDown().show();
  setTimeout(function () {
    $("#message").fadeOut("slow");
  }, 1000);
});
// adding another tshirt
$("#tshirtchecked1, #tshirtchecked2, #tshirtplus2").hide();
$("#tshirtplus1").click(function () {
  $("#tshirtchecked1, #tshirtplus2").show();
  $("#tshirtchecked2, #tshirtplus1").hide();
});
$("#tshirtplus2").click(function () {
  $("#tshirtplus2, #tshirtplus2").hide();
  $("#tshirtchecked2").show();
});
//file input
$(document).on("change", ".file-input", function () {
  var filesCount = $(this)[0].files.length;
  var textbox = $(this).prev();
  if (filesCount === 1) {
    var fileName = $(this).val().split("\\").pop();
    textbox.text(fileName);
  } else {
    textbox.text(filesCount + " files selected");
    $(this)
      .parent(".file-drop-area")
      .find(".upload_img")
      .attr("src", "./assets/portalAsset/images/casualPic.png");
  }
});
$(".year").datepicker({
  format: "yyyy",
  viewMode: "years",
  minViewMode: "years",
});
// $(".month-year").datepicker({
//   format: "mm yyyy",
//   viewMode: "month year",
//   minViewMode: "mm yyyy",
// });
//license and voterid
$(document).ready(function () {
  $("#license-content").hide();
  $("#license").click(function () {
    $("#license-content").show();
    $("#voter-content").hide();
  });
  $("#Voter").click(function () {
    $("#license-content").hide();
    $("#voter-content").show();
  });
  //yes and no for work expirence
  $("#Yes").click(function () {
    $("#yes-content").show();
  });
  $("#No").click(function () {
    $("#yes-content").hide();
    $("#working-content").hide();
    $("#relieved-content").hide();
    $("#working").removeClass("active");
    $("#relieved").removeClass("active");
    $("input:radio[name=work_status]").prop("checked", false);
    $("#exp_emp_name").val("");
    $("#exp_designation").val("").selectpicker("refresh");
    $(".workstart").val("").datepicker("refresh");
  });
  //working experience
  $("#working-content").hide();
  $("#relieved-content").hide();
  $("#relieved").click(function () {
    $("#relieved-content").show();
    $("#working-content").hide();
  });
  $("#working").click(function () {
    $("#relieved-content").hide();
    $("#working-content").show();
  });
  //alternate content
  $("#alternatecontactinput").hide();
  $("#alternate-number").click(function () {
    $("#alternatecontactinput").show();
    $("#alternate-number").hide();
  });
  //casual
  $("#casual-content").hide();
  $("#casual").click(function () {
    $("#casual-content").show();
    $("#casual").hide();
  });
  //passport
  $("#passport-content, .showpassportminus").hide();
  $("#plus").click(function () {
    $("#passport-content, .showpassportminus").show();
    $("#plus").hide();
  });
  $(".showpassportminus").click(function () {
    $("#passport-content, .showpassportminus").hide();
    $("#plus").show();
  });
  //certificate
  $("#certificate-content, .showcertificateminus").hide();
  $("#certificateplus").click(function () {
    $("#certificate-content, .showcertificateminus").show();
    $("#certificateplus").hide();
  });
  $(".showcertificateminus").click(function () {
    $("#certificate-content, .showcertificateminus").hide();
    $("#certificateplus").show();
  });
  //medical none select
  $(
    ".dosedate1 , .dosedate2 , #nonereaseon, #dose2reaseon, .vaac_cert "
  ).hide();
  $("#dose1").click(function () {
    $(".dosedate1, #dose2reaseon, .vaac_cert").show();
    $("#nonereaseon").hide();
    $(".dosedate2").hide();
  });
  $("#dose2").click(function () {
    $(".dosedate1, .dosedate2, .vaac_cert ").show();
    $("#nonereaseon, #dose2reaseon").hide();
  });
  $("#none").click(function () {
    $(" #nonereaseon").show();
    $(" #dose2reaseon, .dosedate2, .dosedate1, .vaac_cert").hide();
  });
  //address checked function
  $("#address").click(function () {
    if ($("#aadharcheck").is(":checked")) {
      $("#hide-address").hide();
      $("input:radio[name=add_proof]:checked").each(function () {
        $(this).prop("checked", false);
        $("#license-content").hide();
        $("#voter-content").hide();
        $("#license").removeClass("active");
        $("#Voter").removeClass("active");
      });
    } else if ($("#aadharcheck").is(":checked") == false) {
      $("#hide-address").show();
      $("input:radio[name=add_proof]:checked").each(function () {
        $(this).prop("checked", true);
      });
    }
  });
  //max-length for pincode
  $(document).ready(function () {
    $("#pincode-val, #pincode-get").on("input propertychange", function () {
      charLimit(this, 6);
    });
  });
  let charLimit = (input, maxChar) => {
    let len = $(input).val().length;
    if (len > maxChar) {
      $(input).val($(input).val().substring(0, maxChar));
    }
  };
  $(".salary-click").click(function () {
    if ($("#salary").is(":checked")) {
      $(".salary-content").hide();
    } else {
      $(".salary-content").show();
    }
  });
  //get values from permanant address
  $("#permanant-address").change(function () {
    var pincode = $("#pincode-val").val();
    var state = $("#state-val").val();
    var taluk = $("#taluk-val").val();
    var city = $("#city-val").val();
    var area = $("#area-val").val();
    var building = $("#building-val").val();
    var block = $("#block-val").val();
    var country = $(".country-val .filter-option").attr("class");
    var countrytext = $(".country-val .filter-option").text();
    if ($(this).is(":checked") == false) {
      $(".checkval").each(function () {
        $(this).val("").prop("disabled", false);
      });
    } else if ($("#permanant-address").is(":checked")) {
      $("#pincode-get").val(pincode).prop("disabled", true);
      $("#state-get").val(state).prop("disabled", true);
      $("#taluk-get").val(taluk).prop("disabled", true);
      $("#city-get").val(city).prop("disabled", true);
      $("#area-get").val(area).prop("disabled", true);
      $("#building-get").val(building).prop("disabled", true);
      $("#block-get").val(block).prop("disabled", true);
      $(".country-get .dropdown-toggle .filter-option")
        .attr("class", country)
        .text(countrytext);
      $(".country-get").prop("disabled", true);
    }
  });
  // Fieldset navigation via Progress-bar
  function nav() {
    current_fs.animate(
      { opacity: 0 },
      {
        step: function (now) {
          opacity = 1 - now;
          current_fs.css({
            display: "none",
            position: "relative",
          });
          next_fs.show();
          next_fs.css({ opacity: opacity });
        },
        duration: 600,
      }
    );
  }
  $("#progressbar li").click(function () {
    if ($(this).hasClass("change-bg")) {
      $(this).addClass("active");
      $(this).nextAll().removeClass("active change-bg ").find(".test").addClass("f1 animatedmode");
    }
  });
  $(".field1").click(function () {
    if ($(this).parent().hasClass("change-bg")) {
      current_fs = $(".next").parent();
      next_fs = $("#basic-details").parent();
      nav();
    }
  });
  $(".field2").click(function () {
    if ($(this).parent().hasClass("change-bg")) {
      current_fs = $(".next").parent();
      next_fs = $("#preferance-btn").parent();
      nav();
    }
  });
  $(".field3").click(function () {
    if ($(this).parent().hasClass("change-bg")) {
      current_fs = $(".next").parent();
      next_fs = $("#upload-btn").parent();
      nav();
    }
  });
  $(".field4").click(function () {
    if ($(this).parent().hasClass("change-bg")) {
      current_fs = $(".next").parent();
      next_fs = $("#education-btn").parent();
      nav();
    }
  });
  $(".field5").click(function () {
    if ($(this).parent().hasClass("change-bg")) {
      current_fs = $(".next").parent();
      next_fs = $("#insurance-btn").parent();
      nav();
    }
  });
});
$('.nav-pills li:nth-child(1)').click(()=>{
  $('#previewmodal .modal-content').css('height','660px')
})
$('.nav-pills li:nth-child(2)').click(()=>{
  $('#previewmodal .modal-content').css('height','580px')
})
$('.nav-pills li:nth-child(3)').click(()=>{
  $('#previewmodal .modal-content').css('height','660px')
})
$('.nav-pills li:nth-child(4)').click(()=>{
  $('#previewmodal .modal-content').css('height','660px')
})
$('.nav-pills li:nth-child(5)').click(()=>{
  $('#previewmodal .modal-content').css('height','660px')
})