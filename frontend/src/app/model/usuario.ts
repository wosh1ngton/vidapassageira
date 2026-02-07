export interface UsuarioCreateDTO {
  username: string;
  email: string;
  password: string;
  termsAccepted?: boolean;
  privacyAccepted?: boolean;
}


export interface UsuarioDTO {
  username: string;
  email: string;
  id: string;
}

