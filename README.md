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
│       └── update-badges.yml  # GitHub Action para actualización automática
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

Antes de publicar, asegúrate de:

1. **Configurar tu cuenta de npm**:
```bash
npm login
```

2. **Actualizar la versión** (elige una):
```bash
# Patch (1.0.0 -> 1.0.1) - correcciones de bugs
pnpm version patch

# Minor (1.0.0 -> 1.1.0) - nuevas características
pnpm version minor

# Major (1.0.0 -> 2.0.0) - cambios que rompen compatibilidad
pnpm version major
```

3. **Publicar el paquete**:
```bash
# La compilación se ejecuta automáticamente con prepublishOnly
pnpm publish

# Para primera publicación con acceso público
pnpm publish --access public
```

4. **Verificar la publicación**:
```bash
npm view mtmi-async-badges
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
