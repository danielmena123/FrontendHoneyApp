export interface Respuestas{
    respuestasId: number;
    descripcion: string;
    fecha: Date;
    estado: number;
    comentarioId: number;
    nombreUsuario: string;
    usuariosId: number;
    likes: number;
}

export interface Respuesta_C{
    descripcion: string;
    comentariosId: number;
    usuariosId: number;
}

export interface Respuesta_U{
    descripcion: string;
    respuestasId: number;
}