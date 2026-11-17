# API de Gestión de Peritos Forenses

Proyecto desarrollado para el examen parcial de Desarrollo de Sistemas Web Backend — IFTS N.º 16.

## Descripción

API REST desarrollada con Node.js, Express y Sequelize para gestionar usuarios peritos y sus roles.

Permite registrar peritos, consultar usuarios activos, filtrar por rol y realizar bajas lógicas sin eliminar físicamente los registros.

## Tecnologías

- Node.js
- Express
- Sequelize ORM
- SQLite
- PostgreSQL
- Docker Compose
- Morgan
- Chalk
- http-errors

## Instalación

Clonar el repositorio:

```bash
git clone https://github.com/ignaci0vidal/ifts16-i.vidal-api-peritos-forenses.git
cd ifts16-i.vidal-api-peritos-forenses
```

Instalar dependencias:

```bash
npm ci
```

Crear el archivo de configuración:

```powershell
Copy-Item .env.example .env
```

## Ejecución con SQLite

Configurar en `.env`:

```dotenv
PORT=3000
DB_DIALECT=sqlite
DB_STORAGE=./forensics.db
```

Iniciar el servidor:

```bash
npm run dev
```

La API estará disponible en `http://localhost:3000`.

El archivo `forensics.db` contiene los registros iniciales requeridos para la demostración.

## Ejecución con PostgreSQL

Se requiere Docker Desktop instalado y en funcionamiento.

Configurar en `.env`:

```dotenv
DB_DIALECT=postgres
DB_HOST=127.0.0.1
DB_PORT=5433
DB_NAME=forensics
DB_USER=forense
DB_PASSWORD=CAMBIAR_PASSWORD
```

Asignar una contraseña local antes de iniciar el contenedor.

Iniciar PostgreSQL:

```bash
docker compose up -d
```

Crear las tablas mediante Sequelize:

```bash
node -e "const db = require('./src/config/database'); require('./src/models'); db.sync().then(() => console.log('Tablas creadas')).catch(console.error).finally(() => db.close())"
```

Cargar los datos iniciales:

```bash
node scripts/seed.js
```

Iniciar la API:

```bash
npm run dev
```

**Nota:** si se habían definido variables `DB_*` directamente en la terminal, estas pueden tener prioridad sobre los valores de `.env`. Reiniciar la terminal permite evitar configuraciones anteriores.

## Endpoints

| Método | Endpoint                     | Descripción                |
| ------ | ---------------------------- | -------------------------- |
| POST   | `/api/v1/peritos`            | Registrar un perito        |
| GET    | `/api/v1/peritos`            | Listar peritos activos     |
| GET    | `/api/v1/peritos?role=ADMIN` | Filtrar por rol            |
| GET    | `/api/v1/peritos/:id`        | Consultar un perito activo |
| DELETE | `/api/v1/peritos/:id`        | Dar de baja lógicamente    |

### Ejemplo de creación

**POST** `/api/v1/peritos`

```json
{
  "username": "perito_nuevo",
  "role_id": 2
}
```

Respuesta esperada: `201 Created`.

### Códigos HTTP

- `200`: operación o consulta exitosa.
- `201`: usuario registrado.
- `400`: datos inválidos.
- `404`: usuario inexistente o inactivo.
- `409`: nombre de usuario duplicado.
- `500`: error interno del servidor.

## Modelo de datos

**roles:** `id`, `nombre_rol`.

Roles iniciales: `ADMIN`, `FORENSIC_INSPECTOR`, `AUDITOR`.

**users:** `id`, `username`, `role_id`, `active`, `created_at`.

Cada usuario pertenece a un rol mediante `role_id`, que funciona como clave foránea.

La baja lógica cambia `active` a `false`; los registros permanecen almacenados, pero se excluyen de las consultas de usuarios activos.

## Auditoría y errores

Morgan registra las solicitudes HTTP en consola.

Chalk distingue los mensajes mediante colores:

- Cyan: registro exitoso de un usuario.
- Amarillo: errores de validación.
- Rojo: errores internos y stack.

El middleware centralizado devuelve respuestas HTTP en formato JSON.

## Autor

Ignacio Vidal — IFTS N.º 16.
