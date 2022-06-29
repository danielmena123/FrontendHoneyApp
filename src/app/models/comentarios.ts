export interface Comentarios {
    comentariosId: number;
    descripcion: string;
    fecha: Date;
    nombreUsuario: string;
    usuariosId: number;
    numLikes: number;
    userLike: number;
    activo: boolean;
    shortime: boolean;
}

export interface Comentario_C {
    descripcion: string;
    publicacionesId: number;
    usuariosId: number;
}

export interface Comentario_U{
    descripcion: string;
    comentariosId: number;
}