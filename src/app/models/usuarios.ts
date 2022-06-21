export interface Usuarios {
    usuariosId: number,
    nombreUsuario: string,
    correoElectronico: string,
    role: string
}

export interface Usuario {
    usuariosId: number,
    nombres: string,
    apellidos: string,
    nombreUsuario: string,
    correoElectronico: string,
    contraseña: string,
    nombre?: string,
    rolesId?: number
}

export interface Usuario_C {
    nombres: string,
    apellidos: string,
    nombreUsuario: string,
    correoElectronico: string,
    contraseña: string
    roleId: Number
}

export interface Usuario_U {
    usuariosId: number,
    nombres: string,
    apellidos: string,
    nombreUsuario: string,
    correoElectronico: string,
    contraseña: string
    roleId: Number
}