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
  /** Fecha de creación o actualización de la lista */
  date: string;
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
 * Estructura de datos almacenada en localStorage.
 * Contiene las insignias cargadas y la fecha de última actualización.
 */
export type LocalStorageAsyncBadges = {
  /** Array de insignias almacenadas */
  badges: Badges;
  /** Fecha de última actualización de las insignias */
  lastUpdate: Date;
}

/**
 * Clase para gestionar insignias de forma asíncrona.
 * Carga las insignias desde un CDN, las almacena en localStorage para persistencia,
 * y permite buscarlas según criterios mediante predicados.
 */
class AsyncBadges {
  /** Lista de insignias cargadas */
  badges: Badges = [];
  /** Fecha de última actualización de las insignias desde el CDN */
  lastUpdate: Date = new Date(0);
  /** Clave utilizada para almacenar los datos en localStorage */
  localStorageKey = "MTMIAsyncBadges";

  /**
   * Inicializa la clase cargando las insignias desde localStorage si existen,
   * y luego actualiza la lista desde el CDN si hay una versión más reciente.
   */
  constructor() {
    this.loadFromLocalStorage();
    this.updateBadges();
  }

  /**
   * Obtiene la lista de nombres de insignias desde el CDN y actualiza el estado local.
   * Solo actualiza si la versión del CDN es más reciente que la última actualización local.
   * Guarda los cambios en localStorage tras una actualización exitosa.
   * @throws Error si la petición al CDN falla
   * @private
   */
  private async updateBadges() {
    try {
      const { badges, date } = await this.fromCDN<BadgeList>("list");
      const cdnDate = new Date(date);
      if (this.lastUpdate < cdnDate) {
        this.badges = badges.map(badge => ({
          text: badge,
          image: "",
          description: "",
          value: null,
        }));
        this.lastUpdate = cdnDate;
        this.saveToLocalStorage();
      }
    } catch (error) {
      console.error("Error updating badges:", error);
      throw error;
    }
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
   * Actualiza el objeto badge con la imagen, descripción y valor obtenidos,
   * y guarda los cambios en localStorage.
   * @param badge - La insignia a completar con información del CDN
   * @private
   */
  private async getBadge(badge: Badge) {
    try {
      const cdnBadge = await this.fromCDN<Badge>(badge.text.split("/").join("_"));
      badge.image = cdnBadge.image;
      badge.description = cdnBadge.description;
      badge.value = cdnBadge.value;
      this.saveToLocalStorage();
    }
    catch (error) {
      console.error(`Error fetching badge ${badge.text} from CDN:`, error);
    }
  }

  /**
   * Carga las insignias almacenadas en localStorage.
   * Si no hay datos guardados, inicializa con un array vacío y fecha cero.
   * @private
   */
  private loadFromLocalStorage() {
    const data = localStorage.getItem(this.localStorageKey);
    if (data) {
      const parsed: LocalStorageAsyncBadges = JSON.parse(data);
      this.badges = parsed.badges;
      this.lastUpdate = new Date(parsed.lastUpdate ? parsed.lastUpdate : 0);
    } else {
      this.badges = [];
      this.lastUpdate = new Date(0);
    }
  }

  /**
   * Guarda las insignias actuales en localStorage.
   * Serializa el estado actual de badges y lastUpdate como JSON.
   * @private
   */
  private saveToLocalStorage() {
    const data: LocalStorageAsyncBadges = {
      badges: this.badges,
      lastUpdate: this.lastUpdate,
    };
    localStorage.setItem(this.localStorageKey, JSON.stringify(data));
  }

  /**
   * Busca una insignia que cumpla con el predicado especificado.
   * Si la insignia se encuentra pero no tiene imagen cargada, inicia la carga asíncrona desde el CDN.
   * @param predicate - Función que determina si una insignia cumple con los criterios de búsqueda
   * @returns La insignia encontrada con imagen cargada, o undefined si no se encuentra o aún no tiene imagen disponible
   * @example
   * const badge = badges.find(b => b.text === 'subscriber/12');
   * if (badge) console.log(badge.image);
   */
  public find(predicate: Predicate) {
    const badge = this.badges.find(predicate);
    if (badge && !badge.image) this.getBadge(badge);
    return badge?.image ? badge : undefined;
  }

  /**
   * Propiedad de solo lectura que retorna "async" para identificar este objeto como AsyncBadges.
   * Permite diferenciar esta implementación asíncrona de un array normal de insignias.
   * @returns La cadena "async"
   */
  public get length() {
    return "async";
  }
}

/**
 * Instancia singleton de AsyncBadges para gestionar las insignias de forma global.
 * Se exporta como un array de Badges para facilitar su uso.
 */
const badges: Badges = new AsyncBadges() as unknown as Badges;

export default badges;