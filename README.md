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

#### Uso con MTMI (Recomendado)

```javascript
import badges from 'mtmi-async-badges';
import { client } from 'mtmi';

// Conectar al chat de Twitch pasando badges como opción
client.connect({ 
  channels: ['tu_canal'], 
  badges,  // Los badges se cargan automáticamente de forma asíncrona
  avatarProvider: 'decapi' 
});

// Escuchar mensajes
client.on('message', (message) => {
  console.log(message);
  // Los badges ya estarán resueltos en message.badges
});
```

### API

#### Uso Principal: Integración con MTMI

El caso de uso principal es pasar el objeto `badges` directamente a MTMI:

```javascript
import badges from 'mtmi-async-badges';
import { client } from 'mtmi';

client.connect({ 
  channels: ['canal'], 
  badges  // MTMI se encarga de todo automáticamente
});
```

#### Tipos TypeScript

```typescript
import badges from 'mtmi-async-badges';
import { client } from 'mtmi';
import type ChatView from '@components/chat-view';

const chatView = document.querySelector('chat-view') as ChatView;
const channel = 'tu_canal';

// Conectar con tipos completos
client.connect({ 
  channels: [channel], 
  badges,
  avatarProvider: 'decapi'
});

// Los tipos de MTMI incluyen la información de badges
client.on('message', (message) => {
  chatView.newMessage(message);
});
```

#### Uso Directo (Avanzado)

Si necesitas acceder directamente a los badges sin MTMI:

```javascript
import badges from 'mtmi-async-badges';

// Buscar badge específico
const subscriberBadge = badges.find(badge => badge.text === 'subscriber/12');
console.log(subscriberBadge?.image); // URL de la imagen del badge

// Buscar por patrón
const vipBadges = badges.filter(b => b.text.startsWith('vip/'));

// Buscar por valor
const longSubscriber = badges.find(b => 
  b.text.startsWith('subscriber/') && (b.value || 0) >= 12
);

// Los badges se cargan de forma asíncrona desde el CDN
// La primera llamada iniciará la descarga, las siguientes usarán la versión cacheada
```

### Uso desde CDN (unpkg)

Puedes usar el paquete directamente en el navegador sin instalación mediante [unpkg.com](https://unpkg.com):

#### Módulo ESM (Navegadores Modernos)

```html
<!DOCTYPE html>
<html>
<head>
  <title>MTMI Async Badges</title>
</head>
<body>
  <script type="module">
    // Importar desde unpkg
    import badges from 'https://unpkg.com/mtmi-async-badges@latest/dist/index.js';
    
    // Usar el paquete
    const subscriberBadge = badges.find(b => b.text === 'subscriber/12');
    console.log(subscriberBadge);
  </script>
</body>
</html>
```

#### URLs Disponibles

```bash
# Última versión (recomendado para desarrollo)
https://unpkg.com/mtmi-async-badges/dist/index.js

# Versión específica (recomendado para producción)
https://unpkg.com/mtmi-async-badges@1.0.4/dist/index.js

# Ver todos los archivos del paquete
https://unpkg.com/browse/mtmi-async-badges@latest/

# Archivos de tipos TypeScript
https://unpkg.com/mtmi-async-badges@latest/dist/index.d.ts
```

#### Ejemplo Completo

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Demo MTMI Async Badges</title>
</head>
<body>
  <h1>Twitch Chat con Badges</h1>
  <div id="chat"></div>

  <script type="module">
    import badges from 'https://unpkg.com/mtmi-async-badges@latest/dist/index.js';
    import { client } from 'https://unpkg.com/mtmi@latest/dist/index.js';
    
    const chatContainer = document.getElementById('chat');
    
    // Conectar al chat de Twitch
    client.connect({ 
      channels: ['tu_canal'], 
      badges,
      avatarProvider: 'decapi'
    });
    
    // Mostrar mensajes con badges
    client.on('message', (message) => {
      const msgDiv = document.createElement('div');
      
      // Renderizar badges
      if (message.badges) {
        message.badges.forEach(badge => {
          const img = document.createElement('img');
          img.src = badge.image;
          img.alt = badge.description;
          img.title = badge.text;
          img.style.width = '18px';
          img.style.marginRight = '4px';
          msgDiv.appendChild(img);
        });
      }
      
      // Añadir mensaje
      msgDiv.appendChild(document.createTextNode(
        `${message.username}: ${message.message}`
      ));
      
      chatContainer.appendChild(msgDiv);
    });
  </script>
</body>
</html>
```

#### Características

- ✅ **Zero build**: No requiere empaquetador
- ✅ **Módulos ESM**: Compatible con navegadores modernos
- ✅ **Caché CDN**: Rápido y distribuido globalmente
- ✅ **Versionado**: Puedes fijar versiones específicas
- ✅ **Integración con MTMI**: Funciona directamente con la librería MTMI
- ⚠️ **Soporte de navegadores**: Requiere navegadores con soporte para ES Modules

### API

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
│       ├── publish-npm-tag.yml     # Publicación npm por tags
│       └── create-release.yml      # Creación automática de GitHub Releases
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

#### 📦 Publicación Automática (Recomendado)

El proyecto tiene configurado GitHub Actions para publicar automáticamente cuando cambias la versión en `package.json`:

```bash
# 1. Actualizar la versión
pnpm version patch  # 1.0.4 -> 1.0.5
pnpm version minor  # 1.0.4 -> 1.1.0
pnpm version major  # 1.0.4 -> 2.0.0

# 2. Push de los cambios (esto dispara la publicación automática)
git push && git push --tags
```

La GitHub Action:
1. Detecta el cambio de versión
2. Compila el paquete
3. Publica en npm
4. Crea un tag de Git
5. Genera un changelog automático
6. Crea un release en GitHub

#### 🏷️ Publicación por Tags

También puedes publicar creando un tag de versión:

```bash
# Crear tag y hacer push
git tag v1.0.5
git push origin v1.0.5
```

Esto también disparará el workflow de publicación y creación de release.

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

# 4. GitHub Actions se encargan del resto:
#    - Instala dependencias
#    - Compila el código
#    - Publica en npm
#    - Crea un release en GitHub con changelog automático
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
