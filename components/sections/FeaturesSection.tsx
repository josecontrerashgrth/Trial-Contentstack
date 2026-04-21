import Image from "next/image";
import { Block, CSLPFieldMapping } from "@/lib/types";
import { VB_EmptyBlockParentClass } from "@contentstack/live-preview-utils";

interface FeaturesSectionProps {
    blocks?: Block[];
    /** CSLP del campo contenedor (p.ej. `page?.$?.blocks` o `block?.$?.cards`). */
    containerCslp?: CSLPFieldMapping;
    /** Devuelve el CSLP de cada tarjeta por índice. */
    getItemCslp?: (index: number) => CSLPFieldMapping | undefined;
    title?: string;
}

/**
 * FeaturesSection – muestra los blocks como tarjetas en una cuadrícula.
 * Útil como alternativa visual a BlocksSection cuando los bloques representan
 * características o ventajas del producto/servicio.
 */
export default function FeaturesSection({
    blocks,
    containerCslp,
    getItemCslp,
    title,
}: FeaturesSectionProps) {
    return (
        <section className="py-16 px-4">
            {title && (
                <h2 className="text-3xl font-bold text-center mb-10">{title}</h2>
            )}

            <div
                className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto ${!blocks || blocks.length === 0 ? VB_EmptyBlockParentClass : ""
                    }`}
                {...(containerCslp ?? {})}
            >
                {blocks?.map((block, index) => {
                    return (
                        <div
                            key={block._metadata?.uid ?? `feature-${index}`}
                            {...(getItemCslp?.(index) ?? {})}
                            className="flex flex-col gap-4 bg-white border border-gray-100 rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow"
                        >
                            {block.image && (
                                <Image
                                    src={block.image.url}
                                    alt={block.image.title}
                                    width={64}
                                    height={64}
                                    className="rounded-lg object-cover"
                                    {...(block.image.$?.url ?? {})}
                                />
                            )}

                            {block.title && (
                                <h3
                                    className="text-xl font-semibold"
                                    {...(block.$?.title ?? {})}
                                >
                                    {block.title}
                                </h3>
                            )}

                            {block.copy && (
                                <p className="text-gray-500 text-sm leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: block.copy }}
                                >

                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
