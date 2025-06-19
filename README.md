<<<<<<< HEAD
# official-infogenerator
=======
# Official InfoGenerator

## 1. Descripción General

Official InfoGenerator es una aplicación web diseñada para la generación automatizada de informes estándares de devolución y párrafos para actividades de investigación. Su objetivo principal es optimizar el tiempo de los funcionarios al estandarizar y agilizar la creación de documentos recurrentes, utilizando plantillas previamente configuradas y personalizables. La aplicación permite generar diferentes tipos de informes (SIJIN, DATT, INPEC) y párrafos específicos (Web Service, ANI), además de ofrecer un dashboard para visualizar estadísticas de uso y una sección para configurar las plantillas base.

## 2. Tecnologías Utilizadas

La aplicación está construida utilizando las siguientes tecnologías y librerías principales:

*   **Frontend:**
    *   **React 19:** Biblioteca principal para la construcción de la interfaz de usuario.
    *   **TypeScript:** Superset de JavaScript que añade tipado estático para mejorar la robustez y mantenibilidad del código.
    *   **Tailwind CSS:** Framework CSS de utilidad para un diseño rápido y responsivo.
    *   **Lucide React:** Colección de iconos SVG ligeros y personalizables.
*   **Manejo de Plantillas:**
    *   **Handlebars.js:** Motor de plantillas para generar dinámicamente el contenido de los informes y párrafos.
*   **Exportación de Documentos:**
    *   **docx:** Librería para generar documentos de Microsoft Word (`.docx`) en el cliente.
    *   **FileSaver.js:** Utilidad para guardar archivos generados en el lado del cliente.
*   **Módulos ES y CDN:**
    *   La aplicación utiliza módulos ES6 nativos, con dependencias cargadas a través de `esm.sh` (un CDN para módulos ES).
*   **Potencialmente (Integración Futura):**
    *   **@google/genai:** Librería para interactuar con los modelos Gemini de Google (actualmente importada vía CDN pero sin implementación visible en la UI para generación de texto asistida por IA).

## 3. Funcionalidades Principales

*   **Dashboard de Estadísticas:**
    *   Visualización del número de informes generados por tipo (SIJIN, DATT, INPEC).
    *   Gráfico de dona para representar la distribución porcentual.
*   **Generación de Informes:**
    *   Creación de informes para **SIJIN**, **DATT** e **INPEC**.
    *   Formularios específicos para cada tipo de informe con campos relevantes.
    *   Validación de datos en los formularios.
*   **Generación de Párrafos:**
    *   Creación de párrafos estándar para consultas a **Web Service** (Registraduría) y **ANI** (Archivo Nacional de Identificación).
    *   Formularios para ingresar la información de los indiciados y detalles de la consulta.
*   **Configuración de Plantillas:**
    *   Permite a los usuarios modificar y guardar las plantillas base (en formato Handlebars) para cada tipo de informe y párrafo.
    *   Opción para cargar plantillas desde archivos `.txt`.
    *   Listado de marcadores de posición (placeholders) disponibles para cada plantilla.
*   **Gestión de Datos:**
    *   Persistencia de plantillas personalizadas y estadísticas de uso en `localStorage`.
*   **Utilidades:**
    *   **Exportación a Word:** Los informes generados pueden exportarse a formato `.docx`.
    *   **Copiar al Portapapeles:** Facilidad para copiar el texto de informes y párrafos generados.
    *   **Notificaciones Toast:** Feedback visual para acciones como guardado exitoso, copia, errores, etc.
*   **Interfaz de Usuario:**
    *   Diseño responsivo adaptado para diferentes tamaños de pantalla.
    *   Navegación intuitiva con menú principal y submenús.
    *   Menú móvil para dispositivos pequeños.

## 4. Guía de Uso

1.  **Navegación:**
    *   Utiliza el menú de navegación superior (o el menú móvil en dispositivos pequeños) para acceder a las diferentes secciones:
        *   **Dashboard:** Visualiza estadísticas de los informes generados.
        *   **Informes:** Selecciona el tipo de informe a generar (SIJIN, DATT, INPEC).
        *   **Párrafos:** Selecciona el tipo de párrafo a generar (Web Service, ANI).
        *   **Configuraciones:** Modifica las plantillas para cada tipo de informe o párrafo.

2.  **Generar un Informe o Párrafo:**
    *   Selecciona el tipo deseado desde el menú.
    *   Completa el formulario correspondiente con la información requerida. Los campos obligatorios se indicarán si se dejan vacíos.
    *   Para informes SIJIN, puedes añadir múltiples "Otras OPJ".
    *   Para párrafos Web Service o ANI, puedes añadir múltiples "Indiciados a Consultar".
    *   Haz clic en el botón "Generar Informe" o "Generar Párrafo".

3.  **Visualizar y Usar el Contenido Generado:**
    *   Aparecerá un modal con el texto generado.
    *   **Copiar:** Utiliza el botón "Copiar al Portapapeles".
    *   **Exportar a Word (solo informes):**
        *   Ingresa un Número de OT (Orden de Trabajo) en el campo provisto en el modal.
        *   Haz clic en "Exportar a Word". El archivo se descargará como `.docx`.

4.  **Configurar Plantillas:**
    *   Navega a la sección "Configuraciones" y selecciona la plantilla que deseas modificar.
    *   Puedes editar la plantilla directamente en el área de texto. Utiliza la sintaxis de Handlebars.js.
    *   Consulta la lista de "Marcadores de Posición Disponibles" para saber qué variables puedes usar en la plantilla.
    *   Opcionalmente, puedes cargar una plantilla desde un archivo `.txt` local.
    *   Haz clic en "Guardar Plantilla" para aplicar los cambios. La plantilla se guardará en el `localStorage` de tu navegador.

## 6. Lógica de Negocio Clave

*   **Servicio de Plantillas (`src/services/templateService.ts`):**
    *   Utiliza Handlebars.js para compilar las plantillas y rellenarlas con los datos de los formularios.
    *   Incluye *helpers* de Handlebars personalizados para:
        *   Formatear fechas a un formato legible en español.
        *   Formatear números de identificación (ej. `formatId`, `idNoDots`).
        *   Unir arrays de strings con conjunciones específicas (ej. `join`).
        *   Calcular el número de folios (ej. `calculateFolios`).
        *   Realizar comparaciones y operaciones lógicas (ej. `eq`, `gt`, `arrayLength`).
        *   Identificar si un municipio es "Cartagena" o un "Corregimiento" para lógica condicional en las plantillas SIJIN.
        *   Filtrar listas de acusados (ej. `filterAdditionalAccusedWithPositiveResult`).
*   **Gestión de Estado (`src/App.tsx`):**
    *   El estado principal de la aplicación (vista activa, plantillas, estadísticas) se maneja con `useState`.
    *   Las plantillas personalizadas y las estadísticas de informes generados se persisten en `localStorage` para que estén disponibles entre sesiones.
*   **Validación de Formularios:**
    *   Cada componente de formulario (ej. `SijinForm.tsx`, `AniForm.tsx`) implementa su propia lógica de validación antes de intentar generar el texto.
    *   Se enfoca el primer campo con error para mejorar la usabilidad.
*   **Exportación a Word (`src/components/reports/GeneratedReportModal.tsx`):**
    *   Utiliza la librería `docx` para construir un documento de Word en el cliente.
    *   El texto del informe se divide en párrafos y se añade al documento.
    *   `FileSaver.js` se usa para disparar la descarga del archivo `.docx` generado.
*   **Manejo de Componentes Dinámicos:**
    *   Se utiliza `crypto.randomUUID()` para generar IDs únicos para elementos dinámicos como "Otras OPJ" o "Indiciados Adicionales".
    *   Se usan `Refs` para manejar el foco en campos de ítems dinámicos.

## 7. Consideraciones Adicionales

*   **Diseño Responsivo:** La interfaz se adapta a diferentes tamaños de pantalla gracias a Tailwind CSS.
*   **Modularidad:** Los componentes están organizados por funcionalidad (informes, párrafos, configuración, compartidos) dentro de la carpeta `src/components/`.
*   **Offline Parcial:** Una vez cargada la aplicación y sus dependencias CDN, la generación de informes/párrafos y la configuración de plantillas pueden funcionar offline, ya que la lógica y el almacenamiento (localStorage) son del lado del cliente. La carga inicial sí requiere conexión.
*   **Notificaciones:** Se utilizan "toasts" para proporcionar feedback al usuario sobre acciones completadas o errores.

## 8. Posibles Mejoras Futuras

*   **Integración Real con `@google/genai`:**
    *   Utilizar modelos Gemini para asistir en la redacción de los informes o párrafos, sugerir mejoras, o generar borradores basados en datos mínimos.
*   **Pruebas:**
    *   Implementar pruebas unitarias (ej. con Jest/Vitest y React Testing Library) para los componentes y la lógica de negocio.
    *   Pruebas de integración para flujos clave.
*   **Backend y Base de Datos:**
    *   Si se requiere colaboración o persistencia centralizada de plantillas y datos, desarrollar un backend con una base de datos.
*   **Autenticación y Autorización:**
    *   En caso de un backend, implementar un sistema de usuarios para controlar el acceso.
*   **Internacionalización (i18n):**
    *   Adaptar la interfaz y las plantillas a múltiples idiomas.
*   **Mejoras de Accesibilidad (a11y):**
    *   Realizar una auditoría de accesibilidad más profunda y aplicar mejoras.
*   **Sistema de Build:**
    *   Migrar a un sistema de empaquetado moderno como Vite o Webpack si el proyecto crece significativamente, para optimizar los assets y mejorar el flujo de desarrollo.
*   **Gestión de Estado Avanzada:**
    *   Para aplicaciones más complejas, considerar librerías como Redux, Zustand o Jotai.
*   **Versionado de Plantillas:**
    *   Permitir a los usuarios guardar múltiples versiones de plantillas o revertir a versiones anteriores.
*   **Interfaz de Ayuda más Detallada:**
    *   Incorporar tooltips o guías más específicas para el uso de marcadores de Handlebars en las plantillas.
*   **Sincronización de Configuraciones:**
    *   Si se usa en múltiples dispositivos, ofrecer una forma de sincronizar las plantillas personalizadas.
```

  </change>
</changes>
```
>>>>>>> 81abd85 (Aplicacion para generar Informes y Parrafos estandar de PJ)
