# Autenticacion

Servicio de autenticación desarrollado en **TypeScript** con Node.js.

## Tecnologías

- Node.js + TypeScript
- ESLint + Prettier
- Husky (Git Hooks)

## Requisitos previos

- Node.js >= 18
- npm >= 9

## Instalación

```bash
npm install 
```

### Regla para instalar dependencias

Como el proyecto usa una versión reciente de TypeScript, para evitar conflictos de dependencias, **toda instalación** de paquetes debe incluir .

Ejemplos:

```bash
# Dependencias de desarrollo
npm install --save-dev eslint prettier
```

```bash
npm install --save-dev jest ts-jest @types/jest
```

```bash
# Dependencias de producción
npm install express
```

## Scripts disponibles

| Script | Descripción |
|---|---|
| `npm run dev` | Ejecuta la app en desarrollo con ts-node |
| `npm run dev-watch` | Ejecuta la app en modo watch (recarga automática) |
| `npm run build` | Compila TypeScript a JavaScript en `dist/` |
| `npm start` | Ejecuta la app compilada desde `dist/` |

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto basado en el siguiente ejemplo:

```env
# Puerto del servidor
PORT=3000
```

## Git Hooks (Husky)

Este proyecto usa Husky para aplicar reglas automáticas antes de cada operación Git.

### pre-commit
- Valida que el nombre de la rama sea válido
- Elimina archivos temporales (`*.log`)
- Detecta secretos expuestos con **Gitleaks**
- Revisa vulnerabilidades en dependencias con `npm audit`

### pre-push
- Verifica que el proyecto compile correctamente con `npm run build`

### Convención de ramas

| Prefijo | Para qué se usa | Ejemplo |
|---|---|---|
| `feature/` | Nueva funcionalidad o módulo | `feature/login` |
| `fix/` | Corrección de un bug en desarrollo | `fix/token-expiry` |
| `hotfix/` | Corrección urgente sobre producción | `hotfix/critical-bug` |
| `chore/` | Tareas de mantenimiento sin impacto en lógica (deps, configs) | `chore/update-deps` |
| `refactor/` | Reestructuración de código sin cambiar comportamiento | `refactor/auth-service` |
| `docs/` | Cambios en documentación únicamente | `docs/readme` |
| `test/` | Agregar o corregir pruebas | `test/login-unit` |
| `perf/` | Mejoras de rendimiento | `perf/query-optimization` |
| `ci/` | Cambios en pipelines o configuración de CI/CD | `ci/github-actions` |
| `revert/` | Revertir un commit o rama anterior | `revert/feature-login` |
| `experimental/` | Pruebas de concepto o ideas sin garantía de merge | `experimental/oauth2` |
| `main` / `dev` / `qa` | Ramas principales protegidas | — |

## Estructura del proyecto

```
├── app.ts          # Punto de entrada
├── dist/           # Código compilado (generado por tsc)
├── .husky/         # Git hooks
├── .eslintrc.json  # Configuración de ESLint
├── tsconfig.json   # Configuración de TypeScript
└── package.json
```
