/**
 * Representa una insignia con su información completa.
 */
export type Badge = {
  /** Nombre identificador de la insignia */
  text: string;
  /** URL de la imagen de la insignia */
  image: string;
  /** Descripción textual de la insignia */
  description: string;
  /** Valor numérico asociado a la insignia, puede ser null si no tiene valor */
  value: number | null;
}
/**
 * Array de nombres de insignias.
 */
export type BadgeNames = string[]

/**
 * Estructura de la lista de insignias obtenida del CDN.
 */
export type BadgeList = {
  /** Texto descriptivo de la lista */
  text: string;
  /** URL de imagen asociada a la lista */
  image: string;
  /** Descripción de la lista */
  description: string;
  /** Valor numérico de la lista */
  value: number;
  /** Array de nombres de insignias contenidas en la lista */
  badges: BadgeNames;
}

/**
 * Array de insignias.
 */
export type Badges = Badge[]

/**
 * Función predicado para filtrar insignias.
 * @param value - La insignia a evaluar
 * @param index - El índice de la insignia en el array
 * @param obj - El array completo de insignias
 * @returns true si la insignia cumple con la condición, false en caso contrario
 */
export type Predicate = (value: Badge, index: number, obj: unknown[]) => boolean;

/**
 * Clase para gestionar insignias de forma asíncrona.
 * Carga las insignias desde un CDN y permite buscarlas según criterios.
 */
class AsyncBadges {
  /** Lista de insignias cargadas */
  badges: Badges = [];

  /**
   * Inicializa la clase y comienza la carga de nombres de insignias.
   */
  constructor() {
    this.getBadgeNames();
  }

  /**
   * Obtiene la lista de nombres de insignias desde el CDN.
   * Inicializa el array de insignias con los nombres y valores vacíos.
   * @private
   */
  private async getBadgeNames() {
    const response = await this.fromCDN<BadgeList>("list");
    this.badges = response.badges.map(badge => ({
      text: badge,
      image: "",
      description: "",
      value: null,
    }));
  }

  /**
   * Obtiene un archivo JSON desde el CDN de insignias.
   * @template T - El tipo de dato esperado del JSON
   * @param file - Nombre del archivo (sin extensión) a obtener del CDN
   * @returns Promise que resuelve con el contenido del archivo JSON parseado
   * @throws Error si la petición falla
   * @private
   */
  private async fromCDN<T>(file: string) {
    try {
      return (await fetch(`https://raw.githubusercontent.com/chrisvdev/mtmi-async-badges/refs/heads/main/badges/${file}.json`)).json() as Promise<T>;
    }
    catch (error) {
      console.error(`Error fetching ${file} from CDN:`, error);
      throw error;
    }
  }

  /**
   * Obtiene los detalles completos de una insignia desde el CDN.
   * Actualiza el objeto badge con la imagen, descripción y valor obtenidos.
   * @param badge - La insignia a completar con información del CDN
   * @private
   */
  private async getBadge(badge: Badge) {
    try {
      const cdnBadge = await this.fromCDN<Badge>(badge.text.split("/").join("_"));
      badge.image = cdnBadge.image;
      badge.description = cdnBadge.description;
      badge.value = cdnBadge.value;
    }
    catch (error) {
      console.error(`Error fetching badge ${badge.text} from CDN:`, error);
    }
  }

  /**
   * Busca una insignia que cumpla con el predicado especificado.
   * Si la insignia se encuentra pero no tiene imagen cargada, inicia la carga desde el CDN.
   * @param predicate - Función que determina si una insignia cumple con los criterios de búsqueda
   * @returns La insignia encontrada con imagen cargada, o undefined si no se encuentra o no tiene imagen
   */
  public find(predicate: Predicate) {
    const badge = this.badges.find(predicate);
    if (badge && !badge.image) this.getBadge(badge);
    return badge?.image ? badge : undefined;
  }

  /**
   * Retorna la cadena "async" para identificar este objeto como AsyncBadges.
   * Permite diferenciar esta implementación asíncrona de un array normal de insignias.
   * @returns La cadena "async"
   */
  public length() {
    return "async";
  }
}

/**
 * Instancia singleton de AsyncBadges para gestionar las insignias de forma global.
 * Se exporta como un array de Badges para facilitar su uso.
 */
const badges: Badges = new AsyncBadges() as unknown as Badges;

export default badges;