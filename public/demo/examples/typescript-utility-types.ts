// Interfaces base para los ejemplos
interface Usuario {
  id: string;
  nombre: string;
  email: string;
  edad?: number;
}

interface Producto {
  id: string;
  nombre: string;
  precio: number;
  stock: number;
}

// =============== 1. Partial ===============
// Hace todas las propiedades opcionales
const actualizarUsuario = (usuario: Usuario, cambios: Partial<Usuario>) => {
  return { ...usuario, ...cambios };
};

// Ejemplo de uso:
// actualizarUsuario(usuario, { nombre: "Nuevo Nombre" }); // No necesitas pasar todas las propiedades

// =============== 2. Required ===============
// Hace todas las propiedades requeridas
type UsuarioCompleto = Required<Usuario>;
// Ahora 'edad' es requerida, no opcional

// =============== 3. Pick ===============
// Selecciona solo ciertas propiedades
type UsuarioBasico = Pick<Usuario, 'nombre' | 'email'>;
// Solo tiene { nombre: string; email: string; }

// =============== 4. Record ===============
// Crea un objeto con claves de un tipo y valores de otro
type InventarioProductos = Record<string, Producto>;
// Ejemplo:
const inventario: InventarioProductos = {
  'prod-1': { id: 'prod-1', nombre: 'Laptop', precio: 1000, stock: 5 },
  'prod-2': { id: 'prod-2', nombre: 'Mouse', precio: 20, stock: 10 }
};

// =============== 5. Exclude ===============
// Excluye tipos de una unión
type TiposDatos = string | number | boolean;
type SoloTextoYNumero = Exclude<TiposDatos, boolean>;
// Resultado: string | number

// =============== 6. Extract ===============
// Extrae tipos que coinciden con una condición
type SoloTexto = Extract<TiposDatos, string>;
// Resultado: string

// =============== 7. NonNullable ===============
// Elimina null y undefined del tipo
type PosiblementeNulo = string | null | undefined;
type Definitivo = NonNullable<PosiblementeNulo>;
// Resultado: string

// =============== 8. ReturnType ===============
// Obtiene el tipo de retorno de una función
function obtenerUsuario(): Usuario {
  return {} as Usuario;
}
type ResultadoUsuario = ReturnType<typeof obtenerUsuario>;
// Resultado: Usuario

// =============== 9. Parameters ===============
// Obtiene los tipos de los parámetros como tupla
function crearProducto(nombre: string, precio: number, stock: number): Producto {
  return {} as Producto;
}
type ParametrosProducto = Parameters<typeof crearProducto>;
// Resultado: [string, number, number]

// =============== 10. Readonly ===============
// Hace todas las propiedades de solo lectura
type ProductoInmutable = Readonly<Producto>;
// No se puede modificar ninguna propiedad después de la creación

// =============== 11. ThisType ===============
// Define el tipo de 'this' en un objeto
type MetodosUsuario = {
  actualizarNombre(nuevoNombre: string): void;
  actualizarEmail(nuevoEmail: string): void;
} & ThisType<Usuario & MetodosUsuario>;

// =============== 12. InstanceType ===============
class ServicioAPI {
  baseUrl: string = '';
  fetch() { /* ... */ }
}
type InstanciaServicio = InstanceType<typeof ServicioAPI>;
// Tipo de la instancia de ServicioAPI

// =============== Ejemplos de Combinaciones ===============
// Podemos combinar utility types para casos más complejos

// Usuario parcial pero solo con ciertas propiedades
type UsuarioActualizable = Partial<Pick<Usuario, 'nombre' | 'email'>>;

// Producto inmutable sin ID
type ProductoVistaPrevia = Readonly<Omit<Producto, 'id'>>;

// Registro de productos donde todos los campos son requeridos
type InventarioEstricto = Record<string, Required<Producto>>;

// =============== Ejemplo Práctico ===============
interface EstadoAplicacion {
  usuario: Usuario | null;
  productos: Producto[];
  cargando: boolean;
  error: string | null;
}

// Acciones que pueden actualizar el estado
type ActualizacionEstado = Partial<EstadoAplicacion>;

function actualizarEstado(estado: EstadoAplicacion, actualizacion: ActualizacionEstado): EstadoAplicacion {
  return { ...estado, ...actualizacion };
}

// Ejemplo de uso:
const estadoInicial: EstadoAplicacion = {
  usuario: null,
  productos: [],
  cargando: false,
  error: null
};

// Actualización parcial
const nuevoEstado = actualizarEstado(estadoInicial, {
  cargando: true,
  error: null
});
