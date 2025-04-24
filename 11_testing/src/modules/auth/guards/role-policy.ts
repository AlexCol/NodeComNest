import { SetMetadata } from "@nestjs/common";
import { ROLE_POLICY_KEY } from "../auth.constants";

export enum ERole { //evitar 0 como valor padrão, pois o javascript considera 0 como false
  admin = 1,
  user = 2,
}

export const RolePolicy = (role: ERole) => SetMetadata(ROLE_POLICY_KEY, role); //deve ser usado nos controllers
