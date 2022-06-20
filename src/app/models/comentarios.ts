export interface Comentarios {
    comentariosId: number;
    descripcion: string;
    fecha: Date;
    nombreUsuario: string;
    usuariosId: number;
    likes: number;
    activo: boolean;
    shortime: boolean;
}

export interface Comentario_C {
    descripcion: string,
    publicacionesId: number,
    usuariosId: number
}