export interface Publicaciones{
    publicacionesId: number;
    descripcion: string;
    fecha: Date;
    estado: number;
    nombreUsuario: string;
    usuariosId: number;
    numLikes: number;
    userLike: number;
    activo: boolean;
}

export interface Publicacion_C{
    descripcion: string;
    usuariosId: number;
}

export interface Publicacion_U{
    descripcion: string;
    publicacionesId: number;
}