export interface Mensajes{
    chatsId: number,
    titulo: string,
    mensajesId: number,
    descripcion: string,
    fecha: Date,
    estado: number,
    nombreUsuario: string,
    usuariosId: number,
    shortime: boolean
}

export interface Mensajes_C{
    descripcion: string,
    chatsId: number,
    usuariosId: number,
    nombreUsuario: string
}

export interface Mensajes_Signalr{
    ChatsId: number,
    Titulo: string,
    MensajesId: number,
    Descripcion: string,
    Fecha: Date,
    Estado: number,
    NombreUsuario: string,
    UsuariosId: number,
    shortime: boolean
}