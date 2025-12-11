/**
 * Tipos de productos con separación estricta entre B2B y B2C
 * 
 * REGLA CRÍTICA:
 * - precio_b2b y moq SOLO se envían a Admin y Seller
 * - precio_b2c SOLO se envía a Cliente Final
 * - La API debe filtrar estos campos según el rol del usuario
 */

export interface ProductB2B {
  id: string;
  nombre: string;
  descripcion_larga: string;
  precio_b2b: number;
  moq: number;
  stock: number;
  galeria_imagenes: string[];
  categoria_id: string;
  created_at: string;
  updated_at: string;
}

export interface ProductB2C {
  id: string;
  nombre: string;
  descripcion_larga: string;
  precio_b2c: number;
  stock: number;
  galeria_imagenes: string[];
  categoria_id: string;
  created_at: string;
  updated_at: string;
}

export interface ProductFull {
  id: string;
  nombre: string;
  descripcion_larga: string;
  precio_b2b: number;
  precio_b2c: number;
  moq: number;
  stock: number;
  galeria_imagenes: string[];
  categoria_id: string;
  created_at: string;
  updated_at: string;
}

/**
 * Función helper para filtrar producto según rol
 * Esto NO se hace en el frontend, pero como referencia para la lógica backend
 */
export const filterProductByRole = (
  product: ProductFull,
  userRole: "admin" | "seller" | "client" | null
): ProductB2B | ProductB2C | null => {
  if (!userRole) return null;
  
  if (userRole === "admin" || userRole === "seller") {
    // Admin y Seller ven precio B2B y MOQ
    return {
      id: product.id,
      nombre: product.nombre,
      descripcion_larga: product.descripcion_larga,
      precio_b2b: product.precio_b2b,
      moq: product.moq,
      stock: product.stock,
      galeria_imagenes: product.galeria_imagenes,
      categoria_id: product.categoria_id,
      created_at: product.created_at,
      updated_at: product.updated_at,
    };
  } else if (userRole === "client") {
    // Cliente ve solo precio B2C
    return {
      id: product.id,
      nombre: product.nombre,
      descripcion_larga: product.descripcion_larga,
      precio_b2c: product.precio_b2c,
      stock: product.stock,
      galeria_imagenes: product.galeria_imagenes,
      categoria_id: product.categoria_id,
      created_at: product.created_at,
      updated_at: product.updated_at,
    };
  }
  
  return null;
};
