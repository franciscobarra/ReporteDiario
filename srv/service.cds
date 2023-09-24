using {cio as db} from '../db/schema';

@(path : '/Administrador') 
@(requires: 'authenticated-user')
service Administrador {

    entity Usuario as projection on db.Usuario;
    entity Rol as projection on db.Rol;
    entity UsuarioRol as projection on db.UsuarioRol;
    entity Pais as projection on db.Pais;
}

@(path : '/Mantenedor') 
@(requires: 'authenticated-user')
service Mantenedor {
    
    /*entity Usuario (restrict: [ 
        { grant: ['READ','WRITE'], to: 'role:Token_Exchange' },
    ])/ as projection on cio.Usuario;*/

    entity Maquina as projection on db.Maquina;
    entity Parametro as projection on db.Parametro;
    entity Turno as projection on db.Turno;
    entity LineaFaena as projection on db.LineaFaena;
    entity Predio as projection on db.Predio;
    entity TipoTiempoPerdido as projection on db.TipoTiempoPerdido;

     // Acción
    action resetPassword(usuarioID: UUID) returns String;

    // Función
    function getTotalUsuarios() returns Integer;

}

@(path : '/Produccion')
@(requires: 'authenticated-user')
service Produccion {

    entity Maquina @(restrict: [{ grant: ['READ']} ]) as projection on db.Maquina;
    entity Parametro @(restrict: [{ grant: ['READ']} ]) as projection on db.Parametro;
    entity Turno @(restrict: [{ grant: ['READ']} ]) as projection on db.Turno;
    entity LineaFaena @(restrict: [{ grant: ['READ']} ]) as projection on db.LineaFaena;
    entity Predio @(restrict: [{ grant: ['READ']} ]) as projection on db.Predio;
    entity TipoTiempoPerdido @(restrict: [{ grant: ['READ']} ]) as projection on db.TipoTiempoPerdido;

    entity MaquinaFaenas as projection on db.MaquinaFaenas;
    entity JornadaFaenas as projection on db.JornadaFaenas;
    entity TiempoPerdido as projection on db.TiempoPerdido;
    entity ReporteDiario as projection on db.ReporteDiario;

}

