# Arquitectura de GLOBALTICKET K

## Estructura

`App` coordina las vistas, los datos compartidos y los callbacks. `Header` y `Footer` mantienen navegación e identidad. Los componentes de UI agrupan botones, campos, estados, tablas y QR. Las vistas están separadas del catálogo ficticio, los hooks y las utilidades.

| Carpeta | Responsabilidad |
| --- | --- |
| src/components | UI compartida, layout, tarjetas y formularios de autenticación |
| src/pages | Catalog, Detail, Cart, Checkout, Account, Tickets y Admin |
| src/data | Eventos, zonas, usuarios ficticios y reportes |
| src/hooks | Persistencia y acciones asíncronas cancelables |
| src/utils | Moneda, fecha, correo y espera cancelable |

## Flujo de compra

Catalog recibe eventos y llama a `onOpen`. Detail selecciona una zona y cantidad y llama a `onAdd`. App valida la disponibilidad y actualiza cart. Cart y OrderSummary calculan el total. Checkout solicita nombre/correo, valida y simula rechazo o aprobación. App registra una sola orden, vacía el carrito y crea la sesión de invitado si hace falta. Tickets recibe las órdenes de la sesión y genera un QR por admisión. Cancelar marca la orden como Cancelada; la disponibilidad derivada se libera.

## Flujo de autenticación

Account contiene las pestañas Iniciar sesión, Crear cuenta y Recuperar contraseña, además del perfil. LoginForm normaliza el correo y valida la contraseña ficticia antes de comunicar el acceso simulado. RegistrationForm recorta y valida nombre, correo, longitud y confirmación de la contraseña. RecoveryForm simula la recuperación sin correos. Los tres componentes están organizados en `src/components/auth`; Account incorpora LoginForm mediante `import.meta.glob`.

Los formularios reciben `onSuccess`, no acceden directamente al estado global. Account transforma el resultado en una sesión y llama a setSession. Los roles rápidos permiten probar las vistas; no son controles de seguridad reales. Ninguna contraseña se guarda.

## Estado y efectos

App conserva cart, orders, session, theme, category y títulos editados con usePersistent. Búsqueda, pasos, campos, errores y carga pertenecen a sus vistas. Total y disponibilidad son valores derivados. La tabla de claves está en el README.

usePersistent lee JSON validado, escribe al actualizar, escucha storage y limpia la suscripción. Si falla la escritura, la sesión continúa en memoria. useDelayedAction usa useRef para bloquear dos envíos antes del siguiente render y AbortController para cancelar la espera al desmontarse. Los efectos limpian temporizadores del catálogo, escucha de hash y resultados asíncronos de QR.

La navegación utiliza rutas hash. El salto al contenido mueve el foco sin cambiar de vista. Las operaciones de compra verifican cantidad y disponibilidad antes de generar la orden.

## Límites de la arquitectura

Todo funciona en el navegador. No hay autenticación real, correo, pasarela ni inventario compartido entre dispositivos. Los reportes usan una serie estática; el dashboard cuenta las compras confirmadas locales. No se incorporan las tecnologías reservadas para la siguiente etapa del curso.
