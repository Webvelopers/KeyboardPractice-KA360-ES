# KeyboardPractice — Kinesis Advantage 360 — Español

**Versión:** 0.0.x-dev
**Teclado:** Kinesis Advantage 360
**Idioma de la interfaz:** Español
**Arquitectura:** Framework-free, offline-first, single-user

Aplicación web **offline-first** para aprender mecanografía táctil en un teclado **Kinesis Advantage 360** configurado para **Español (Latinoamérica)**. Sin registro, sin backend dinámico, sin base de datos externa, sin dependencias CDN — todo el contenido y la lógica se ejecutan localmente en el navegador. El servidor Node.js solo sirve archivos estáticos.

---

## Requisitos del sistema

- Un navegador moderno (Chrome, Firefox, Edge) con soporte para:
  - `LocalStorage`
  - `Service Worker` y `Cache API`
  - `Web Crypto API` (`window.crypto.subtle`)
  - `ES Modules`
  - `matchMedia` y `prefers-color-scheme`
- No se requiere conexión a Internet después de la primera carga.

---

## Cómo usar la aplicación

### 1. Servir los archivos

Esta carpeta contiene la versión compilada lista para producción. Debes servirla con un servidor HTTP estático. En este repositorio se usa GitHub Pages.

Luego abre [https://webvelopers.github.io/KeyboardPractice-KA360-ES/](https://webvelopers.github.io/KeyboardPractice-KA360-ES/) en tu navegador.

> También puedes usar cualquier otro servidor estático (Python `http.server`, `nginx`, etc.) apuntando a esta carpeta.

### 2. Primera carga

En la primera visita, el Service Worker se instala automáticamente y almacena en caché todos los archivos. A partir de ese momento, la aplicación funciona **completamente sin conexión**.

### 3. Pantalla de carga

Al iniciar, un cargador accesible muestra el progreso de inicialización con mensajes escalonados, una barra de progreso ARIA y un mínimo de 3 segundos de visibilidad. Una vez lista, se muestra la interfaz principal.

### 4. Flujo de inicio de sesión local

En el primer uso, la aplicación te guía para crear una **frase de contraseña local** que protegerá tus datos almacenados. En usos subsecuentes, debes ingresar tu frase de contraseña para desbloquear el almacenamiento cifrado. Este proceso es completamente local — nunca se envía información a ningún servidor.

> **Nota importante:** No existe una función "olvidé mi contraseña". La frase de contraseña es irrecuperable. Si la pierdes, deberás borrar todos los datos locales y empezar de nuevo.

---

## Arquitectura

La aplicación sigue una arquitectura modular basada en los principios de **Responsabilidad Única (SRP)** sin ningún framework de frontend:

| Capa | Función |
| ---- | ------- |
| **App** | Orquestación de bootstrap, inicialización, barra lateral, eventos del ciclo de vida |
| **Core** | Clase base Component, EventBus, contenedor DI, almacén de estado, tipos JSDoc |
| **Domain** | Lógica de negocio: curso adaptativo, sesión de práctica, métricas, progresión, definición de teclado |
| **Features** | Vistas de práctica, configuración, estadísticas, respaldo, seguridad, PWA, sonido |
| **Infrastructure** | Adaptadores de almacenamiento, cifrado, registro de auditoría, temas, sonido, depuración |
| **Shared** | Utilerías DOM seguras, renderizadores de UI reutilizables (teclas, diálogos, notificaciones) |

No se utiliza React, Vue, Angular, Svelte ni ninguna dependencia CDN. Todo es JavaScript Vanilla con módulos ES nativos.

---

## Funcionalidades principales

### Sistema de curso adaptativo

El curso se genera dinámicamente desde la disposición de teclado activa. No es un curso fijo de 50 lecciones — se adapta a tu nivel real:

1. **Diagnóstico inicial:** Escribes texto en prosa española para que el sistema evalúe tu velocidad y precisión actuales.
2. **Clasificación por niveles:** Tu desempeño se clasifica en uno de seis niveles mediante la fórmula `Índice = PPM × (Precisión / 100)` con compuertas de precisión mínima que evitan que la velocidad por sí sola infla la clasificación:

   | Nivel | PPM mínimo | Precisión mínima |
   | ----- | ---------- | ---------------- |
   | Inicial | — | 90 % |
   | Básico | 20 | 95 % |
   | Intermedio | 35 | 97 % |
   | Avanzado | 50 | 98 % |
   | Experto | 70 | 99 % |
   | Élite | 100 | 99 % |

3. **Ruta de aprendizaje personalizada:**
   - **Inicial:** Curso físico de pares de dedos en el KA360, introduciendo filas y columnas de forma incremental.
   - **Básico a Élite:** Pistas de prosa española con vocabulario centrado en mecanografía (técnica, ritmo, puntuación, control, fluidez) con un máximo de 5 palabras por línea.

### Práctica de mecanografía

- **Texto objetivo** con resaltado caracter por caracter en tiempo real: color verde para aciertos, rojo para errores.
- **Campo de escritura** con prevención de autocompletado, pegado, y entrada de métodos de escritura asistida.
- **Métricas en vivo:** PPM (palabras por minuto), precisión (%), errores acumulados, tiempo transcurrido y avance de la línea.
- **Finalización correcta:** El intento termina cuando se cubre la longitud completa del texto objetivo, incluso si hay errores registrados.
- **5 repeticiones** del texto objetivo por lección para reforzar la memoria muscular.
- **Selector de lección activa** bloqueado solo mientras hay una sesión en curso.

### Evaluación automática

Al finalizar cada intento, se evalúan todos estos criterios. La lección se aprueba **solo si se cumplen todos**:

| Criterio | Valor típico |
| -------- | ------------ |
| Precisión mínima | 95 % |
| Errores máximos | 5 % del texto |
| PPM mínimo | Según la lección (0 a 120) |
| Tiempo máximo | Calculado según la longitud del texto y el PPM objetivo |
| Texto completado | Toda la longitud del texto objetivo cubierta |

- Las lecciones con PPM objetivo ≥ 100 requieren **2 intentos exitosos** para ser dominadas.
- Las lecciones fallidas **no degradan** una lección ya dominada.
- Los ejercicios con errores se agregan a una **cola de repaso** (hasta 20 ítems) para reforzar el aprendizaje.

### Teclado visual KA360

Durante la práctica, se muestra un teclado Kinesis Advantage 360 interactivo que resalta la siguiente tecla esperada. Sirve como guía visual opcional para reducir la carga cognitiva mientras se desarrolla la memoria muscular.

- Se puede mantener visible incluso en modo concentración.
- Las teclas con acentos y caracteres muertos se resuelven mediante alias para facilitar la escritura en español.

### Modo concentración

Al iniciar una práctica, los elementos secundarios (encabezado, barra lateral, teclado visual y panel de curso) se ocultan automáticamente para reducir distracciones. Al finalizar el intento, todo se restaura. Puedes mantener el teclado visual visible si lo prefieres.

### Análisis de errores

Al completar una práctica con errores, un dashboard modal muestra un análisis detallado estilo Power BI:

- **Teclas críticas:** Las teclas donde cometes más errores.
- **Patrones de sustitución:** Qué tecla escribes en lugar de la correcta (ej. `e` → `r`).
- **Distribución de fallos:** Mapa visual de errores por dedo y fila.
- **Progresión de errores:** Cómo evolucionan los errores a lo largo del intento.

### Pausa inteligente (Smart Stop)

Si se supera el umbral de errores o el tiempo máximo antes de completar el texto, la práctica se detiene automáticamente para evitar el sobreentrenamiento incorrecto. Puedes revisar el análisis de errores y cerrar para continuar.

### Sonidos mecánicos Cherry MX

La aplicación sintetiza sonidos de teclado mecánico mediante la Web Audio API — sin archivos de audio externos. Puedes elegir entre tres perfiles:

| Perfil | Característica |
| ------ | -------------- |
| **Azul (Blue)** | Sonido clicky clásico, fuerte y nítido, ideal para retroalimentación auditiva durante el aprendizaje. |
| **Café (Brown)** | Sonido táctil suave, punto medio entre silencio y respuesta audible. |
| **Rojo (Red)** | Sonido lineal silencioso, mínima distracción auditiva. |

Los sonidos se pueden activar/desactivar y el perfil se puede cambiar desde el panel de Configuración > Teclado. Cada sonido se compone de tres capas sintetizadas: clic (onda triangular), impacto (onda senoidal) y textura (ruido de banda).

### Retroalimentación constructiva

La aplicación usa mensajes breves y no punitivos para guiar tu práctica:

- *"Coloca tus manos, respira y empieza cuando estés listo."*
- *"Buen control. Repite una vez más para consolidar."*
- *"Disminuye la velocidad y mantén la precisión."*
- *"Excelente precisión. Ahora aumenta el ritmo gradualmente."*

---

## Navegación y paneles

La interfaz se organiza en cuatro secciones principales, accesibles desde la barra lateral (se abre por defecto al iniciar):

| Sección | Descripción |
| ------- | ----------- |
| **Práctica** | Panel principal de entrenamiento. Muestra el texto objetivo, campo de escritura, teclado visual, métricas en vivo, selector de lección y panel de criterios. |
| **Curso** | Ruta de aprendizaje completa con listado de lecciones, estado de desbloqueo (bloqueada/disponible/completada/dominada), criterios de evaluación, instrucciones de uso y barra de progreso general. |
| **Estadísticas** | Panel de progreso acumulado: KPI generales (PPM promedio, precisión promedio, tiempo total de práctica), patrones de error frecuentes, historial de sesiones recientes (máximo 100) y mapa de lecciones completadas. |
| **Configuración** | Ajustes de tema, administración de disposiciones de teclado, perfiles de sonido, exportación e importación de respaldos cifrados, registro de auditoría y zona de peligro para borrado selectivo de datos. |

---

## Almacenamiento y seguridad

### Cifrado en reposo

Todos los datos de la aplicación se almacenan cifrados en `LocalStorage` usando el estándar **Web Crypto API**:

- **Cifrado:** AES-GCM (Autenticado)
- **Derivación de clave:** PBKDF2 con SHA-256
- **Sal aleatoria:** Por cada almacén, única e independiente
- **IV fresco:** Por cada escritura cifrada
- **Frase de contraseña:** Solo existe en memoria durante la sesión desbloqueada — nunca se persiste

### Respaldo cifrado

Puedes exportar e importar respaldos completos o parciales desde el panel de Configuración:

- **Cifrado AES-GCM** con firma de integridad SHA-256.
- **Importación atómica:** Si algo falla durante la importación, tus datos actuales se conservan intactos.
- **Cobertura selectiva:** Puedes elegir qué categorías incluir: progreso, evaluaciones adaptativas, estadísticas, historial, preferencias, disposiciones de teclado y registro de auditoría.

### Política de frases de contraseña

Para crear nuevo almacenamiento protegido, la frase debe cumplir:

- Mínimo 12 caracteres
- Al menos una mayúscula
- Al menos una minúscula
- Al menos un número
- Al menos un símbolo especial
- Sin espacios en blanco

> **Nota importante:** Las frases creadas con versiones anteriores (políticas más permisivas) siguen siendo aceptadas para desbloquear.

### Privacidad

Todos los datos permanecen exclusivamente en tu navegador. No se envían a ningún servidor externo, no hay telemetría, no hay análisis de uso, no hay cuentas de usuario.

### Seguridad de contenido (CSP)

La aplicación aplica una política de seguridad de contenido estricta en producción que solo permite recursos del mismo origen:

- `connect-src 'self'` — Solo conexiones al mismo origen
- `worker-src 'self'` — Solo Service Workers del mismo origen
- `manifest-src 'self'` — Solo manifiestos del mismo origen

No se cargan recursos externos, scripts de terceros, fuentes CDN ni servicios de análisis.

---

## Panel de Configuración detallado

### Tema

Tres opciones de tema visual:

| Tema | Descripción |
| ---- | ----------- |
| **Claro** | Fondo blanco, texto oscuro |
| **Oscuro** | Fondo oscuro (`#1a1a2e`), texto claro |
| **Sistema** | Sigue la preferencia del sistema operativo (`prefers-color-scheme`) |

El tema se aplica antes de que la aplicación se renderice (mediante `theme-preboot.js`) para evitar el flash de contenido sin estilo. Al menos 4.8:1 de contraste en texto verde sobre fondos claros (WCAG AA).

### Administración de disposiciones de teclado

Puedes gestionar múltiples disposiciones de teclado:

- **Crear** una nueva disposición basada en la disposición KA360 por defecto
- **Duplicar** una disposición existente para modificarla
- **Editar** teclas individuales (caracteres, etiquetas, valores con/sin Shift, AltGr)
- **Seleccionar** la disposición activa para la práctica
- **Importar/Exportar** disposiciones en formato JSON
- **Restaurar** una disposición a sus valores KA360 por defecto
- **Eliminar** disposiciones personalizadas

Cada disposición mantiene su propio progreso de curso adaptativo. Al cambiar de disposición, se restaura el progreso asociado o se inicia una nueva evaluación inicial.

### Registro de auditoría

Un registro cronológico local que captura eventos importantes sin telemetría externa:

- Cambios de configuración
- Inicio y fin de sesiones de práctica
- Importación y exportación de respaldos
- Operaciones de borrado de datos
- Creación/eliminación de disposiciones

Visible desde Configuración > Registro de auditoría.

### Zona de peligro

Operaciones destructivas con confirmación explícita:

- **Borrado selectivo** por categoría: progreso, evaluaciones, estadísticas, historial, preferencias, disposiciones y auditoría
- **Borrado completo** de todos los datos de la aplicación
- Confirmación mediante frase de seguridad visible (captcha de texto local)

---

## PWA (Aplicación Web Progresiva)

- **Instalable:** Manifiesto para agregar a la pantalla de inicio como aplicación independiente.
- **Offline completo:** Service Worker con estrategia Cache First — después de la primera carga, todos los recursos se sirven desde la caché local.
- **Actualizaciones controladas:** Cuando hay una nueva versión disponible, aparece un banner con las opciones **Actualizar ahora** y **Más tarde**. La actualización no se aplica sin tu consentimiento.

---

## Accesibilidad

- **Navegación por teclado:** Todos los controles son accesibles mediante teclado con estados de foco visibles.
- **Contraste WCAG AA:** Relación de contraste mínima de 4.8:1 en todos los modos de tema.
- **ARIA:** Uso de roles, propiedades y estados ARIA apropiados en paneles, botones, diálogos y la barra de progreso de carga.
- **Semántica HTML:** Uso de elementos semánticos (`<nav>`, `<main>`, `<section>`, `<button>`, etc.) antes que ARIA cuando es posible.
- **Reduced motion:** Soporte para `prefers-reduced-motion`.
- **Live regions:** Notificaciones con `aria-live="polite"` para no interrumpir al lector de pantalla.
- **Atajos de teclado documentados** y visibles en los controles (Enter, Esc, combinaciones Alt).

---

## Flujo de aprendizaje recomendado

1. **Bienvenida** → Explora la interfaz y familiarízate con los cuatro paneles.
2. **Diagnóstico inicial** → La aplicación te guiará para escribir texto diagnóstico. Solo relájate y escribe como lo harías normalmente.
3. **Revisa tu clasificación** → Ve al panel **Curso** para ver tu nivel asignado y las lecciones disponibles.
4. **Práctica** → Selecciona una lección, presiona `Enter` o haz clic en *"Empezar entrenamiento"* y escribe el texto mostrado.
5. **Evaluación** → Al completar el texto, revisa los criterios de aprobación y el análisis de errores si los hubo.
6. **Repite o avanza** → Si aprobaste, pasa a la siguiente lección. Si no, repite para consolidar.
7. **Estadísticas** → Monitorea tu progreso general, patrones de error, tiempo acumulado y racha de práctica.
8. **Ajusta configuración** → Explora los perfiles de sonido, temas, y otras preferencias en Configuración.

---

## Atajos de teclado

| Atajo | Acción |
| ----- | ------ |
| `Enter` | Empezar entrenamiento / Confirmar acción |
| `Esc` | Finalizar intento / Cerrar modal / Cancelar |
| `Alt+F` | Lección anterior (Retroceder) |
| `Alt+J` | Lección siguiente (Avanzar) |
| `Espacio` | Siguiente reto (cuando está habilitado) |
| `Ctrl+Shift+D` | Alternar consola de depuración (solo builds de desarrollo) |

---

## Solución de problemas

| Problema | Posible causa | Solución |
| -------- | ------------- | -------- |
| La aplicación no carga sin conexión | Service Worker no instalado | Carga la aplicación al menos una vez con conexión |
| El progreso se pierde al recargar | `LocalStorage` corrupto o lleno | Abre Configuración → importa un respaldo previo |
| No se puede iniciar práctica | Lección bloqueada | Completa la lección anterior con los criterios mínimos |
| El teclado visual no coincide | Disposición incorrecta | Ve a Configuración → Teclado → selecciona o importa la disposición correcta |
| No se puede importar respaldo | Archivo inválido o manipulado | Solo usa respaldos exportados por esta misma aplicación |
| La frase de contraseña no funciona | Frase incorrecta o datos corruptos | No hay recuperación posible. Debes borrar los datos locales desde las herramientas de desarrollo del navegador |
| No se escuchan sonidos | Sonido deshabilitado o perfil silencioso | Ve a Configuración → Teclado → Sonido y verifica que esté activado y el perfil no sea "Rojo" |

---

## Limitaciones conocidas

- El progreso está atado al navegador y perfil de usuario. Cambiar de navegador o computadora no transfiere los datos.
- No hay sincronización entre dispositivos.
- No hay perfiles multiusuario.
- No hay actualizaciones automáticas de contenido (requiere una nueva versión del build).
- Sin conexión, no se pueden cargar nuevos recursos (el Service Worker solo entrega lo que ya está en caché).
- La frase de contraseña es irrecuperable — no existe función "olvidé mi contraseña".
- Los datos residen en `LocalStorage` que tiene un límite de ~5–10 MB por origen.

---

## Licencia

Proyecto educativo y de uso personal, bajo Licencia MIT.
