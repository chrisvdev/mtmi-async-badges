# 🎖️ MTMI Badges

<div align="center">

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![npm (coming soon)](https://img.shields.io/badge/npm-coming%20soon-orange)](https://www.npmjs.com/)

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
https://raw.githubusercontent.com/[usuario]/mtmi-badges/main/badges/[nombre_badge].json
```

### Paquete NPM (Próximamente)

```bash
npm install mtmi-badges
```

```javascript
// Uso previsto (en desarrollo)
import { getBadge } from 'mtmi-badges';

const badge = await getBadge('subscriber/12');
console.log(badge.image); // URL de la imagen del badge
```

## 📂 Estructura del Proyecto

```
mtmi-badges/
├── .github/
│   └── workflows/
│       └── update-badges.yml  # GitHub Action para actualización automática
├── badges/           # Directorio con todos los badges en formato JSON
├── scripts/          # Scripts de mantenimiento
│   └── getGlobalBadges.js  # Script para actualizar badges desde la API
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
