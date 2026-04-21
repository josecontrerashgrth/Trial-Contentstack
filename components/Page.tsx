import { Page } from "@/lib/types";
import HeroSection from "@/components/sections/HeroSection";
import RichTextSection from "@/components/sections/RichTextSection";
import BlocksSection from "@/components/sections/BlocksSection";
import SectionRenderer from "@/components/sections/SectionRenderer";

interface ContentDisplayProps {
  page: Page | undefined;
}

/**
 * Page (ContentDisplay) – orquesta las secciones de una página de Contentstack.
 *
 * Tiene dos modos de construcción de página:
 *
 * 1. Campos fijos del content type `page`:
 *    - HeroSection    → title, description, image
 *    - RichTextSection → rich_text
 *    - BlocksSection   → blocks (modular, imagen+texto)
 *
 * 2. Campo `sections` (page builder modular):
 *    - SectionRenderer dispatchea por block type UID.
 *    - Añadir una nueva sección: crear el block type en Contentstack,
 *      añadir la interfaz en lib/types.ts y el `if` en SectionRenderer.
 */
export default function ContentDisplay({ page }: ContentDisplayProps) {
  return (
    <main>
      {/* ── Campos fijos ─────────────────────────────────────────── */}
      <HeroSection
        title={page?.title}
        description={page?.description}
        image={page?.image ?? undefined}
        cslp={{ title: page?.$?.title, description: page?.$?.description }}
      />

      <RichTextSection html={page?.rich_text} cslp={page?.$?.rich_text} />

      <BlocksSection
        blocks={page?.blocks}
        containerCslp={page?.$?.blocks}
        getItemCslp={(i) => page?.$?.[`blocks__${i}`]}
      />

      {/* ── Secciones modulares (page builder) ───────────────────── */}
      <SectionRenderer sections={page?.sections} pageCslp={page?.$} />
    </main>
  );
}
