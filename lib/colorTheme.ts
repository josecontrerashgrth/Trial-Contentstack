import type { CSSProperties } from "react";

/**
 * Convierte campos de color del CMS a un objeto de estilos inline de React.
 *
 * Los campos son cadenas de texto (valor CSS: hex, rgb, hsl, nombre, etc.)
 * que se configuran en Contentstack como campos Single line text.
 * Si el campo está vacío, el estilo correspondiente no se aplica.
 */
export function themeStyle(
  bgColor?: string,
  textColor?: string,
): CSSProperties {
  return {
    ...(bgColor ? { backgroundColor: bgColor } : {}),
    ...(textColor ? { color: textColor } : {}),
  };
}

/**
 * Devuelve el color del texto para aplicar a headings individuales.
 */
export function headingStyle(headingColor?: string): CSSProperties {
  return headingColor ? { color: headingColor } : {};
}
