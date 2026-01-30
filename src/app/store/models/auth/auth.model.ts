import { ITokens } from '@/shared/entities/tokens.entity';
import { ICompany } from '@/shared/entities/company.entity';
import { IBranding } from '@/shared/entities/branding.entity';
export interface AuthState {
  isAutenticated: boolean;
  loading: boolean;
  error: any;
  companies: ICompany[];
  userId: string | null;
  tokens: ITokens;
  name: string;
  email: string;
  branding: IBranding;
  permissions: any;
  activeCompany: ICompany;
  companyId: string | null;
}

export const initialAuthState: AuthState = {
  isAutenticated: false,
  loading: false,
  error: null,
  companies: [],
  userId: null,
  tokens: {} as ITokens,
  name: '',
  email: '',
  branding: {} as IBranding,
  permissions: null,
  activeCompany: {} as ICompany,
  companyId: null
};
