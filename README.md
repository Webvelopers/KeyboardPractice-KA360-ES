# KeyboardPractice — Kinesis Advantage 360 — Español

**Versión:** 0.0.x-dev
**Teclado:** Kinesis Advantage 360
**Idioma de la interfaz:** Español

Aplicación web **offline-first** para aprender mecanografía táctil en un teclado **Kinesis Advantage 360** configurado para **Español**. Sin registro, sin backend, sin conexión a Internet: todo el contenido y la lógica se ejecutan localmente en el navegador.

---

## Requisitos del sistema

- Un navegador moderno (Chrome, Firefox, Edge) con soporte para:
  - `LocalStorage`
  - `Service Worker` y `Cache API`
  - `Web Crypto API` (`window.crypto.subtle`)
  - `ES Modules`
- No se requiere conexión a Internet después de la primera carga.

---

## Cómo usar la aplicación

### 1. Servir los archivos

Esta carpeta contiene la versión compilada lista para producción. Debes servirla con un servidor HTTP estático. En este repo se usará GitHub Pages.

Luego abre [https://webvelopers.github.io/KeyboardPractice-KA360-ES/](https://webvelopers.github.io/KeyboardPractice-KA360-ES/) en tu navegador.

> También puedes usar cualquier otro servidor estático (Python `http.server`, `nginx`, etc.) apuntando a esta carpeta.

### 2. Primera carga

En la primera visita, el Service Worker se instala automáticamente y almacena en caché todos los archivos. A partir de ese momento, la aplicación funciona **completamente sin conexión**.

### 3. Pantalla de carga

Al iniciar, un cargador accesible muestra el progreso de inicialización. Los mensajes guían al usuario mientras se prepara la aplicación. Una vez lista, se muestra la interfaz principal.

---

## Funcionalidades principales

### Práctica progresiva

- **Curso de 50 lecciones** que van desde la fila inicial (`f j`) hasta 120 PPM sostenibles con símbolos, acentos y puntuación.
- **Comparación caracter por caracter** en tiempo real: la aplicación resalta si el caracter escrito es correcto o incorrecto respecto al texto objetivo.
- **Métricas en vivo**: PPM (palabras por minuto), precisión (%), errores, tiempo transcurrido y avance de la línea.
- **Evaluación automática** al finalizar cada intento: la lección se aprueba solo si se cumplen todos los criterios (precisión ≥ 95%, errores ≤ 5%, PPM objetivo alcanzado, tiempo máximo respetado).

### Navegación y paneles

La interfaz se organiza en cuatro secciones principales, accesibles desde la barra lateral:

| Sección | Descripción |
| ------- | ----------- |
| **Práctica** | Panel principal de entrenamiento. Muestra el texto objetivo, campo de escritura, teclado visual y métricas en vivo. |
| **Curso** | Ruta de aprendizaje con el listado de lecciones, estado de desbloqueo, criterios de evaluación e instrucciones de uso. |
| **Estadísticas** | Panel de progreso acumulado: KPI generales, patrones de error frecuentes, historial de sesiones recientes y mapa de lecciones. |
| **Configuración** | Ajustes de tema (claro/oscuro/sistema), administración de disposiciones de teclado, exportación e importación de respaldos cifrados y zona de peligro para borrado de datos. |

### Teclado visual KA360

Durante la práctica, se muestra un teclado Kinesis Advantage 360 interactivo que resalta la siguiente tecla esperada. Sirve como guía visual opcional para reducir la carga cognitiva mientras se desarrolla la memoria muscular.

### Modo concentración

Al iniciar una práctica, los elementos secundarios (encabezado, navegación, teclado visual y panel de curso) se ocultan automáticamente para reducir distracciones. Al finalizar el intento, todo se restaura.

### Análisis de errores

Al completar una práctica, un dashboard modal muestra un análisis detallado de errores: teclas críticas, patrones de sustitución y distribución de fallos, similar a un panel de Power BI.

### Pausa inteligente

Si se supera el umbral de errores o el tiempo máximo antes de completar el texto, la práctica se detiene automáticamente para evitar el sobreentrenamiento incorrecto.

### Retroalimentación constructiva

La aplicación usa mensajes breves y no punitivos:

- *"Coloca tus manos, respira y empieza cuando estes listo."*
- *"Buen control. Repite una vez mas para consolidar."*
- *"Disminuye la velocidad y mantén la precisión."*

---

## Progresión y desbloqueo

Una lección se considera **aprobada** cuando se cumplen **todos** estos criterios:

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

---

## Persistencia de datos

| Almacenamiento | Contenido |
| -------------- | --------- |
| `LocalStorage` | Progreso del curso, estadísticas agregadas, historial de sesiones recientes (máximo 100), configuración de usuario y disposiciones de teclado. |

**Privacidad:** Todos los datos permanecen exclusivamente en tu navegador. No se envían a ningún servidor externo.

**Respaldos:** Puedes exportar e importar respaldos cifrados con AES-GCM desde el panel de Configuración. Los respaldos incluyen una firma de integridad SHA-256 y la importación es atómica: si algo falla, tus datos actuales se conservan intactos.

---

## Flujo de aprendizaje recomendado

1. **Bienvenida** → Explora la interfaz y familiarízate con los paneles.
2. **Curso** → Revisa las lecciones disponibles.
3. **Práctica** → Selecciona una lección, presiona *"Empezar entrenamiento"* (Alt+K) y escribe el texto mostrado.
4. **Evaluación** → Al completar el texto, revisa los criterios y el análisis de errores.
5. **Repite o avanza** → Si aprobaste, pasa a la siguiente lección. Si no, repite para consolidar.
6. **Estadísticas** → Monitorea tu progreso general, patrones de error y racha de práctica.

---

## Atajos de teclado

| Atajo | Acción |
| ----- | ------ |
| `Enter` | Empezar entrenamiento |
| `Esc` | Finalizar intento |
| `Enter` / `Esc` | Cerrar mensajes emergentes |

---

## Solución de problemas

| Problema | Posible causa | Solución |
| -------- | ------------- | -------- |
| La aplicación no carga sin conexión | Service Worker no instalado | Carga la aplicación al menos una vez con conexión |
| El progreso se pierde al recargar | `LocalStorage` corrupto o lleno | Abre Configuración → importa un respaldo previo |
| No se puede iniciar práctica | Lección bloqueada | Completa la lección anterior con los criterios mínimos |
| El teclado visual no coincide | Disposición incorrecta | Ve a Configuración → Teclado → selecciona o importa la disposición correcta |
| No se puede importar respaldo | Archivo inválido o manipulado | Solo usa respaldos exportados por esta misma aplicación |

---

## Limitaciones conocidas

- El progreso está atado al navegador y perfil. Cambiar de navegador o computadora no transfiere los datos.
- No hay sincronización entre dispositivos.
- No hay perfiles multiusuario.
- No hay actualizaciones automáticas de contenido (requiere una nueva versión del build).
- Sin conexión, no se pueden cargar nuevos recursos (el Service Worker solo entrega lo que ya está en caché).

---

## Licencia

Proyecto educativo y de uso personal, bajo Licencia MIT.
