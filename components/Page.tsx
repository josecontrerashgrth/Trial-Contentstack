import { Page } from "@/lib/types";
import HeroSection from "@/components/sections/HeroSection";
import RichTextSection from "@/components/sections/RichTextSection";
import BlocksSection from "@/components/sections/BlocksSection";

interface ContentDisplayProps {
  page: Page | undefined;
}

/**
 * Page (ContentDisplay) – orquesta las secciones de una página de Contentstack.
 *
 * Estructura:
 *   1. HeroSection   → título, descripción e imagen principal
 *   2. RichTextSection → contenido HTML enriquecido
 *   3. BlocksSection   → modular blocks (imagen + texto, layout configurable)
 *
 * Para añadir una nueva sección:
 *   1. Crea el componente en components/sections/
 *   2. Impórtalo aquí y añádelo al JSX pasándole los campos de `page` que necesite.
 *
 * Todos los atributos CSLP (page.$.*) se pasan a cada sección para que
 * Contentstack Live Preview / Visual Builder pueda detectar los campos editables.
 */
export default function ContentDisplay({ page }: ContentDisplayProps) {
  return (
    <main>
      <HeroSection
        title={page?.title}
        description={page?.description}
        image={page?.image ?? undefined}
        cslp={page?.$}
      />

      <RichTextSection html={page?.rich_text} cslp={page?.$} />

      <BlocksSection blocks={page?.blocks} cslp={page?.$} />
    </main>
  );
}
