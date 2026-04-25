/**
 * @fileoverview Script para obtener y almacenar badges globales de Twitch
 * @description Este script obtiene los badges globales de Twitch desde la API de StreamDatabase,
 * los transforma a un formato estructurado y los guarda como archivos JSON individuales.
 * @version 1.0.0
 */

import { writeFile } from "node:fs/promises";

/**
 * @typedef {Object} BadgeVersion
 * @property {string} id - ID de la versión del badge
 * @property {string} image_url_4x - URL de la imagen del badge en resolución 4x
 * @property {string} title - Título descriptivo del badge
 */

/**
 * @typedef {Object} BadgeData
 * @property {string} set_id - ID del conjunto del badge
 * @property {BadgeVersion} version - Información de la versión del badge
 */

/**
 * @typedef {Object} APIBadgeResponse
 * @property {BadgeData} current - Datos actuales del badge
 */

/**
 * @typedef {Object} TransformedBadge
 * @property {string} text - Identificador del badge en formato "nombre/versión"
 * @property {string} image - URL de la imagen del badge (4x)
 * @property {string} description - Descripción legible del badge
 * @property {number} value - Valor numérico asociado (útil para subscribers, bits, etc.)
 */

/**
 * Obtiene los datos de badges globales desde la API de StreamDatabase
 * 
 * @async
 * @function getAPIData
 * @returns {Promise<APIBadgeResponse[]>} Array con los datos de badges desde la API
 * @throws {Error} Si falla la petición HTTP o el parseo JSON
 * 
 * @example
 * const badges = await getAPIData();
 * console.log(badges.length); // Número de badges obtenidos
 */
async function getAPIData () {
  const res = await fetch(
    "https://api.streamdatabase.com/twitch/global-badges/",
  );
  const { data } = await res.json();
  return data;
}

/**
 * Transforma la respuesta de la API al formato estructurado del proyecto
 * 
 * @function transformResponse
 * @param {APIBadgeResponse[]} data - Array de datos de badges desde la API
 * @returns {TransformedBadge[]} Array de badges transformados
 * 
 * @description
 * Esta función realiza las siguientes transformaciones:
 * - Extrae el badge actual de cada entrada
 * - Analiza el set_id para determinar el nombre base y el valor numérico
 * - Genera un identificador texto en formato "nombre/versión"
 * - Construye el objeto badge con la estructura final
 * 
 * @example
 * const apiData = [{ current: { set_id: 'subscriber_12', version: {...} } }];
 * const transformed = transformResponse(apiData);
 * // Resultado: [{ text: 'subscriber/12', image: '...', description: '...', value: 12 }]
 */
function transformResponse (data) {
  return data
    .map((badge) => badge.current)
    .map((badge) => {
      const parts = badge.set_id.split("_");
      const lastPart = parts[parts.length - 1];
      const value =
        parts.length > 1 && !isNaN(Number(lastPart)) ? Number(lastPart) : 1;
      const baseName =
        parts.length > 1 && !isNaN(Number(lastPart))
          ? parts.slice(0, -1).join("_")
          : badge.set_id;
      const versionId = value > 1 ? String(value) : badge.version.id;

      return {
        text: `${baseName}/${versionId}`,
        image: badge.version.image_url_4x,
        description: badge.version.title,
        value,
      };
    });
}

/**
 * Guarda un badge como archivo JSON en el sistema de archivos
 * 
 * @async
 * @function saveToFS
 * @param {TransformedBadge} badge - Objeto badge a guardar
 * @returns {Promise<void>}
 * @throws {Error} Si falla la escritura del archivo
 * 
 * @description
 * Guarda el badge en la carpeta ./badges/ con el nombre basado en su identificador.
 * Los caracteres "/" en el identificador son reemplazados por "_" para el nombre del archivo.
 * 
 * @example
 * await saveToFS({ text: 'subscriber/12', image: '...', description: '...', value: 12 });
 * // Crea el archivo: ./badges/subscriber_12.json
 */
async function saveToFS (badge) {
  await writeFile(`./badges/${badge.text.split("/").join("_")}.json`, JSON.stringify(badge));
}

/**
 * Flujo principal de ejecución del script
 * 
 * @description
 * Ejecuta el proceso completo de actualización de badges:
 * 1. Obtiene los badges desde la API
 * 2. Transforma los datos al formato del proyecto
 * 3. Guarda cada badge como archivo JSON individual
 * 
 * El script imprime mensajes de progreso en consola y maneja errores
 * terminando el proceso con código de salida 1 en caso de fallo.
 */
try {
  console.log("Fetching badges from API...");
  const APIData = await getAPIData();
  console.log(`✔ Fetched ${APIData.length} badges.`);

  const transformedResponse = transformResponse(APIData);
  console.log(`✔ Transformed ${transformedResponse.length} entries.`);

  for (const badge of transformedResponse) {
    await saveToFS(badge);
    console.log(`✔ Saved ${badge.text} to badges/${badge.text.split("/").join("_")}.json`);
  }
} catch (err) {
  console.error("✖ Error:", err.message);
  process.exit(1);
}
