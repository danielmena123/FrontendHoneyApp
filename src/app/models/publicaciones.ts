export interface Publicaciones{
    publicacionesId: number,
    descripcion: string,
    fecha: Date,
    estado: number,
    nombreUsuario: string,
    usuariosId: number,
    likes: number,
    activo: boolean;
}

export interface Publicacion_C{
    descripcion: string,
    usuariosId: number
}