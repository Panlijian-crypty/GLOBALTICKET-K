# GLOBALTICKET K

Aplicación académica de venta y gestión de boletos para eventos. **Programación Orientada al Usuario · UCA · Grupo K.** Actividad: Entrega Parcial del Proyecto 3, implementación React del MVP.

**Pareja:** Pan Lijian Wong y Ariana.

## Instalación y ejecución

Requiere Node.js 24 LTS y npm. Desde la carpeta del proyecto:

```sh
npm install
npm run dev
```

Abre la dirección que indique Vite. Para comprobar y compilar:

```sh
npm run lint
npm run build
npm run preview
```

No se incluye `node_modules`. `dist` se genera al compilar y no forma parte del código fuente entregado.

## Funcionalidad

- Catálogo con listado, búsqueda, filtros, detalle y estados del evento.
- Tres zonas por evento con precio y disponibilidad.
- Carrito y compra en cuatro pasos: carrito, datos, pago y confirmación.
- Pago simulado con aprobación y rechazo recuperable.
- Boletos con QR generado en el cliente y cancelación de compras.
- Registro, recuperación, perfil y roles de demostración. El login se integra con el archivo de Ariana.
- Administración con dashboard, eventos, edición de títulos, inventario, precios y usuarios.
- Reportes estáticos con datos de ejemplo.
- Carga, error, reintento, vacío y confirmaciones; prevención de doble envío.

## Integración de la pareja

Esta primera subida contiene la base compartida y el registro de Pan Lijian Wong. **El archivo de login de Ariana todavía no está incluido.** El flujo de compra, registro, perfil y accesos de demostración funcionan en esta base.

Ariana debe revisar y agregar `src/components/auth/LoginForm.jsx` desde su cuenta. `Account.jsx` detecta ese archivo mediante `import.meta.glob` y habilita la pestaña Iniciar sesión; no necesita sustituir el código del registro. Después de integrar su contribución, ejecutar otra vez instalación, lint, build y revisar ambos formularios. El repositorio final de la pareja es el que debe entregarse.

El historial refleja quién sube los cambios; el reparto de autenticación es registro para Lijian e inicio de sesión para Ariana. La documentación no atribuye a una persona la autoría completa de los módulos compartidos.

## Recorrido principal

1. Abrir Neon Nights desde Explorar.
2. Seleccionar VIP y dos boletos; añadirlos al carrito. Total: $120.00.
3. Recargar y comprobar que se conserva el carrito.
4. Continuar con `Cliente Demo` y `cliente@example.com`.
5. Marcar la confirmación de demostración y probar `DEMO 0000`: el pago se rechaza y permite reintentar.
6. Elegir `DEMO 4242`: el pago se aprueba, se crea una orden y se vacía el carrito.
7. Consultar Mis boletos y los QR. Cancelar para liberar la disponibilidad.
8. En Mi cuenta, cerrar sesión y probar Crear cuenta. Usar únicamente datos ficticios y una contraseña de al menos ocho caracteres, por ejemplo `Demo12345`.
9. Probar los accesos Administrador y Organizador para consultar el panel.

Explorar > Opciones de demostración permite simular el error de carga o reiniciar los datos locales con confirmación.

## Inventario de componentes

| Archivo | Componentes reutilizables | Props principales |
| --- | --- | --- |
| `src/components/UI.jsx` | Button, Badge, Field, EmptyState, Notice, PageTitle, Stepper, QuantityPicker, QR, StatCard, Table, Tabs | children, variant, type, title, label, value, onChange, step, headers y children según componente |
| `src/components/Layout.jsx` | Header, Footer | view, go, cartCount, session, theme, setTheme |
| `src/components/EventCard.jsx` | EventCard | event, onOpen |
| `src/components/auth/RegistrationForm.jsx` | RegistrationForm | onSuccess |
| `src/components/auth/RecoveryForm.jsx` | RecoveryForm | sin props obligatorias |
| `src/components/auth/LoginForm.jsx` (contribución pendiente) | LoginForm | initialEmail, onSuccess |
| `src/pages/Cart.jsx` | OrderSummary | items, total |

Las vistas están en `src/pages`, los datos en `src/data`, los hooks en `src/hooks` y las utilidades en `src/utils`. La separación completa y el flujo de callbacks se describen en [Arquitectura](docs/Arquitectura.md).

## Mapa de estado y persistencia

| Estado | Propietario | Persistencia | Uso |
| --- | --- | --- | --- |
| cart | App / usePersistent | gt-cart | Selecciones por evento y zona, cantidades |
| orders | App / usePersistent | gt-orders | Órdenes, estado, usuario y total confirmado |
| session | App / usePersistent | gt-session | Identidad y rol ficticios; no guarda contraseñas |
| theme | App / usePersistent | gt-theme | Tema claro u oscuro |
| category | App / usePersistent | gt-category | Filtro seleccionado |
| overrides | App / usePersistent | gt-event-titles | Títulos editados en administración |
| view | App | hash de la URL | Vista actual |
| búsqueda y carga | Catalog | temporal | Filtro de texto y operación simulada |
| campos, errores, busy | formularios | temporal | Validación y retroalimentación |
| paso y rechazo | Checkout | temporal | Avance de compra y reintento |

El total del carrito y la disponibilidad se calculan; no se duplican como estado. Las vistas reciben props y comunican eventos mediante callbacks. `usePersistent` valida JSON, conserva una alternativa en memoria ante errores y limpia la escucha de storage. `useDelayedAction` usa un bloqueo inmediato y AbortController para cancelar operaciones al desmontar los formularios.

## Datos simulados

`src/data/events.js` define ocho eventos propios: música, teatro, gastronomía, deportes, arte y comedia. Cada evento tiene fecha, lugar, imagen SVG local, estado y tres zonas. Incluye roles Cliente, Administrador y Organizador, además de una serie estática para reportes. Las órdenes se generan al recorrer el pago; Mis boletos comienza vacío en un navegador nuevo. Los datos de las capturas proceden de una compra de prueba.

## Diseño y decisiones

Se utiliza la identidad violeta de GLOBALTICKET (#6D28D9, #4C1D95 y #EDE9FE), Poppins en títulos e Inter en textos con fuentes de respaldo, tarjetas, botones y campos coherentes. La comparación exacta con el Figma final del equipo debe realizarse durante la revisión de la pareja.

CSS propio y navegación por hash. React Router no es obligatorio en esta actividad. No se incluyen PWA, API falsa ni Context, que el PDF sitúa en una entrega posterior. La aplicación usa etiquetas, semántica, foco visible, textos alternativos y mensajes de estado.

## Capturas

Las pantallas principales se documentan a 375, 768 y 1440 píxeles en [docs/Capturas.md](docs/Capturas.md). Las capturas corresponden a esta base; la evidencia del login debe agregarse cuando Ariana integre su archivo.

## Limitaciones

Sesión, roles y pagos simulados; sin backend, base de datos, cobros ni envío real de correos. El login no verifica credenciales reales. Los QR son referencias DEMO sin validez comercial. localStorage pertenece a un navegador y no asegura inventario concurrente entre equipos. Los reportes son estáticos; el dashboard usa las compras locales. Administración permite editar títulos y consultar el resto de datos, no un CRUD completo.

## Entregables

Código fuente, README, documento breve de arquitectura y capturas en este repositorio. La pareja debe realizar una presentación de 5 a 8 minutos con el flujo principal. No se incluye un guion ni un informe adicional. El envío de la actividad se hace con el enlace del repositorio público, una vez integrada la contribución de Ariana.
