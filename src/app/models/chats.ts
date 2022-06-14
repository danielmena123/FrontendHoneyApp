export interface VerfifyChat{
    chatsId: number
}

export interface Chat_Detalle_C{
    titulo: string,
    usuarioPrimario: number,
    usuarioSecundario: number,
    nombreUsuario: string
}

export interface Chats{
    chatsId: number,
    titulo: string,
    fecha: Date,
    estado: number,
    nombreUsuario: string,
    mensaje: string,
    lastFecha: Date,
    shortime: boolean,    
}

export interface Salas {
    rooms: string
}