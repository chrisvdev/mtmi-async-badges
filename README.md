# 🎖️ MTMI Async Badges

<div align="center">

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![npm version](https://img.shields.io/npm/v/mtmi-async-badges.svg)](https://www.npmjs.com/package/mtmi-async-badges)

</div>

Repositorio de badges globales de Twitch para usar como fuente asíncrona con la librería [MTMI](https://github.com/ManzDev/mtmi).

## 📋 Descripción

Este repositorio aloja los badges globales de Twitch en formato JSON, disponibles para descarga directa vía `raw.githubusercontent.com`. Está diseñado para ser utilizado como parche que proporciona una alternativa asíncrona para la resolución de badges en la librería MTMI.

### ¿Por qué este proyecto?

La librería MTMI es una excelente herramienta para trabajar con el chat de Twitch, pero requiere una solución asíncrona para la carga de badges. Este repositorio proporciona:

- ✅ Badges actualizados y disponibles en formato JSON
- ✅ Acceso directo vía CDN (GitHub Raw)
- ✅ Estructura organizada y fácil de consumir
- ✅ Actualización automatizada mediante scripts

## 🚀 Uso

### Descarga Directa

Los badges están disponibles en formato JSON y pueden ser descargados directamente desde:

```
https://raw.githubusercontent.com/chrisvdev/mtmi-async-badges/main/badges/[nombre_badge].json
```

### Paquete NPM

```bash
npm install mtmi-async-badges
# o
pnpm add mtmi-async-badges
# o
yarn add mtmi-async-badges
```

```javascript
import badges from 'mtmi-async-badges';

// Buscar badge por texto
const subscriberBadge = badges.find(badge => badge.text === 'subscriber/12');
console.log(subscriberBadge?.image); // URL de la imagen del badge

// Los badges se cargan de forma asíncrona desde el CDN
// La primera llamada iniciará la descarga, las siguientes usarán la versión cacheada
```

#### TypeScript

El paquete incluye definiciones de tipos completas:

```typescript
import badges, { Badge, Badges, Predicate } from 'mtmi-async-badges';

// Type-safe badge search
const badge: Badge | undefined = badges.find((badge: Badge) => 
  badge.text.startsWith('subscriber/')
);

if (badge) {
  console.log(`Badge: ${badge.description}`);
  console.log(`Image: ${badge.image}`);
  console.log(`Value: ${badge.value}`);
}
```

#### API

**`badges.find(predicate: Predicate): Badge | undefined`**

Busca un badge que cumpla con el predicado especificado. Si el badge se encuentra pero no tiene su imagen cargada aún, inicia la descarga desde el CDN de forma asíncrona.

```typescript
// Predicado: función que determina si un badge cumple los criterios
type Predicate = (value: Badge, index: number, obj: unknown[]) => boolean;

// Estructura de un Badge
type Badge = {
  text: string;          // Identificador (ej: "subscriber/12")
  image: string;         // URL de la imagen
  description: string;   // Descripción legible
  value: number | null;  // Valor numérico asociado
};
```

**Ejemplos de uso:**

```javascript
// Buscar por nombre exacto
const moderatorBadge = badges.find(b => b.text === 'moderator/1');

// Buscar por patrón
const vipBadges = badges.filter(b => b.text.startsWith('vip/'));

// Buscar por valor
const longSubscriber = badges.find(b => 
  b.text.startsWith('subscriber/') && (b.value || 0) >= 12
);
```

## 📂 Estructura del Proyecto

```
mtmi-async-badges/
├── .github/
│   └── workflows/
│       ├── update-badges.yml       # Actualización automática de badges
│       ├── publish-npm.yml         # Publicación npm por cambio de versión
│       └── publish-npm-tag.yml     # Publicación npm por tags
├── badges/           # Directorio con todos los badges en formato JSON
├── dist/             # Archivos compilados (generado por tsdown)
├── src/
│   └── index.ts      # Código fuente del paquete
├── scripts/          # Scripts de mantenimiento
│   └── getGlobalBadges.js  # Script para actualizar badges desde la API
├── tsconfig.json     # Configuración de TypeScript
├── tsdown.config.ts  # Configuración de tsdown
├── package.json
├── LICENSE
└── README.md
```

## 🔧 Desarrollo

### Requisitos

- Node.js >= 18
- pnpm (recomendado)

### Instalación

```bash
pnpm install
```

### Actualizar Badges

Para actualizar los badges desde la API de Twitch:

```bash
pnpm update-badges
```

Este comando:
1. Obtiene los badges globales desde la API de StreamDatabase
2. Transforma los datos al formato requerido
3. Guarda cada badge como un archivo JSON individual en `badges/`

### 🤖 Actualización Automática

El repositorio incluye una GitHub Action que actualiza automáticamente los badges:

- **Ejecución programada**: Se ejecuta automáticamente cada lunes a las 00:00 UTC
- **Ejecución manual**: Puedes ejecutarla manualmente desde la pestaña "Actions" en GitHub

La action realiza los siguientes pasos:
1. Clona el repositorio
2. Configura Node.js y pnpm
3. Instala las dependencias
4. Ejecuta el script de actualización
5. Hace commit y push de los cambios automáticamente si hay badges nuevos o actualizados

Para ejecutar manualmente:
1. Ve a la pestaña "Actions" en GitHub
2. Selecciona "Update Twitch Badges"
3. Haz clic en "Run workflow"

### 📦 Compilar el Paquete

El proyecto usa [tsdown](https://tsdown.dev/) para compilar TypeScript a JavaScript con soporte para ESM y CJS:

```bash
pnpm build
```

Esto generará los archivos compilados en la carpeta `dist/`:
- `dist/index.js` - Módulo ESM
- `dist/index.cjs` - Módulo CommonJS
- `dist/index.d.ts` - Definiciones de TypeScript (ESM)
- `dist/index.d.cts` - Definiciones de TypeScript (CJS)
- Source maps para debugging

### 🚀 Publicar en NPM

El proyecto incluye publicación automática mediante GitHub Actions. Hay dos métodos:

#### 🤖 Método 1: Publicación Automática (Recomendado)

Cuando cambias la versión en `package.json` y haces push, se publica automáticamente:

```bash
# 1. Actualizar la versión
pnpm version patch  # o minor/major

# 2. Push de los cambios (esto dispara la publicación automática)
git push && git push --tags
```

La GitHub Action detectará el cambio de versión y publicará automáticamente en npm.

#### 🏷️ Método 2: Publicación por Tags

Crear un tag de versión también dispara la publicación:

```bash
# Crear tag y hacer push
git tag v1.0.1
git push origin v1.0.1
```

#### ⚙️ Configuración Inicial (Una sola vez)

Para habilitar la publicación automática, necesitas configurar el token de npm:

1. **Generar token de npm**:
   - Ve a [npmjs.com](https://www.npmjs.com/) → Settings → Access Tokens
   - Crea un token de tipo "Automation" o "Publish"
   - Copia el token generado

2. **Configurar en GitHub**:
   - Ve a tu repositorio en GitHub
   - Settings → Secrets and variables → Actions
   - Haz clic en "New repository secret"
   - Nombre: `NPM_TOKEN`
   - Valor: Pega tu token de npm
   - Guarda el secret

3. **Listo**: Los próximos cambios de versión se publicarán automáticamente

#### 📋 Flujo de Trabajo de Publicación

```bash
# 1. Hacer cambios en el código
git add .
git commit -m "✨ feat: nueva característica"

# 2. Actualizar versión (esto crea un commit y tag automáticamente)
pnpm version patch  # 1.0.0 -> 1.0.1
# o
pnpm version minor  # 1.0.0 -> 1.1.0
# o
pnpm version major  # 1.0.0 -> 2.0.0

# 3. Subir cambios y tags
git push && git push --tags

# 4. GitHub Action se encarga del resto:
#    - Instala dependencias
#    - Compila el código
#    - Publica en npm
```

#### 🔧 Publicación Manual (Opcional)

Si prefieres publicar manualmente:

```bash
npm login
pnpm build
pnpm publish --access public
```

#### ✅ Verificar la Publicación

```bash
# Ver información del paquete
npm view mtmi-async-badges

# Ver en npmjs.com
# https://www.npmjs.com/package/mtmi-async-badges
```

## 📊 Formato de Datos

Cada badge se guarda con la siguiente estructura:

```json
{
  "text": "subscriber/12",
  "image": "https://static-cdn.jtvnw.net/badges/v1/...",
  "description": "12-Month Subscriber",
  "value": 12
}
```

### Campos

- **text**: Identificador del badge en formato `nombre/versión`
- **image**: URL de la imagen del badge (versión 4x)
- **description**: Descripción legible del badge
- **value**: Valor numérico asociado al badge (útil para subscribers, bits, etc.)

## 🔗 Enlaces Relacionados

- [MTMI - Librería original](https://github.com/ManzDev/mtmi)
- [Documentación MTMI](https://manzdev.github.io/mtmi)
- [Twitch API](https://dev.twitch.tv/)

## 📝 Licencia

ISC

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request para sugerencias o mejoras.

---

<div align="center">
Hecho con ❤️ para la comunidad de MTMI
</div>
