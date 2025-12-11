/**
 * Componente ProtectedRoute para controlar acceso según rol
 * 
 * Uso:
 * <ProtectedRoute requiredRoles={[UserRole.ADMIN, UserRole.SELLER]} fallbackPath="/login">
 *   <AdminPage />
 * </ProtectedRoute>
 */

import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { UserRole, ProtectedRouteProps } from "@/types/auth";

const ProtectedRoute = ({
  children,
  requiredRoles,
  fallbackPath = "/login",
}: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario autenticado
  if (!user) {
    return <Navigate to={fallbackPath} replace />;
  }

  // Si el usuario no tiene el rol requerido
  if (!requiredRoles.includes(user.role as UserRole)) {
    // Redirigir según su rol
    const redirectPath = getRoleRedirectPath(user.role as UserRole);
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

/**
 * Obtiene la ruta de redirección según el rol del usuario
 */
export const getRoleRedirectPath = (role: UserRole): string => {
  switch (role) {
    case UserRole.ADMIN:
      return "/admin/dashboard";
    case UserRole.SELLER:
      return "/seller/adquisicion-lotes";
    case UserRole.CLIENT:
    default:
      return "/";
  }
};

export default ProtectedRoute;
