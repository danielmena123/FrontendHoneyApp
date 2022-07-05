export interface Notificaciones{
    mensajesnoleidos: number;
}

export interface NotificacionesNoLeidas{
    notificacionnoleidas: number;
}

export interface NotificacionesForo{
    notificacionesId?: number;
    nombreUsuarioReferencia?: string;
    descripcion: string;
    fecha?: Date;
    referenciaId: number;
    estado?: number;
    tipo_NotificacionesId: number;
    notificacion?: string;
    usuarioReceptorId: number;
    usuariosId: number;
    url?: string;
    shortime?: boolean;
}