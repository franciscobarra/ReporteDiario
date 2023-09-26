const cds = require("@sap/cds"); // Módulo principal que trabaja con CAP
const xsenv = require("@sap/xsenv"); // Ayuda a cargar y acceder a las variables de entrono y servicios vinculados a la aplicación (SAP BTP)
const passport = require("passport"); // Miidleware de autentificación para node.js
const xssec = require("@sap/xssec"); // Módulo de seguridad de SAP que proporciona la estrategia JWT para passport en el contexsto de XSUAA
const jwt = require('jsonwebtoken');
const cdsConfig = cds.env;

xsenv.loadEnv(); // Funcion que carga las variables de entorno definidas en el archivo de "default-env.json" (para desarrollo local)

const xsuaa = xsenv.getServices({
    xsuaa: {
        name: 'ReporteDiario-auth'
    }
}).xsuaa; // Se obtiene la config del servicio xsuaa que está vinculado a la aplicación. Se espera que sea ReporteDiario-Auth
const xsappname = xsuaa.xsappname // Nombre de la App

passport.use(new xssec.JWTStrategy(xsuaa)); // Se configura el Passport para usar la estrategia JWT asociada al xsuaa definido anteriormente

cds.on("bootstrap", app => {
    app.use(passport.initialize());

    if (cdsConfig.auth.passport.strategy === 'mock') {
        user = cds.env.auth.passport.users.admin;
        return
    }

    app.use((req, res, next) => {

        passport.authenticate('JWT', { session: false }, async (err, user, info) => {

            const jwtToken = readJwt(req);

            if (jwtToken) {
                console.log("===> JWT: scopes: " + jwtToken.scope);
                console.log("===> JWT: client_id: " + jwtToken.client_id);
                console.log("===> JWT: user: " + jwtToken.user_name);
            }

            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(402).json({ message: "Unauthorized" });
            }
            req.user = user;
            next();
        })(req, res, next);
    });

    app.use('/Administrador', verificarRolAdministrador);
    app.use('/Analista', verificarRolAnalista);
    app.use('/Produccion', verificarRolProduccion);
});

// Middleware para verificar el rol de Administrador
const verificarRolAdministrador = (req, res, next) => {

    let jwtToken = readJwt(req)

    if (jwtToken.scope && jwtToken.scope.includes(`${xsappname}.Administrador`)) {
        return next();
    }

    return res.status(403).json({ message: 'Acceso denegado' });

};

// Middleware para verificar el rol de Analista
const verificarRolAnalista = (req, res, next) => {
    let jwtToken = readJwt(req)

    if (jwtToken.scope && jwtToken.scope.includes(`${xsappname}.Administrador`)) {
        return next();
    }

    if (jwtToken.scope && jwtToken.scope.includes(`${xsappname}.Analista`)) {
        return next();
    }

    return res.status(403).json({ message: 'Acceso denegado' });
};

// Middleware para verificar el rol de Producción
const verificarRolProduccion = (req, res, next) => {
    let jwtToken = readJwt(req)

    if (jwtToken.scope && jwtToken.scope.includes(`${xsappname}.Administrador`)) {
        return next();
    }
    if (jwtToken.scope && jwtToken.scope.includes(`${xsappname}.Analista`)) {
        return next();
    }
    if (jwtToken.scope && jwtToken.scope.includes(`${xsappname}.Produccion`)) {
        return next();
    }

    return res.status(403).json({ message: 'Acceso denegado' });

};

const readJwt = function (req) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const theJwtToken = authHeader.substring(7);
        if (theJwtToken) {
            console.log("===> JWT Token: " + theJwtToken);
            const jwtBase64Encoded = theJwtToken.split(".")[1];
            if (jwtBase64Encoded) {
                const jwtDecoded = Buffer.from(jwtBase64Encoded, "base64").toString(
                    "ascii"
                );
                return JSON.parse(jwtDecoded);
            }
        }
    }
};

module.exports = cds.server;