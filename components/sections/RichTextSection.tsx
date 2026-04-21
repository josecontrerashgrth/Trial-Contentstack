import { CSLPFieldMapping } from "@/lib/types";
import RichText from "@/components/ui/RichText";

interface RichTextSectionProps {
    html?: string;
    /** Pasar directamente el CSLPFieldMapping del campo (p.ej. `page?.$?.rich_text` o `block?.$?.content`). */
    cslp?: CSLPFieldMapping;
}

/**
 * RichTextSection – sección de contenido HTML enriquecido.
 * El HTML se sanitiza con DOMPurify (ver componente RichText) antes de inyectarse.
 */
export default function RichTextSection({ html, cslp }: RichTextSectionProps) {
    if (!html) return null;

    return (
        <section className="py-12 px-4 max-w-3xl mx-auto">
            <RichText
                html={html}
                className="prose prose-lg mx-auto"
                cslp={cslp}
            />
        </section>
    );
}
