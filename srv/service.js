// Este módulo se invocará de foma automatica, solo si posee el mismo nombre que el .cds ("service.cds")
module.exports = cds.service.impl(srv => {

    // CRUD estándar: Manejador personalizado para CREAR un usuario
    srv.before('CREATE', 'Usuario', (data) => {
        // ... se puede personalizar antes de crear un usuario ...
    });

    // CRUD estándar: Manejador personalizado para LEER un usuario
    srv.before('READ', 'Usuario', (data) => {
        console.log("Leer usuario");
        console.log(JSON.stringify(data.query));
        // ... se puede personalizar después de leer un usuario ...
    });

    srv.after('READ', 'Usuario', (data) => {
        try{
            console.log(JSON.stringify(data.query));
        } catch (error) {
            console.error("Error al ejecutar la consulta -- ROL:", error.message);
        }
    });

    // test
    srv.on('resetPassword', async (req) => {
        console.log("dd")
        const userID = req.data.usuarioID;
        return "Contraseña reseteada con éxito para usuario " + userID;
    });

    srv.on('getTotalUsuarios', async () => {
        const count = await cds.run(SELECT.from('cio.Usuario').count());
        return count;
    });
});