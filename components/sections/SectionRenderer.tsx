import { SectionItem, Page } from "@/lib/types";
import { VB_EmptyBlockParentClass } from "@contentstack/live-preview-utils";
import HeroSection from "./HeroSection";
import RichTextSection from "./RichTextSection";
import BlocksSection from "./BlocksSection";
import FeaturesSection from "./FeaturesSection";

interface SectionRendererProps {
    sections?: SectionItem[];
    /** CSLP del campo `sections` de la página (page?.$). */
    pageCslp?: Page["$"];
}

/**
 * SectionRenderer – dispatcher de secciones modulares.
 *
 * Lee el campo `sections` de la entrada `page` (modular blocks) y renderiza
 * el componente de React correspondiente a cada tipo de bloque.
 *
 * ┌─────────────────────────────────────────────────────────────┐
 * │ Block type UID en Contentstack → Componente React           │
 * │ hero_section        → HeroSection                          │
 * │ rich_text_section   → RichTextSection                      │
 * │ image_text_section  → BlocksSection (un solo bloque)       │
 * │ features_section    → FeaturesSection (cuadrícula)         │
 * └─────────────────────────────────────────────────────────────┘
 *
 * Para añadir un nuevo tipo de sección:
 *   1. Crea el content type / block type en Contentstack con el UID deseado.
 *   2. Añade la interfaz TypeScript correspondiente en lib/types.ts.
 *   3. Añade la clave a `SectionItem` en lib/types.ts.
 *   4. Añade un `if (item.nuevo_tipo)` aquí apuntando al componente correcto.
 */
export default function SectionRenderer({ sections, pageCslp }: SectionRendererProps) {
    return (
        <div
            className={!sections || sections.length === 0 ? VB_EmptyBlockParentClass : ""}
            {...(pageCslp?.sections ?? {})}
        >
            {sections?.map((item, index) => {
                const key = item._metadata?.uid ?? `section-${index}`;
                // CSLP del bloque completo – usado como wrapper para que Visual Builder
                // identifique el bloque en la lista modular.
                const blockCslp = pageCslp?.[`sections__${index}`];

                // ── hero_section ──────────────────────────────────────────────
                if (item.hero_section) {
                    const s = item.hero_section;
                    return (
                        <div key={key} {...(blockCslp ?? {})}>
                            <HeroSection
                                title={s.title}
                                description={s.description}
                                image={s.image ?? undefined}
                                ctaLabel={s.cta_label}
                                ctaHref={s.cta_href}
                                cslp={{ title: s.$?.title, description: s.$?.description }}
                            />
                        </div>
                    );
                }

                // ── rich_text_section ─────────────────────────────────────────
                if (item.rich_text_section) {
                    const s = item.rich_text_section;
                    return (
                        <div key={key} {...(blockCslp ?? {})}>
                            <RichTextSection html={s.content} cslp={s.$?.content} />
                        </div>
                    );
                }

                // ── image_text_section ────────────────────────────────────────
                if (item.image_text_section) {
                    const s = item.image_text_section;
                    return (
                        <div key={key} {...(blockCslp ?? {})}>
                            <BlocksSection
                                blocks={[{ block: s }]}
                                containerCslp={undefined}
                                getItemCslp={() => undefined}
                            />
                        </div>
                    );
                }

                // ── features_section ──────────────────────────────────────────
                if (item.features_section) {
                    const s = item.features_section;
                    return (
                        <div key={key} {...(blockCslp ?? {})}>
                            <FeaturesSection
                                title={s.section_title}
                                blocks={s.cards}
                                containerCslp={s.$?.cards}
                                getItemCslp={(i) => s.$?.[`cards__${i}`]}
                            />
                        </div>
                    );
                }

                // Tipo de bloque desconocido – ignorar en producción
                return null;
            })}
        </div>
    );
}
