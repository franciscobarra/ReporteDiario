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

    passport.use(new xssec.JWTStrategy(xsuaa)); // Se configura el Passport para usar la estrategia JWT asociada al xsuaa definido anteriormente

    cds.on("bootstrap", app => {
        app.use(passport.initialize()); // Añade un middleware que autentica cada solicitud, Si es exitosa, el objeto "user" se asjunta al "req"
        app.use((req, res, next) => {
            passport.authenticate('JWT', { session: false }, async (err, user, info) => {
                    if(cdsConfig.auth.passport.strategy === 'mock'){ // Si es un usuario de prueba, saltar autentificación con los atributos del usuario del package.json
                        user = cds.env.auth.passport.users.admin; // User admin
                    }

                    console.log(user);
                    const { Usuario, Rol, UsuarioRol } = cds.entities;
                    let rolNames = []
                    try {
                        const userUsuarioRolResults = await SELECT.from(`${Usuario.name} as u`)
                            .join(`${UsuarioRol.name} as ur`).on(`u.ID = ur.usuario_ID`)
                            .where({ 'u.correo': user.id });
                        if (userUsuarioRolResults && userUsuarioRolResults.length > 0) {

                            const rolIds = userUsuarioRolResults.map(result => result.rol_ID);
                            const rolesResults = await SELECT.from(`${Rol.name} as r`)
                                .where({ 'r.ID': { in: rolIds } })
                                .columns(`r.nombre`)
                            rolNames = rolesResults.map(result => result.nombre);
                        }
                    } catch (error) {
                        console.error("Error al ejecutar la consulta -- ROL:", error.message);
                    }
                    if (!rolNames.includes('ADMIN')) {
                        return res.status(403).json({ message: 'Autenticación fallida.' });
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
    });

// Función para verificar roles y derivar a diferentes funciones
/*function checkRole(role) {
    return function (req, res, next) {
        if (req.user && req.authInfo.checkLocalScope(role)) {
            next();
        } else {
            res.status(403).json({ message: "Forbidden" });
        }
    };
}*/


module.exports = cds.server;