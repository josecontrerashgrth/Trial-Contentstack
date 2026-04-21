import Image from "next/image";
import { CSLPFieldMapping, File } from "@/lib/types";
import Button from "@/components/ui/Button";

interface HeroSectionProps {
    title?: string;
    description?: string;
    image?: File | null;
    /** CSLP field bindings – pass the block's own `$` object. */
    cslp?: {
        title?: CSLPFieldMapping;
        description?: CSLPFieldMapping;
    };
    ctaLabel?: string;
    ctaHref?: string;
}

/**
 * HeroSection – sección de cabecera de página.
 * Muestra el título principal, descripción, imagen destacada y un botón CTA opcional.
 * Los atributos `cslp` permiten que Contentstack Live Preview / Visual Builder
 * detecte los campos editables en pantalla.
 */
export default function HeroSection({
    title,
    description,
    image,
    cslp,
    ctaLabel,
    ctaHref,
}: HeroSectionProps) {
    return (
        <section className="flex flex-col items-center text-center gap-6 py-16 px-4">
            {title && (
                <h1
                    className="text-5xl font-bold leading-tight"
                    {...(cslp?.title ?? {})}
                >
                    {title}
                </h1>
            )}

            {description && (
                <p
                    className="text-lg text-gray-600 max-w-2xl"
                    {...(cslp?.description ?? {})}
                >
                    {description}
                </p>
            )}

            {image && (
                <Image
                    src={image.url}
                    alt={image.title}
                    width={960}
                    height={540}
                    className="rounded-xl w-full max-w-3xl object-cover"
                    {...(image.$?.url ?? {})}
                />
            )}

            {ctaLabel && ctaHref && (
                <Button label={ctaLabel} href={ctaHref} variant="primary" />
            )}
        </section>
    );
}
