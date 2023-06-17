import { Permission } from '@/content/Management/Staff/CreateUser';

export interface RegisterParams {
  headers: {
    phone: string;
    name: string;
    password: string;
    type: string;
    role: string;
  };
  body: {
    permissions: Permission[];
  };
}
