namespace cio;

using {
    cuid,
    managed
} from '@sap/cds/common';

entity Usuario : cuid, managed {
    nombres : String;
    apellidos: String;
    num_identificador : String;
    correo : String;
    telefono: String;
    area_negocio : String;
    tipo_usuario : String;
    zona : String;
    pais : Association to Pais;
    roles  : Association to many UsuarioRol
                 on roles.usuario = $self;
}

entity Rol : cuid, managed {
    nombre : String;
    descripcion : String;
    vigente : Boolean;
    usuarios  : Association to many UsuarioRol
                    on usuarios.rol = $self;
}

entity UsuarioRol : cuid, managed {
    usuario : Association to Usuario;
    rol     : Association to Rol;
    vigente : Boolean;
}

entity Pais : cuid, managed {
    nombre : String;
    codigo : String;
}

entity Maquina : cuid, managed {
    proceso     : String;
    tipo        : String;
    equipo      : String;
    cod_modelo  : String;
    descripcion : String;
}

entity Parametro : cuid, managed {
    param: String;
    valor : String;
    glosa  : String;
    descripcion  : String;
    vigente  : Boolean;
}

entity Turno : cuid, managed {
    descripcion: String;
    hora_inicial : String;
    hora_fin  : String;
    vigente  : Boolean;
    pais : Association to Pais;
}

entity LineaFaena : cuid, managed {
    codigo: String;
    descripcion : String;
}

entity TipoTiempoPerdido : cuid, managed {
    codigo: String;
    proceso : String;
    descripcion : String;
    vigente : Boolean;
}

entity Predio : cuid, managed {
    zona: String;
    rol : String;
    descripcion : String;
    vigente : Boolean;
}

entity MaquinaFaenas : cuid, managed {
    sector      : String;
    asistencia        : Boolean;
    horaIniAsistencia : Time;
    horaFinAsistencia : Time;
    horaIni  : Time;
    horaFin  : Time;
    horaIniRealJornada : Time;
    horaFinRealJornada : Time;
    horaIniCarroMad : Time;
    horaFinCarroMad : Time;
    horasTrabajadas : Decimal;
    horasPerdidas : Decimal;
    horasTotalesValidadas : Decimal;
    horasTotalesReales : Decimal;
    horaTotalesCarroMad : Decimal;
    horaTotalesAsistencia : Decimal;
    maquina : Association to Maquina;
}

entity JornadaFaenas : cuid, managed {
    nroSector: Int32;
    proceso : String;
    nroArboles: Int32;
    nroCiclo: Int32;
    volArbolesProTotal: Decimal;
    gdbFromDate : String;
    gdbToDate : String;
    repoteDiario : Association to ReporteDiario;
    maquinaFaenas : Association to MaquinaFaenas;
}

entity TiempoPerdido : cuid, managed {
    minutos: Decimal;
    observaciones : String;
    descripcion : String;
    vigente : Boolean;
    tipoTiempoPerdido : Association to TipoTiempoPerdido;
    jornadaFaenas : Association to JornadaFaenas;
}

entity ReporteDiario : cuid, managed {
    dia: Integer;
    anio : Integer;
    maxDate : DateTime;
    minDate : DateTime;
    fecha : DateTime;
    fecha_computar : DateTime;
    observacion : String;
    usuario : Association to Usuario;
    lineaFaena : Association to LineaFaena;
    turno : Association to Turno;
    predio : Association to Predio;
}