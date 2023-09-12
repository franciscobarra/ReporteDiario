const cds = require("@sap/cds");

const xsenv = require("@sap/xsenv");
const passport = require("passport");
const xssec = require("@sap/xssec");

xsenv.loadEnv();

const xsuaa = xsenv.getServices({
    xsuaa : {
        name : 'ReporteDiario-auth'
    }
}).xsuaa;

passport.use(new xssec.JWTStrategy(xsuaa));

cds.on("bootstrap", app => {
    app.use(passport.initialize());
});