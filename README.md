# ts-vertical-slice

Proyecto base para APIs REST con **arquitectura Vertical Slice por feature** (TypeScript, Bun, Hono, Sequelize, MySQL).

## Estructura

```
src/
├── index.ts                    # punto de entrada: new Server().start()
├── server.ts                   # clase Server: BD, middlewares, rutas y Bun.serve
├── routes/
│   ├── routes.ts               # health "/" + "/api/v1"
│   └── v1.routes.ts            # registro de las rutas de cada feature
├── shared/                     # lo que usan varios features
│   ├── constant.ts             # constantes compartidas
│   ├── env.ts                  # variables de entorno
│   ├── interfaces.ts
│   ├── errors/                 # CustomError
│   └── dtos/                   # DTOs compartidos (paginación)
├── database/                   # infraestructura de BD común
│   ├── config.ts / sequelize.ts            # configuración + instancia única
│   ├── associations.ts                     # relaciones entre modelos de distintos features
│   ├── init.ts                             # DbService: associations + sync + migraciones
│   ├── models/                             # Migration.ts + re-export de los modelos de cada feature
│   ├── migration/                          # control de la tabla migrations
│   └── seeders/{data,exec}/                # registro y ejecución de migraciones y seeders
├── cli/                        # comandos de administración (migraciones)
└── features/
    └── products/               # un feature
        ├── database/           # todo lo de BD del feature
        │   ├── Product.ts      # modelo Sequelize
        │   ├── migrations/     # migraciones del feature
        │   └── seeders/        # datos iniciales (data/, exec/ y su DTO)
        ├── entities/           # una entidad por archivo + index.ts
        ├── product.constant.ts # constantes propias del feature
        ├── routes.ts           # monta el controller de cada slice
        ├── createProduct/      # un slice = un caso de uso
        │   ├── createProduct.dto.ts         # validación de la entrada
        │   ├── createProduct.useCase.ts     # lógica + Sequelize
        │   └── createProduct.controller.ts  # HTTP (Context de Hono)
        ├── getProduct/
        ├── listProducts/
        ├── updateProduct/
        └── deleteProduct/

tests/
├── setup.ts                    # preload: entorno por defecto y cierre de la conexión
├── helpers/                    # helpers usados por varios features
├── shared/                     # tests de src/shared
└── features/
    └── products/               # una carpeta por feature
        ├── products.helper.ts            # app y builders de prueba del feature
        ├── createProduct.test.ts         # un archivo por slice
        ├── ...
        ├── productSeeder.test.ts
        └── products.integration.test.ts  # contra MySQL real
```

## Cómo se lee

- **Feature** (`src/features/<feature>/`): agrupa todo lo de un dominio: su BD, entidades, constantes, rutas y casos de uso.
- **Slice** (`src/features/<feature>/<accion>/`): un caso de uso con su DTO, use case y controller
  (`controller → useCase`); el use case usa el modelo Sequelize directamente.
- **`shared/`**: solo lo que usan varios features. Lo propio de un feature se queda en su carpeta.
- **`database/`** (raíz): la conexión y el arranque de la BD. Los modelos, migraciones y seeders de cada feature viven en
  `src/features/<feature>/database/` y aquí solo se registran.
- **`tests/`**: replica la organización de `src/`: una carpeta por feature y un archivo por slice.

## Reglas

1. Los slices no se importan entre sí; solo comparten lo de su feature (`database/`, `entities/`, `<feature>.constant.ts`)
   y `shared/`.
2. Los features no se importan entre sí; las relaciones entre modelos se declaran en `src/database/associations.ts`.
3. Cambiar un caso de uso solo toca su carpeta y su archivo de test.
