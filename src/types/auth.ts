/**
 * Tipos de autenticación y autorización para la aplicación
 * Separación estricta entre B2B (Mayorista) y B2C (Minorista)
 */

export enum UserRole {
  ADMIN = "admin", // Administrador - Acceso total
  SELLER = "seller", // Vendedor Siver509 - Acceso a módulo B2B
  CLIENT = "client", // Cliente Final - Acceso solo a experiencia B2C
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles: UserRole[];
  fallbackPath?: string;
}
