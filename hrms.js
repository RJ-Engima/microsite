const express = require('express');
const path = require('path');
var mb = require("morgan-body");
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const app = express();
const session = require('express-session');
const log = require('./app/configs/log.js');
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const validatorExpress = require('express-validator');
const createNamespace = require('continuation-local-storage').createNamespace;
const traceRequest = createNamespace('trace-Request');
const uuidv4 = require('uuid/v4');
const helmet = require('helmet')
const args = require("yargs");
const cors = require('cors')

args.command({
    command: "config",
    describe: "Please provide environment",
    builder: {
        env: {
            describe: "Environment=prod, uat, dev",
            demandOption: true,
            type: "string",
        },
    },
    handler: function (argv) {
        require("dotenv").config({ path: "./hrms" + argv.env + ".env" });
        return log.warn("Server started at with Environment :: " + argv.env);
    },
}).demandCommand(1, "You need at least one command to start the application");
args.parse();

const constant = require('./app/configs/constants');
const { StatusCodeError } = require('request-promise/errors');
const port = process.env.APPLICATION_PORT;

var whitelist = ["https://hrms-uat.m2pfintech.com","https://hrms-onboarding.m2pfintech.com","http://localhost:7051"]
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin ) {
      callback(null, true)
    } else {
      callback(new Error("Blocked by cors"))
    }
  }
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(csrf({ cookie: true }));
app.use(function (req, res, next) {
    res.cookie('X-CSRF-Token', req.csrfToken());
    res.locals.csrfToken = req.csrfToken();
    next();
 });
app.use(validatorExpress());
app.use(helmet.frameguard({ action: 'deny' }));
app.use(helmet.referrerPolicy({ policy: 'same-origin' }));
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.xssFilter());
app.use(helmet.noSniff());
app.use(function (req, res, next) {
    traceRequest.run(function () {
        traceRequest.set('reqId', uuidv4());
        next();
    });
});
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
            scriptSrcAttr: ["'self'","'unsafe-inline'"],
            scriptSrc: ["'self'", 'mojoaxel.github.io','unpkg.com','pro.fontawesome.com','cdnjs.cloudflare.com',  "'unsafe-inline'"],
            styleSrc: ["'self'", 'mojoaxel.github.io','pro.fontawesome.com','cdn.datatables.net','cdn.jsdelivr.net','cdnjs.cloudflare.com',  "'unsafe-inline'"],
            imgSrc: ["'self'",'data:','blob:',"*"],
            connectSrc: ["'self'",'data:',"*"],
            // mediaSrc: ["'self'",'data:','blob:','filesystem'],
            },
        },
    })
);

app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Origin", ["https://hrms-uat.m2pfintech.com","https://hrms-onboarding.m2pfintech.com","http://localhost:7051"]);
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-requested-with")
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,POST,PUT");
    res.setHeader("pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("X-Frame-Options", "deny");
    res.setHeader("Permissions-Policy", "geolocation=(self), microphone=()");
    res.setHeader("Cache-Control", "no-store, no-cache, pre-check=0, post-check=0, max-age=0, s-maxage=0");
    res.removeHeader("X-Powered-By");
    next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));

// view engine
app.engine('handlebars', exphbs({
    "defaultLayout": 'layout', "helpers": {
        compare: function (arg1, arg2, options) {
            if (arg1 === arg2) {
                return options.fn(this);
            }
            return options.inverse(this);
        }
    }
}));

app.set('view engine', 'handlebars');
log.info("Overriding 'Express' logger");

const statusMonitor = require('express-status-monitor')();
app.get('/status', function (req, res) {
    res.render('template/404', {
        'layout': false
    });
});
app.use(statusMonitor);
app.get('/forex/stats', statusMonitor.pageRoute);

app.use(function (req, res, next) {
    if (req.headers['x-forwarded-host']) {
        req.headers.referrerBaseUrl = req.headers['x-forwarded-host'];
    } else {
        req.headers.referrerBaseUrl = req.headers.host;
    }
    if (req.method === 'POST') {
        req.body = JSON.parse(JSON.stringify(req.body).replace(/[<>]/g, ""));
        next();
    } else {
        next();
    }
});

app.use(function (err, req, res, next) {
    if (err.code !== 'EBADCSRFTOKEN') return next(err)
    // handle CSRF token errors here
    log.error('Forbiddden request - CSRF ')
    res.status(403)
    res.send('Forbidden request - CSRF')
}) 
app.use(session({
    secret: constant.SECRETKEY,
    saveUninitialized: true,
    resave: false,
    cookie: {
        maxAge: 2700000,
        secure: false,
        httpOnly: true,
    },
    rolling: true
}));

app.use(require('./app/routes'));
app.use(cors(corsOptions));
require('./app/index')(app);

// app.use((err,req,res,next)=>{
//     if(err){
//         log.error("Invalid Request")
//         // res.status(500).send("Invalid Request")
//     } else{
//         next()
//     }
// })
// RESOLVE 404
app.get('*', function (req, res) {
    res.render('template/404', {
        'layout': false
    });
});
app.use(function (req, res, next) {
  res.render("template/403", { layout: false });
});

app.use(function (req, res, next) {
  res.render("template/401", { layout: false });
});


function sessionTimeoutCheckforUrlRequests(req, res, next) {
    let _ = require('underscore'),
        pathsToIgnore = ['/logout','/tokenLogin', '/resetPassword', '/resetPasswordOtpTrigger'];
    if (_.contains(pathsToIgnore, req.path)) {
        next();
    }  else {
        next();
    }
}

function sessionTimeoutCheckforApiRequests(req, res, next) {
    let _ = require('underscore'),
        pathsToIgnore = constant.APIROUTES;
    if (_.contains(pathsToIgnore, req.path)) {
        next();
    } else {
        res.status(440).send();
    }
}

app.listen(port, function () {
    log.warn('Server started at port :: ' + port);
});

module.exports = app;
