# GLOBALTICKET K

Aplicación React para explorar eventos, seleccionar boletos, realizar una compra simulada y consultar boletos electrónicos con código QR.

**Asignatura:** Programación Orientada al Usuario · UCA  
**Actividad:** Entrega Parcial del Proyecto 3  
**Integrantes:** Pan Lijian Wong y Ariana Belén Recinos Santos

## Responsabilidades del equipo

El trabajo se distribuye entre dos módulos principales del flujo de cuenta: creación de cuenta y acceso a la aplicación.

| Integrante | Responsabilidad principal | Funciones de su módulo |
| --- | --- | --- |
| **Pan Lijian Wong** | **Crear cuenta — RegistrationForm** | Formulario controlado de registro; validación del nombre, correo, longitud y confirmación de contraseña; normalización de datos; mensajes de error y carga; prevención de envíos repetidos; comunicación del resultado a Account mediante onSuccess para establecer la sesión simulada. |
| **Ariana Belén Recinos Santos** | **Iniciar sesión — LoginForm** | Formulario controlado de acceso; validación y normalización del correo; validación de la contraseña de prueba; mensajes de error y carga; prevención de envíos repetidos; comunicación del acceso a Account mediante onSuccess para establecer la sesión simulada. |

En ambos módulos se aplican estado local, props, eventos, componentes reutilizables y el hook compartido de operaciones cancelables. Las operaciones pendientes se cancelan al abandonar el formulario y las contraseñas no se almacenan. El registro permite incorporar al usuario de demostración y el inicio de sesión permite acceder con una identidad simulada; son responsabilidades complementarias dentro de la gestión de usuarios.

## Instalación y ejecución

Requisitos: Node.js 24 LTS y npm.

```sh
npm install
npm run dev
```

Abrir la dirección indicada por Vite. Comandos adicionales:

```sh
npm run lint
npm run build
npm run preview
```

## Funcionalidades

- Catálogo de eventos con búsqueda, filtros, detalle y estados.
- Selección de zonas, precios y cantidades según disponibilidad.
- Carrito persistente y compra en cuatro pasos.
- Pago simulado con aprobación, rechazo y reintento.
- Boletos con QR y cancelación de órdenes.
- Registro, recuperación de contraseña simulada, perfil y roles de demostración.
- Panel con dashboard, eventos, inventario, precios y usuarios.
- Reportes estáticos, tema claro/oscuro y estados de carga, error y vacío.

## Componentes y estructura

| Archivo o carpeta | Componentes y responsabilidad |
| --- | --- |
| `src/components/UI.jsx` | Button, Badge, Field, EmptyState, Notice, PageTitle, Stepper, QuantityPicker, QR, StatCard, Table y Tabs |
| `src/components/Layout.jsx` | Header y Footer |
| `src/components/EventCard.jsx` | EventCard recibe event y onOpen |
| `src/components/auth/` | Formularios controlados de cuenta; comunican el resultado mediante onSuccess |
| `src/pages/Cart.jsx` | Cart y OrderSummary reciben selecciones y total |
| `src/pages/` | Catálogo, detalle, carrito, pago, cuenta, boletos y administración |
| `src/data/` | Eventos, zonas, usuarios y reportes simulados |
| `src/hooks/` | Persistencia y operaciones asíncronas cancelables |
| `src/utils/` | Formato de moneda y fecha, validación de correo y espera cancelable |

Los componentes reciben datos y callbacks mediante props. Button admite children, variant y eventos; Field agrupa label y controles; Tabs utiliza items, value y onChange; Table recibe headers y children; QR recibe value.

## Estado y persistencia

App mantiene el estado compartido y distribuye las acciones a las vistas.

| Estado | Persistencia | Contenido |
| --- | --- | --- |
| cart | localStorage: gt-cart | Evento, zona y cantidad |
| orders | localStorage: gt-orders | Órdenes, usuario, total y estado |
| session | localStorage: gt-session | Identidad y rol simulados |
| theme | localStorage: gt-theme | Tema visual |
| category | localStorage: gt-category | Categoría seleccionada |
| overrides | localStorage: gt-event-titles | Títulos editados |
| view | Hash de la URL | Vista actual |
| Campos, búsqueda, pasos y carga | Temporal en cada vista | Interacción y validación |

El total y la disponibilidad se calculan a partir de los datos. Los efectos limpian temporizadores y escuchas; las operaciones pendientes se cancelan al abandonar el formulario. El bloqueo de envíos evita compras duplicadas. Las contraseñas no se guardan.

## Datos y prueba del flujo

Se incluyen ocho eventos ficticios con imagen, fecha, lugar, categoría y estado; cada uno tiene tres zonas. Hay roles Cliente, Administrador y Organizador y una serie de ventas para reportes. Las órdenes se generan durante la compra.

1. Abrir Neon Nights y seleccionar dos boletos VIP: total $120.00.
2. Añadir al carrito y continuar con Cliente Demo y cliente@example.com.
3. Probar DEMO 0000 para un rechazo y DEMO 4242 para una aprobación.
4. Consultar Mis boletos y sus QR; cancelar la orden para liberar disponibilidad.

Para los formularios se utilizan datos ficticios y contraseñas de prueba de al menos ocho caracteres.

## Diseño y documentación

Identidad violeta de GLOBALTICKET, Poppins en títulos e Inter en textos, CSS propio y navegación por hash. Se utilizan etiquetas, HTML semántico, foco visible, textos alternativos y mensajes de estado.

- [Arquitectura de componentes y flujo de estado](docs/Arquitectura.md).
- [Capturas de las pantallas a 375, 768 y 1440 px](docs/Capturas.md).

## Alcance y limitaciones

Proyecto académico con datos, sesiones, roles, pagos y recuperación simulados. No utiliza backend, base de datos, cobros ni envío real de correos. Los QR no tienen validez comercial. La persistencia es local a cada navegador; no hay inventario compartido entre equipos. Los reportes son estáticos y la administración permite editar títulos y consultar los demás datos.
