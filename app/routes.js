const express = require("express");
const router = express.Router({ caseSensitive: true, strict: true });
const session = require("express-session");
const log = require("./configs/log");

const sessionJwtAuthCheck = (req, res, next) => {
  var pathIgnore = ["/", "/login"];
  if (pathIgnore.includes(req.path)) {
          req.session.destroy();
          next();
  } else {
      if (req.session.authtoken === undefined) {
          return res.redirect("/login");
      } else {
          next();
      }
  }
  
};

router.get("/logout", function (req, res) {
  req.session.destroy();
  res.redirect("/");
});
router.get("/", function (req, res) {
  res.redirect("/login");
});
// Render Login Page
router.get("/login", function (req, res, user) {
  log.info("Base URL :: " + req.headers.referrerBaseUrl);
  res.render("template/login", {
    title: "",
    footer_text: "",
    layout: false,
  });
});
router.get("/home", sessionJwtAuthCheck, function (req, res) {
  if (req.session.role === "BANK") {
    res.redirect("/403");
    return;
  } else if (req.session.role === "user") {
    res.render("onboard/home", {
      title: "Microsite Onboarding - Home",
      csrfToken: req.csrfToken(),
    });
  }
});
router.get("/thankyou", function (req, res) {
  req.session.destroy();
  res.render("template/thankyou", {
    layout: false,
  });
});

router.get("/addDetail",sessionJwtAuthCheck, function (req, res) {
  if (req.session.role === "user") {
    res.redirect("/403");
    return;
  } else {
    res.render("template/addDetail", {
      layout: false,
      title: "HRMS - Add-Details",
      csrfToken: req.csrfToken(),
    });
  }
});

router.get("/viewDetail",sessionJwtAuthCheck, function (req, res) {
  if (req.session.role === "user") {
    res.redirect("/403");
    return;
  } else {
    res.render("template/viewDetail", {
      layout: false,
      title: "HRMS - View-Details",
      csrfToken: req.csrfToken(),
    });
  }
});
router.get("/addDesignation",sessionJwtAuthCheck, function (req, res) {
  if (req.session.role === "user") {
    res.redirect("/403");
    return;
  } else {
    res.render("template/viewDesignation", {
      layout: false,
      title: "HRMS - View-Designation",
      csrfToken: req.csrfToken(),
    });
  }
});
router.get("/addDepartment",sessionJwtAuthCheck, function (req, res) {
  if (req.session.role === "user") {
    res.redirect("/403");
    return;
  } else {
    res.render("template/viewDepartment", {
      layout: false,
      title: "HRMS - View-Department",
      csrfToken: req.csrfToken(),
    });
  }
});
router.get("/addLocation",sessionJwtAuthCheck, function (req, res) {
  if (req.session.role === "user") {
    res.redirect("/403");
    return;
  } else {
    res.render("template/viewLocation", {
      layout: false,
      title: "HRMS - View-location",
      csrfToken: req.csrfToken(),
    });
  }
});
router.get("/403", (req, res) => {
  res.render("template/403", {
    layout: false,
  });
});

router.get("/404", (req, res) => {
  res.render("template/404", {
    layout: false,
  });
});
router.get("/401", (req, res) => {
  res.render("template/401", {
    layout: false,
  });
});

module.exports = router;

function isUsersMenu(req, res, menu) {
  if (!req.session.userMenus) {
    res.status(440).send();
  } else {
    if (req.session.userMenus.includes(menu)) return true;
    else res.render("template/404", { layout: false });
  }
}
