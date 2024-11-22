# Sistema de Gestión de Preparadurías Universitario (SGPU)

El **Sistema de Gestión de Preparadurías Universitario (SGPU)** tiene como objetivo optimizar y automatizar la gestión de preparadurías académicas en universidades, facilitando la asignación de preparadores, el control de asistencia, la gestión de salones y horarios, la subida de contenidos, y la visualización de un historial detallado de las sesiones.

## Funcionalidades

### 1. Gestión de Preparadores

- Los profesores pueden asignar preparadores a cada sesión.
- Los preparadores son responsables de impartir los contenidos o ejercicios prácticos acordados.

### 2. Gestión de Salones y Horarios

- Consulta en tiempo real la disponibilidad de salones para evitar conflictos con otras actividades.
- El sistema valida la disponibilidad de los salones para evitar solapamientos entre clases y preparadurías.

### 3. Control de Asistencia de Estudiantes

- Los estudiantes pueden registrarse en las preparadurías disponibles.
- El preparador recibe notificaciones con el número de estudiantes inscritos.

### 4. Subida de Contenido por el Preparador

- Los preparadores pueden cargar materiales de apoyo, ejercicios y otros recursos.
- Los profesores pueden revisar los materiales subidos y dejar retroalimentación.

### 5. Historial de Preparadurías

- Acceso a un historial detallado de las preparadurías pasadas, incluyendo fechas, contenidos, preparadores, asistentes y materiales subidos.
- Los usuarios pueden filtrar el historial por diferentes criterios (fecha, preparador, materia).

## Tecnologías

- **Backend**: Node.js, Next.js
- **Frontend**: React, Next.js
- **Base de Datos**: MySQL
- **Almacenamiento**: AWS S3 o Google Cloud Storage (para archivos)
- **Autenticación**: JWT (JSON Web Tokens)

## Requerimientos

- El sistema debe ser accesible desde cualquier dispositivo (móvil, tablet, PC).
- Control de accesos basado en roles (profesor, preparador, estudiante).
- El sistema debe ser escalable y de alto rendimiento para soportar múltiples usuarios concurrentes.

## Instalación

### Prerequisitos

1. Tener instalado Node.js (versión 16 o superior).
2. Tener MySQL instalado o configurado.
3. Acceso a un servicio de almacenamiento en la nube como AWS S3 o Google Cloud Storage.

### Pasos para ejecutar el proyecto

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/tuusuario/sgpu.git
   cd sgpu
   ```

2. Instalar las dependencias:

   ```bash
   npm install
   ```

3. Configurar las variables de entorno (`.env`):

   Asegúrate de incluir las variables necesarias para la base de datos, autenticación y almacenamiento.

4. Iniciar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

   Accede al sistema en `http://localhost:3000`.

## Contribuir

Las contribuciones son bienvenidas. Si deseas aportar, por favor sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una nueva rama para tu funcionalidad (`git checkout -b feature/nueva-funcionalidad`).
3. Haz commit de tus cambios.
4. Realiza un pull request describiendo los cambios.

## Licencia

Este proyecto está bajo la Licencia MIT - consulta el archivo [LICENSE](LICENSE) para más detalles.
