export interface Login{
    correoElectronico: string;
    contraseña: string;
}

export interface UsuarioAccess{
    usuariosId: number;
    nombreUsuario: string;
    url?: string;
}

export interface IResponse{
    token: string;
    usuario: any;
}