import { AuthFailedEffect } from './effects/auth/auth-failed.effect';
import { LoginEffects } from './effects/auth/auth.effects';
import { CommonEffect } from './effects/common/common.effect';
import { GetPermissionsFailedEffect } from './effects/auth/get-permissions-failed.effect';
import { PermissionEffects } from './effects/auth/get-permissions.effect';
import { SetCompanyEffect } from './effects/auth/set-company.effect';
import { HydratationEffects } from './hydratation/effects/hydratation.effects';
import { AuthHydrationEffect } from './effects/auth/auth-hydration.effect';
import { LogoutEffect } from './effects/auth/logout.effect';
import { GetFormFieldsEffect } from './effects/admin/suppliers/get-formfields.effect';

export const STORE_EFFECTS = [
  LoginEffects,
  AuthFailedEffect,
  SetCompanyEffect,
  PermissionEffects,
  HydratationEffects,
  GetPermissionsFailedEffect,
  CommonEffect,
  AuthHydrationEffect,
  LogoutEffect,
  GetFormFieldsEffect,
  
];
